import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  LogOut, 
  Send, 
  AlertTriangle, 
  FileText, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  RefreshCw, 
  IndianRupee, 
  BarChart3, 
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Award,
  Vote
} from 'lucide-react';

import { 
  Application, 
  Grievance, 
  SchemeInfo, 
  UserSession, 
  VerificationConnector,
  NotificationToast,
  AuditLogEntry
} from './types';
import { 
  INITIAL_SCHEMES, 
  INITIAL_CONNECTORS 
} from './data';
import {
  loadActiveSession,
  saveActiveSession,
  loadApplicationsForUser,
  saveApplicationToStorage,
  loadGrievancesForUser,
  saveGrievanceToStorage
} from './storage';

import { SchemeCard } from './components/SchemeCard';
import { SchemeModal } from './components/SchemeModal';
import { ApplicationCard } from './components/ApplicationCard';
import { ApplicationDetailModal } from './components/ApplicationDetailModal';
import { GrievanceCard } from './components/GrievanceCard';
import { GrievanceModal } from './components/GrievanceModal';
import { ConnectorsPanel } from './components/ConnectorsPanel';
import { ToastContainer } from './components/ToastContainer';
import { AuthScreen } from './components/AuthScreen';

export default function App() {
  // Session State - retrieved from persistent storage
  const [session, setSession] = useState<UserSession | null>(() => {
    return loadActiveSession();
  });

  // User-scoped applications state: ONLY loaded for current user
  const [applications, setApplications] = useState<Application[]>(() => {
    const active = loadActiveSession();
    return loadApplicationsForUser(active);
  });

  // User-scoped grievances state: ONLY loaded for current user
  const [grievances, setGrievances] = useState<Grievance[]>(() => {
    const active = loadActiveSession();
    return loadGrievancesForUser(active);
  });

  const [schemes, setSchemes] = useState<SchemeInfo[]>(INITIAL_SCHEMES);
  const [connectors, setConnectors] = useState<VerificationConnector[]>(INITIAL_CONNECTORS);

  // Active navigation view
  const [activeView, setActiveView] = useState<'schemes' | 'my_applications' | 'grievances' | 'connectors' | 'analytics'>('schemes');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modals state
  const [selectedScheme, setSelectedScheme] = useState<SchemeInfo | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isGrievanceModalOpen, setIsGrievanceModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  const addToast = (type: NotificationToast['type'], title: string, message: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Handlers - user-isolated data loading on login
  const handleLogin = (newSession: UserSession) => {
    // 1. Clear previous user's temporary state completely
    setSelectedApplication(null);
    setSelectedScheme(null);
    setSearchQuery('');
    setFilterCategory('all');
    setFilterStatus('all');
    setIsGrievanceModalOpen(false);
    setToasts([]);

    // 2. Set new user session & persist
    setSession(newSession);
    saveActiveSession(newSession);
    
    // 3. Load data strictly scoped for this user (User B will have 0 applications)
    const userApps = loadApplicationsForUser(newSession);
    setApplications(userApps);

    const userGrvs = loadGrievancesForUser(newSession);
    setGrievances(userGrvs);

    // Switch to relevant default view
    if (newSession.role === 'official') {
      setActiveView('my_applications');
      addToast('success', 'Official Adjudicator Signed In', `Welcome ${newSession.name}. Review queue loaded (${userApps.length} records).`);
    } else if (newSession.role === 'citizen') {
      if (userApps.length > 0) {
        setActiveView('my_applications');
        addToast('success', `Welcome back, ${newSession.name}`, `Loaded ${userApps.length} personal application(s).`);
      } else {
        setActiveView('schemes');
        addToast('success', `Welcome, ${newSession.name}`, `Account authenticated via Aadhaar (${newSession.govId}). Ready to submit your first scheme application!`);
      }
    } else {
      setActiveView('schemes');
    }

    // Trigger celebratory confetti
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const handleLogout = () => {
    // 1. Clear current user's temporary and loaded in-memory state completely
    setSelectedApplication(null);
    setSelectedScheme(null);
    setSearchQuery('');
    setFilterCategory('all');
    setFilterStatus('all');
    setIsGrievanceModalOpen(false);
    setToasts([]);
    setApplications([]); // Clear applications from memory so next user starts clean
    setGrievances([]);   // Clear grievances from memory
    setSession(null);
    saveActiveSession(null);

    addToast('info', 'Logged Out', 'You have been securely signed out. Returning to starting portal.');
  };

  // Quick switch role without re-typing for judges presentation
  const handleSwitchRole = (target: 'citizen_a' | 'citizen_b' | 'official') => {
    if (target === 'citizen_a') {
      const citizenSession: UserSession = {
        id: 'user_aadhaar_8942_5510',
        role: 'citizen',
        name: 'Rameshwar Kumar Patel',
        govId: 'AADHAAR-8942-5510',
        phone: '+91 98765 43210',
        token: 'auth-jwt-demo-cit-a'
      };
      handleLogin(citizenSession);
    } else if (target === 'citizen_b') {
      const citizenBSession: UserSession = {
        id: 'user_aadhaar_2244_6688',
        role: 'citizen',
        name: 'Pooja Sharma',
        govId: 'AADHAAR-2244-6688',
        phone: '+91 98111 22334',
        token: 'auth-jwt-demo-cit-b'
      };
      handleLogin(citizenBSession);
    } else {
      const officialSession: UserSession = {
        id: 'official_emp_98214',
        role: 'official',
        name: 'Dr. Anita Roy, IAS',
        govId: 'OFFICIAL-EMP-98214',
        phone: '+91 99112 00192',
        designation: 'Joint Commissioner & Nodal Adjudicator',
        department: 'Central Public Grievance & DBT Cell',
        token: 'auth-jwt-demo-off'
      };
      handleLogin(officialSession);
    }
  };

  // Protected handler to open Application Detail Modal
  const handleOpenApplicationModal = (app: Application) => {
    if (session?.role === 'citizen' && app.userId !== session.id) {
      addToast('error', 'Access Denied', 'Security Protection: You cannot view another citizen\'s confidential records or audit log.');
      setSelectedApplication(null);
      return;
    }
    setSelectedApplication(app);
  };

  // Submit Application
  const handleApplyScheme = (scheme: SchemeInfo, formData: {
    applicantName: string;
    applicantGovId: string;
    applicantPhone: string;
    consentGiven: boolean;
  }) => {
    const newId = `GB-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const blockNum = Math.floor(1400 + Math.random() * 500);
    const hash = '0x' + Array.from({length: 4}, () => Math.floor(Math.random()*65536).toString(16).padStart(4, '0')).join('');

    // Every application MUST store the owner's userId:
    const ownerUserId = session?.id || ('user_' + (formData.applicantGovId || 'citizen').toLowerCase().replace(/[^a-z0-9]/g, '_'));

    const initialAudit: AuditLogEntry[] = [
      {
        id: `aud-${Date.now()}-1`,
        timestamp: formattedDate,
        action: 'Application Submitted with Citizen Consent',
        actor: `${formData.applicantName || session?.name || 'Citizen'} (Citizen)`,
        statusChange: 'submitted',
        details: `Consent token granted under DEPA architecture for accessing ${scheme.requiredDocs.join(', ')}.`,
        system: 'DEPA Consent Manager',
        blockHash: `${hash}... (Fabric Block #${blockNum})`
      },
      {
        id: `aud-${Date.now()}-2`,
        timestamp: formattedDate,
        action: 'Automated Interoperability Verification Succeeded',
        actor: 'GovBridge Orchestration Engine',
        statusChange: 'verified',
        details: `All ${scheme.requiredDocs.length} statutory records queried and pre-verified from DigiLocker & UIDAI Vault.`,
        system: 'GovBridge API Gateway',
        blockHash: `0x${Array.from({length: 4}, () => Math.floor(Math.random()*65536).toString(16).padStart(4, '0')).join('')}... (Fabric Block #${blockNum + 1})`
      }
    ];

    const newApp: Application = {
      id: newId,
      userId: ownerUserId, // STORE OWNER'S USER ID!
      schemeId: scheme.id,
      schemeTitle: scheme.title,
      department: scheme.department,
      applicantName: formData.applicantName || session?.name || 'Citizen Beneficiary',
      applicantGovId: formData.applicantGovId || session?.govId || 'AADHAAR-XXXX-XXXX',
      applicantPhone: formData.applicantPhone || session?.phone || '',
      category: scheme.maxGrant ? 'subsidy' : 'certificate',
      status: 'verified', // Auto-verified via DigiLocker Interoperability Bus!
      submittedAt: formattedDate,
      updatedAt: formattedDate,
      remarks: 'Automated DigiLocker and UIDAI demographic verification succeeded with 100% hash match.',
      verifiedDocuments: scheme.requiredDocs.map((doc, idx) => ({
        name: doc,
        verified: true,
        source: idx === 0 ? 'UIDAI Vault' : idx === 1 ? 'DigiLocker Central Vault' : 'State e-District DB'
      })),
      beneficiaryAmount: scheme.maxGrant,
      dbtStatus: scheme.maxGrant ? 'pending' : 'na',
      auditHistory: initialAudit
    };

    // 1. Immediate UI update
    const updated = [newApp, ...applications];
    setApplications(updated);
    setActiveView('my_applications');
    addToast('success', 'Application Auto-Verified & Submitted!', `Reference ID: ${newId}. Saved to your personal dashboard.`);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });

    // 2. Safe save to user's scoped storage bucket
    saveApplicationToStorage(newApp);
  };

  // Official Action: Approve Application
  const handleApproveApplication = (id: string) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const blockNum = Math.floor(1900 + Math.random() * 200);
    const hash = '0x' + Array.from({length: 4}, () => Math.floor(Math.random()*65536).toString(16).padStart(4, '0')).join('');

    let updatedTargetApp: Application | null = null;

    const updated = applications.map((app) => {
      if (app.id === id) {
        const newAuditEntry: AuditLogEntry = {
          id: `aud-${Date.now()}`,
          timestamp: formattedDate,
          action: 'Administrative Sanction & DBT Grant Authorized',
          actor: session?.name || 'Dr. Anita Roy, IAS (Nodal Adjudicator)',
          statusChange: 'approved',
          details: app.beneficiaryAmount
            ? `Direct Benefit Transfer of ₹${app.beneficiaryAmount.toLocaleString('en-IN')} approved via PFMS / APBS token.`
            : 'Statutory service certificate generated and issued to beneficiary DigiLocker.',
          system: 'GovBridge Orchestration Engine',
          blockHash: `${hash}... (Fabric Block #${blockNum})`
        };

        const existingAudit = app.auditHistory || [];
        const updatedApp: Application = {
          ...app,
          status: 'approved' as const,
          dbtStatus: (app.beneficiaryAmount ? 'credited' : 'na') as Application['dbtStatus'],
          updatedAt: formattedDate,
          remarks: 'Statutory sanction signed with e-Gov token. PFMS DBT payment batch authorized.',
          auditHistory: [...existingAudit, newAuditEntry]
        };
        updatedTargetApp = updatedApp;
        return updatedApp;
      }
      return app;
    });

    setApplications(updated);
    if (selectedApplication && selectedApplication.id === id && updatedTargetApp) {
      setSelectedApplication(updatedTargetApp);
    }
    addToast('success', 'Application Approved & Sanctioned', `Application ${id} sanctioned. DBT payment initiated.`);
    if (updatedTargetApp) {
      saveApplicationToStorage(updatedTargetApp);
    }
  };

  // Official Action: Reject Application
  const handleRejectApplication = (id: string) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const blockNum = Math.floor(1900 + Math.random() * 200);
    const hash = '0x' + Array.from({length: 4}, () => Math.floor(Math.random()*65536).toString(16).padStart(4, '0')).join('');

    let updatedTargetApp: Application | null = null;

    const updated = applications.map((app) => {
      if (app.id === id) {
        const newAuditEntry: AuditLogEntry = {
          id: `aud-${Date.now()}`,
          timestamp: formattedDate,
          action: 'Application Disallowed / Rejected by Adjudicator',
          actor: session?.name || 'Official Adjudicator',
          statusChange: 'rejected',
          details: 'Discrepancy in land survey coordinates or statutory quota limit reached. Formal notification issued.',
          system: 'GovBridge Review Console',
          blockHash: `${hash}... (Fabric Block #${blockNum})`
        };

        const existingAudit = app.auditHistory || [];
        const updatedApp: Application = {
          ...app,
          status: 'rejected' as const,
          dbtStatus: 'na' as Application['dbtStatus'],
          updatedAt: formattedDate,
          remarks: 'Discrepancy in land survey coordinates against cadastral GIS. Re-application advised.',
          auditHistory: [...existingAudit, newAuditEntry]
        };
        updatedTargetApp = updatedApp;
        return updatedApp;
      }
      return app;
    });

    setApplications(updated);
    if (selectedApplication && selectedApplication.id === id && updatedTargetApp) {
      setSelectedApplication(updatedTargetApp);
    }
    addToast('warning', 'Application Disallowed / Rejected', `Application ${id} status updated to Rejected.`);
    if (updatedTargetApp) {
      saveApplicationToStorage(updatedTargetApp);
    }
  };

  // Verify Document manually via connector
  const handleVerifyDocument = (appId: string, docIndex: number) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const blockNum = Math.floor(1500 + Math.random() * 300);
    const hash = '0x' + Array.from({length: 4}, () => Math.floor(Math.random()*65536).toString(16).padStart(4, '0')).join('');

    let updatedTargetApp: Application | null = null;

    const updated = applications.map((app) => {
      if (app.id === appId) {
        const docs = [...app.verifiedDocuments];
        let docName = 'Statutory Document';
        let docSource = 'Connector Gateway';
        if (docs[docIndex]) {
          docName = docs[docIndex].name;
          docSource = docs[docIndex].source;
          docs[docIndex] = { ...docs[docIndex], verified: true };
        }
        const allVerified = docs.every((d) => d.verified);
        const newStatus = allVerified ? ('verified' as const) : app.status;

        const auditEntry: AuditLogEntry = {
          id: `aud-${Date.now()}`,
          timestamp: formattedDate,
          action: `Connector Verification Passed: ${docName}`,
          actor: docSource,
          statusChange: newStatus,
          details: `Synchronized query dispatched to ${docSource}. Remote checksum and legal validity verified.`,
          system: 'GovBridge Connector Bus',
          blockHash: `${hash}... (Fabric Block #${blockNum})`
        };

        const existingAudit = app.auditHistory || [];
        const updatedApp: Application = {
          ...app,
          verifiedDocuments: docs,
          status: newStatus,
          updatedAt: formattedDate,
          auditHistory: [...existingAudit, auditEntry]
        };
        updatedTargetApp = updatedApp;
        return updatedApp;
      }
      return app;
    });

    setApplications(updated);
    if (selectedApplication && selectedApplication.id === appId && updatedTargetApp) {
      setSelectedApplication(updatedTargetApp);
    }
    addToast('success', 'Connector Synchronized', `Document verified via live API query.`);
    if (updatedTargetApp) {
      saveApplicationToStorage(updatedTargetApp);
    }
  };

  // Submit Grievance
  const handleLodgeGrievance = (grievanceData: Omit<Grievance, 'id' | 'submittedAt' | 'updatedAt' | 'status'>) => {
    const newId = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const ownerUserId = session?.id || ('user_' + (grievanceData.citizenGovId || 'citizen').toLowerCase().replace(/[^a-z0-9]/g, '_'));

    const newGrievance: Grievance = {
      ...grievanceData,
      id: newId,
      userId: ownerUserId,
      status: 'lodged',
      submittedAt: formattedDate,
      updatedAt: formattedDate,
      assignedOfficer: 'Auto-Routing to District Redressal Officer'
    };

    const updated = [newGrievance, ...grievances];
    setGrievances(updated);
    setActiveView('grievances');
    addToast('success', 'Grievance Lodged in CPGRAMS Bus', `Ticket ${newId} logged. Escalation timer initialized.`);
    saveGrievanceToStorage(newGrievance);
  };

  // Resolve Grievance
  const handleResolveGrievance = (id: string, note: string) => {
    let updatedTargetGrv: Grievance | null = null;
    const updated = grievances.map((g) => {
      if (g.id === id) {
        const up = {
          ...g,
          status: 'resolved' as const,
          resolutionNote: note,
          updatedAt: 'Just now'
        };
        updatedTargetGrv = up;
        return up;
      }
      return g;
    });

    setGrievances(updated);
    addToast('success', 'Grievance Marked Resolved', `Resolution note recorded for ${id}.`);
    if (updatedTargetGrv) {
      saveGrievanceToStorage(updatedTargetGrv);
    }
  };

  // Escalate Grievance
  const handleEscalateGrievance = (id: string) => {
    let updatedTargetGrv: Grievance | null = null;
    const updated = grievances.map((g) => {
      if (g.id === id) {
        const up = {
          ...g,
          status: 'escalated' as const,
          priority: 'urgent' as const,
          updatedAt: 'Just now',
          assignedOfficer: 'Secretary, Public Grievances (Direct Supervision)'
        };
        updatedTargetGrv = up;
        return up;
      }
      return g;
    });

    setGrievances(updated);
    addToast('warning', 'Grievance Escalated to Higher Authority', `Escalation dispatched for ${id}.`);
    if (updatedTargetGrv) {
      saveGrievanceToStorage(updatedTargetGrv);
    }
  };

  // Connector sync all
  const handleTriggerSyncAll = () => {
    setConnectors((prev) =>
      prev.map((c) => ({
        ...c,
        recordsVerifiedToday: c.recordsVerifiedToday + Math.floor(10 + Math.random() * 50),
        latencyMs: Math.floor(70 + Math.random() * 60)
      }))
    );
    addToast('success', 'Connectors Refreshed', 'Inter-departmental APIs operational. Zero latency faults.');
  };

  const handlePingConnector = (id: string) => {
    setConnectors((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            latencyMs: Math.floor(65 + Math.random() * 40),
            recordsVerifiedToday: c.recordsVerifiedToday + 1
          };
        }
        return c;
      })
    );
    addToast('info', 'Ping Success', `Echo response received from connector authority in sub-100ms.`);
  };

  // Active scope applications and grievances based on authenticated identity
  // Citizen sees ONLY their own applications and grievances!
  const visibleApplications = session?.role === 'citizen'
    ? applications.filter((app) => app.userId === session.id)
    : session?.role === 'guest'
    ? []
    : applications; // official sees all departmental applications for review

  const visibleGrievances = session?.role === 'citizen'
    ? grievances.filter((g) => g.userId === session.id)
    : session?.role === 'guest'
    ? []
    : grievances;

  // Filtering calculations on user-scoped data
  const filteredApplications = visibleApplications.filter((app) => {
    const matchesSearch = 
      app.schemeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantGovId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredGrievances = visibleGrievances.filter((g) => {
    const matchesSearch = 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || g.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch = 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      filterCategory === 'all' || 
      (filterCategory === 'subsidy' && s.maxGrant) ||
      (filterCategory === 'service' && !s.maxGrant);

    return matchesSearch && matchesCategory;
  });

  // Calculate high-level KPIs based strictly on current user's visible data!
  const totalBeneficiaryDisbursed = visibleApplications
    .filter((a) => a.status === 'approved' && a.beneficiaryAmount)
    .reduce((sum, a) => sum + (a.beneficiaryAmount || 0), 0);

  const pendingReviewsCount = visibleApplications.filter((a) => ['submitted', 'under_review', 'verified'].includes(a.status)).length;
  const resolvedGrievancesCount = visibleGrievances.filter((g) => g.status === 'resolved').length;

  // Separate Standalone Starting Window for Login & Sign Up
  if (!session) {
    return (
      <>
        <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
        <AuthScreen 
          onLogin={handleLogin}
          onContinueAsGuest={() => {
            handleLogin({
              id: 'guest_public_user',
              role: 'guest',
              name: 'Guest Citizen (Public)',
              govId: 'GUEST-PUBLIC-VISITOR',
              phone: '+91 90000 00000',
              token: 'guest-preview-token'
            });
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Top Government Emblem & Prototype Header */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white tracking-wide">
              Smart India Hackathon (SIH 2026) Official Demonstration Prototype
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-400">
              Interoperable Public Service Delivery & Grievance Redressal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80 font-mono">
              Live Mock Bus: ACTIVE
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400">Quick Persona:</span>
              <button
                onClick={() => handleSwitchRole('citizen_a')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  session?.id === 'user_aadhaar_8942_5510' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="Demo Citizen A (Rameshwar - with initial apps)"
              >
                Citizen A
              </button>
              <button
                onClick={() => handleSwitchRole('citizen_b')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  session?.id === 'user_aadhaar_2244_6688' ? 'bg-indigo-500 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="Citizen B (Pooja Sharma - starts with 0 apps)"
              >
                Citizen B (0 Apps)
              </button>
              <button
                onClick={() => handleSwitchRole('official')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  session?.role === 'official' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="Official Adjudicator review queue"
              >
                Official
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div 
                onClick={() => setActiveView('schemes')}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-700 text-white font-black text-lg flex items-center justify-center shadow-md cursor-pointer hover:opacity-90 transition-opacity"
              >
                GB
              </div>
              <div 
                onClick={() => setActiveView('schemes')}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">GovBridge</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                    SIH 2026
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Unified Citizen Services & Inter-Departmental Delivery Bus
                </p>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
              <button
                onClick={() => { setActiveView('schemes'); setFilterStatus('all'); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'schemes'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Welfare Schemes ({schemes.length})
              </button>
              <button
                onClick={() => { setActiveView('my_applications'); setFilterStatus('all'); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'my_applications'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Applications ({applications.length})
                {pendingReviewsCount > 0 && session?.role === 'official' && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {pendingReviewsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => { setActiveView('grievances'); setFilterStatus('all'); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'grievances'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Grievances ({grievances.length})
              </button>
              <button
                onClick={() => setActiveView('connectors')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'connectors'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                API Connectors
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'analytics'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Impact & Audit
              </button>
            </nav>

            {/* User Session profile or Login Button */}
            <div className="flex items-center gap-3">
              {session.role === 'guest' ? (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                    Guest Visitor
                  </span>
                  <button
                    onClick={() => setSession(null)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" /> Sign In / Register
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {session.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {session.role === 'official' ? session.designation || 'Adjudicator' : session.govId}
                    </span>
                  </div>

                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                    session.role === 'official' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {session.role === 'official' ? 'GOV' : 'CIT'}
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Sign Out to Login Window"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation row */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-200 py-2 px-1 bg-slate-50 text-[11px] font-bold">
          <button
            onClick={() => setActiveView('schemes')}
            className={`px-2 py-1 rounded ${activeView === 'schemes' ? 'bg-amber-500 text-white' : 'text-slate-600'}`}
          >
            Schemes
          </button>
          <button
            onClick={() => setActiveView('my_applications')}
            className={`px-2 py-1 rounded ${activeView === 'my_applications' ? 'bg-amber-500 text-white' : 'text-slate-600'}`}
          >
            Applications
          </button>
          <button
            onClick={() => setActiveView('grievances')}
            className={`px-2 py-1 rounded ${activeView === 'grievances' ? 'bg-amber-500 text-white' : 'text-slate-600'}`}
          >
            Grievances
          </button>
          <button
            onClick={() => setActiveView('connectors')}
            className={`px-2 py-1 rounded ${activeView === 'connectors' ? 'bg-amber-500 text-white' : 'text-slate-600'}`}
          >
            Connectors
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`px-2 py-1 rounded ${activeView === 'analytics' ? 'bg-amber-500 text-white' : 'text-slate-600'}`}
          >
            Impact
          </button>
        </div>
      </header>

      {/* Sub-hero metric banner */}
      <section className="bg-gradient-to-r from-amber-900 via-slate-900 to-slate-950 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Next-Generation Public Service Infrastructure
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              Instant Entitlements, Zero Physical Paperwork & Direct Adjudication.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              GovBridge bridges citizen applications directly with UIDAI, DigiLocker, PFMS DBT and Bhulekh GIS for real-time statutory sanctioning.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-center">
              <span className="block text-[11px] text-slate-300">PFMS DBT Disbursed</span>
              <span className="font-mono text-base font-extrabold text-amber-300">
                ₹{totalBeneficiaryDisbursed.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-center">
              <span className="block text-[11px] text-slate-300">Pending Review</span>
              <span className="font-mono text-base font-extrabold text-white">
                {pendingReviewsCount}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-center">
              <span className="block text-[11px] text-slate-300">Grievances Solved</span>
              <span className="font-mono text-base font-extrabold text-emerald-400">
                {resolvedGrievancesCount}/{grievances.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Search & Actions Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme, citizen, ID, or department..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {activeView === 'schemes' && (
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-700"
              >
                <option value="all">All Scheme Categories</option>
                <option value="subsidy">Direct Cash / Subsidies</option>
                <option value="service">Digital Certificates & Permits</option>
              </select>
            )}

            {(activeView === 'my_applications' || activeView === 'grievances') && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved / Sanctioned</option>
                <option value="verified">Verified via API</option>
                <option value="under_review">Under Review</option>
                <option value="rejected">Rejected</option>
                <option value="resolved">Resolved</option>
              </select>
            )}

            <button
              onClick={() => setIsGrievanceModalOpen(true)}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Lodge Grievance
            </button>
          </div>
        </div>

        {/* View 1: Schemes View */}
        {activeView === 'schemes' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">National Welfare & Statutory Schemes</h3>
                <p className="text-xs text-slate-500">
                  Select a scheme to inspect automated eligibility criteria or trigger instantaneous 1-click citizen filing.
                </p>
              </div>
              <span className="text-xs font-medium text-slate-500">
                Showing {filteredSchemes.length} central & state initiatives
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSchemes.map((scheme) => (
                <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                  onOpenDetails={(s) => setSelectedScheme(s)}
                  onQuickApply={(s) => {
                    if (session.role === 'guest') {
                      addToast('info', 'Registration Required', 'Please sign in or register with Aadhaar to apply for welfare schemes.');
                      setSession(null);
                    } else {
                      setSelectedScheme(s);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* View 2: Applications Queue View */}
        {activeView === 'my_applications' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {session?.role === 'official' ? 'Official Adjudication & Verification Queue' : 'Citizen Applications & Entitlements'}
                </h3>
                <p className="text-xs text-slate-500">
                  {session?.role === 'official'
                    ? 'Review incoming applications with pre-verified DigiLocker records. Approve for DBT or issue remarks.'
                    : 'Track your filed service requests, connector verification checks, and DBT credit status in real-time.'}
                </p>
              </div>

              {session?.role === 'official' && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  Officer Adjudication Mode Active
                </span>
              )}
            </div>

            {filteredApplications.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 text-sm">No applications found</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search criteria or apply for an available welfare scheme from the Schemes catalog.
                </p>
                <button
                  onClick={() => setActiveView('schemes')}
                  className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Browse Available Schemes
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {filteredApplications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    onSelect={(a) => setSelectedApplication(a)}
                    showAdminActions={session?.role === 'official'}
                    onApprove={handleApproveApplication}
                    onReject={handleRejectApplication}
                    onVerifyDoc={handleVerifyDocument}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 3: Grievances View */}
        {activeView === 'grievances' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Central Public Grievance Redressal (CPGRAMS Interop Bus)
                </h3>
                <p className="text-xs text-slate-500">
                  Automated SLA tracking with statutory escalation timers to prevent administrative bottlenecks.
                </p>
              </div>

              <button
                onClick={() => setIsGrievanceModalOpen(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Lodge New Citizen Grievance
              </button>
            </div>

            {filteredGrievances.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 text-sm">Zero pending grievances</h4>
                <p className="text-xs text-slate-500 mt-1">All public redressal tickets have been resolved.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {filteredGrievances.map((g) => (
                  <GrievanceCard
                    key={g.id}
                    grievance={g}
                    showAdminActions={session?.role === 'official'}
                    onResolve={handleResolveGrievance}
                    onEscalate={handleEscalateGrievance}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 4: Connectors View */}
        {activeView === 'connectors' && (
          <ConnectorsPanel
            connectors={connectors}
            onTriggerSyncAll={handleTriggerSyncAll}
            onPingConnector={handlePingConnector}
          />
        )}

        {/* View 5: Analytics & SIH Presentation Pitch View */}
        {activeView === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="font-bold text-slate-900 text-lg">GovBridge Architectural Innovation (SIH 2026 Pitch)</h3>
              <p className="text-xs text-slate-500 mt-1">
                Comparative analysis of traditional administrative overhead versus GovBridge's instant digital verification matrix.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Turnaround Time SLA</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-rose-600 line-through">21 Days</span>
                    <span className="text-2xl font-black text-emerald-600">→ 4 Mins</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Zero physical in-person inspections required due to real-time DigiLocker & Bhulekh API validation.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Leakage Prevention</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-800">100%</span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Direct APBS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Direct Benefit Transfer directly routed to Aadhaar-seeded accounts via PFMS Gateway.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Grievance SLA Compliance</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-700">72-Hour</span>
                    <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Hard Escalation
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Tickets auto-escalate to Joint Secretary/District Magistrate if unaddressed past deadline.
                  </p>
                </div>
              </div>

              {/* Data flow architecture diagram */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="font-bold text-slate-800 text-sm mb-3">Live Architectural Flow:</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="font-mono text-xs font-bold text-amber-800 block">1. Citizen Filing</span>
                    <p className="text-[11px] text-slate-600 mt-1">Single-Click Aadhaar OTP Authentication</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="font-mono text-xs font-bold text-blue-800 block">2. Interoperability Bus</span>
                    <p className="text-[11px] text-slate-600 mt-1">DigiLocker, Bhulekh, Income Tax API queries</p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                    <span className="font-mono text-xs font-bold text-purple-800 block">3. Official Sanction</span>
                    <p className="text-[11px] text-slate-600 mt-1">One-click digital token approval & audit trail</p>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="font-mono text-xs font-bold text-emerald-800 block">4. PFMS DBT Credit</span>
                    <p className="text-[11px] text-slate-600 mt-1">Instant fund transfer or e-Certificate issued</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">GovBridge</span>
            <span>— Smart India Hackathon 2026 Interactive Working Prototype</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Exception-Safe Render Guarantee</span>
            <span>•</span>
            <span>Universal Test OTP: 123456</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedScheme && (
        <SchemeModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
          onApply={handleApplyScheme}
          defaultCitizen={session ? {
            name: session.name,
            govId: session.govId,
            phone: session.phone
          } : undefined}
        />
      )}

      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          currentUserSession={session}
          onClose={() => setSelectedApplication(null)}
          onApprove={handleApproveApplication}
          onReject={handleRejectApplication}
          showAdminActions={session?.role === 'official'}
        />
      )}

      <GrievanceModal
        isOpen={isGrievanceModalOpen}
        onClose={() => setIsGrievanceModalOpen(false)}
        onSubmit={handleLodgeGrievance}
        defaultCitizen={session ? {
          name: session.name,
          govId: session.govId,
          phone: session.phone
        } : undefined}
      />
    </div>
  );
}
