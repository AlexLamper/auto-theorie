"use client"

import { useState, useEffect } from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface FallbackImageProps extends Omit<ImageProps, "src"> {
  src: string | any
  fallbackSrc: string
}

export function FallbackImage({ src, fallbackSrc, className, alt, ...props }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || "Afbeelding"}
      className={cn("transition-opacity duration-300", className)}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc)
        }
      }}
    />
  )
}
