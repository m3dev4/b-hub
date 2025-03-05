import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "B-Hub - Accueil",
    description: "B-Hub est une plateforme qui combine les fonctionnalités d'un réseau social, d'un forum et d'un espace collaboratif dédié aux développeurs et acteurs de la tech au Sénégal. L'application vise à rassembler la communauté tech locale en facilitant le partage de projets, la discussion, le recrutement et l'organisation d'événements.",
}


export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
