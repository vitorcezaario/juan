import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchLatestLastFmTrack } from './server/lastfm.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

async function startServer() {
  const app = express();
  app.disable('x-powered-by');

  // Proxy seguro no servidor para consultar a última música ouvida no Last.fm
  app.get('/api/lastfm/recent', async (_req, res) => {
    const result = await fetchLatestLastFmTrack();
    res.setHeader(
      'Cache-Control',
      result.status === 200 && result.body.configured
        ? 'public, max-age=25, stale-while-revalidate=60'
        : 'no-store',
    );
    res.status(result.status).json(result.body);
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    const indexHtmlPath = path.join(distDir, 'index.html');

    app.use(
      '/assets',
      express.static(path.join(distDir, 'assets'), {
        maxAge: '1y',
        immutable: true,
      }),
    );
    app.use(
      '/src/assets',
      express.static(path.join(distDir, 'src', 'assets'), {
        maxAge: '1y',
        immutable: true,
      }),
    );
    app.use(
      express.static(distDir, {
        setHeaders(res, filePath) {
          if (filePath.endsWith('artwork-manifest.json')) {
            res.setHeader(
              'Cache-Control',
              'public, max-age=60, stale-while-revalidate=3600',
            );
          } else if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          }
        },
      }),
    );
    app.get('*', (_req, res) => {
      if (fs.existsSync(indexHtmlPath)) {
        res.setHeader('Cache-Control', 'no-cache');
        res.sendFile(indexHtmlPath);
      } else {
        res.status(404).send('Not found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error instanceof Error ? error.message : 'Unknown error');
  process.exit(1);
});
