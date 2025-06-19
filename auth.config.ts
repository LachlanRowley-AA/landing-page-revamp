import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { Session, User, Account, Profile, AuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// Extend Profile type for Google-specific properties
interface GoogleProfile extends Profile {
  email_verified?: boolean;
}

const allowedEmails = ['lachlan@assetalley.com.au', 'familyfriendlydev@gmail.com', 'eliasdib0@gmail.com'];

export const authConfig: AuthOptions = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }: {
      user: User;
      account: Account | null;
      profile?: GoogleProfile;
    }) {
      if (account?.provider === 'google') {
        // Ensure we have a valid email before checking
        if (!user.email || !profile?.email_verified) {
          return false;
        }
        return allowedEmails.includes(user.email);
      }
      return false;
    },
    session: async ({ session, token }: {
      session: Session;
      token: JWT;
    }) => {
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};