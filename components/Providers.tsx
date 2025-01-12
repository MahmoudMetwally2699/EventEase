'use client'

import dynamic from 'next/dynamic'
import { NotificationProvider } from '@/providers/NotificationProvider'
import { SessionProvider } from "next-auth/react"

const SocketProvider = dynamic(
  () => import('@/providers/SocketProvider').then(mod => mod.SocketProvider),
  { ssr: false }
)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SocketProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </SocketProvider>
    </SessionProvider>
  )
}
