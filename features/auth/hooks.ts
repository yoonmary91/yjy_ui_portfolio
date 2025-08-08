// src/features/auth/hooks.ts
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ADMIN_EMAIL } from './constants'
import { signInWithEmail } from './service' // ✅ 로그인용 함수

// 최고관리자 보호용
export function useAdminGuard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.replace('/login')
      } else {
        setAuthorized(true)
      }
      setLoading(false)
    }

    checkAdmin()
  }, [router])

  return { authorized, loading }
}

// 🔥 여기에 로그인 훅 추가!
export function useLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // useLogin.ts 내부 수정
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      await signInWithEmail(email, password)
      setError(null)
      return true                // ✅ 성공 반환
    } catch (err: any) {
      setError(err.message)
      return false               // ✅ 실패 반환
    } finally {
      setLoading(false)
    }
  }


  return { login, loading, error }
}

// ✅ 현재 세션 정보 가져오기
export function useSession() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  return session
}

// ✅ 로그아웃 훅
export function useLogout() {
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return { logout }
}
