/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { LoadingScreen } from './components/LoadingScreen';
import { SiteNav, type PageRoute } from './components/SiteNav';
import { ThemeMenu, type SiteTheme } from './components/ThemeMenu';
import { ArtesPage } from './pages/ArtesPage';
import { RecomendacoesPage } from './pages/RecomendacoesPage';

const THEME_STORAGE_KEY = 'fr0ggyart-theme';

function resolveRoute(pathname: string): PageRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized === '/recomendacoes') {
    return '/recomendacoes';
  }
  return '/';
}

function resolveInitialTheme(): SiteTheme {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (
      saved === 'papel' ||
      saved === 'bic' ||
      saved === 'amarelo' ||
      saved === 'creme' ||
      saved === 'escuro'
    ) {
      return saved;
    }
  } catch {
    // Ignora caso storage esteja indisponível
  }
  return 'papel';
}

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const [replayCount, setReplayCount] = useState(0);
  const [theme, setTheme] = useState<SiteTheme>(resolveInitialTheme);
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() =>
    resolveRoute(window.location.pathname),
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignora erro de armazenamento
    }
  }, [theme]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(resolveRoute(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = useCallback(
    (route: PageRoute) => {
      if (route === currentRoute) return;
      window.history.pushState(null, '', route);
      setCurrentRoute(route);
    },
    [currentRoute],
  );

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleReplayLoading = useCallback(() => {
    setReplayCount((count) => count + 1);
    setIsLoading(true);
  }, []);

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-[var(--page-bg)] text-[var(--page-ink)] transition-colors duration-200">
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen
            key={replayCount}
            onComplete={handleLoadingComplete}
          />
        )}
      </AnimatePresence>

      {/* Menu discreto no canto superior direito para escolher a cor/tinta do site */}
      {!isLoading && <ThemeMenu theme={theme} onChange={setTheme} />}

      <div className="paper-sheet-grain group/sheet relative flex min-h-dvh w-full flex-col items-center overflow-hidden bg-[var(--page-bg)] px-5 pt-4 pb-6 transition-colors duration-200 sm:px-10 sm:pt-5 sm:pb-7">
        {/* Borda expressionista de folha de animação/caderno contida dentro da aba */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-2.5 z-0 h-[calc(100%-20px)] w-[calc(100%-20px)] transition-transform duration-300 ease-out group-hover/sheet:scale-[0.996] group-hover/sheet:rotate-[-0.14deg] motion-reduce:transition-none motion-reduce:group-hover/sheet:scale-100 motion-reduce:group-hover/sheet:rotate-0 sm:inset-3.5 sm:h-[calc(100%-28px)] sm:w-[calc(100%-28px)]"
        >
          <defs>
            <filter
              id="notebook-sketch-border-filter"
              x="-2%"
              y="-2%"
              width="104%"
              height="104%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.016 0.022"
                numOctaves="3"
                seed="11"
                result="paperNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="paperNoise"
                scale="4.6"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          <g filter="url(#notebook-sketch-border-filter)">
            {/* Traço principal denso em nanquim irregular */}
            <path
              d="M 8 11 C 235 4, 505 15, 765 6 C 875 4, 955 11, 991 9 C 996 245, 986 520, 994 780 C 995 890, 988 955, 991 991 C 745 996, 485 986, 230 994 C 125 995, 48 989, 9 991 C 4 745, 14 490, 6 230 C 5 125, 11 52, 8 11 Z"
              fill="none"
              stroke="var(--page-ink)"
              strokeWidth="2.35"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.82"
            />
            {/* Segunda passada nervosa de esboço */}
            <path
              d="M 14 16 C 280 12, 540 19, 815 13 C 905 11, 962 16, 985 15 C 989 275, 982 545, 987 805 C 989 905, 983 960, 985 985 C 725 990, 465 982, 205 987 C 110 989, 44 984, 15 985 C 11 720, 18 465, 13 210 C 11 115, 16 55, 14 16 Z"
              fill="none"
              stroke="var(--page-ink-soft)"
              strokeWidth="1.15"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.34"
            />
            {/* Traços sutis de hachura nos 4 cantos da folha */}
            <path
              d="M 10 28 L 28 10 M 10 42 L 42 10 M 958 10 L 990 42 M 972 10 L 990 28 M 10 958 L 42 990 M 10 972 L 28 990 M 958 990 L 990 958 M 972 990 L 990 972"
              fill="none"
              stroke="var(--page-ink)"
              strokeWidth="1.2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.32"
            />
          </g>
        </svg>

        {/* Marcas sutis de registro de folha de animação 2D nos cantos internos */}
        <CornerRegistrationMark className="top-5 left-5 sm:top-6 sm:left-6" />
        <CornerRegistrationMark className="bottom-5 left-5 sm:bottom-6 sm:left-6" />

        <header className="relative z-10 w-full max-w-[900px]">
          <SiteNav
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
          />
        </header>

        <main className="relative z-10 flex w-full max-w-[900px] flex-1 items-center justify-center pt-3 sm:pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoute}
              initial={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }
              }
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {currentRoute === '/recomendacoes' ? (
                <RecomendacoesPage />
              ) : (
                <ArtesPage />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Controle discreto desenhado à mão para rever a tela de carregamento */}
      {!isLoading && (
        <button
          type="button"
          onClick={handleReplayLoading}
          className="font-sketch sketch-boil-hover fixed right-5 bottom-5 z-20 inline-flex cursor-pointer items-center gap-1.5 bg-[var(--page-surface)]/90 px-3 py-1.5 text-[13px] whitespace-nowrap text-[var(--page-ink-soft)] opacity-75 transition-all duration-150 hover:text-[var(--page-ink)] hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)]"
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="sketch-boil-target pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            <path
              d="M 2 5 C 32 1, 68 7, 98 3 C 99 35, 97 68, 98 96 C 69 99, 31 94, 3 97 C 1 66, 3 34, 2 5 Z"
              fill="none"
              stroke="var(--page-ink)"
              strokeWidth="1.65"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.72"
            />
          </svg>
          <RotateCcw className="relative z-10 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="relative z-10">Rever loading</span>
        </button>
      )}
    </div>
  );
}

/** Pequena cruz de registro de prancheta de animação 2D (marca puramente estrutural) */
function CornerRegistrationMark({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      aria-hidden="true"
      className={`pointer-events-none fixed z-10 hidden h-3.5 w-3.5 opacity-30 sm:block ${className}`}
      fill="none"
    >
      <path
        d="M 9 1.5 L 8.7 16.5 M 1.5 9.2 L 16.5 8.8"
        stroke="var(--page-ink)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle
        cx="9"
        cy="9"
        r="3.2"
        stroke="var(--page-ink)"
        strokeWidth="1.15"
      />
    </svg>
  );
}
