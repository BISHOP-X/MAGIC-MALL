import { BookOpen } from 'lucide-react'

export default function Rules() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Rules & Terms</h1>
        <p className="text-white/80 mt-1">Please read our store rules carefully</p>
      </div>
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Store Rules</h2>
        </div>
        <div className="space-y-4 text-gray-600 dark:text-gray-400">
          <p>Rules will be published here soon. Please check back later.</p>
        </div>
      </div>
    </div>
  )
}
