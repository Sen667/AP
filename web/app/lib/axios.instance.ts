import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { envConfig } from '@/app/config/env.config'
import ax from 'axios'
import { getServerSession } from 'next-auth'
import { getSession, signOut } from 'next-auth/react'

export const axios = ax.create({
  // Pas de baseURL ici
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

axios.interceptors.request.use(
  async (config) => {
    const isServer = typeof window === 'undefined'

    config.baseURL = isServer
      ? process.env.API_INTERNAL_URL! // runtime, jamais exposé au browser
      : process.env.NEXT_PUBLIC_API_URL! // baked au build, accessible browser

    let token
    if (isServer) {
      const session = await getServerSession(authOptions)
      token = session?.token
    } else {
      const session = await getSession()
      token = session?.token
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        await signOut({ redirect: true, callbackUrl: '/login' })
      }
    }
    return Promise.reject(error)
  },
)
