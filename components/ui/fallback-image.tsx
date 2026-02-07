"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc: string
}

export function FallbackImage({ src, fallbackSrc, className, alt, ...props }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
    />
  )
}
