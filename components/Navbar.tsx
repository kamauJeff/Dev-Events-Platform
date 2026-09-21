import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/auth';
import UserActions from './UserActions';

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header>
      <nav>
        <Link href="/" className="logo">
        <Image src="/icons/logo.png" alt="logo" width={24} height={24 } /> 
        <p>DevEvent</p>
        </Link>
        <ul className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/">Events</Link>
          <Link href="/">Create Event</Link>
        </ul>
        {session?.user?.email ? (
          <UserActions email={session.user.email} />
        ) : (
          <div className="auth-actions">
            <Link href="/auth/signup" className="auth-button auth-button-muted">Sign up</Link>
            <Link href="/auth/login" className="auth-button">Log in</Link>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
