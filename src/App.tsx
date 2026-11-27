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
    <div className="relative min-h-screen w-full bg-[var(--page-bg)] text-[var(--page-ink)] transition-colors duration-200">
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

      <div className="paper-sheet-grain flex min-h-screen w-full flex-col items-center bg-[var(--page-bg)] px-5 pt-5 pb-10 transition-colors duration-200 sm:px-10 sm:pt-7 sm:pb-12">
        <header className="w-full max-w-[900px]">
          <SiteNav
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
          />
        </header>

        <main className="flex w-full max-w-[900px] flex-1 items-center justify-center pt-6 sm:pt-8">
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
