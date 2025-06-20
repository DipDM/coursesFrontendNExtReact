
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookMarked, CalendarDays, Home } from "lucide-react"
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/courses", label: "Courses", icon: BookMarked },
  { href: "/instances", label: "Instances", icon: CalendarDays },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href}>
            <SidebarMenuButton
              className={cn(
                pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              asChild={false} // Ensure it's a button
              isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
              tooltip={{ children: item.label, side: "right" }}
            >
              <item.icon className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
