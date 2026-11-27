import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

interface ArtworkManifestEntry {
  width: number;
  height: number;
  webp?: string;
}

type ArtworkManifest = Record<string, ArtworkManifestEntry>;

const SUPPORTED_IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg']);

function collectImageFiles(rootDir: string, acc: string[] = []): string[] {
  if (!fs.existsSync(rootDir)) return acc;

  for (const entry of fs.readdirSync(rootDir, {withFileTypes: true})) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      collectImageFiles(fullPath, acc);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_IMAGE_EXTS.has(ext)) {
        acc.push(fullPath);
      }
    }
  }

  return acc;
}

function toPublicUrl(distDir: string, filePath: string): string {
  const relative = path.relative(distDir, filePath).split(path.sep).join('/');
  return `/${relative}`;
}

/** Leitura leve de dimensões PNG/JPEG sem dependências externas (fallback seguro caso sharp não esteja disponível) */
function readImageDimensionsFallback(
  buffer: Buffer,
  ext: string,
): {width: number; height: number} {
  if (ext === '.png' && buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }
  if ((ext === '.jpg' || ext === '.jpeg') && buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      offset += 2;
      if (
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf)
      ) {
        return {
          height: buffer.readUInt16BE(offset + 3),
          width: buffer.readUInt16BE(offset + 5),
        };
      }
      const segmentLength = buffer.readUInt16BE(offset);
      if (segmentLength < 2) break;
      offset += segmentLength;
    }
  }
  return {width: 0, height: 0};
}

/**
 * Plugin Vite autocontido de otimização sem perda de qualidade das artes originais:
 * - PNG: recompressão 100% lossless (compressionLevel 9, adaptiveFiltering, sem redução de paleta) preservando perfil ICC
 * - JPEG: progressivo com subsampling 4:4:4 (qualidade 96, mozjpeg) preservando nitidez de traços e perfil ICC
 * - WebP lossless: gera cópia .webp matematicamente sem perda quando ficar menor que o arquivo original
 * - Manifesto (/artwork-manifest.json): registra dimensões intrínsecas (width/height) e variantes WebP lossless
 */
function losslessArtworkPlugin(): Plugin {
  let rootDir = process.cwd();
  let outDir = 'dist';

  return {
    name: 'lossless-artwork-optimizer',
    apply: 'build',
    configResolved(config) {
      rootDir = config.root;
      outDir = config.build.outDir;
    },
    async closeBundle(error?: Error) {
      if (error) return;

      const distDir = path.resolve(rootDir, outDir);
      if (!fs.existsSync(distDir)) return;

      const scanRoots = [
        path.join(distDir, 'assets'),
        path.join(distDir, 'src', 'assets'),
      ];

      const imageFiles = Array.from(
        new Set(scanRoots.flatMap((dir) => collectImageFiles(dir))),
      );

      if (imageFiles.length === 0) return;

      type SharpFactory = (typeof import('sharp'))['default'];
      let sharpFn: SharpFactory | null = null;
      try {
        const imported = await import('sharp');
        sharpFn = imported.default;
      } catch {
        sharpFn = null;
      }

      const manifest: ArtworkManifest = {};
      let totalSavedBytes = 0;
      let webpCount = 0;

      for (const filePath of imageFiles) {
        try {
          const ext = path.extname(filePath).toLowerCase();
          const inputBuffer = fs.readFileSync(filePath);
          const originalSize = inputBuffer.length;
          const publicUrl = toPublicUrl(distDir, filePath);

          if (!sharpFn) {
            const dims = readImageDimensionsFallback(inputBuffer, ext);
            if (dims.width > 0 && dims.height > 0) {
              manifest[publicUrl] = dims;
            }
            continue;
          }

          const metadata = await sharpFn(inputBuffer).metadata();
          const width = metadata.width ?? 0;
          const height = metadata.height ?? 0;

          let bestOriginalSize = originalSize;

          if (ext === '.png') {
            const optimizedPng = await sharpFn(inputBuffer)
              .keepIccProfile()
              .png({
                compressionLevel: 9,
                adaptiveFiltering: true,
                palette: false,
                effort: 10,
              })
              .toBuffer();

            if (optimizedPng.length < originalSize) {
              fs.writeFileSync(filePath, optimizedPng);
              totalSavedBytes += originalSize - optimizedPng.length;
              bestOriginalSize = optimizedPng.length;
            }
          } else if (ext === '.jpg' || ext === '.jpeg') {
            const optimizedJpg = await sharpFn(inputBuffer)
              .keepIccProfile()
              .jpeg({
                quality: 96,
                chromaSubsampling: '4:4:4',
                mozjpeg: true,
                progressive: true,
              })
              .toBuffer();

            if (optimizedJpg.length < originalSize) {
              fs.writeFileSync(filePath, optimizedJpg);
              totalSavedBytes += originalSize - optimizedJpg.length;
              bestOriginalSize = optimizedJpg.length;
            }
          }

          const entry: ArtworkManifestEntry = {width, height};

          const losslessWebp = await sharpFn(inputBuffer)
            .keepIccProfile()
            .webp({
              lossless: true,
              effort: 6,
            })
            .toBuffer();

          if (losslessWebp.length < bestOriginalSize) {
            const webpPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp');
            fs.writeFileSync(webpPath, losslessWebp);
            entry.webp = toPublicUrl(distDir, webpPath);
            webpCount += 1;
          }

          if (width > 0 && height > 0) {
            manifest[publicUrl] = entry;
          }
        } catch (fileError) {
          console.warn(
            `[lossless-artwork-optimizer] Ignorando ${path.basename(filePath)}:`,
            fileError instanceof Error ? fileError.message : 'Erro desconhecido',
          );
        }
      }

      const manifestPath = path.join(distDir, 'artwork-manifest.json');
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

      const savedKb = Math.round(totalSavedBytes / 1024);
      console.log(
        `[lossless-artwork-optimizer] ${imageFiles.length} imagens verificadas | ${savedKb} KB economizados sem perda | ${webpCount} variantes WebP lossless geradas`,
      );
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
      // Otimiza todas as artes originais sem perda de qualidade e gera WebP lossless + manifesto de dimensões
      losslessArtworkPlugin(),
    ],
    build: {
      // Evita embutir imagens originais em base64 no bundle JS, mantendo arquivos originais cacheáveis
      assetsInlineLimit: 0,
      cssCodeSplit: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
