export default function Logo({
  className = '',
  size = 'default',
  variant: _variant = 'full',
}: {
  className?: string
  size?: 'sm' | 'default' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
}) {
  const textSizes = {
    sm: 'text-xl',
    default: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }

  return (
    <span className={`inline-flex items-center gap-1 font-extrabold tracking-tight ${textSizes[size]} ${className}`}>
      <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Magic</span>
      <span className="text-gray-900 dark:text-white">Mall</span>
    </span>
  )
}
