import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { DivideIcon, LayoutDashboard, PenBox, Wallet, Sparkles } from 'lucide-react'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {
  await checkUser();
  return (
    <div className='fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b' >
      <nav className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <Link href='/'>
        
        <div className="flex items-center gap-2 transition-transform duration-500 ease-in-out hover:scale-110">
          <div className="relative group">
            <Wallet className="h-10 w-10 text-blue-600 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
            <Sparkles className="h-5 w-5 text-pink-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient">
            SpendWise
          </span>
        </div>
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
