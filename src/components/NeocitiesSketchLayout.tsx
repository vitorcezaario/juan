import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SketchBox, type SketchVariant } from './SketchPrimitives';

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

export function NeocitiesSketchLayout() {
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
    <div className="paper-sheet-grain flex min-h-screen w-full flex-col items-center justify-center bg-white px-5 py-10 sm:px-10">
      <div className="flex w-full max-w-[820px] flex-col items-center gap-6">
        {/* Linha principal: seta esquerda + mural central + seta direita */}
        <div className="flex w-full items-center justify-center gap-4 sm:gap-7">
          {/* Seta esquerda desenhada à mão (desktop) */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Arte anterior"
            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full text-[#2A1203] transition-transform duration-150 hover:-translate-x-0.5 hover:bg-[#F8D11D]/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A1203] sm:inline-flex"
          >
            <SketchArrow direction="left" />
          </button>

          {/* Mural grande centralizado (aceita clique nas setas, teclado ou deslize no celular) */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full max-w-[600px]"
          >
            <SketchBox
              variant={activeSlot.variant}
              doubleFrame
              label={`Mural de artes, quadro ${currentIndex + 1} de ${total}`}
              className="aspect-square w-full max-h-[68vh]"
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
                    /* Folha em branco pronta para receber a arte deste quadro */
                    <div className="h-full w-full" />
                  )}
                </motion.div>
              </AnimatePresence>
            </SketchBox>
          </div>

          {/* Seta direita desenhada à mão (desktop) */}
          <button
            type="button"
            onClick={goNext}
            aria-label="Próxima arte"
            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full text-[#2A1203] transition-transform duration-150 hover:translate-x-0.5 hover:bg-[#F8D11D]/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A1203] sm:inline-flex"
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#2A1203] transition-colors duration-150 hover:bg-[#F8D11D]/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A1203] sm:hidden"
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
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A1203]"
                >
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-4 w-4 overflow-visible"
                  >
                    <path
                      d="M 10.2 3.1 C 14.3 2.8, 17.2 6.1, 16.9 10.2 C 16.6 14.2, 13.7 17.1, 9.8 16.9 C 5.6 16.7, 2.9 13.8, 3.1 9.7 C 3.3 5.8, 6.2 3.4, 10.2 3.1 Z"
                      fill={isActive ? '#F8D11D' : 'transparent'}
                      stroke="#2A1203"
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#2A1203] transition-colors duration-150 hover:bg-[#F8D11D]/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A1203] sm:hidden"
          >
            <SketchArrow direction="right" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SketchArrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 28 28"
      aria-hidden="true"
      className="h-6 w-6 overflow-visible"
      fill="none"
    >
      {direction === 'left' ? (
        <>
          <path
            d="M 21 14.3 C 16 13.9, 12 14.4, 7.2 14.1"
            stroke="#2A1203"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <path
            d="M 13.4 7.8 C 11.2 10.2, 9.1 12.1, 6.8 14.1 C 9.3 16.2, 11.3 18.2, 13.7 20.4"
            stroke="#2A1203"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M 7 13.8 C 12 14.2, 16 13.7, 20.8 14"
            stroke="#2A1203"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <path
            d="M 14.6 7.6 C 16.8 10, 18.9 11.9, 21.2 14 C 18.7 16, 16.7 18.1, 14.3 20.3"
            stroke="#2A1203"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
