"use client";
import MainSidebar from "@/components/main-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [activeTab, setActiveTab] = useState("");
  const { currentUser } = useAuth();
  return (
    <div className="flex items-center justify-center">
      <div className="w-full">
        <SidebarProvider>
          <MainSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={currentUser}
          />
        </SidebarProvider>
        </div>
        <div className="w-full">{children}</div>
    </div>
  );
}
