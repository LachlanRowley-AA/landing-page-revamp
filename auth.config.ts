import NextAuth, { NextAuthConfig } from 'next-auth';
import type { Account, Profile, Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

// Extend Profile type for Google-specific properties
interface GoogleProfile extends Profile {
  email_verified?: boolean;
}

const allowedEmails = [
  'lachlan@assetalley.com.au',
  'familyfriendlydev@gmail.com',
  'eliasdib0@gmail.com',
];

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const googleProfile = profile as GoogleProfile | undefined;

        if (!user.email || !googleProfile?.email_verified) {
          return false;
        }
        return allowedEmails.includes(user.email);
      }
      return false;
    },
    async session({ session, token }) {
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
