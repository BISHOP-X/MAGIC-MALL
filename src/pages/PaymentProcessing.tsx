import { Loader2 } from 'lucide-react'

export default function PaymentProcessing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Processing Payment</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait while we verify your payment...</p>
    </div>
  )
}
