"use client";

import Image from "next/image";
import {
  isDirectImageUrl,
  isImgBbShareUrl,
  resolveImageUrl,
} from "@/lib/image-url";

export function CoverImage({
  src,
  alt,
  className,
  priority,
  sizes,
  fill,
  aspectClassName = "relative aspect-video overflow-hidden rounded-xl border border-border",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  aspectClassName?: string;
}) {
  const resolved = resolveImageUrl(src) ?? src;
  const useNextImage =
    isDirectImageUrl(resolved) && !isImgBbShareUrl(resolved);

  if (!useNextImage) {
    return (
      <div className={aspectClassName}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolved}
          alt={alt}
          className={className ?? "h-full w-full object-cover"}
        />
      </div>
    );
  }

  if (fill) {
    return (
      <div className={aspectClassName}>
        <Image
          src={resolved}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes ?? "(max-width: 768px) 100vw, 768px"}
          className={className ?? "object-cover"}
        />
      </div>
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      width={1200}
      height={675}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
