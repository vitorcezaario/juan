import { useEffect, useState } from 'react';
import { SketchBox } from './SketchPrimitives';
import realVinylRecordImg from '../assets/images/real_vinyl_record_1795795623753.jpg';

interface LastFmTrack {
  title: string;
  artist: string;
  album: string | null;
  coverUrl: string | null;
  trackUrl: string | null;
  isNowPlaying: boolean;
  playedAtUnix: number | null;
}

interface LastFmResponse {
  configured: boolean;
  missing?: Array<'LASTFM_API_KEY' | 'LASTFM_USERNAME'>;
  track: LastFmTrack | null;
  error?: string;
}

const POLL_INTERVAL_MS = 45_000;

function isSafeHttpUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function formatRelativeTimePtBr(unixSeconds: number): string {
  const diffSeconds = Math.max(0, Math.floor(Date.now() / 1000) - unixSeconds);

  if (diffSeconds < 60) return 'agora há pouco';
  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'ontem';
  if (days < 30) return `há ${days} dias`;
  const months = Math.floor(days / 30);
  if (months === 1) return 'há 1 mês';
  return `há ${months} meses`;
}

export function LastFmNowPlaying() {
  const [data, setData] = useState<LastFmResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [coverFailed, setCoverFailed] = useState(false);

  useEffect(() => {
    let active = true;

    const loadRecentTrack = async () => {
      try {
        const response = await fetch('/api/lastfm/recent', {
          headers: { Accept: 'application/json' },
        });
        if (!active) return;

        const payload = (await response.json()) as LastFmResponse;
        if (!active) return;

        setData(payload);
        setCoverFailed(false);
      } catch {
        if (!active) return;
        setData({
          configured: true,
          track: null,
          error: 'indisponível agora',
        });
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadRecentTrack();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void loadRecentTrack();
      }
    }, POLL_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void loadRecentTrack();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const track = data?.track ?? null;
  const safeTrackUrl = isSafeHttpUrl(track?.trackUrl) ? track.trackUrl : null;
  const safeCoverUrl =
    !coverFailed && isSafeHttpUrl(track?.coverUrl) ? track.coverUrl : null;

  const relativeTime =
    track && !track.isNowPlaying && track.playedAtUnix
      ? formatRelativeTimePtBr(track.playedAtUnix)
      : null;

  const missingUsernameOnly =
    data?.configured === false &&
    data.missing?.length === 1 &&
    data.missing[0] === 'LASTFM_USERNAME';

  const cardInner = (
    <div className="flex items-center gap-3.5">
      {/* Mini capa + vinil real espiando na lateral */}
      <div className="relative mr-2 h-12 w-12 shrink-0">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 right-0 z-0 h-[84%] w-[84%] translate-x-[28%] -translate-y-1/2 overflow-hidden rounded-full bg-[#0e0d0c] shadow-[0_4px_10px_rgba(0,0,0,0.24)] ring-1 ring-white/15 ${
            track?.isNowPlaying
              ? 'animate-[spin_9s_linear_infinite] motion-reduce:animate-none'
              : ''
          }`}
        >
          <img
            src={realVinylRecordImg}
            alt=""
            referrerPolicy="no-referrer"
            draggable={false}
            className="h-full w-full scale-[1.045] object-cover select-none"
          />
        </div>

        <div className="relative z-10 h-full w-full">
          <SketchBox
            variant="a"
            className="h-full w-full"
            contentClassName="flex h-full w-full items-center justify-center overflow-hidden p-1"
          >
            {safeCoverUrl ? (
              <img
                src={safeCoverUrl}
                alt={track ? `Capa de ${track.title}` : 'Capa do álbum'}
                referrerPolicy="no-referrer"
                draggable={false}
                onError={() => setCoverFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <SketchMusicNote />
            )}
          </SketchBox>
        </div>
      </div>

      {/* Informações da música */}
      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-1.5 text-[12.5px] text-[var(--page-ink-soft)] opacity-85">
          {track?.isNowPlaying ? (
            <>
              <SketchEqualizer />
              <span>ouvindo agora</span>
            </>
          ) : (
            <span>
              última música ouvida
              {relativeTime ? ` · ${relativeTime}` : ''}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="mt-1.5 flex flex-col gap-1.5" aria-hidden="true">
            <div className="h-3.5 w-3/4 rounded-full bg-[var(--page-ink)]/12" />
            <div className="h-3 w-1/2 rounded-full bg-[var(--page-ink)]/8" />
          </div>
        ) : track ? (
          <>
            <p className="mt-0.5 truncate text-[17px] leading-snug text-[var(--page-ink)]">
              {track.title}
            </p>
            <p className="truncate text-[14px] leading-snug text-[var(--page-ink-soft)] opacity-90">
              {track.artist}
            </p>
          </>
        ) : data?.configured === false ? (
          <p className="mt-0.5 text-[14px] leading-snug text-[var(--page-ink-soft)] opacity-85">
            {missingUsernameOnly
              ? 'faltando definir o usuário do last.fm'
              : 'conectando ao last.fm'}
          </p>
        ) : (
          <p className="mt-0.5 text-[14px] leading-snug text-[var(--page-ink-soft)] opacity-80">
            nenhuma faixa recente encontrada
          </p>
        )}
      </div>

      {/* Seta sutil rabiscada quando houver link para a música */}
      {safeTrackUrl && (
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-[var(--page-ink-soft)] opacity-60 transition-transform duration-150 group-hover/lfm:translate-x-0.5 group-hover/lfm:-translate-y-0.5 group-hover/lfm:text-[var(--page-ink)] group-hover/lfm:opacity-100"
          fill="none"
        >
          <path
            d="M 5.5 14.5 L 14.2 5.8 M 8 5.5 L 14.5 5.5 L 14.5 12"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );

  return (
    <aside
      aria-label="Última música ouvida no Last.fm"
      className="mt-0.5 w-full max-w-[400px]"
    >
      <SketchBox
        variant="c"
        className="w-full"
        contentClassName="p-0"
      >
        {safeTrackUrl ? (
          <a
            href={safeTrackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/lfm block rounded-[4px] px-3.5 py-2.5 transition-colors duration-150 hover:bg-[var(--page-hover-tint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)]"
          >
            {cardInner}
          </a>
        ) : (
          <div className="px-3.5 py-2.5">{cardInner}</div>
        )}
      </SketchBox>
    </aside>
  );
}

function SketchMusicNote() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6 text-[var(--page-ink-soft)] opacity-65"
      fill="none"
    >
      <path
        d="M 10 16.5 L 10 6.8 L 18.2 5.2 L 18.2 14.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse
        cx="7.8"
        cy="17"
        rx="2.4"
        ry="1.8"
        transform="rotate(-14 7.8 17)"
        fill="var(--page-accent)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse
        cx="16"
        cy="15.2"
        rx="2.4"
        ry="1.8"
        transform="rotate(-14 16 15.2)"
        fill="var(--page-accent)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function SketchEqualizer() {
  return (
    <svg
      viewBox="0 0 14 12"
      aria-hidden="true"
      className="h-3 w-3.5 shrink-0 text-[var(--page-ink)]"
      fill="none"
    >
      <path
        d="M 2.5 10.5 L 2.5 4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="origin-bottom animate-pulse motion-reduce:animate-none"
      />
      <path
        d="M 7 10.5 L 7 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="origin-bottom animate-pulse [animation-delay:180ms] motion-reduce:animate-none"
      />
      <path
        d="M 11.5 10.5 L 11.5 5.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="origin-bottom animate-pulse [animation-delay:340ms] motion-reduce:animate-none"
      />
    </svg>
  );
}
