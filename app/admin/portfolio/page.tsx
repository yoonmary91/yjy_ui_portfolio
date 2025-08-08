'use client'

import { useState } from 'react'
import UserInfo from '@/components/common/UserInfo'
import ProjectCard from '@/components/cards/ProjectCard'
import PortfolioForm from '@/components/forms/PortfolioForm'
import Modal from '@/components/ui/Modal'
import { usePortfolio } from '@/features/portfolio/hooks'
import { useAdminGuard } from '@/features/auth/hooks'
import { Project } from '@/features/portfolio/service'

export default function PortfolioPage() {
  const { authorized, loading } = useAdminGuard()
  const {
    projects,
    loading: projectLoading,
    create,
    update,
    removeMany,
    editTarget,
    setEditTarget,
    selectedIds,
    toggleSelect,
    clearSelection,
  } = usePortfolio()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // ✏️ 수정 시작
  const handleEdit = (project: Project) => {
    setEditTarget(project)
  }

  // ✏️ 수정 취소
  const handleEditCancel = () => {
    setEditTarget(null)
  }

  // ✏️ 수정 완료
  const handleEditSubmit = async (
    slug: string,
    title: string,
    date: string,
    files: File[]
  ) => {
    if (!editTarget) return
    await update(editTarget.id, slug, title, date, files)
    setEditTarget(null)
  }

  // ➕ 추가 완료
  const handleAddSubmit = async (
    slug: string,
    title: string,
    date: string,
    files: File[]
  ) => {
    await create(slug, title, date, files)
    setIsAddModalOpen(false)
  }

  // 🗑️ 선택 삭제
  const handleDelete = () => {
    console.log('🧨 삭제 요청됨:', selectedIds)
    if (selectedIds.length === 0) return
    if (confirm('선택한 포트폴리오를 삭제하시겠습니까?')) {
      removeMany()
    }
  }

  if (loading) return <p className="text-blue-300">🔐 관리자 인증 확인 중...</p>
  if (!authorized) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0d1b2a] to-black text-white px-6 py-8 space-y-6">
      
      {/* 상단 유저 정보 */}
      <div className="flex justify-end border-b border-blue-900 pb-4">
        <UserInfo />
      </div>

      {/* 프로젝트 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            selected={selectedIds.includes(project.id)}
            onSelect={() => toggleSelect(project.id)}
            onEdit={() => handleEdit(project)}
          />
        ))}
        {projects.length === 0 && (
          <p className="text-gray-400 col-span-full text-center mt-10">
            🌌 등록된 프로젝트가 없습니다.
          </p>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-4 justify-center pt-6 border-t border-blue-900">
        <button
          className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded shadow hover:brightness-110 transition"
          onClick={() => setIsAddModalOpen(true)}
        >
          ➕ 프로젝트 추가
        </button>
        <button
          className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded shadow hover:brightness-110 transition"
          onClick={handleDelete}
          disabled={selectedIds.length === 0}
        >
          🗑️ 선택 삭제
        </button>
      </div>

      {/* ➕ 추가 모달 */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <PortfolioForm
          onSubmit={handleAddSubmit}
          loading={projectLoading}
          editTarget={null}
          onCancelEdit={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* ✏️ 수정 모달 */}
      {editTarget && (
        <Modal isOpen={!!editTarget} onClose={handleEditCancel}>
          <PortfolioForm
            onSubmit={handleEditSubmit}
            loading={projectLoading}
            editTarget={editTarget}
            onCancelEdit={handleEditCancel}
          />
        </Modal>
      )}
    </div>
  )
}
