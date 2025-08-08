// ✅ ProjectCard.tsx - 갤럭시 스타일 적용

'use client'

import { Project } from '@/features/portfolio/service'

interface Props {
  project: Project
  selected?: boolean
  onSelect?: () => void
  onEdit?: () => void
}

export default function ProjectCard({ project, selected, onSelect, onEdit }: Props) {
  return (
    <div
      className={`relative group bg-gradient-to-br from-[#1b263b] to-[#0d1b2a] border-2 p-4 rounded-xl shadow-md
        transition hover:shadow-lg hover:border-indigo-500 cursor-pointer
        ${selected ? 'border-indigo-400' : 'border-blue-900'}`}
    >
      {/* 체크박스 */}
      {onSelect && (
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="absolute top-2 right-2 w-4 h-4 text-blue-400 bg-black border-gray-600 rounded"
        />
      )}

      {/* 수정 버튼 */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute top-2 left-2 text-xs px-2 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded shadow"
        >
          수정
        </button>
      )}

      {/* 썸네일 */}
      {project.thumbnail_url && (
        <img
          src={project.thumbnail_url}
          alt="썸네일"
          className="w-full h-40 object-cover rounded-md mb-3 border border-blue-900"
        />
      )}

      <h3 className="text-lg font-bold text-indigo-200 mb-1 truncate">
        {project.title}
      </h3>

      <p className="text-xs text-blue-300 mb-1">날짜: {project.date}</p>

      <p className="text-xs text-gray-500">
        등록일: {new Date(project.created_at).toLocaleDateString()}
      </p>
    </div>
  )
}
