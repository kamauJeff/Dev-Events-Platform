'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

const AuthNav = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="auth-actions min-w-[120px]" aria-hidden="true" />;
  }

  if (session?.user?.email) {
    return (
      <div className="auth-actions">
        <span className="user-email">{session.user.email}</span>
        <button type="button" className="auth-button" onClick={() => signOut({ callbackUrl: '/' })}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="auth-actions">
      <Link href="/auth/signup" className="auth-button auth-button-muted">Sign up</Link>
      <Link href="/auth/login" className="auth-button">Log in</Link>
    </div>
  );
};

export default AuthNav;