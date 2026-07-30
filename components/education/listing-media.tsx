"use client"

import Image from "next/image"
import { useState } from "react"

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

export function ListingMedia({
  src,
  alt,
  name,
  region,
  sizes,
}: {
  src?: string
  alt: string
  name: string
  region: string
  sizes: string
}) {
  const [failed, setFailed] = useState(!src)

  return (
    <span className="listing-media">
      <span className="listing-media-fallback" aria-hidden="true">
        <span className="fallback-region">{region}</span>
        <strong>{getInitials(name)}</strong>
        <span className="fallback-name">{name}</span>
      </span>
      {!failed && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="sr-only">{alt}</span>
      )}
    </span>
  )
}
