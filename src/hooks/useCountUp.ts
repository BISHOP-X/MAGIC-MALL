import { useState, useEffect, useRef } from 'react'

interface UseCountUpOptions {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
}

export function useCountUp({ end, duration = 2000, suffix = '', prefix = '' }: UseCountUpOptions) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Ease-out cubic for a nice deceleration effect
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = eased * end
      // Preserve decimal places from the target value
      const decimals = (end % 1 !== 0) ? (end.toString().split('.')[1]?.length || 1) : 0
      setCount(decimals > 0 ? parseFloat(value.toFixed(decimals)) : Math.floor(value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [hasStarted, end, duration])

  const display = `${prefix}${count.toLocaleString()}${suffix}`

  return { ref, display }
}
