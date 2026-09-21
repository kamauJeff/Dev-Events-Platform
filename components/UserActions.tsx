'use client';

import { signOut } from 'next-auth/react';

const UserActions = ({ email }: { email: string }) => (
  <div className="auth-actions">
    <span className="user-email">{email}</span>
    <button type="button" className="auth-button" onClick={() => signOut({ callbackUrl: '/' })}>
      Log out
    </button>
  </div>
);

export default UserActions;