// src/types/auth.ts

import type { Prisma } from '@prisma/client';

// Role definitions
export const USER_ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  BROKER: 'BROKER',
  CLIENT: 'CLIENT'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Define detailed permissions for each role
export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPERADMIN]: {
    canAccessAdmin: true,
    canAccessClient: true,
    canManageUsers: true,
    canManageBrokers: true,
    canViewAllShipments: true,
    canEditAllShipments: true,
    canDeleteAllShipments: true,
    canApproveDocuments: true,
    canManageAccreditation: true,
    canViewReports: true,
    canManageSettings: true,
  },
  [USER_ROLES.BROKER]: {
    canAccessAdmin: true,
    canAccessClient: false,
    canViewAssignedClients: true,
    canManageAssignedClients: true,
    canCreateShipments: true,
    canViewAssignedShipments: true,
    canEditAssignedShipments: true,
    canUploadDocuments: true,
    canVerifyDocuments: true,
    canGenerateReports: true,
  },
  [USER_ROLES.CLIENT]: {
    canAccessAdmin: false,
    canAccessClient: true,
    canViewOwnShipments: true,
    canCreateShipmentRequests: true,
    canUploadDocuments: true,
    canViewOwnDocuments: true,
    canViewOwnReports: true,
  }
} as const;

// Separate profile types for Client and Broker
interface ClientProfile {
  tin?: string;
  brn?: string;
  industryType?: string;
  taxSettings?: {
    vatRegistered?: boolean;
    vatNumber?: string;
  };
}

interface BrokerProfile {
  employeeId?: string;
  designation?: string;
  specialization?: string[];
}

// User interface with discriminated union for profile
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  companyName?: string;
  companyAddress?: string;
  contactNumber?: string;
  profile?: ClientProfile | BrokerProfile;
}


// Session interface with enhanced details
export interface Session {
  user: User;
  expiresAt: number;
  permissions: RolePermissions;
}

// Response types
export interface AuthResponse {
  success: boolean;
  error?: string;
  session?: Session;
  user?: User;
  role?: UserRole;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  companyName?: string;
  companyAddress?: string;
  contactNumber?: string;
  tin?: string;
  brn?: string;
  industryType?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Permission helper types
export type RolePermissions = typeof ROLE_PERMISSIONS[UserRole];
export type PermissionKey = keyof RolePermissions;

// Resource permission interface
export interface ResourcePermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
}

// Customs specific interfaces
export interface CustomsDocument {
  id: string;
  type: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface BrokerAssignment {
  brokerId: string;
  clientId: string;
  isPrimary: boolean;
  assignedAt: Date;
}

// Error types
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}