import NextAuth from "next-auth";
import { authConfig } from "@/auth.config"; // adjust path

const { handlers } = NextAuth(authConfig);

export const { GET, POST } = handlers;
