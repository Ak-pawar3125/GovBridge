export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  statusChange?: string;
  details: string;
  system: string;
  blockHash?: string;
}

export interface Application {
  id: string;
  userId: string; // unique ID of citizen owner
  schemeId: string;
  schemeTitle: string;
  department: string;
  applicantName: string;
  applicantGovId: string;
  applicantPhone: string;
  category: 'welfare' | 'certificate' | 'license' | 'subsidy' | 'infrastructure';
  status: 'submitted' | 'under_review' | 'verified' | 'approved' | 'rejected';
  submittedAt: string;
  updatedAt: string;
  remarks?: string;
  verifiedDocuments: {
    name: string;
    verified: boolean;
    source: string; // e.g. "DigiLocker API", "UIDAI Vault", "Income Tax e-Filing"
  }[];
  beneficiaryAmount?: number;
  dbtStatus?: 'pending' | 'credited' | 'na';
  auditHistory?: AuditLogEntry[];
}

export interface Grievance {
  id: string;
  userId?: string; // citizen user id
  title: string;
  department: string;
  description: string;
  category: string;
  citizenName: string;
  citizenGovId: string;
  citizenPhone: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'lodged' | 'in_progress' | 'resolved' | 'escalated';
  submittedAt: string;
  updatedAt: string;
  resolutionNote?: string;
  assignedOfficer?: string;
}

export interface UserSession {
  id: string; // unique userId
  role: 'citizen' | 'official' | 'guest';
  name: string;
  govId: string;
  phone: string;
  designation?: string;
  department?: string;
  token?: string;
}

export interface SchemeInfo {
  id: string;
  title: string;
  code: string;
  department: string;
  description: string;
  benefits: string;
  eligibility: string;
  requiredDocs: string[];
  maxGrant?: number;
  iconName: string;
  badge: string;
}

export interface VerificationConnector {
  id: string;
  name: string;
  authority: string;
  type: string;
  status: 'active' | 'syncing' | 'idle';
  latencyMs: number;
  recordsVerifiedToday: number;
  uptime: string;
}

export interface NotificationToast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
