"use client"
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import React from 'react'

const Accueil = () => {
    const router = useRouter()
    const { logout, currentUser} = useAuth()
    const handleLogout = () => {
        logout.mutate()
        router.push("/")
    }
  return (
    <div>
        <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Accueil