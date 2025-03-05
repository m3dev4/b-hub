"use client"
import MainSidebar from '@/components/main-sidebar'
import { SidebarInset } from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import CommunityPage from '../community/page'
import MeethubPage from '../meethub/page'
import MessagePage from '../messages/page'
import NotificationsPage from '../notifications/page'
import ProfilePage from '../profile/page'
import PostPage from '../post/page'

const Accueil = () => {
    const router = useRouter()
    const { logout, currentUser, isLoading} = useAuth()
    const [ activeTab, setActiveTab ] = useState("Accueil")

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return null;
    }

  return (
    <div className='flex min-h-screen'>
        <MainSidebar activeTab={activeTab} setActiveTab={setActiveTab} user={currentUser} />
        <SidebarInset >
        {activeTab === "Accueil" && <PostPage />}
        {activeTab === "community" && <CommunityPage />}
        {activeTab === "meethub" && <MeethubPage />}
        {activeTab === "messages" && <MessagePage />}
        {activeTab === "notifications" && <NotificationsPage />}
        {activeTab === "profile" && <ProfilePage />}
      </SidebarInset>
    </div>
  )
}

export default Accueil