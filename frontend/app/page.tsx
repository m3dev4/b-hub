import React from 'react'
import Image from 'next/image'
import SignInPage from '@/auth/(authentification)/sign-in/[..sign-in]/page'

const PageHome = () => {
  return (
    <main className='min-h-screen h-full w-full bg-gradient-to-r from-stone-900 to-zinc-800 '>
      <div className='flex items-center justify-around h-screen w-full '>
         <Image 
          src="/image/logo.png"
          alt='logo'
          width={500}
          height={500}
          className='object-contain absolute left-0'
         />
         <div>
           <SignInPage />
         </div>
      </div>
    </main>
  )
}

export default PageHome