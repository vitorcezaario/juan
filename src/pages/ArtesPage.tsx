import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  SketchArrow,
  SketchBox,
  type SketchVariant,
} from '../components/SketchPrimitives';

export interface MuralSlot {
  id: string;
  variant: SketchVariant;
  imageSrc?: string;
  alt?: string;
}

// Espaços vazios do mural prontos para receber as artes enviadas depois
const MURAL_SLOTS: MuralSlot[] = [
  { id: 'slot-1', variant: 'a' },
  { id: 'slot-2', variant: 'b' },
  { id: 'slot-3', variant: 'c' },
  { id: 'slot-4', variant: 'd' },
];

export function ArtesPage() {
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartXRef = useRef<number | null>(null);

  const total = MURAL_SLOTS.length;
  const activeSlot = MURAL_SLOTS[currentIndex];

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goTo = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goPrev();
      } else if (event.key === 'ArrowRight') {
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = endX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        goPrev();
      } else {
        goNext();
      }
    }
  };

  return (
    <section
      aria-label="Mural de artes"
      className="flex w-full flex-col items-center gap-6"
    >
      {/* Linha principal: seta esquerda + mural central + seta direita */}
      <div className="flex w-full items-center justify-center gap-4 sm:gap-7">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Arte anterior"
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full text-[var(--page-ink)] transition-transform duration-150 hover:-translate-x-0.5 hover:bg-[var(--page-hover-tint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)] sm:inline-flex"
        >
          <SketchArrow direction="left" />
        </button>

        {/* Mural grande centralizado */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full max-w-[580px]"
        >
          <SketchBox
            variant={activeSlot.variant}
            doubleFrame
            label={`Mural de artes, quadro ${currentIndex + 1} de ${total}`}
            className="aspect-square w-full max-h-[64vh]"
            contentClassName="relative h-full w-full overflow-hidden p-5 sm:p-7"
          >
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={activeSlot.id}
                custom={direction}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: direction * 24 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: direction * -24 }
                }
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-full w-full items-center justify-center"
              >
                {activeSlot.imageSrc ? (
                  <img
                    src={activeSlot.imageSrc}
                    alt={activeSlot.alt ?? `Arte ${currentIndex + 1}`}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                    draggable={false}
                  />
                ) : (
                  <div className="h-full w-full" />
                )}
              </motion.div>
            </AnimatePresence>
          </SketchBox>
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Próxima arte"
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full text-[var(--page-ink)] transition-transform duration-150 hover:translate-x-0.5 hover:bg-[var(--page-hover-tint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)] sm:inline-flex"
        >
          <SketchArrow direction="right" />
        </button>
      </div>

      {/* Controles inferiores: bolinhas desenhadas à mão (+ setas no mobile) */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Arte anterior"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--page-ink)] transition-colors duration-150 hover:bg-[var(--page-hover-tint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)] sm:hidden"
        >
          <SketchArrow direction="left" />
        </button>

        <div
          role="tablist"
          aria-label="Selecionar quadro do mural"
          className="flex items-center gap-2.5"
        >
          {MURAL_SLOTS.map((slot, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slot.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Ir para arte ${index + 1}`}
                onClick={() => goTo(index)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)]"
              >
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="h-4 w-4 overflow-visible"
                >
                  <path
                    d="M 10.2 3.1 C 14.3 2.8, 17.2 6.1, 16.9 10.2 C 16.6 14.2, 13.7 17.1, 9.8 16.9 C 5.6 16.7, 2.9 13.8, 3.1 9.7 C 3.3 5.8, 6.2 3.4, 10.2 3.1 Z"
                    fill={isActive ? 'var(--page-accent)' : 'transparent'}
                    stroke="var(--page-ink)"
                    strokeWidth={isActive ? '2.1' : '1.6'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={isActive ? '1' : '0.45'}
                  />
                </svg>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Próxima arte"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--page-ink)] transition-colors duration-150 hover:bg-[var(--page-hover-tint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)] sm:hidden"
        >
          <SketchArrow direction="right" />
        </button>
      </div>
    </section>
  );
}
