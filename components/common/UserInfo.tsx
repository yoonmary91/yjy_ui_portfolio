// ✅ UserInfo.tsx - 갤럭시 테마 스타일 적용

'use client'

import { useSession, useLogout } from '@/features/auth/hooks'

export default function UserInfo() {
  const session = useSession()
  const { logout } = useLogout()

  if (!session) return null

  return (
    <div className="flex items-center justify-end gap-4 bg-[#1b263b] px-4 py-2 rounded-md border border-blue-800 shadow">
      <span className="text-sm text-blue-200 font-mono">
        👤 {session.user.email}
      </span>
      <button
        onClick={logout}
        className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm rounded hover:brightness-110 transition shadow"
      >
        로그아웃
      </button>
    </div>
  )
}
