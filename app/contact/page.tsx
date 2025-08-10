'use client'

export default function ContactPage() {
  const name = '윤자영 / Yoon ja young'
  const phone = '010-5649-7550'
  const email = 'wkdudyoon@naver.com'

  const handleCopy = () => {
    navigator.clipboard.writeText(email)
    alert('이메일 주소가 복사되었습니다!')
  }

  return (
    <div className="relative z-10 max-w-xl mx-auto px-4 py-32 text-white text-center bg-black">
      <h1 className="text-4xl font-bold mb-6 text-white">📡 Contact</h1>

      {/* 이름 */}
      <div className="mb-4">
        <span className="text-lg tracking-wide text-white">
          {name}
        </span>
      </div>

      {/* 핸드폰번호 */}
      <div className="mb-4">
        <span className="text-lg tracking-wide text-white">
          {phone}
        </span>
      </div>

      {/* 이메일 (클릭 시 복사) */}
      <div className="inline-block card-glow card-hover-glow hover-ring">
        <button
          onClick={handleCopy}
          className="text-lg tracking-wide text-white px-6 py-3 transition-all duration-300"
        >
          {email}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">이메일을 클릭하면 복사됩니다</p>
    </div>
  )
}
