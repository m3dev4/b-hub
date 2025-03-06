"use client";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProfilePageProps {
  user: User;
}

const ProfilePage = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex-col flex-1 flex items-center justify-center w-full">
        <p>Utilisateur non trouvé</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full overflow-hidden">
      <div className="absolute flex items-center justify-center top-0 w-full left-0">
        <div className="w-full fixed top-0 h-10 text-center bg-background blur-md " />
        <h1 className="z-10 font-sans font-semibold text-xl py-">
          {currentUser ? currentUser.userName : "Utilisateur non trouvé"}
        </h1>
      </div>
      <div className="flex absolute top-3 mt-20 left-0 flex-col items-center justify-center w-full">
        <div className="relative left-28">
             {/* Couverture de profil */}
             <div className="h-48 w-[900px] rounded-xl bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
             <div className="absolute flex flex-col justify-between -bottom-56 -left-10 items-end gap-4">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.userName[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="relative left-10">
                  <div className=" flex justify-between">
                  <p className="font-sans uppercase text-xl font-semibold">{currentUser.firstName} {currentUser.lastName}</p>
                  <Button className="bg-primary text-background absolute left-[800px]">Suivre</Button>
                  </div>
                  <p className="font-sans text-muted-foreground">@_{currentUser.userName}</p> 
                  <p className="font-sans text-muted-foreground">{currentUser.titleProfile}</p> 
                  <p className="font-sans text-muted-foreground">{currentUser.location}</p> 
                  <Link href={currentUser.website} className="font-sans text-cyan-500">{currentUser.website}</Link> 
                </div>
                {/* Button follow & following */}
                <div className="flex gap-2">
                  8.9K followers 
                  1.2K following
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
