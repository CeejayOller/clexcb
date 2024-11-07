// src/lib/utils/permissions.ts
import { User, USER_ROLES, ROLE_PERMISSIONS, type PermissionKey } from '@/types/auth';

export function checkPermission(user: User | null, permission: PermissionKey): boolean {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role][permission] || false;
}

export function getResourcePermissions(user: User | null, resourceUserId?: string) {
  if (!user) {
    return {
      canView: false,
      canEdit: false,
      canDelete: false,
      canCreate: false
    };
  }

  // Superadmin can do everything
  if (user.role === USER_ROLES.SUPERADMIN) {
    return {
      canView: true,
      canEdit: true,
      canDelete: true,
      canCreate: true
    };
  }

  // For Broker
  if (user.role === USER_ROLES.BROKER) {
    const isOwn = resourceUserId === user.id;
    return {
      canView: true, // Brokers can view all
      canEdit: isOwn, // Can only edit own resources
      canDelete: isOwn, // Can only delete own resources
      canCreate: true // Can create new resources
    };
  }

  // For Client
  if (user.role === USER_ROLES.CLIENT) {
    const isOwn = resourceUserId === user.id;
    return {
      canView: isOwn,
      canEdit: isOwn,
      canDelete: false,
      canCreate: false
    };
  }

  return {
    canView: false,
    canEdit: false,
    canDelete: false,
    canCreate: false
  };
}

export function canAccessRoute(user: User | null, route: string): boolean {
  if (!user) return false;

  // Superadmin can access everything
  if (user.role === USER_ROLES.SUPERADMIN) return true;

  // Check admin routes
  if (route.startsWith('/admin')) {
    return checkPermission(user, 'canAccessAdmin');
  }

  // Check client routes
  if (route.startsWith('/client')) {
    return checkPermission(user, 'canAccessClient');
  }

  // Public routes
  return true;
}

export function filterUserAccessibleData<T extends { userId: string }>(
  user: User,
  data: T[]
): T[] {
  if (user.role === USER_ROLES.SUPERADMIN) {
    return data;
  }

  if (user.role === USER_ROLES.BROKER) {
    return data.filter(item => item.userId === user.id);
  }

  // Clients can only see their own data
  return data.filter(item => item.userId === user.id);
}