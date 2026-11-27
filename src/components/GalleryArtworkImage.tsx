import { useEffect, useRef, useState } from 'react';
import { useArtworkManifestEntry } from '../lib/artworkManifest';

interface GalleryArtworkImageProps {
  src: string;
  alt: string;
  className?: string;
  pictureClassName?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Renderizador performático sem perda de qualidade para artes originais da galeria:
 * - Entrega variante WebP matematicamente lossless via <picture> quando gerada no build
 * - Injeta width/height intrínsecos do manifesto para evitar layout shift (CLS = 0)
 * - Decodificação assíncrona com transição suave e exibição imediata se já estiver em cache
 */
export function GalleryArtworkImage({
  src,
  alt,
  className = '',
  pictureClassName = 'flex h-full w-full items-center justify-center',
  priority = false,
  sizes,
}: GalleryArtworkImageProps) {
  const entry = useArtworkManifestEntry(src);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const isLoaded = loadedSrc === src;

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoadedSrc(src);
    }
  }, [src, entry?.webp]);

  return (
    <picture className={pictureClassName}>
      {entry?.webp ? (
        <source srcSet={entry.webp} type="image/webp" sizes={sizes} />
      ) : null}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={entry?.width}
        height={entry?.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        referrerPolicy="no-referrer"
        draggable={false}
        onLoad={() => setLoadedSrc(src)}
        onError={() => setLoadedSrc(src)}
        className={`${className} transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </picture>
  );
}
