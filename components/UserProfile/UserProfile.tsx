'use client';

import { useSession, signOut } from 'next-auth/react';

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
      {session.user?.image && (
        <img
          src={session.user.image}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      )}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">
          {session.user?.name}
        </p>
        <p className="text-sm text-gray-500">
          {session.user?.email}
        </p>
      </div>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/' })}
        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50"
      >
        Sign Out
      </button>
    </div>
  );
}