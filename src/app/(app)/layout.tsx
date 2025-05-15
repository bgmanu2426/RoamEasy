
import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { TripProvider } from '@/components/providers/trip-provider';
import { Toaster } from "@/components/ui/toaster";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <TripProvider>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="p-4">
            <div className="flex items-center justify-between">
                <Logo />
                <div className="md:hidden">
                    <SidebarTrigger />
                </div>
            </div>
          </SidebarHeader>
          <Separator />
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter className="p-4 mt-auto">
            {/* Footer content if any, e.g. settings, logout */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
            <div className="md:hidden">
                 <SidebarTrigger />
            </div>
            <div className="flex-1">
              {/* Optional: Breadcrumbs or search bar can go here */}
            </div>
            <div>
              {/* User profile / actions */}
              {/* <Button variant="ghost" size="icon"><Settings /></Button> */}
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </TripProvider>
  );
}
