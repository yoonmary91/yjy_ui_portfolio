'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  fetchProjects,
  addProject,
  updateProject,
  deleteProject,
  Project,
} from './service'

export function usePortfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [editTarget, setEditTarget] = useState<Project | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const load = async () => {
    const data = await fetchProjects()
    setProjects(data)
  }

  useEffect(() => {
    load()
  }, [])

  const create = async (
    slug: string,
    title: string,
    date: string,
    files: File[]
  ) => {
    setLoading(true)
    await addProject(slug, title, date, files)
    await load()
    setLoading(false)
  }

  const update = async (
    id: string,
    slug: string,
    title: string,
    date: string,
    files: File[],
    remainingUrls: string[] = [],
    removedUrls: string[] = []
  ) => {
    setLoading(true)
    await updateProject(id, slug, title, date, files, remainingUrls, removedUrls)
    await load()
    setEditTarget(null)
    setLoading(false)
  }

  const remove = async (id: string, galleryUrls: string[]) => {
    setLoading(true)
    await deleteProject(id, galleryUrls)
    await load()
    setLoading(false)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const clearSelection = () => setSelectedIds([])

  const removeMany = async () => {
    setLoading(true)

    try {
      const selectedProjects = projects.filter((p) => selectedIds.includes(p.id))

      for (const project of selectedProjects) {
        const fileNames = project.gallery_urls.map((url) => {
          const prefix = '/storage/v1/object/public/gallery/'
          const idx = url.indexOf(prefix)
          return idx >= 0 ? url.slice(idx + prefix.length) : ''
        }).filter(Boolean)

        const { error: dbError } = await supabase
          .from('projects')
          .delete()
          .eq('id', project.id)

        if (dbError) throw dbError

        const { data, error: storageError } = await supabase.storage
          .from('gallery')
          .remove(fileNames)

        if (storageError || (data && data.length === 0)) {
          console.error('❌ 삭제 실패 또는 파일 없음:', fileNames)
          throw storageError || new Error('Storage 삭제 실패')
        }

        console.log('✅ 다중 삭제 완료:', data)
      }

      await load()
      clearSelection()
      alert('삭제 완료!')
    } catch (err: any) {
      alert('삭제 중 오류 발생: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    projects,
    loading,
    create,
    update,
    remove,
    removeMany,
    selectedIds,
    toggleSelect,
    clearSelection,
    editTarget,
    setEditTarget,
  }
}
