import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SketchBox } from './SketchPrimitives';

export type SiteTheme = 'papel' | 'bic' | 'amarelo' | 'creme' | 'escuro';

export const SITE_THEMES: {
  id: SiteTheme;
  label: string;
  swatch: string;
  ring: string;
}[] = [
  { id: 'papel', label: 'papel', swatch: '#F4F1EA', ring: '#111010' },
  { id: 'bic', label: 'caneta bic', swatch: '#1421B8', ring: '#F2F4F8' },
  { id: 'amarelo', label: 'amarelo', swatch: '#F6CF1C', ring: '#180C04' },
  { id: 'creme', label: 'creme', swatch: '#EAE1D0', ring: '#181310' },
  { id: 'escuro', label: 'escuro', swatch: '#111010', ring: '#F1ECE2' },
];

interface ThemeMenuProps {
  theme: SiteTheme;
  onChange: (theme: SiteTheme) => void;
}

export function ThemeMenu({ theme, onChange }: ThemeMenuProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTheme =
    SITE_THEMES.find((item) => item.id === theme) ?? SITE_THEMES[0];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed top-4 right-4 z-30 sm:top-6 sm:right-6"
    >
      {/* Botão bem discreto de borrão/círculo rabiscado no canto superior direito */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Escolher cor do site"
        title="Cor do site"
        className="sketch-boil-hover inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full opacity-75 transition-all duration-150 hover:scale-105 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)]"
      >
        <svg
          viewBox="0 0 28 28"
          aria-hidden="true"
          className="sketch-boil-target h-6 w-6 overflow-visible"
        >
          <path
            d="M 14.3 3.0 C 20.8 2.5, 25.4 7.5, 25.0 14.2 C 24.6 20.7, 19.8 25.3, 13.5 24.9 C 7.2 24.5, 2.8 19.6, 3.1 13.4 C 3.4 7.2, 8.1 3.4, 14.3 3.0 Z"
            fill={activeTheme.swatch}
            stroke="var(--page-ink)"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 10.5 14.2 L 17.4 13.6 M 14.2 10.5 L 13.8 17.4"
            stroke={activeTheme.ring}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.65"
          />
        </svg>
      </button>

      {/* Menu compacto desenhado à mão com sombra hachurada */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label="Cores do site"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -4, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -4, scale: 0.97 }
            }
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-12 right-0 w-40 origin-top-right"
          >
            <SketchBox
              variant="d"
              crosshatchShadow
              className="paper-sheet-grain"
              contentClassName="flex flex-col gap-0.5 p-2"
            >
              {SITE_THEMES.map((item) => {
                const isSelected = item.id === theme;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={isSelected}
                    onClick={() => {
                      onChange(item.id);
                      setIsOpen(false);
                    }}
                    className={`font-sketch flex min-h-[34px] w-full cursor-pointer items-center gap-2.5 px-2 py-1 text-left text-[15px] whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--page-ink)] ${
                      isSelected
                        ? 'bg-[var(--page-hover-tint)] text-[var(--page-ink)]'
                        : 'text-[var(--page-ink-soft)] hover:bg-[var(--page-hover-tint)] hover:text-[var(--page-ink)]'
                    }`}
                  >
                    <svg
                      viewBox="0 0 18 18"
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 overflow-visible"
                    >
                      <path
                        d="M 9.1 2.2 C 13.1 1.9, 16.1 5, 15.9 9.1 C 15.7 13.1, 12.8 16.1, 8.8 15.9 C 4.8 15.7, 2 12.7, 2.2 8.8 C 2.4 4.8, 5.4 2.5, 9.1 2.2 Z"
                        fill={item.swatch}
                        stroke="var(--page-ink)"
                        strokeWidth={isSelected ? '2.1' : '1.45'}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="flex-1">{item.label}</span>
                    {isSelected && (
                      <svg
                        viewBox="0 0 14 14"
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0"
                        fill="none"
                      >
                        <path
                          d="M 2.3 7.5 L 5.6 10.6 L 11.7 3.4"
                          stroke="var(--page-accent)"
                          strokeWidth="2.1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </SketchBox>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
