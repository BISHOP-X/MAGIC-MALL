import { HeadphonesIcon, MessageCircle } from 'lucide-react'

export default function CustomerCare() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Customer Care</h1>
        <p className="text-white/80 mt-1">We're here to help</p>
      </div>
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <HeadphonesIcon className="w-6 h-6 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Contact Support</h2>
        </div>
        <div className="space-y-4">
          <a
            href="https://t.me/magic_malll"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">Telegram Support</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@magic_malll</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
