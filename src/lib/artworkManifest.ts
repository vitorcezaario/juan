import { useEffect, useState } from 'react';

export interface ArtworkManifestEntry {
  width: number;
  height: number;
  webp?: string;
}

export type ArtworkManifest = Record<string, ArtworkManifestEntry>;

let manifestCache: ArtworkManifest | null = null;
let manifestPromise: Promise<ArtworkManifest> | null = null;
let webpSupportedCache: boolean | null = null;
const preloadedUrls = new Set<string>();

function detectWebpSupport(): boolean {
  if (webpSupportedCache !== null) return webpSupportedCache;
  if (typeof document === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      webpSupportedCache =
        canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      return webpSupportedCache;
    }
  } catch {
    // fallback seguro
  }
  webpSupportedCache = false;
  return false;
}

export function loadArtworkManifest(): Promise<ArtworkManifest> {
  if (manifestCache) {
    return Promise.resolve(manifestCache);
  }
  if (!manifestPromise) {
    manifestPromise = fetch('/artwork-manifest.json', {
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (!response.ok) return {};
        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) return {};
        return response.json() as Promise<ArtworkManifest>;
      })
      .then((data) => {
        manifestCache = data ?? {};
        return manifestCache;
      })
      .catch(() => {
        manifestCache = {};
        return manifestCache;
      });
  }
  return manifestPromise;
}

export function useArtworkManifestEntry(
  src?: string,
): ArtworkManifestEntry | undefined {
  const [manifest, setManifest] = useState<ArtworkManifest | null>(
    manifestCache,
  );

  useEffect(() => {
    if (!src || manifestCache) return;
    let active = true;
    void loadArtworkManifest().then((loaded) => {
      if (active) setManifest(loaded);
    });
    return () => {
      active = false;
    };
  }, [src]);

  if (!src) return undefined;
  return (manifest ?? manifestCache)?.[src];
}

function preloadSingleImage(url: string) {
  if (!url || preloadedUrls.has(url)) return;
  preloadedUrls.add(url);

  const img = new Image();
  img.referrerPolicy = 'no-referrer';
  img.decoding = 'async';
  img.src = url;
  if (typeof img.decode === 'function') {
    void img.decode().catch(() => {
      // ignora erro de decode em preload especulativo
    });
  }
}

/**
 * Pré-carrega e pré-decodifica silenciosamente as imagens vizinhas da galeria
 * durante tempo ocioso do navegador, escolhendo a variante WebP lossless quando disponível.
 */
export function usePreloadGalleryImages(sources: Array<string | undefined>) {
  const key = sources.filter(Boolean).join('|');

  useEffect(() => {
    const validSources = sources.filter((src): src is string => Boolean(src));
    if (validSources.length === 0) return;

    let cancelled = false;

    const runPreload = async () => {
      const manifest = await loadArtworkManifest();
      if (cancelled) return;
      const useWebp = detectWebpSupport();

      for (const src of validSources) {
        const entry = manifest[src];
        const optimalSrc = useWebp && entry?.webp ? entry.webp : src;
        preloadSingleImage(optimalSrc);
      }
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        options?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof idleWindow.requestIdleCallback === 'function') {
      const idleId = idleWindow.requestIdleCallback(
        () => {
          void runPreload();
        },
        { timeout: 600 },
      );
      return () => {
        cancelled = true;
        idleWindow.cancelIdleCallback?.(idleId);
      };
    }

    const timerId = window.setTimeout(() => {
      void runPreload();
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
