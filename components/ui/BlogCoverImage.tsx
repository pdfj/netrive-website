"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  fallbackClass: string; // gradient CSS classes for the fallback bg
}

export function BlogCoverImage({ src, alt, fallbackClass }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${fallbackClass}`}>
      {!failed && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
