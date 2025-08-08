'use client'

import { useState } from 'react'
import { useLogin } from '@/features/auth/hooks'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useLogin()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(email, password)
    if (success) router.push('/admin/portfolio')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 bg-[#0a192f] border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400 shadow-sm"
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 bg-[#0a192f] border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400 shadow-sm"
        required
      />
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-md shadow-lg hover:brightness-125 transition hover:shadow-indigo-500/50"
        disabled={loading}
      >
        {loading ? '🚀 로그인 중...' : '✨ 로그인'}
      </button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </form>
  )
}
