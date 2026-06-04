"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  hue: number;
}

function Fallback({ hue }: { hue: number }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(ellipse 100% 80% at 70% 10%, hsla(${hue},100%,70%,0.35), transparent 60%), linear-gradient(160deg, #0a1628 0%, #050a1a 60%, #000 100%)`,
      }}
      aria-hidden
    >
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 320 200" fill="none">
        <g stroke="rgba(147,180,255,0.5)" strokeWidth="1">
          <path d="M210 50 L255 80 L235 130 L185 120 L195 70 Z" />
          <path d="M210 50 L185 120" />
          <path d="M255 80 L195 70" />
        </g>
        {[[210,50],[255,80],[235,130],[185,120],[195,70]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="3" fill="#93b4ff" />
        ))}
      </svg>
    </div>
  );
}

export function PortfolioImage({ src, alt, hue }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-night">
      <Fallback hue={hue} />
      {!failed && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
