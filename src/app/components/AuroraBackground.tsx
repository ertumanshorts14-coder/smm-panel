'use client'

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-glow-pulse"></div>
      <div
        className="absolute top-20 -right-40 w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-glow-pulse"
        style={{ animationDelay: '1s' }}
      ></div>
      <div
        className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-pink-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-glow-pulse"
        style={{ animationDelay: '2s' }}
      ></div>
    </div>
  )
}