'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-white/10 backdrop-blur">
      <nav className="max-w-screen-xl mx-auto px-4 py-3">
        <ul className="flex justify-center space-x-8 text-sm font-medium text-slate-100">
          <li>
            <Link
              href="/"
              className="hover:ring-1 hover:ring-white/30 px-3 py-1 rounded transition duration-200"
            >
              PORTFOLIO
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="hover:ring-1 hover:ring-white/30 px-3 py-1 rounded transition duration-200"
            >
              CONTACT
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
