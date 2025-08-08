'use client'

import Link from 'next/link'

interface Props {
  title: string
  thumbnail_url: string
  slug: string
}

export default function ProjectCard({ title, thumbnail_url, slug }: Props) {
  return (
    <Link href={`/portfolio/${slug}`}>
      <div
        className="
          relative
          rounded-xl overflow-hidden
          bg-gradient-to-br from-neutral-900 to-black
          border border-white/10
          shadow-md shadow-black/40
          hover:scale-105
          transition duration-300
          cursor-pointer
          card-hover-glow
        "
      >
        <img
          src={thumbnail_url}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="p-3 text-center text-sm text-slate-100 hover:text-white transition">
          {title}
        </div>
      </div>
    </Link>
  )
}
