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
    <div className='fixed top-0 w-full bg-white/70 backdrop-blur-2xl z-50 border-b border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-300' >
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
      
        {/* Center Tabs for Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm font-semibold text-slate-600 hover:text-blue-600 hover:-translate-y-0.5 transition-all">Features</Link>
          <Link href="/#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-blue-600 hover:-translate-y-0.5 transition-all">How It Works</Link>
          <Link href="/#testimonials" className="text-sm font-semibold text-slate-600 hover:text-blue-600 hover:-translate-y-0.5 transition-all">Testimonials</Link>
        </div>

        <div className='flex items-center space-x-4 gap-3'>
          <SignedIn>
            <Link href={"/dashboard"}>
             <Button variant="ghost" className="flex items-center gap-2 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-full transition-all">
              <PenBox size={18} />
              <span className='hidden md:inline font-medium'>Dashboard</span>
             </Button>
            </Link>

            <Link href={"/transaction/create"}>
             <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] transition-all duration-300 hover:-translate-y-0.5">
              <LayoutDashboard size={18} />
              <span className='hidden md:inline font-semibold'>Transactions</span>
             </Button>
            </Link>
            <div className="ml-2 ring-2 ring-white rounded-full shadow-md">
              <UserButton appearance={{elements: { avatarBox: "w-10 h-10" }}}/>
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-full px-8 shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] transition-all duration-300 hover:-translate-y-0.5">
                Login
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </div>
  )
}

export default Header
