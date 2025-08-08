'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Project } from '@/types/project'
import ProjectGrid from '@/components/ProjectGrid'

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from('projects')
        .select('id, title, thumbnail_url, slug')

      if (data) setProjects(data)
    }

    fetchProjects()
  }, [])

  return (
    <div className="relative flex flex-col min-h-screen bg-black text-white">
      {/* 별 배경 효과 유지 */}
      <div className="starfield absolute inset-0 z-0 pointer-events-none" />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 px-6 py-20 max-w-7xl mx-auto relative z-10">
        <section className="text-center py-24 bg-black text-white">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Game UI &amp; UX Portfolio
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-400">
            Yoon Ja Young <span className="mx-2">|</span> Player-centric Interface Design
          </p>
        </section>

        <ProjectGrid projects={projects} />
      </main>
    </div>
  )
}
