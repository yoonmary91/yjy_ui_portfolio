'use client'

import ProjectCard from './ProjectCard'
import { Project } from '@/types/project'

interface Props {
  projects: Project[]
}

export default function ProjectGrid({ projects }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          title={project.title}
          thumbnail_url={project.thumbnail_url}
          slug={project.slug}
        />
      ))}
    </div>
  )
}
