import { NextApiRequest, NextApiResponse } from 'next'
import { AuthOptions, SessionAuth, UserAuth } from 'next-auth'

import { JWT } from 'next-auth/jwt'

import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

type AuthorizeProps = {
  email: string
  password: string
}

const options: AuthOptions = {
  pages: {
    signIn: '/sign-in'
  },
  providers: [
    CredentialsProvider({
      name: 'Sign-in',
      credentials: {},

      async authorize(credentials, req) {
        const { email, password } = req.body as AuthorizeProps

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local`,
          {
            method: 'POST',
            body: new URLSearchParams({
              identifier: email,
              password: password
            })
          }
        )

        const data = await response.json()
        if (data.user) {
          return { ...data.user, ti: 'tooooo', jwt: data.jwt }
        } else {
          return undefined
        }
      }
    })
  ],

  callbacks: {
    session: async ({
      session,
      token
    }: {
      session: SessionAuth
      token: JWT
    }) => {
      session.jwt = token.jwt as JWT
      session.id = token.id as string

      return Promise.resolve(session)
    },
    jwt: async ({ token, user }: { token: JWT; user: UserAuth }) => {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.username
        token.jwt = user.jwt
      }
      return Promise.resolve(token)
    }
  }
}

const Auth = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options)

export default Auth
