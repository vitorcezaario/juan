import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SketchBox } from './SketchPrimitives';

export type SiteTheme = 'papel' | 'amarelo' | 'creme' | 'escuro';

export const SITE_THEMES: {
  id: SiteTheme;
  label: string;
  swatch: string;
  ring: string;
}[] = [
  { id: 'papel', label: 'papel', swatch: '#FFFFFF', ring: '#2A1203' },
  { id: 'amarelo', label: 'amarelo', swatch: '#F8D11D', ring: '#2A1203' },
  { id: 'creme', label: 'creme', swatch: '#F3ECE0', ring: '#2A180D' },
  { id: 'escuro', label: 'escuro', swatch: '#171412', ring: '#F4EFE6' },
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
      {/* Botão super discreto de bolinha rabiscada no canto superior direito */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Escolher cor do site"
        title="Cor do site"
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full opacity-70 transition-all duration-150 hover:scale-105 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)]"
      >
        <svg
          viewBox="0 0 28 28"
          aria-hidden="true"
          className="h-6 w-6 overflow-visible"
        >
          {/* Círculo rabiscado preenchido com a cor atual do site */}
          <path
            d="M 14.2 3.2 C 20.5 2.8, 25.1 7.6, 24.8 14.1 C 24.5 20.4, 19.9 25.1, 13.7 24.8 C 7.5 24.5, 3.1 19.8, 3.3 13.6 C 3.5 7.5, 8.2 3.6, 14.2 3.2 Z"
            fill={activeTheme.swatch}
            stroke="var(--page-ink)"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pequeno ponto central discreto */}
          <circle
            cx="14"
            cy="14"
            r="2.1"
            fill={activeTheme.ring}
            opacity="0.55"
          />
        </svg>
      </button>

      {/* Menu compacto desenhado à mão */}
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
            className="absolute top-12 right-0 w-36 origin-top-right"
          >
            <SketchBox
              variant="d"
              className="paper-sheet-grain shadow-sm"
              contentClassName="flex flex-col gap-1 p-2"
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
                    className={`font-sketch flex min-h-[36px] w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[16px] whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--page-ink)] ${
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
                        strokeWidth={isSelected ? '2' : '1.4'}
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
                          d="M 2.5 7.4 L 5.6 10.4 L 11.5 3.6"
                          stroke="var(--page-ink)"
                          strokeWidth="1.9"
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
