'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.ok) {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl transform transition-all hover:scale-[1.02]">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="focus:ring-2 focus:ring-purple-500 transition-all"
          />

          <Button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transform transition-all hover:scale-[1.02] focus:ring-2 focus:ring-purple-500"
          >
            Sign In
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:text-blue-800 font-semibold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
