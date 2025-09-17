// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';

// export default NextAuth(authConfig).auth;

// export const config = {
//     matcher: ['/admin/:path'],
//     runtime: 'experimental-edge',
// }

import { NextResponse, NextRequest } from 'next/server';

const Middleware = (req : NextRequest) => {
  if (req.nextUrl.pathname === req.nextUrl.pathname.toLowerCase())
    {return NextResponse.next()};

  return NextResponse.redirect(new URL(req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()));
};

export default Middleware;