
"use client"

import React from "react"
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset, SidebarRail, useSidebar } from "@/components/ui/sidebar"
import { SidebarNav } from "./sidebar-nav"
import { ThemeToggleButton } from "@/components/theme-toggle-button"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react" 
import Link from "next/link"
import { cn } from "@/lib/utils"

const MobileAppSidebarToggleButton = () => {
  const { toggleSidebar, openMobile, isMobile } = useSidebar();

  if (!isMobile) { 
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="h-8 w-8" 
      aria-label={openMobile ? "Close sidebar" : "Open sidebar"}
    >
      {openMobile ? <PanelLeftClose /> : <PanelLeftOpen />}
    </Button>
  );
};


export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="sidebar" collapsible="icon" side="left">
        <SidebarHeader className="p-4 flex justify-between items-center">
          <Link href="/courses" className="flex items-center gap-2 min-w-0 group-data-[collapsible=icon]:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 flex-shrink-0  text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <h1 className="text-xl font-semibold text-foreground truncate">Course Manager</h1>
          </Link>
          {/* MobileAppSidebarToggleButton is removed from here and placed in the mobile-specific header */}
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-2 flex items-center justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-2">
           <div className="group-data-[collapsible=icon]:hidden text-xs text-muted-foreground">
            © {new Date().getFullYear()} Course Manager
          </div>
          <ThemeToggleButton />
        </SidebarFooter>
      </Sidebar>
      <SidebarRail /> 
      <SidebarInset className="w-full overflow-x-hidden">
        {/* Mobile-only Header */}
        <header className="md:hidden p-4 flex justify-between items-center border-b bg-background sticky top-0 z-20">
          <Link href="/courses" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <h1 className="text-lg font-semibold text-foreground">Course Manager</h1>
          </Link>
          <MobileAppSidebarToggleButton />
        </header>
        
        <div className="w-full max-w-full overflow-x-hidden pt-4 px-4 md:px-6">
           {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
