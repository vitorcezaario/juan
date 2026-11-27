import { motion, useReducedMotion } from 'motion/react';
import { SketchDivider } from './SketchPrimitives';

export type PageRoute = '/' | '/recomendacoes';

interface SiteNavProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

const NAV_ITEMS: { route: PageRoute; label: string }[] = [
  { route: '/', label: 'artes' },
  { route: '/recomendacoes', label: 'recomendações' },
];

export function SiteNav({ currentRoute, onNavigate }: SiteNavProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex w-full flex-col items-center">
      <nav
        aria-label="Páginas do site"
        className="flex items-center justify-center gap-8 sm:gap-12"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = currentRoute === item.route;

          return (
            <a
              key={item.route}
              href={item.route}
              aria-current={isActive ? 'page' : undefined}
              onClick={(event) => {
                if (
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey ||
                  event.button !== 0
                ) {
                  return;
                }
                event.preventDefault();
                onNavigate(item.route);
              }}
              className={`font-sketch sketch-boil-hover relative inline-flex min-h-[44px] items-center px-2.5 py-1.5 text-[20px] tracking-[0.015em] whitespace-nowrap transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--page-ink)] sm:text-[23px] ${
                isActive
                  ? 'text-[var(--page-ink)]'
                  : 'text-[var(--page-ink-soft)] opacity-60 hover:-rotate-1 hover:text-[var(--page-ink)] hover:opacity-100'
              }`}
            >
              <span className="sketch-boil-target relative z-10">
                {item.label}
              </span>

              {isActive && (
                <motion.svg
                  layoutId="active-page-sketch-underline"
                  viewBox="0 0 120 18"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="sketch-ink-bleed pointer-events-none absolute -right-1 -bottom-1 -left-1 h-4 w-[calc(100%+8px)] overflow-visible"
                >
                  {/* Mancha de marcador sangrando (referência rosa/carmesim dos desenhos) */}
                  <path
                    d="M 4 10.5 C 34 7.4, 82 12.2, 116 8.8"
                    fill="none"
                    stroke="var(--page-accent)"
                    strokeWidth="6.5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    opacity="0.34"
                  />
                  {/* Rabisco irregular de caneta por cima */}
                  <path
                    d="M 1 11.4 C 32 8.6, 74 13.0, 119 9.5"
                    fill="none"
                    stroke="var(--page-ink)"
                    strokeWidth="2.35"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Segunda passada nervosa fina */}
                  <path
                    d="M 6 13.8 C 42 11.8, 86 14.2, 113 12.1"
                    fill="none"
                    stroke="var(--page-ink-soft)"
                    strokeWidth="1.15"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    opacity="0.65"
                  />
                </motion.svg>
              )}
            </a>
          );
        })}
      </nav>

      {/* Linha sutil de caneta separando o cabeçalho do palco principal */}
      <div className="mt-1.5 w-full max-w-[300px] opacity-35">
        <SketchDivider orientation="horizontal" variant="a" />
      </div>
    </div>
  );
}
