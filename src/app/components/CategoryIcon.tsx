export default function CategoryIcon({ category }: { category: string }) {
  const cat = (category ?? '').toLowerCase()

  if (cat.includes('instagram')) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center text-white text-sm">📷</div>
  if (cat.includes('tiktok')) return <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm">🎵</div>
  if (cat.includes('youtube')) return <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm">▶️</div>
  if (cat.includes('whatsapp')) return <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">💬</div>
  if (cat.includes('facebook')) return <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">f</div>
  if (cat.includes('telegram')) return <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-sm">✈️</div>
  if (cat.includes('twitter') || cat.includes('x /')) return <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm">𝕏</div>
  if (cat.includes('spotify')) return <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm">🎵</div>
  if (cat.includes('tool')) return <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm">🛠️</div>
  return <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white text-sm">📦</div>
}