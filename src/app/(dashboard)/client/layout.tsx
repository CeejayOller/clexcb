// src/app/(dashboard)/client/layout.tsx

import DashboardHeader from '@/components/layout/DashboardHeader'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { USER_ROLES } from '@/types/auth'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAuth allowedRoles={[USER_ROLES.CLIENT]}>
      <div className="min-h-screen">
        <DashboardHeader />
        <div className="flex h-[calc(100vh-4rem)]">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto bg-muted/50">
            {children}
          </main>
        </div>
      </div>
    </RequireAuth>
  )
}