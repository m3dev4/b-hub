import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "./ui/sidebar";
import { Code, Search } from "lucide-react";
import { Input } from "./ui/input";
import { navItems } from "@/constants";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "@/types";

interface MainSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}



const MainSidebar = ({ activeTab, setActiveTab }: MainSidebarProps) => {
    const  { logout, currentUser } = useAuth()
    const router = useRouter()

    const handleNavigation = (item: typeof navItems[0]) => {
      setActiveTab(item.label)
      router.push(item.path)
    }

    const handleLogout = () => {
        logout.mutate()
        router.push("/")
    }
  return (
    <Sidebar variant="floating" collapsible="icon" className="-ml-2 -mt-3 h-[104vh]">
      <SidebarHeader>
        <div className="flex items-center gap-2 py-2">
          <span className="text-xl font-bold">B-Hub</span>
        </div>
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5" />
            <Input
              placeholder="Search"
              type="search"
              className="pl-8 w-full rounded-md"
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            {navItems.map((item) => (
              <SidebarMenuItem
                key={item.id}
                onClick={() => handleNavigation(item)}
                className="list-none"
              >
                <SidebarMenuButton
                  isActive={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                  tooltip={item.label}
                  className="list-none"
                >
                 <Image 
                    src={`/animations/${item.icon}`}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                  <span className="list-none">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Découvrir</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Projects Open Source">
                  <Code className="w-5 h5" />
                  <span>Projects Open Source</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Hackathons">
                  <span>Hackathons</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Paramètres">
                <span>Paramètres</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Button onClick={handleLogout}>Déconnexion</Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <div className="p-4">
          <div className="flex items-center gap-3">
            <Image 
              src={currentUser?.avatar || "/images/placeholder.jpg"}
              alt={currentUser?.userName || "User"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-medium">{currentUser?.firstName || "Utilisateur"}</span>
              <span className="text-sm text-gray-500">{currentUser?.titleProfile || "Membre"}</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
      <SidebarTrigger className="absolute top-4 right-4 hidden" />
    </Sidebar>
  );
};

export default MainSidebar;
