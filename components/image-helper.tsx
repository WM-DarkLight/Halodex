"use client"

import { useState, useEffect } from "react"

interface ImageWithFallbackProps {
  src: string | undefined
  fallbackSrc: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export default function ImageWithFallback({ src, fallbackSrc, alt, className, width, height }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Reset state when src changes
    setImgSrc(src || fallbackSrc)
    setError(false)
    setImgLoaded(false)
  }, [src, fallbackSrc])

  return (
    <div className="relative w-full h-full">
      {!imgLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700 animate-pulse">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      <img
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        className={className}
        width={width}
        height={height}
        onLoad={() => setImgLoaded(true)}
        onError={() => {
          console.log("Image failed to load:", src)
          if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc)
            setError(true)
          }
        }}
        style={{ display: error && imgSrc === fallbackSrc ? "block" : imgLoaded ? "block" : "none" }}
      />
    </div>
  )
}
