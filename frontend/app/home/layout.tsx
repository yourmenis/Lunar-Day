'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.replace('/login')
      return
    }
    // เช็ค JWT exp
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('access_token')
        router.replace('/login')
        return
      }
    } catch {}

    setReady(true)
  }, [])

  if (!ready) return null

  return <>{children}</>
}