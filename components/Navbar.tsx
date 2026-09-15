import Link from 'next/link';
import React from 'react'
import Image from 'next/image';

const Navbar = () => {
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
      </nav>
    </header>
  )
}

export default Navbar
