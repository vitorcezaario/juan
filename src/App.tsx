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

      {/* Menu discreto no canto superior direito para escolher a cor do site */}
      {!isLoading && <ThemeMenu theme={theme} onChange={setTheme} />}

      <div className="paper-sheet-grain group/sheet relative flex min-h-dvh w-full flex-col items-center overflow-hidden bg-[var(--page-bg)] px-5 pt-4 pb-6 transition-colors duration-200 sm:px-10 sm:pt-5 sm:pb-7">
        {/* Borda sketch irregular desenhada à mão contida dentro da aba */}
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
                baseFrequency="0.015 0.02"
                numOctaves="3"
                seed="11"
                result="paperNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="paperNoise"
                scale="4.2"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          <g filter="url(#notebook-sketch-border-filter)">
            {/* Traço principal irregular em tinta */}
            <path
              d="M 8 11 C 240 5, 510 14, 770 7 C 875 5, 955 11, 991 9 C 995 250, 987 520, 993 780 C 995 890, 989 955, 991 991 C 745 996, 485 987, 230 993 C 125 995, 48 989, 9 991 C 5 745, 13 490, 7 230 C 5 125, 11 52, 8 11 Z"
              fill="none"
              stroke="var(--page-ink)"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.72"
            />
            {/* Segundo risco leve deslocado reforçando a folha desenhada à mão */}
            <path
              d="M 14 16 C 280 12, 540 19, 815 13 C 905 11, 962 16, 985 15 C 989 275, 982 545, 987 805 C 989 905, 983 960, 985 985 C 725 990, 465 982, 205 987 C 110 989, 44 984, 15 985 C 11 720, 18 465, 13 210 C 11 115, 16 55, 14 16 Z"
              fill="none"
              stroke="var(--page-ink-soft)"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.28"
            />
          </g>
        </svg>

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

      {/* Controle discreto para rever a tela de carregamento */}
      {!isLoading && (
        <button
          type="button"
          onClick={handleReplayLoading}
          className="fixed right-5 bottom-5 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--page-ink)]/15 bg-[var(--page-surface)]/95 px-3.5 py-2 text-xs font-medium whitespace-nowrap text-[var(--page-ink-soft)] shadow-xs backdrop-blur-xs transition-colors duration-150 hover:border-[var(--page-ink)]/40 hover:bg-[var(--page-hover-tint)] hover:text-[var(--page-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)]"
        >
          <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Rever loading</span>
        </button>
      )}
    </div>
  );
}
