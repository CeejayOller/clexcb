// src/types/auth.ts
export const USER_ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  BROKER: 'BROKER',
  CLIENT: 'CLIENT'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Define permissions for each role
export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPERADMIN]: {
    canAccessAdmin: true,
    canAccessClient: true,
    canViewAll: true,
    canEditAll: true,
    canDeleteAll: true,
    canCreate: true
  },
  [USER_ROLES.BROKER]: {
    canAccessAdmin: true,
    canAccessClient: false,
    canViewAll: true,
    canEditOwn: true,
    canDeleteOwn: true,
    canCreate: true
  },
  [USER_ROLES.CLIENT]: {
    canAccessAdmin: false,
    canAccessClient: true,
    canViewOwn: true,
    canEditOwn: true,
    canDeleteOwn: false,
    canCreate: false
  }
} as const;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyName?: string;
  companyAddress?: string;
  contactNumber?: string;
}

export interface Session {
  user: User;
}

export type RolePermissions = typeof ROLE_PERMISSIONS[UserRole];
export type PermissionKey = keyof RolePermissions;

export interface AuthenticatedResponse {
  success: boolean;
  error?: string;
  session?: Session;
  user?: User;
  role?: UserRole;
}

export interface ResourcePermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
}