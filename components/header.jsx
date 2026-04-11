import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { DivideIcon, LayoutDashboard, PenBox } from 'lucide-react'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {
  await checkUser();
  return (
    <div className='fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b' >
      <nav className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <Link href='/'>
        
        <Image
        src={"/logo.png"} alt ="SpendWise logo" height={80} width={200}
        className="transition-transform duration-500 ease-in-out hover:scale-110 object-contain h-10 w-auto "
         />
        </Link>
      
      <div className='flex items-center space-x-4 gap-3'>
        <SignedIn>
          <Link href ={"/dashboard"} className='text-gray-600 flex gap-2'>
           <Button  className="flex items-center gap-2">
            <PenBox size={18} />
            <span className='hidden md:inline'>Dashboard</span>
           </Button>
          </Link>
          
        

         <Link href ={"/transaction/create"}>
           <Button variant="outline" className="flex items-center gap-2">
            <LayoutDashboard size={18} />
            <span className='hidden md:inline'>Transactions</span>
           </Button>
          </Link>
          <UserButton  appearance={{elements:{
            avatarBox: "w-10 h-10",
          },
          }}/>
        </SignedIn>




<SignedOut>
  <SignInButton mode="modal" forceRedirectUrl="/dashboard" >
    <Button variant="outline">Login</Button>
  </SignInButton>
</SignedOut>
      
        
        </div>
        </nav>
    </div>
  )
}

export default Header
