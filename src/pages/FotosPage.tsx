import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  SketchArrow,
  SketchBox,
  SketchDivider,
  SketchScribbleDot,
  type SketchVariant,
} from '../components/SketchPrimitives';
import { GalleryArtworkImage } from '../components/GalleryArtworkImage';
import { usePreloadGalleryImages } from '../lib/artworkManifest';

export interface PhotoSlot {
  id: string;
  frameNumber: string;
  variant: SketchVariant;
  tiltClass: string;
  tapeOffsetClass: string;
  imageSrc?: string;
  alt?: string;
  caption?: string;
  date?: string;
  location?: string;
}

// Espaços vazios de fotos no formato de folha de contato / álbum zine, prontos para receber as fotos reais
const PHOTO_SLOTS: PhotoSlot[] = [
  {
    id: 'foto-1',
    frameNumber: '01',
    variant: 'a',
    tiltClass: '-rotate-[0.9deg] hover:rotate-0',
    tapeOffsetClass: '-rotate-[2.5deg]',
  },
  {
    id: 'foto-2',
    frameNumber: '02',
    variant: 'b',
    tiltClass: 'rotate-[0.7deg] hover:rotate-0',
    tapeOffsetClass: 'rotate-[1.8deg]',
  },
  {
    id: 'foto-3',
    frameNumber: '03',
    variant: 'c',
    tiltClass: '-rotate-[0.5deg] hover:rotate-0',
    tapeOffsetClass: '-rotate-[1.4deg]',
  },
  {
    id: 'foto-4',
    frameNumber: '04',
    variant: 'd',
    tiltClass: 'rotate-[0.8deg] hover:rotate-0',
    tapeOffsetClass: 'rotate-[2.2deg]',
  },
  {
    id: 'foto-5',
    frameNumber: '05',
    variant: 'b',
    tiltClass: '-rotate-[0.7deg] hover:rotate-0',
    tapeOffsetClass: '-rotate-[2deg]',
  },
  {
    id: 'foto-6',
    frameNumber: '06',
    variant: 'a',
    tiltClass: 'rotate-[0.6deg] hover:rotate-0',
    tapeOffsetClass: 'rotate-[1.5deg]',
  },
];

export function FotosPage() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const touchStartXRef = useRef<number | null>(null);

  const total = PHOTO_SLOTS.length;
  const activePhoto = selectedIndex !== null ? PHOTO_SLOTS[selectedIndex] : null;

  const prevIndex =
    selectedIndex !== null ? (selectedIndex - 1 + total) % total : null;
  const nextIndex =
    selectedIndex !== null ? (selectedIndex + 1) % total : null;

  // Pré-carrega e pré-decodifica fotos vizinhas quando o visor ampliado estiver aberto
  usePreloadGalleryImages([
    prevIndex !== null ? PHOTO_SLOTS[prevIndex]?.imageSrc : undefined,
    nextIndex !== null ? PHOTO_SLOTS[nextIndex]?.imageSrc : undefined,
  ]);

  const openPhoto = useCallback((index: number) => {
    setDirection(1);
    setSelectedIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + total) % total,
    );
  }, [total]);

  const goNext = useCallback(() => {
    setDirection(1);
    setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % total));
  }, [total]);

  const goTo = useCallback(
    (index: number) => {
      if (selectedIndex === null || index === selectedIndex) return;
      setDirection(index > selectedIndex ? 1 : -1);
      setSelectedIndex(index);
    },
    [selectedIndex],
  );

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        goPrev();
      } else if (event.key === 'ArrowRight') {
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLightbox, goNext, goPrev, selectedIndex]);

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
      aria-label="Galeria de fotos"
      className="flex w-full flex-col items-center gap-4"
    >
      {/* Grade de revelações / fotos presas com fita no caderno */}
      <div className="grid w-full max-w-[780px] grid-cols-2 gap-x-4 gap-y-6 px-1 pt-2 pb-1 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-7">
        {PHOTO_SLOTS.map((slot, index) => (
          <motion.button
            key={slot.id}
            type="button"
            onClick={() => openPhoto(index)}
            aria-label={
              slot.caption
                ? `Abrir foto ${slot.frameNumber}: ${slot.caption}`
                : `Abrir foto ${slot.frameNumber} de ${total}`
            }
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 10 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.22,
              delay: prefersReducedMotion ? 0 : index * 0.035,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`group relative w-full cursor-pointer pr-1.5 pb-1.5 text-left transition-transform duration-200 ease-out hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-[var(--page-ink)] motion-reduce:transform-none ${slot.tiltClass}`}
          >
            {/* Fita adesiva desenhada à mão prendendo a foto na folha */}
            <SketchTapeStrip className={slot.tapeOffsetClass} />

            <SketchBox
              variant={slot.variant}
              photoCorners
              crosshatchShadow
              bleedHover
              className="w-full"
              contentClassName="flex flex-col p-2.5 pb-2 sm:p-3 sm:pb-2.5"
            >
              {/* Área da fotografia em proporção clássica 4:3 */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--page-surface-inner)]/60">
                {slot.imageSrc ? (
                  <GalleryArtworkImage
                    src={slot.imageSrc}
                    alt={slot.alt ?? slot.caption ?? `Foto ${slot.frameNumber}`}
                    priority={index < 3}
                    sizes="(max-width: 640px) 44vw, 230px"
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                  />
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>

              {/* Margem inferior estilo revelação analógica (numeração do filme + linha livre para legenda) */}
              <div className="mt-2 flex items-center justify-between gap-2 px-0.5">
                <span className="font-sketch text-[12px] tracking-[0.06em] text-[var(--page-ink-soft)] opacity-75">
                  {slot.frameNumber}
                </span>

                {slot.caption ? (
                  <span className="font-sketch truncate text-[12px] text-[var(--page-ink)]">
                    {slot.caption}
                  </span>
                ) : (
                  <div className="w-14 opacity-45">
                    <SketchDivider
                      orientation="horizontal"
                      variant={slot.variant === 'd' ? 'c' : slot.variant}
                      dashed
                    />
                  </div>
                )}
              </div>
            </SketchBox>
          </motion.button>
        ))}
      </div>

      {/* Visor ampliado (lightbox) no mesmo estilo de encarte zine */}
      <AnimatePresence>
        {activePhoto && selectedIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Visualização ampliada da foto ${activePhoto.frameNumber}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--page-scrim)] px-4 py-6 backdrop-blur-[2px]"
          >
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12, scale: 0.97, rotate: -0.35 }
              }
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 8, scale: 0.98 }
              }
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="flex w-full max-w-[720px] flex-col items-center gap-4"
            >
              <div className="flex w-full items-center justify-center gap-3 sm:gap-6">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Foto anterior"
                  className="sketch-boil-hover hidden h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--page-surface)]/85 text-[var(--page-ink)] transition-transform duration-150 hover:-translate-x-1 hover:bg-[var(--page-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)] sm:inline-flex"
                >
                  <span className="sketch-boil-target">
                    <SketchArrow direction="left" />
                  </span>
                </button>

                <div className="w-full max-w-[580px] pr-2 pb-2">
                  <SketchBox
                    variant={activePhoto.variant}
                    doubleFrame
                    cornerTicks
                    photoCorners
                    crosshatchShadow
                    className="paper-sheet-grain w-full"
                    contentClassName="relative p-5 sm:p-7"
                  >
                    {/* Botão X rabiscado à mão para fechar */}
                    <button
                      type="button"
                      onClick={closeLightbox}
                      aria-label="Fechar foto ampliada"
                      className="group/close absolute top-3.5 right-3.5 z-30 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[var(--page-surface)]/90 text-[var(--page-ink)] transition-colors duration-150 hover:bg-[var(--page-hover-tint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)]"
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

                    <AnimatePresence
                      mode="wait"
                      initial={false}
                      custom={direction}
                    >
                      <motion.div
                        key={activePhoto.id}
                        custom={direction}
                        initial={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, x: direction * 20 }
                        }
                        animate={{ opacity: 1, x: 0 }}
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, x: direction * -20 }
                        }
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-4"
                      >
                        <div className="flex aspect-[4/3] max-h-[58dvh] w-full items-center justify-center overflow-hidden bg-[var(--page-surface-inner)]/55">
                          {activePhoto.imageSrc ? (
                            <GalleryArtworkImage
                              src={activePhoto.imageSrc}
                              alt={
                                activePhoto.alt ??
                                activePhoto.caption ??
                                `Foto ${activePhoto.frameNumber}`
                              }
                              priority
                              sizes="(max-width: 640px) 92vw, 560px"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="h-full w-full" />
                          )}
                        </div>

                        {/* Rodapé discreto da revelação (número do quadro + metadados limpos quando existirem) */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
                          <span className="font-sketch text-[14px] tracking-[0.06em] text-[var(--page-ink-soft)]">
                            {activePhoto.frameNumber} / 0{total}
                          </span>

                          {activePhoto.caption ||
                          activePhoto.location ||
                          activePhoto.date ? (
                            <div className="font-sketch flex flex-wrap items-center gap-2 text-[14px] text-[var(--page-ink)]">
                              {activePhoto.caption && (
                                <span>{activePhoto.caption}</span>
                              )}
                              {activePhoto.location && (
                                <>
                                  {activePhoto.caption && (
                                    <span
                                      aria-hidden="true"
                                      className="text-[var(--page-ink-soft)]"
                                    >
                                      ·
                                    </span>
                                  )}
                                  <span className="text-[var(--page-ink-soft)]">
                                    {activePhoto.location}
                                  </span>
                                </>
                              )}
                              {activePhoto.date && (
                                <>
                                  {(activePhoto.caption ||
                                    activePhoto.location) && (
                                    <span
                                      aria-hidden="true"
                                      className="text-[var(--page-ink-soft)]"
                                    >
                                      ·
                                    </span>
                                  )}
                                  <span className="text-[var(--page-ink-soft)]">
                                    {activePhoto.date}
                                  </span>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="w-28 opacity-50">
                              <SketchDivider
                                orientation="horizontal"
                                variant="b"
                                dashed
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </SketchBox>
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Próxima foto"
                  className="sketch-boil-hover hidden h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--page-surface)]/85 text-[var(--page-ink)] transition-transform duration-150 hover:translate-x-1 hover:bg-[var(--page-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)] sm:inline-flex"
                >
                  <span className="sketch-boil-target">
                    <SketchArrow direction="right" />
                  </span>
                </button>
              </div>

              {/* Paginação com bolinhas rabiscadas + setas mobile dentro do visor */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Foto anterior"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--page-surface)]/85 text-[var(--page-ink)] transition-colors duration-150 hover:bg-[var(--page-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)] sm:hidden"
                >
                  <SketchArrow direction="left" />
                </button>

                <div
                  role="tablist"
                  aria-label="Selecionar foto"
                  className="flex items-center gap-1.5 rounded-full bg-[var(--page-surface)]/85 px-2.5 py-1"
                >
                  {PHOTO_SLOTS.map((slot, index) => {
                    const isActive = index === selectedIndex;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Ir para foto ${slot.frameNumber}`}
                        onClick={() => goTo(index)}
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)]"
                      >
                        <SketchScribbleDot active={isActive} />
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Próxima foto"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--page-surface)]/85 text-[var(--page-ink)] transition-colors duration-150 hover:bg-[var(--page-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--page-ink)] sm:hidden"
                >
                  <SketchArrow direction="right" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/** Pedacinho de fita adesiva desenhado à mão prendendo cada foto na folha do caderno */
function SketchTapeStrip({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 20"
      aria-hidden="true"
      className={`pointer-events-none absolute -top-2.5 left-1/2 z-30 h-4.5 w-14 -translate-x-1/2 opacity-80 ${className}`}
      fill="none"
    >
      <path
        d="M 4 3.5 L 59.5 2.5 L 62 9 L 58.5 16.5 L 3.5 17.5 L 1.5 10.5 Z"
        fill="var(--page-surface)"
        fillOpacity="0.88"
        stroke="var(--page-ink)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 10 7.5 L 53 6.8 M 14 12.2 L 49 11.7"
        stroke="var(--page-ink-soft)"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.32"
      />
    </svg>
  );
}
