// src/components/layout/DashboardSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { adminNavigation, clientNavigation } from '@/lib/constants/navigation'
import { USER_ROLES } from '@/types/auth'
import type { NavigationItem } from '@/lib/constants/navigation'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  const navigation: NavigationItem[] = user.role === USER_ROLES.CLIENT 
    ? clientNavigation 
    : adminNavigation

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user.role)
  )

  return (
    <div className="w-64 h-[calc(100vh-4rem)] border-r bg-background">
      <ScrollArea className="h-full py-6">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}