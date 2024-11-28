// src/lib/constants/navigation.ts

import { 
    LayoutDashboard, 
    Users, 
    Ship, 
    FileText, 
    Settings,
    ArrowDownToLine,
    ArrowUpFromLine,
    ClipboardList
  } from 'lucide-react'
  import type { UserRole } from '@/types/auth'
  import { USER_ROLES } from '@/types/auth'
  
  export interface NavigationItem {
    name: string
    href: string
    icon: any
    roles: UserRole[]
  }
  
  export const adminNavigation: NavigationItem[] = [
    {
      name: 'Overview',
      href: '/admin/overview',
      icon: LayoutDashboard,
      roles: [USER_ROLES.SUPERADMIN, USER_ROLES.BROKER]
    },
    {
      name: 'Import Clearance',
      href: '/admin/services/import',
      icon: ArrowDownToLine,
      roles: [USER_ROLES.SUPERADMIN, USER_ROLES.BROKER]
    },
    {
      name: 'Export Declaration',
      href: '/admin/services/export',
      icon: ArrowUpFromLine,
      roles: [USER_ROLES.SUPERADMIN, USER_ROLES.BROKER]
    },
    {
      name: 'Accreditation',
      href: '/admin/services/accreditation',
      icon: ClipboardList,
      roles: [USER_ROLES.SUPERADMIN, USER_ROLES.BROKER]
    },
    {
      name: 'Clients',
      href: '/admin/clients',
      icon: Users,
      roles: [USER_ROLES.SUPERADMIN, USER_ROLES.BROKER]
    },
    {
      name: 'Documents',
      href: '/admin/documents',
      icon: FileText,
      roles: [USER_ROLES.SUPERADMIN, USER_ROLES.BROKER]
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      roles: [USER_ROLES.SUPERADMIN]
    }
  ]
  
  export const clientNavigation: NavigationItem[] = [
    {
      name: 'Overview',
      href: '/client/overview',
      icon: LayoutDashboard,
      roles: [USER_ROLES.SUPERADMIN, USER_ROLES.CLIENT]
    },
    {
      name: 'Transactions',
      href: '/client/transactions',
      icon: Ship,
      roles: [USER_ROLES.SUPERADMIN, USER_ROLES.CLIENT]
    },
    {
      name: 'Documents',
      href: '/client/documents',
      icon: FileText,
      roles: [USER_ROLES.SUPERADMIN, USER_ROLES.CLIENT]
    },
    {
      name: 'Profile',
      href: '/client/profile',
      icon: Settings,
      roles: [USER_ROLES.SUPERADMIN, USER_ROLES.CLIENT]
    }
  ]