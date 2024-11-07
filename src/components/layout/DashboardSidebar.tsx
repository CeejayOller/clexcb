// src/components/layout/DashboardSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  Package, 
  Users, 
  TrendingUp,
  Settings,
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const routes = [
    {
      href: '/admin/overview',
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Overview'
    },
    {
      href: '/admin/services/import',
      icon: <ArrowDownToLine className="w-5 h-5" />,
      label: 'Import'
    },
    {
      href: '/admin/services/export',
      icon: <ArrowUpFromLine className="w-5 h-5" />,
      label: 'Export'
    },
    {
      href: '/admin/services/accreditation',
      icon: <ClipboardList className="w-5 h-5" />,
      label: 'Accreditation'
    },
    {
      href: '/admin/documents',
      icon: <FileText className="w-5 h-5" />,
      label: 'Documents'
    },
    {
      href: '/admin/clients',
      icon: <Users className="w-5 h-5" />,
      label: 'Clients'
    }
  ];

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200">
      <div className="p-4">
        <nav className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                pathname === route.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {route.icon}
              <span>{route.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}