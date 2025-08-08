import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Galaxy Portfolio',
  description: 'A cosmic-themed portfolio built with Next.js + Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-black text-white">
        <div className="relative flex flex-col min-h-screen bg-black">
          <div className="starfield" /> {/* ⭐ 별 배경 */}
          <Header />
          <main className="flex-1 z-10 relative">{children}</main>
          <ScrollToTop />
          <Footer />
        </div>
      </body>
    </html>
  )
}
