'use client'

import { useState, useEffect, useRef } from 'react'
import { Project } from '@/features/portfolio/service'

interface Props {
  onSubmit: (
    slug: string,
    title: string,
    date: string,
    files: File[],
    remainingUrls?: string[],
    removedUrls?: string[]
  ) => void
  loading: boolean
  editTarget?: Project | null
  onCancelEdit?: () => void
}

export default function PortfolioForm({
  onSubmit,
  loading,
  editTarget,
  onCancelEdit,
}: Props) {
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [existingUrls, setExistingUrls] = useState<string[]>([])
  const [removedUrls, setRemovedUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editTarget) {
      setSlug(editTarget.slug || '')
      setTitle(editTarget.title)
      setDate(editTarget.date || '')
      setExistingUrls(editTarget.gallery_urls || [])
      setRemovedUrls([])
    } else {
      setSlug('')
      setTitle('')
      setDate('')
      setFiles([])
      setPreviews([])
      setExistingUrls([])
      setRemovedUrls([])
    }
  }, [editTarget])

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file))
    setPreviews(urls)
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [files])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (selected) {
      const newFiles = Array.from(selected)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveExisting = (url: string) => {
    setRemovedUrls((prev) => [...prev, url])
  }

  const handleUndoRemove = (url: string) => {
    setRemovedUrls((prev) => prev.filter((u) => u !== url))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const remainingUrls = existingUrls.filter((url) => !removedUrls.includes(url))
    onSubmit(slug, title, date, files, remainingUrls, removedUrls)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">
        {editTarget ? '✏️ 프로젝트 수정' : '➕ 새 프로젝트 등록'}
      </h2>

      <input
        type="text"
        placeholder="slug (예: my-project)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="w-full p-3 bg-[#0a192f] border border-blue-500 rounded-md text-white"
        required
      />

      <input
        type="text"
        placeholder="프로젝트명"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 bg-[#0a192f] border border-blue-500 rounded-md text-white"
        required
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-3 bg-[#0a192f] border border-blue-500 rounded-md text-white"
        required
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
      >
        📂 파일 추가하기
      </button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {existingUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {existingUrls.map((url, idx) => {
            const isRemoved = removedUrls.includes(url)
            return (
              <div key={idx} className="relative group">
                <img
                  src={url}
                  alt={`기존-${idx}`}
                  className={`h-24 w-full object-cover rounded border ${isRemoved ? 'opacity-40 grayscale' : 'border-gray-600'}`}
                />
                {isRemoved ? (
                  <button
                    type="button"
                    onClick={() => handleUndoRemove(url)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center hover:bg-green-600"
                    title="되돌리기"
                  >
                    ↩
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRemoveExisting(url)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center hover:bg-red-600"
                    title="제거"
                  >
                    ×
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {previews.map((url, idx) => (
            <div key={idx} className="relative group">
              <img
                src={url}
                alt={`미리보기-${idx}`}
                className="h-24 w-full object-cover rounded border border-gray-600"
              />
              <button
                type="button"
                onClick={() => handleRemoveFile(idx)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          {loading ? '처리 중...' : editTarget ? '수정 완료' : '등록하기'}
        </button>
        {onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2 border border-gray-500 text-white rounded"
          >
            취소
          </button>
        )}
      </div>
    </form>
  )
}
