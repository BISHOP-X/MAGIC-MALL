import { CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Payment Successful!</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Your wallet has been topped up.</p>
      <Link
        to="/dashboard"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold hover:opacity-90 transition-opacity"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
