import { Construction } from 'lucide-react'

export default function AdminOrders() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-white/80 mt-1">Manage customer orders</p>
      </div>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Construction className="w-12 h-12 text-orange-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Coming Soon</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Order management is being set up.</p>
      </div>
    </div>
  )
}
