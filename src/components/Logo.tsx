export default function Logo({
  className = '',
  size = 'default',
  variant: _variant = 'full',
}: {
  className?: string
  size?: 'sm' | 'default' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
}) {
  // Pixel-scanned text bounds in the 612×408 PNG: x=126,y=134 → x=484,y=250
  // Crop area with ~12% padding on each side so letters breathe
  const CROP = { x: 82, y: 118, w: 446, h: 148, srcW: 612, srcH: 408 }

  // Desired rendered height of the cropped text box (pixels)
  const targetH: Record<string, number> = {
    sm: 38,
    default: 46,
    lg: 58,
    xl: 72,
  }

  const ch = targetH[size]
  const scale = ch / CROP.h
  const cw    = Math.round(CROP.w    * scale)
  const imgW  = Math.round(CROP.srcW * scale)
  const imgH  = Math.round(CROP.srcH * scale)
  const ox    = -Math.round(CROP.x   * scale)
  const oy    = -Math.round(CROP.y   * scale)

  return (
    <div
      className={`relative overflow-hidden shrink-0 select-none ${className}`}
      style={{ width: cw, height: ch }}
    >
      <img
        src="/MAGICMALL-LOGO.png"
        alt="Magic Mall"
        className="absolute pointer-events-none"
        style={{ width: imgW, height: imgH, top: oy, left: ox }}
        draggable={false}
      />
    </div>
  )
}
