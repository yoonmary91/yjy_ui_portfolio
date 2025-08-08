'use client'

export default function ContactPage() {
  const email = 'gtgyoon301@gmail.com'

  const handleCopy = () => {
    navigator.clipboard.writeText(email)
    alert('이메일 주소가 복사되었습니다!')
  }

  return (
    <div className="relative z-10 max-w-xl mx-auto px-4 py-32 text-white text-center bg-black">
      <h1 className="text-4xl font-bold mb-6 text-white">📡 Contact</h1>

      <div className="inline-block card-glow card-hover-glow hover-ring">
        <button
          onClick={handleCopy}
          className="text-lg font-mono tracking-wide text-white px-6 py-3 transition-all duration-300"
        >
          {email}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">클릭하면 복사됩니다</p>
    </div>
  )
}
