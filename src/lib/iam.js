// Server-side Identity & Access Management (IAM-01 & IAM-02)
import { getStore, saveStore } from './store.js';

export const PERSONAS = {
  PUBLIC_VISITOR: 'public_visitor',
  EMPLOYEE: 'employee',
  CLIENT_MEMBER: 'client_member',
  CLIENT_ADMIN: 'client_admin',
  LEARNING_MODERATOR: 'learning_moderator',
  CONTENT_PUBLISHER: 'content_publisher',
  PORTAL_ADMIN: 'portal_admin'
};

export const PERMISSION_GRANTS = {
  SUBMIT_OBSERVATIONS: 'submit_observations',
  ACCESS_ENTITLED_SANDBOX: 'access_entitled_sandbox',
  VIEW_SHARED_LEARNING: 'view_shared_learning',
  ACCESS_EMPLOYEE_PLAYGROUND: 'access_employee_playground',
  VIEW_INTERNAL_BROADCASTS: 'view_internal_broadcasts',
  MODERATE_LEARNING: 'moderate_learning',
  REDACT_CONTRIBUTIONS: 'redact_contributions',
  PUBLISH_SHARED_LEARNING: 'publish_shared_learning',
  PUBLISH_VIDEOS: 'publish_videos',
  MANAGE_CMS_BANNERS: 'manage_cms_banners',
  INVITE_CLIENT_USERS: 'invite_client_users',
  MANAGE_CLIENT_ROLES: 'manage_client_roles',
  MANAGE_IMPROVEMENT_IDEAS: 'manage_improvement_ideas',
  RUN_FEDERATED_COORDINATOR: 'run_federated_coordinator',
  MANAGE_ORGANISATIONS: 'manage_organisations',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  MANAGE_SYSTEM_CONFIG: 'manage_system_config'
};

/**
 * Resolves current user from request session header or cookie.
 * Securely enforces server-side validation against our store.
 */
export function authenticateRequest(req) {
  const store = getStore();
  
  // Extract user ID from header (e.g. x-azentio-user-id or auth cookie)
  let userId = null;
  
  if (req.headers && typeof req.headers.get === 'function') {
    userId = req.headers.get('x-azentio-user-id') || req.headers.get('authorization')?.replace('Bearer ', '');
  } else if (req.headers) {
    userId = req.headers['x-azentio-user-id'] || (req.headers['authorization']?.replace('Bearer ', ''));
  }

  // Fallback to cookie if present
  if (!userId && req.cookies) {
    if (typeof req.cookies.get === 'function') {
      userId = req.cookies.get('azentio_user_id')?.value;
    } else {
      userId = req.cookies['azentio_user_id'];
    }
  }

  // If no user token provided, resolve as unauthenticated public visitor
  if (!userId) {
    return {
      authenticated: false,
      user: {
        id: "usr_pub_anonymous",
        name: "Public Visitor",
        persona: PERSONAS.PUBLIC_VISITOR,
        roles: [PERSONAS.PUBLIC_VISITOR],
        grants: [],
        tenantId: null,
        tenantName: null
      }
    };
  }

  const user = store.users.find(u => u.id === userId);
  if (!user) {
    return {
      authenticated: false,
      user: {
        id: "usr_pub_anonymous",
        name: "Public Visitor",
        persona: PERSONAS.PUBLIC_VISITOR,
        roles: [PERSONAS.PUBLIC_VISITOR],
        grants: [],
        tenantId: null,
        tenantName: null
      }
    };
  }

  return {
    authenticated: user.persona !== PERSONAS.PUBLIC_VISITOR,
    user
  };
}

/**
 * Validates whether user is allowed to access a given resource audience.
 * Audiences:
 * - 'public': Anyone including unauthenticated visitors
 * - 'client_only': Any authenticated client member with active tenant
 * - 'internal_employee_only': Azentio employees only
 * - 'moderator_only': Learning moderators only
 * - 'portal_admin_only': Portal administrators only
 */
export function checkAudienceAccess(user, audience) {
  if (audience === 'public') return { allowed: true };

  // Unauthenticated users cannot view non-public resources
  if (!user || user.persona === PERSONAS.PUBLIC_VISITOR) {
    return { allowed: false, reason: 'Authentication required. Resource is not public.' };
  }

  if (audience === 'internal_employee_only') {
    const isEmployee = user.roles.includes('employee') || user.persona === PERSONAS.EMPLOYEE || user.persona === PERSONAS.PORTAL_ADMIN;
    if (!isEmployee) {
      return { allowed: false, reason: 'Employee-only resource. Verified internal Azentio identity required.' };
    }
    return { allowed: true };
  }

  if (audience === 'client_only') {
    const isClient = user.tenantId && user.tenantId !== 'tenant_azentio_internal';
    const isStaffWithExplicitSupport = user.persona === PERSONAS.PORTAL_ADMIN || user.persona === PERSONAS.LEARNING_MODERATOR;
    if (!isClient && !isStaffWithExplicitSupport) {
      return { allowed: false, reason: 'Client-only resource. Active organisation workspace required.' };
    }
    return { allowed: true };
  }

  if (audience === 'moderator_only') {
    if (!user.grants?.includes(PERMISSION_GRANTS.MODERATE_LEARNING)) {
      return { allowed: false, reason: 'Restricted to designated Learning Moderators.' };
    }
    return { allowed: true };
  }

  if (audience === 'portal_admin_only') {
    if (user.persona !== PERSONAS.PORTAL_ADMIN && !user.roles.includes(PERSONAS.PORTAL_ADMIN)) {
      return { allowed: false, reason: 'Restricted to Portal Infrastructure Administrators.' };
    }
    return { allowed: true };
  }

  return { allowed: false, reason: 'Unknown resource audience category.' };
}

/**
 * Tenant Isolation & Ownership Check:
 * Enforces that client users cannot read/modify records belonging to another tenant.
 */
export function checkTenantAccess(user, targetTenantId) {
  if (!user || user.persona === PERSONAS.PUBLIC_VISITOR) {
    return { allowed: false, reason: 'Authentication required.' };
  }

  // If user belongs to the same tenant, allow
  if (user.tenantId && user.tenantId === targetTenantId) {
    return { allowed: true };
  }

  // Privileged moderators / admins can view submitted items for moderation, but NOT unsubmitted drafts!
  if (user.persona === PERSONAS.LEARNING_MODERATOR || user.persona === PERSONAS.PORTAL_ADMIN) {
    return { allowed: true, privilegedReview: true };
  }

  return { 
    allowed: false, 
    reason: `Tenant access denied. User belongs to ${user.tenantId || 'none'}, not target tenant ${targetTenantId}.` 
  };
}

/**
 * Verifies if user has a specific required grant.
 */
export function checkGrant(user, requiredGrant) {
  if (!user || !user.grants) return false;
  return user.grants.includes(requiredGrant);
}

/**
 * Audit log recording helper (IAM-01)
 */
export function recordAuditLog(store, { userId, userName, role, action, targetResourceId, targetType, details }) {
  const auditEntry = {
    id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    userId: userId || 'system',
    userName: userName || 'System Automated',
    role: role || 'system',
    action,
    targetResourceId,
    targetType,
    details
  };

  if (!store.auditLogs) store.auditLogs = [];
  store.auditLogs.unshift(auditEntry);
  return auditEntry;
}

/**
 * In-app Notification helper
 */
export function sendInAppNotification(store, { userId, title, message, type = 'info' }) {
  const notif = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false,
    type
  };

  if (!store.notifications) store.notifications = [];
  store.notifications.unshift(notif);
  return notif;
}
