export interface LastFmTrackPayload {
  title: string;
  artist: string;
  album: string | null;
  coverUrl: string | null;
  trackUrl: string | null;
  isNowPlaying: boolean;
  playedAtUnix: number | null;
}

export interface LastFmApiResponse {
  configured: boolean;
  missing?: Array<'LASTFM_API_KEY' | 'LASTFM_USERNAME'>;
  track: LastFmTrackPayload | null;
  error?: string;
  errorCode?: number;
}

interface RawLastFmImage {
  '#text'?: unknown;
  size?: unknown;
}

interface RawLastFmTrack {
  name?: unknown;
  artist?: { '#text'?: unknown } | unknown;
  album?: { '#text'?: unknown } | unknown;
  url?: unknown;
  image?: RawLastFmImage[] | unknown;
  '@attr'?: { nowplaying?: unknown } | unknown;
  date?: { uts?: unknown } | unknown;
}

interface RawLastFmResponse {
  error?: unknown;
  message?: unknown;
  recenttracks?: {
    track?: RawLastFmTrack | RawLastFmTrack[];
  };
}

const LASTFM_ENDPOINT = 'https://ws.audioscrobbler.com/2.0/';
const LASTFM_DEFAULT_PLACEHOLDER_HASH = '2a96cbd8b46e442fc41c2b86b821562f';
const CACHE_TTL_MS = 25_000;
const FETCH_TIMEOUT_MS = 6_000;

let cachedResult: { key: string; expiresAt: number; data: LastFmApiResponse } | null =
  null;

function readEnvValue(names: string[]): string {
  for (const name of names) {
    const raw = process.env[name]?.trim();
    if (raw) {
      return raw.replace(/^['"]+|['"]+$/g, '').trim();
    }
  }
  return '';
}

function normalizeLastFmUsername(raw: string): string {
  const cleaned = raw.trim().replace(/^@/, '');
  const profileMatch = cleaned.match(
    /^https?:\/\/(?:www\.)?last\.fm\/(?:[a-z]{2}\/)?user\/([a-zA-Z0-9._-]{1,64})\/?$/i,
  );
  return profileMatch ? profileMatch[1] : cleaned;
}

function mapLastFmErrorMessage(errorCode: number | undefined): string {
  switch (errorCode) {
    case 6:
      return 'Usuário não encontrado no Last.fm.';
    case 10:
      return 'Chave da API do Last.fm inválida.';
    case 17:
      return 'O histórico recente está privado no perfil do Last.fm.';
    case 29:
      return 'Limite temporário do Last.fm atingido.';
    default:
      return 'Não foi possível consultar o Last.fm agora.';
  }
}

function sanitizeHttpUrl(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function extractCoverUrl(images: unknown): string | null {
  if (!Array.isArray(images)) return null;

  const preferredOrder = ['extralarge', 'large', 'medium', 'small'];
  const bySize = new Map<string, string>();

  for (const item of images) {
    if (!item || typeof item !== 'object') continue;
    const record = item as RawLastFmImage;
    const size = typeof record.size === 'string' ? record.size : '';
    const safeUrl = sanitizeHttpUrl(record['#text']);
    if (!safeUrl || safeUrl.includes(LASTFM_DEFAULT_PLACEHOLDER_HASH)) {
      continue;
    }
    if (size) {
      bySize.set(size, safeUrl);
    }
  }

  for (const size of preferredOrder) {
    const found = bySize.get(size);
    if (found) return found;
  }

  for (const url of bySize.values()) {
    return url;
  }

  return null;
}

function extractTextField(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object' && '#text' in value) {
    const text = (value as { '#text'?: unknown })['#text'];
    if (typeof text === 'string') return text.trim();
  }
  return '';
}

export async function fetchLatestLastFmTrack(): Promise<{
  status: number;
  body: LastFmApiResponse;
}> {
  const apiKey = readEnvValue([
    'LASTFM_API_KEY',
    'LAST_FM_API_KEY',
    'LAST_FM_API',
    'LASTFM_API',
    'LASTFM_KEY',
  ]);
  const rawUsername = readEnvValue([
    'LASTFM_USERNAME',
    'LAST_FM_USERNAME',
    'LASTFM_USER',
  ]);
  const username = normalizeLastFmUsername(rawUsername);

  const missing: Array<'LASTFM_API_KEY' | 'LASTFM_USERNAME'> = [];
  if (!apiKey) missing.push('LASTFM_API_KEY');
  if (!username) missing.push('LASTFM_USERNAME');

  if (missing.length > 0) {
    return {
      status: 200,
      body: {
        configured: false,
        missing,
        track: null,
      },
    };
  }

  // Validação simples de formato do username (evita caracteres de controle ou espaços inválidos)
  if (!/^[a-zA-Z0-9._-]{1,64}$/.test(username)) {
    return {
      status: 200,
      body: {
        configured: false,
        missing: ['LASTFM_USERNAME'],
        track: null,
      },
    };
  }

  const cacheKey = username.toLowerCase();
  const now = Date.now();
  if (cachedResult && cachedResult.key === cacheKey && cachedResult.expiresAt > now) {
    return { status: 200, body: cachedResult.data };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const params = new URLSearchParams({
      method: 'user.getrecenttracks',
      user: username,
      api_key: apiKey,
      format: 'json',
      limit: '1',
    });

    const response = await fetch(`${LASTFM_ENDPOINT}?${params.toString()}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'fr0ggyArt/1.0',
      },
      signal: controller.signal,
    });

    let payload: RawLastFmResponse | null = null;
    try {
      payload = (await response.json()) as RawLastFmResponse;
    } catch {
      payload = null;
    }

    const parsedErrorCode =
      payload && typeof payload.error === 'number'
        ? payload.error
        : undefined;

    if (!response.ok || parsedErrorCode !== undefined) {
      return {
        status: 502,
        body: {
          configured: true,
          track: null,
          error: mapLastFmErrorMessage(parsedErrorCode),
          errorCode: parsedErrorCode,
        },
      };
    }

    if (!payload) {
      return {
        status: 502,
        body: {
          configured: true,
          track: null,
          error: 'Não foi possível consultar o Last.fm agora.',
        },
      };
    }

    const rawTracks = payload.recenttracks?.track;
    const trackList = Array.isArray(rawTracks)
      ? rawTracks
      : rawTracks
        ? [rawTracks]
        : [];
    const latest = trackList[0];

    if (!latest) {
      const emptyResult: LastFmApiResponse = {
        configured: true,
        track: null,
      };
      cachedResult = {
        key: cacheKey,
        expiresAt: now + CACHE_TTL_MS,
        data: emptyResult,
      };
      return { status: 200, body: emptyResult };
    }

    const title = extractTextField(latest.name);
    const artist = extractTextField(latest.artist);
    const album = extractTextField(latest.album) || null;
    const trackUrl = sanitizeHttpUrl(latest.url);
    const coverUrl = extractCoverUrl(latest.image);

    const attr = latest['@attr'];
    const isNowPlaying = Boolean(
      attr &&
        typeof attr === 'object' &&
        'nowplaying' in attr &&
        (attr as { nowplaying?: unknown }).nowplaying === 'true',
    );

    const dateObj = latest.date;
    let playedAtUnix: number | null = null;
    if (dateObj && typeof dateObj === 'object' && 'uts' in dateObj) {
      const parsedUnix = Number((dateObj as { uts?: unknown }).uts);
      if (Number.isFinite(parsedUnix) && parsedUnix > 0) {
        playedAtUnix = parsedUnix;
      }
    }

    const data: LastFmApiResponse = {
      configured: true,
      track:
        title && artist
          ? {
              title,
              artist,
              album,
              coverUrl,
              trackUrl,
              isNowPlaying,
              playedAtUnix,
            }
          : null,
    };

    cachedResult = {
      key: cacheKey,
      expiresAt: now + CACHE_TTL_MS,
      data,
    };

    return { status: 200, body: data };
  } catch {
    return {
      status: 502,
      body: {
        configured: true,
        track: null,
        error: 'Não foi possível conectar ao Last.fm no momento.',
      },
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
