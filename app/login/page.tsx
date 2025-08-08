'use client'

import LoginForm from '@/components/forms/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-black text-white">
      <div className="backdrop-blur-lg bg-white/5 border border-blue-200/10 rounded-xl p-8 shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-200 tracking-wider drop-shadow-md">
          🪐 Galaxy Admin
        </h1>
        <LoginForm />
      </div>
    </div>
  )
}
