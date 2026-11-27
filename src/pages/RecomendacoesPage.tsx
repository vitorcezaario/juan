import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  SketchArrow,
  SketchBox,
  SketchDivider,
  SketchScribbleDot,
  type SketchVariant,
} from '../components/SketchPrimitives';
import { LastFmNowPlaying } from '../components/LastFmNowPlaying';
import realVinylRecordImg from '../assets/images/real_vinyl_record_1795795623753.jpg';

export interface VinylSlot {
  id: string;
  variant: SketchVariant;
  coverSrc?: string;
  artist?: string;
  album?: string;
  year?: string;
  note?: string;
  tracks?: string[];
  rating?: number;
}

// Espaços vazios de LPs prontos para receber capas e informações dos artistas
const LP_SLOTS: VinylSlot[] = [
  { id: 'lp-1', variant: 'a' },
  { id: 'lp-2', variant: 'b' },
  { id: 'lp-3', variant: 'c' },
  { id: 'lp-4', variant: 'd' },
];

export function RecomendacoesPage() {
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedLp, setSelectedLp] = useState<VinylSlot | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const total = LP_SLOTS.length;
  const activeLp = LP_SLOTS[currentIndex];

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
      if (selectedLp) {
        if (event.key === 'Escape') {
          setSelectedLp(null);
        }
        return;
      }

      if (event.key === 'ArrowLeft') {
        goPrev();
      } else if (event.key === 'ArrowRight') {
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, selectedLp]);

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
      aria-label="Mural de LPs recomendados"
      className="flex w-full flex-col items-center gap-3.5 sm:gap-4"
    >
      {/* Linha principal: seta esquerda + capa do LP com vinil real saindo + seta direita */}
      <div className="flex w-full items-center justify-center gap-4 sm:gap-8">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Disco anterior"
          className="sketch-boil-hover hidden h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--page-ink)] transition-transform duration-150 hover:-translate-x-1 hover:bg-[var(--page-hover-tint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)] sm:inline-flex"
        >
          <span className="sketch-boil-target">
            <SketchArrow direction="left" />
          </span>
        </button>

        {/* Área do LP clicável */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex w-full max-w-[540px] items-center justify-center pr-8 pb-2 sm:pr-14"
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.button
              key={activeLp.id}
              type="button"
              custom={direction}
              onClick={() => setSelectedLp(activeLp)}
              aria-label={`Abrir informações do disco ${currentIndex + 1} de ${total}`}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * 28, rotate: direction * 0.8 }
              }
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * -28, rotate: direction * -0.8 }
              }
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-square w-full max-w-[310px] max-h-[40dvh] cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[var(--page-ink)] sm:max-w-[350px] sm:max-h-[43dvh]"
            >
              {/* Disco de vinil real espiando pela lateral direita da capa */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-0 z-0 h-[88%] w-[88%] translate-x-[22%] -translate-y-1/2 transition-transform duration-300 ease-out group-hover:translate-x-[31%] group-hover:rotate-[14deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0 sm:translate-x-[26%] sm:group-hover:translate-x-[36%]"
              >
                <RealVinylDisc />
              </div>

              {/* Capa quadrada do LP na frente com hachura e vinco de lombada */}
              <div className="relative z-10 h-full w-full">
                <SketchBox
                  variant={activeLp.variant}
                  doubleFrame
                  photoCorners
                  crosshatchShadow
                  bleedHover
                  className="h-full w-full"
                  contentClassName="relative flex h-full w-full items-center justify-center overflow-hidden p-4 sm:p-5"
                >
                  {/* Vinco sutil da lombada de capa de LP */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-2 bottom-2 left-3 z-20 w-[1.5px] bg-[var(--page-ink)]/18"
                  />

                  {activeLp.coverSrc ? (
                    <img
                      src={activeLp.coverSrc}
                      alt={activeLp.album ?? `Capa do disco ${currentIndex + 1}`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    /* Capa em branco pronta para receber a arte do álbum */
                    <div className="h-full w-full bg-[var(--page-surface-inner)]/55" />
                  )}
                </SketchBox>
              </div>
            </motion.button>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Próximo disco"
          className="sketch-boil-hover hidden h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--page-ink)] transition-transform duration-150 hover:translate-x-1 hover:bg-[var(--page-hover-tint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)] sm:inline-flex"
        >
          <span className="sketch-boil-target">
            <SketchArrow direction="right" />
          </span>
        </button>
      </div>

      {/* Indicação sutil desenhada à mão convidando a clicar no disco */}
      <button
        type="button"
        onClick={() => setSelectedLp(activeLp)}
        className="group/hint font-sketch inline-flex min-h-[34px] cursor-pointer items-center gap-2 px-3 py-0.5 text-[15px] text-[var(--page-ink-soft)] opacity-85 transition-all duration-150 hover:text-[var(--page-ink)] hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--page-ink)]"
      >
        <svg
          viewBox="0 0 26 24"
          aria-hidden="true"
          className="h-5 w-5 shrink-0 transition-transform duration-150 group-hover/hint:-translate-y-0.5 group-hover/hint:text-[var(--page-accent)]"
          fill="none"
        >
          <path
            d="M 4 19.5 C 5.5 11.5, 11 7, 19.5 6.2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 14.5 3.4 C 16.5 4.8, 18.2 5.6, 20.2 6.2 C 18.4 7.7, 17.2 9.2, 16.2 11.2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="relative">
          clique no disco para saber mais
          <span
            aria-hidden="true"
            className="block h-[2.5px] w-full origin-left scale-x-0 bg-[var(--page-accent)] transition-transform duration-150 group-hover/hint:scale-x-100"
          />
        </span>
      </button>

      {/* Controles inferiores: bolinhas rabiscadas à mão (+ setas no mobile) */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Disco anterior"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--page-ink)] transition-colors duration-150 hover:bg-[var(--page-hover-tint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)] sm:hidden"
        >
          <SketchArrow direction="left" />
        </button>

        <div
          role="tablist"
          aria-label="Selecionar disco"
          className="flex items-center gap-2.5"
        >
          {LP_SLOTS.map((slot, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slot.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Ir para disco ${index + 1}`}
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
          aria-label="Próximo disco"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--page-ink)] transition-colors duration-150 hover:bg-[var(--page-hover-tint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)] sm:hidden"
        >
          <SketchArrow direction="right" />
        </button>
      </div>

      {/* Última música ouvida via Last.fm */}
      <LastFmNowPlaying />

      {/* Painel de informações do artista / LP ao clicar na capa */}
      <AnimatePresence>
        {selectedLp && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Informações do artista e do disco"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setSelectedLp(null)}
            className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--page-scrim)] px-4 py-6 backdrop-blur-[2px]"
          >
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12, scale: 0.97, rotate: -0.4 }
              }
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 8, scale: 0.98 }
              }
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-[720px] pr-2 pb-2"
            >
              <SketchBox
                variant={selectedLp.variant}
                doubleFrame
                cornerTicks
                crosshatchShadow
                className="paper-sheet-grain w-full"
                contentClassName="relative p-6 sm:p-9"
              >
                {/* Botão X rabiscado à mão para fechar */}
                <button
                  type="button"
                  onClick={() => setSelectedLp(null)}
                  aria-label="Fechar detalhes do disco"
                  className="group/close absolute top-4 right-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[var(--page-ink)] transition-colors duration-150 hover:bg-[var(--page-hover-tint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5 transition-transform duration-150 group-hover/close:rotate-6"
                    fill="none"
                  >
                    <path
                      d="M 5.5 6.2 L 18.5 18 M 18 5.8 L 5.8 18.2"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 6.5 5.4 L 17.6 18.6"
                      stroke="var(--page-accent)"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      opacity="0.65"
                    />
                  </svg>
                </button>

                {/* Encarte aberto: capa + vinil à esquerda / espaço para infos do artista à direita */}
                <div className="grid grid-cols-1 items-center gap-8 pt-4 sm:grid-cols-[230px_1fr] sm:gap-10 sm:pt-2">
                  {/* Miniatura da capa + disco */}
                  <div className="relative mx-auto aspect-square w-full max-w-[200px] sm:max-w-[230px]">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 right-0 z-0 h-[86%] w-[86%] translate-x-[24%] -translate-y-1/2"
                    >
                      <RealVinylDisc />
                    </div>
                    <div className="relative z-10 h-full w-full">
                      <SketchBox
                        variant={selectedLp.variant}
                        crosshatchShadow={false}
                        photoCorners
                        className="h-full w-full"
                        contentClassName="flex h-full w-full items-center justify-center p-3"
                      >
                        {selectedLp.coverSrc ? (
                          <img
                            src={selectedLp.coverSrc}
                            alt={selectedLp.album ?? 'Capa do disco'}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                            draggable={false}
                          />
                        ) : (
                          <div className="h-full w-full bg-[var(--page-surface-inner)]/55" />
                        )}
                      </SketchBox>
                    </div>
                  </div>

                  {/* Estrutura limpa reservada para informações do artista, nota e comentário */}
                  <div className="flex flex-col gap-5 sm:pl-4">
                    <div className="flex flex-col gap-2.5">
                      {selectedLp.album ? (
                        <h2 className="text-2xl text-[var(--page-ink)]">
                          {selectedLp.album}
                        </h2>
                      ) : (
                        <div className="w-3/4">
                          <SketchDivider orientation="horizontal" variant="a" />
                        </div>
                      )}

                      {selectedLp.artist ? (
                        <p className="text-base text-[var(--page-ink-soft)]">
                          {selectedLp.artist}
                        </p>
                      ) : (
                        <div className="w-1/2">
                          <SketchDivider orientation="horizontal" variant="b" dashed />
                        </div>
                      )}
                    </div>

                    <SketchStars count={5} />

                    <SketchDivider orientation="horizontal" variant="c" dashed />

                    {selectedLp.note ? (
                      <p className="text-base leading-relaxed text-[var(--page-ink)]">
                        {selectedLp.note}
                      </p>
                    ) : (
                      <div className="flex flex-col gap-3 opacity-60">
                        <SketchDivider orientation="horizontal" variant="a" dashed />
                        <div className="w-11/12">
                          <SketchDivider orientation="horizontal" variant="b" dashed />
                        </div>
                        <div className="w-4/5">
                          <SketchDivider orientation="horizontal" variant="c" dashed />
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <SketchBox
                        variant="d"
                        crosshatchShadow
                        label="Espaço reservado para link da música"
                        className="h-11 w-40"
                        contentClassName="p-2"
                      />
                    </div>
                  </div>
                </div>
              </SketchBox>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/** Disco de vinil LP real recortado em círculo perfeito */
function RealVinylDisc() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-full bg-[#0e0d0c] shadow-[0_12px_26px_rgba(0,0,0,0.34)] ring-1 ring-white/15">
      <img
        src={realVinylRecordImg}
        alt=""
        referrerPolicy="no-referrer"
        draggable={false}
        className="h-full w-full scale-[1.045] object-cover select-none"
      />
    </div>
  );
}

function SketchStars({ count = 5 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className="h-4.5 w-4.5 overflow-visible"
          fill="none"
        >
          <path
            d="M 10.1 2.2 L 12.2 7.2 L 17.6 7.7 L 13.4 11.2 L 14.7 16.5 L 10 13.6 L 5.3 16.4 L 6.6 11.1 L 2.5 7.5 L 7.8 7.1 Z"
            stroke="var(--page-ink)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.65"
          />
        </svg>
      ))}
    </div>
  );
}
