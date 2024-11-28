import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

declare module 'next/headers' {
  function cookies(): {
    get: (name: string) => RequestCookie | undefined
    set: (options: {
      name: string
      value: string
      httpOnly?: boolean
      secure?: boolean
      sameSite?: 'strict' | 'lax' | 'none'
      path?: string
      maxAge?: number
      expires?: Date
    }) => void
  }
}