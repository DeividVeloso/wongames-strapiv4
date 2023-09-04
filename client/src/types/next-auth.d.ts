import 'next-auth'
import { JWT } from 'next-auth/jwt'
import { Session, User } from 'next-auth'

declare module 'next-auth' {
  export interface UserAuth extends User {
    username?: string
    jwt?: string
  }

  export interface SessionAuth extends Session {
    jwt?: JWT | string
    id?: string
  }
}
export * from 'next-auth'
