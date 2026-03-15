import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import db from './db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      await db.execute({
        sql: `INSERT OR IGNORE INTO allowed_users (email) VALUES (?)`,
        args: [user.email],
      });
      return true;
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});
