import { motion, useReducedMotion } from 'motion/react';

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
    <nav
      aria-label="Páginas do site"
      className="flex items-center justify-center gap-7 sm:gap-10"
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
            className={`font-sketch relative inline-flex min-h-[44px] items-center px-2 py-2 text-[20px] tracking-[0.015em] whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--page-ink)] sm:text-[22px] ${
              isActive
                ? 'text-[var(--page-ink)]'
                : 'text-[var(--page-ink-soft)] opacity-65 hover:text-[var(--page-ink)] hover:opacity-100'
            }`}
          >
            <span className="relative z-10">{item.label}</span>

            {isActive && (
              <motion.svg
                layoutId="active-page-sketch-underline"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                aria-hidden="true"
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.24, ease: [0.16, 1, 0.3, 1] }
                }
                className="pointer-events-none absolute right-0 -bottom-0.5 left-0 h-3 w-full overflow-visible"
              >
                {/* Grifo suave lembrando marca-texto */}
                <path
                  d="M 2 7.5 C 32 5.4, 68 8.4, 98 6.4"
                  fill="none"
                  stroke="var(--page-accent)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  opacity="0.72"
                />
                {/* Traço irregular de caneta */}
                <path
                  d="M 1 8.4 C 28 6.4, 64 9.2, 99 7.2"
                  fill="none"
                  stroke="var(--page-ink)"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </motion.svg>
            )}
          </a>
        );
      })}
    </nav>
  );
}
