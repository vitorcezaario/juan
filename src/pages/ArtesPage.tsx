import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  SketchArrow,
  SketchBox,
  SketchScribbleDot,
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
      className="flex w-full flex-col items-center gap-5"
    >
      {/* Linha principal: seta esquerda + mural central com hachura + seta direita */}
      <div className="flex w-full items-center justify-center gap-4 sm:gap-8">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Arte anterior"
          className="sketch-boil-hover hidden h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--page-ink)] transition-transform duration-150 hover:-translate-x-1 hover:bg-[var(--page-hover-tint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)] sm:inline-flex"
        >
          <span className="sketch-boil-target">
            <SketchArrow direction="left" />
          </span>
        </button>

        {/* Mural grande centralizado emoldurado como página de sketchbook/zine */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full max-w-[540px] pr-2 pb-2"
        >
          <SketchBox
            variant={activeSlot.variant}
            doubleFrame
            cornerTicks
            photoCorners
            crosshatchShadow
            bleedHover
            label={`Mural de artes, quadro ${currentIndex + 1} de ${total}`}
            className="aspect-square w-full max-h-[60dvh]"
            contentClassName="relative h-full w-full overflow-hidden p-5 sm:p-7"
          >
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={activeSlot.id}
                custom={direction}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: direction * 24, rotate: direction * 0.6 }
                }
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: direction * -24, rotate: direction * -0.6 }
                }
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-full w-full items-center justify-center bg-[var(--page-surface-inner)]/55"
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
          className="sketch-boil-hover hidden h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--page-ink)] transition-transform duration-150 hover:translate-x-1 hover:bg-[var(--page-hover-tint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)] sm:inline-flex"
        >
          <span className="sketch-boil-target">
            <SketchArrow direction="right" />
          </span>
        </button>
      </div>

      {/* Controles inferiores: bolinhas rabiscadas à mão (+ setas no mobile) */}
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
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)]"
              >
                <SketchScribbleDot active={isActive} />
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
