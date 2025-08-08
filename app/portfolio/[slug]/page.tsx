'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type ProjectData = {
  id: string
  title: string
  date: string
  gallery_urls: string[]
  slug: string
}

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)

  const imageRefs = useRef<(HTMLImageElement | null)[]>([])
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set())

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug || typeof slug !== 'string') return

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!error && data) setProject(data as ProjectData)
      setLoading(false)
    }

    fetchProject()
  }, [slug])

  useEffect(() => {
    if (!project?.gallery_urls) return

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSet((prev) => {
          const updated = new Set(prev)

          entries.forEach((entry) => {
            const idx = Number(entry.target.getAttribute('data-idx'))
            if (entry.isIntersecting) updated.add(idx)
            else updated.delete(idx)
          })

          return updated
        })
      },
      { threshold: 0.5, rootMargin: '-100px 0px -100px 0px' }
    )

    imageRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [project])

  if (loading) {
    return <div className="text-white text-center py-20">Loading...</div>
  }

  if (!project) {
    return <div className="text-white text-center py-20">Project not found.</div>
  }

  return (
    <div className="px-4 py-12 text-white">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-300 to-gray-400 text-center mb-2">
        {project.title}
      </h1>

      <p className="text-center text-slate-400 text-sm mb-8">{project.date}</p>

      <div className="space-y-6">
        {project.gallery_urls.map((url, idx) => (
          <div
            key={idx}
            className="w-full max-w-screen-lg mx-auto py-4 flex items-center justify-center rounded-xl overflow-hidden transition-all duration-700"
          >
            <img
              ref={(el) => {
                imageRefs.current[idx] = el
              }}
              data-idx={idx}
              src={url}
              alt={`Image ${idx + 1}`}
              className={`max-w-full max-h-[80vh] object-contain transition-all duration-700 transform-gpu ${
                visibleSet.has(idx) ? 'opacity-100 shadow-white/10' : 'opacity-60'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
