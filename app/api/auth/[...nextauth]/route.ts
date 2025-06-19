import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config'; // Adjust path to your config file

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };