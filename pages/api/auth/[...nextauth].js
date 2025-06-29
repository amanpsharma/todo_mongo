import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '../../../lib/db'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        await dbConnect()
        const user = await User.findOne({ email: credentials.email })
        if (!user) return null
        const isMatch = await bcrypt.compare(credentials.password, user.password)
        if (!isMatch) return null
        return { id: user._id.toString(), email: user.email }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        await dbConnect()
        let dbUser = await User.findOne({ email: user.email })
        if (!dbUser) {
          dbUser = await User.create({ email: user.email, password: '' })
        }
        user.id = dbUser._id.toString()
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id
      }
      return session
    }
  },
  secret: process.env.JWT_SECRET || 'secret'
}

export default NextAuth(authOptions)
