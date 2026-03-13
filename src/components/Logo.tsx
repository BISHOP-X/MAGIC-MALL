export default function Logo({
  className = '',
  size = 'default',
  variant: _variant = 'full',
}: {
  className?: string
  size?: 'sm' | 'default' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
}) {
  const heights: Record<string, string> = {
    sm: 'h-7',
    default: 'h-8',
    lg: 'h-10',
    xl: 'h-12',
  }

  return (
    <img
      src="/MAGICMALL-LOGO.png"
      alt="Magic Mall"
      className={`${heights[size]} w-auto object-contain select-none ${className}`}
      draggable={false}
    />
  )
}
