import { Application, Grievance, NotificationToast, UserSession } from './types';
import { INITIAL_APPLICATIONS, INITIAL_GRIEVANCES } from './data';

const USERS_INDEX_KEY = 'govbridge_all_user_ids';
const SESSION_KEY = 'govbridge_session';

/**
 * Get all known user IDs in the system
 */
export function getAllUserIds(): string[] {
  try {
    const raw = localStorage.getItem(USERS_INDEX_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        return Array.from(new Set(list));
      }
    }
  } catch (e) {
    console.warn('Failed to read user index:', e);
  }
  // Default seeded users
  const defaultUsers = ['user_aadhaar_8942_5510', 'user_aadhaar_7712_4409', 'user_aadhaar_4412_9901'];
  try {
    localStorage.setItem(USERS_INDEX_KEY, JSON.stringify(defaultUsers));
  } catch (e) {
    // Ignore storage issues
  }
  return defaultUsers;
}

/**
 * Register a user ID to the global index so officials can query their applications
 */
export function registerUserId(userId: string): void {
  if (!userId) return;
  try {
    const current = getAllUserIds();
    if (!current.includes(userId)) {
      const updated = [...current, userId];
      localStorage.setItem(USERS_INDEX_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.warn('Failed to register user ID:', e);
  }
}

/**
 * Initialize seed data into user-scoped buckets if not present
 */
export function ensureInitialDataSeeded(): void {
  try {
    // Seed initial applications into their respective user buckets
    const seededUsers = getAllUserIds();

    for (const userId of seededUsers) {
      const appKey = `govbridge_user_apps_${userId}`;
      if (!localStorage.getItem(appKey)) {
        const userSeedApps = INITIAL_APPLICATIONS.filter((a) => a.userId === userId);
        if (userSeedApps.length > 0) {
          localStorage.setItem(appKey, JSON.stringify(userSeedApps));
        }
      }

      const grvKey = `govbridge_user_grievances_${userId}`;
      if (!localStorage.getItem(grvKey)) {
        const userSeedGrvs = INITIAL_GRIEVANCES.filter((g) => g.userId === userId);
        if (userSeedGrvs.length > 0) {
          localStorage.setItem(grvKey, JSON.stringify(userSeedGrvs));
        }
      }
    }
  } catch (e) {
    console.warn('Failed to seed initial data:', e);
  }
}

/**
 * Load applications strictly for the currently authenticated identity.
 * - Citizen: ONLY loads this citizen's applications from their private storage bucket.
 * - Guest: returns [] (0 applications).
 * - Official: loads all applications across all registered citizens for review & adjudication.
 */
export function loadApplicationsForUser(session: UserSession | null): Application[] {
  if (!session) return [];

  if (session.role === 'guest') {
    return [];
  }

  ensureInitialDataSeeded();

  if (session.role === 'citizen') {
    try {
      const key = `govbridge_user_apps_${session.id}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Strictly enforce userId match
          return parsed.filter((app: Application) => app.userId === session.id);
        }
      }

      // If it's the demo citizen and not stored yet
      if (session.id === 'user_aadhaar_8942_5510') {
        const demoApps = INITIAL_APPLICATIONS.filter((a) => a.userId === session.id);
        localStorage.setItem(key, JSON.stringify(demoApps));
        return demoApps;
      }

      // Any other citizen (User B, new signups, etc.) begins with EXACTLY 0 applications
      return [];
    } catch (e) {
      console.warn('Error loading citizen applications:', e);
      return [];
    }
  }

  if (session.role === 'official') {
    // Official reviews all submitted applications across citizens
    try {
      const userIds = getAllUserIds();
      const allApps: Application[] = [];
      const seenAppIds = new Set<string>();

      for (const uid of userIds) {
        const key = `govbridge_user_apps_${uid}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            for (const app of parsed) {
              if (!seenAppIds.has(app.id)) {
                seenAppIds.add(app.id);
                allApps.push(app);
              }
            }
          }
        }
      }

      // If empty for some reason, include initial applications
      if (allApps.length === 0) {
        return INITIAL_APPLICATIONS;
      }

      return allApps;
    } catch (e) {
      console.warn('Error loading official applications:', e);
      return INITIAL_APPLICATIONS;
    }
  }

  return [];
}

/**
 * Save or update an application into its owner's personal storage bucket.
 */
export function saveApplicationToStorage(app: Application): void {
  if (!app || !app.userId) return;

  try {
    const ownerId = app.userId;
    registerUserId(ownerId);
    const key = `govbridge_user_apps_${ownerId}`;
    const raw = localStorage.getItem(key);
    let userApps: Application[] = [];

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        userApps = parsed;
      }
    }

    const existingIndex = userApps.findIndex((a) => a.id === app.id);
    if (existingIndex >= 0) {
      userApps[existingIndex] = app;
    } else {
      userApps.unshift(app);
    }

    localStorage.setItem(key, JSON.stringify(userApps));
  } catch (e) {
    console.warn('Error saving application to user-scoped storage:', e);
  }
}

/**
 * Load grievances strictly for the authenticated identity
 */
export function loadGrievancesForUser(session: UserSession | null): Grievance[] {
  if (!session) return [];

  if (session.role === 'guest') {
    return [];
  }

  ensureInitialDataSeeded();

  if (session.role === 'citizen') {
    try {
      const key = `govbridge_user_grievances_${session.id}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter((g: Grievance) => g.userId === session.id);
        }
      }

      if (session.id === 'user_aadhaar_8942_5510') {
        const demoGrvs = INITIAL_GRIEVANCES.filter((g) => g.userId === session.id);
        localStorage.setItem(key, JSON.stringify(demoGrvs));
        return demoGrvs;
      }

      return [];
    } catch (e) {
      console.warn('Error loading citizen grievances:', e);
      return [];
    }
  }

  if (session.role === 'official') {
    try {
      const userIds = getAllUserIds();
      const allGrvs: Grievance[] = [];
      const seenIds = new Set<string>();

      for (const uid of userIds) {
        const key = `govbridge_user_grievances_${uid}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            for (const grv of parsed) {
              if (!seenIds.has(grv.id)) {
                seenIds.add(grv.id);
                allGrvs.push(grv);
              }
            }
          }
        }
      }

      if (allGrvs.length === 0) {
        return INITIAL_GRIEVANCES;
      }
      return allGrvs;
    } catch (e) {
      console.warn('Error loading official grievances:', e);
      return INITIAL_GRIEVANCES;
    }
  }

  return [];
}

/**
 * Save or update a grievance into its owner's personal storage bucket
 */
export function saveGrievanceToStorage(grievance: Grievance): void {
  if (!grievance || !grievance.userId) return;

  try {
    const ownerId = grievance.userId;
    registerUserId(ownerId);
    const key = `govbridge_user_grievances_${ownerId}`;
    const raw = localStorage.getItem(key);
    let userGrvs: Grievance[] = [];

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        userGrvs = parsed;
      }
    }

    const existingIndex = userGrvs.findIndex((g) => g.id === grievance.id);
    if (existingIndex >= 0) {
      userGrvs[existingIndex] = grievance;
    } else {
      userGrvs.unshift(grievance);
    }

    localStorage.setItem(key, JSON.stringify(userGrvs));
  } catch (e) {
    console.warn('Error saving grievance to user-scoped storage:', e);
  }
}

/**
 * Persist current active session
 */
export function saveActiveSession(session: UserSession | null): void {
  try {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (e) {
    console.warn('Error saving session:', e);
  }
}

/**
 * Load active session from localStorage
 */
export function loadActiveSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error loading session:', e);
  }
  return null;
}
