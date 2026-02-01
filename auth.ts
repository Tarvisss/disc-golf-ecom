import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: Add your own authentication logic here
        // This is where you'd verify credentials against your database
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Placeholder - replace with actual database lookup
        // const user = await db.user.findUnique({ where: { email: credentials.email } })
        // if (user && await bcrypt.compare(credentials.password, user.password)) {
        //   return user
        // }

        return null
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    newUser: "/signup",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
})
