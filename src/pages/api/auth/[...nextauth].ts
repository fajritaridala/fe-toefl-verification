import authServices from '@/services/auth.service';
import { AUTH_SECRET } from '@/utils/config/env';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JwtExt, SessionExt, UserExt } from '@/utils/interfaces/Auth';

export default NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24,
  },
  secret: AUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'MetaMask',
      credentials: {
        address: { label: 'address', type: 'text' },
      },

      async authorize(credentials: Record<'address', string> | undefined) {
        const address = credentials?.address as string | undefined;
        if (!address) {
          throw new Error('address tidak diterima');
        }
        const result = await authServices.login({ address });

        if (result.status === 200 && result.data.needsRegistration) {
          const user = {
            address: result.data.data.address,
            needsRegistration: result.data.needsRegistration,
          };
          return user;
        }

        const accessToken = result.data.data.user;
        const me = await authServices.getProfileWithToken(accessToken);
        const user = me.data.data;

        if (
          accessToken &&
          result.status === 200 &&
          user.address &&
          me.status === 200
        ) {
          user.accessToken = accessToken;
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JwtExt; user: UserExt | null }) {
      if (user) {
        token.user = user;
      }

      return token;
    },

    async session({ session, token }: { session: SessionExt; token: JwtExt }) {
      session.user = token.user;
      session.accessToken = token.user?.accessToken;
      return session;
    },
  },
});
