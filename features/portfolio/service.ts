import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

export interface Project {
  id: string
  slug: string
  title: string
  date: string
  thumbnail_url: string
  gallery_urls: string[]
  created_at: string
}

const getStorageKey = (url: string): string => {
  const prefix = '/storage/v1/object/public/gallery/'
  const idx = url.indexOf(prefix)
  return idx >= 0 ? url.slice(idx + prefix.length) : ''
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message || '프로젝트 목록 조회 실패')
  return data
}

export async function addProject(
  slug: string,
  title: string,
  date: string,
  files: File[]
) {
  let thumbnailUrl = ''
  const galleryUrls: string[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filename = `projects/${slug}-${Date.now()}-${uuidv4()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filename, file)

    if (uploadError) throw new Error(uploadError.message || '파일 업로드 실패')

    const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(filename)

    galleryUrls.push(urlData.publicUrl)
    if (i === 0) thumbnailUrl = urlData.publicUrl
  }

  const { error } = await supabase.from('projects').insert({
    slug,
    title,
    date,
    thumbnail_url: thumbnailUrl,
    gallery_urls: galleryUrls,
  })

  if (error) throw new Error(error.message || '프로젝트 등록 실패')
}

export async function updateProject(
  id: string,
  slug: string,
  title: string,
  date: string,
  files: File[] = [],
  remainingUrls: string[] = [],
  removedUrls: string[] = []
) {
  const galleryUrls: string[] = [...remainingUrls]
  let thumbnailUrl = galleryUrls[0] || ''

  // 1️⃣ 삭제 대상 먼저 제거
  if (removedUrls.length > 0) {
    const fileNames = removedUrls.map(getStorageKey).filter(Boolean)

    const { data, error: storageError } = await supabase.storage
      .from('gallery')
      .remove(fileNames)

    console.log('🧾 삭제 대상:', fileNames)
    if (storageError || (data && data.length === 0)) {
      console.error('❌ 삭제 실패 또는 파일 없음')
      throw new Error('Storage 삭제 실패로 인해 수정 중단됨')
    }
  }

  // 2️⃣ 새 파일 업로드
  for (const file of files) {
    const filename = `projects/${slug}-${Date.now()}-${uuidv4()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filename, file)

    if (uploadError) throw new Error(uploadError.message || '파일 업로드 실패')

    const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(filename)

    galleryUrls.push(urlData.publicUrl)
    if (!thumbnailUrl) thumbnailUrl = urlData.publicUrl
  }

  // 3️⃣ DB 업데이트
  const updateFields: any = {
    slug,
    title,
    date,
    gallery_urls: galleryUrls,
  }
  if (thumbnailUrl) updateFields.thumbnail_url = thumbnailUrl

  const { error } = await supabase
    .from('projects')
    .update(updateFields)
    .eq('id', id)

  if (error) throw new Error(error.message || '프로젝트 수정 실패')
}

export async function deleteProject(id: string, galleryUrls: string[]) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message || '프로젝트 삭제 실패')

  const fileNames = galleryUrls.map(getStorageKey).filter(Boolean)

  const { error: storageError } = await supabase.storage
    .from('gallery')
    .remove(fileNames)

  if (storageError) throw new Error(storageError.message || '스토리지 삭제 실패')
}
