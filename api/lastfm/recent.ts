import { fetchLatestLastFmTrack } from '../../server/lastfm.ts';

interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  setHeader: (name: string, value: string) => void;
  json: (payload: unknown) => void;
}

interface ServerlessRequest {
  method?: string;
}

export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse,
) {
  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const result = await fetchLatestLastFmTrack();
  res.setHeader(
    'Cache-Control',
    result.status === 200 && result.body.configured
      ? 'public, s-maxage=25, stale-while-revalidate=60'
      : 'no-store',
  );
  res.status(result.status).json(result.body);
}
