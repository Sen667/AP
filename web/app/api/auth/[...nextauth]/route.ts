import { envConfig } from '@/app/config/env.config'
import { axios } from '@/app/lib/axios.instance'
import { jwtDecode } from 'jwt-decode'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

declare module 'next-auth' {
  interface Session {
    token?: string
    expiresAt?: number
    user: { id: string; email: string; role: string }
  }

  interface User {
    id: string
    email: string
    role: string
    token: string
    expiresAt: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    userId?: string
    role?: string
    backendExpiresAt?: number
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials) return null

        try {
          const res = await axios.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          })
          const token = res.data.token
          if (!token) return null

          const decoded = jwtDecode<{ exp: number; userId: string; email: string; role: string }>(
            token,
          )

          return {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            token,
            expiresAt: decoded.exp * 1000, // ms
          }
        } catch {
          return null
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: envConfig.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const decoded = jwtDecode<{ exp: number }>(user.token)
        token.accessToken = user.token
        token.userId = user.id
        token.email = user.email
        token.role = user.role
        token.backendExpiresAt = decoded.exp * 1000
      }

      // si expiré côté backend, invalide le JWT
      if (token.backendExpiresAt && Date.now() > token.backendExpiresAt) return {}

      return token
    },

    async session({ session, token }) {
      if (!token.accessToken)
        return {
          ...session,
          token: undefined,
          expiresAt: undefined,
          user: { id: '', email: '', role: '' },
        }

      session.token = token.accessToken
      session.expiresAt = token.backendExpiresAt
      session.user = { id: token.userId!, email: token.email!, role: token.role! }

      return session
    },
  },
  pages: { signIn: '/login', newUser: '/espace', signOut: '/login' },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
