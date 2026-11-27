import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const LOADING_IMAGE_SRC =
  '/assets/aistudio/WhatsApp_Image_2026-11-27_at_09.31.24_b6d648c1.jpeg';

interface LoadingScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export function LoadingScreen({
  onComplete,
  durationMs = 2800,
}: LoadingScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [imageReady, setImageReady] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Fallback caso o evento onLoad demore ou já tenha ocorrido antes da hidratação
    const fallbackTimer = window.setTimeout(() => {
      setImageReady(true);
    }, 600);

    return () => window.clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    const effectiveDuration = prefersReducedMotion ? 900 : durationMs;
    const startTime = performance.now();
    let frameId = 0;
    let completionTimer = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const linear = Math.min(elapsed / effectiveDuration, 1);
      // Curva suave com leve desaceleração orgânica no final
      const eased = 1 - Math.pow(1 - linear, 2.6);
      const nextValue = Math.round(eased * 100);

      // Aguarda a imagem ficar pronta antes de cravar 100%
      if (linear >= 1 && !imageReady) {
        setProgress(98);
        frameId = requestAnimationFrame(tick);
        return;
      }

      setProgress(nextValue);

      if (linear < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        completionTimer = window.setTimeout(() => {
          onComplete();
        }, prefersReducedMotion ? 120 : 280);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(completionTimer);
    };
  }, [durationMs, imageReady, onComplete, prefersReducedMotion]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={`Carregando página, ${progress}%`}
      initial={{ opacity: 1, y: 0 }}
      exit={
        prefersReducedMotion
          ? { opacity: 0, transition: { duration: 0.25 } }
          : {
              y: '-100%',
              transition: {
                duration: 0.72,
                ease: [0.16, 1, 0.3, 1],
              },
            }
      }
      className="loading-canvas fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6 select-none"
    >
      {/* Textura sutil de papel sobre o amarelo da ilustração */}
      <div
        aria-hidden="true"
        className="loading-paper-grain pointer-events-none absolute inset-0 opacity-70"
      />

      <motion.div
        initial={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 14, scale: 0.985 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex w-full max-w-[360px] flex-col items-center sm:max-w-[400px]"
      >
        {/* Ilustração central com proporção travada para alinhar o piscar dos olhos */}
        <div className="relative flex w-full items-end justify-center">
          {!imageError ? (
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: [0, -4, 0],
                    }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration: 3.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
              className="relative aspect-[1229/1600] w-[min(78vw,354px,calc(56vh*1229/1600))]"
            >
              <img
                src={LOADING_IMAGE_SRC}
                alt="Ilustração do personagem"
                width={1229}
                height={1600}
                referrerPolicy="no-referrer"
                onLoad={() => setImageReady(true)}
                onError={() => {
                  setImageError(true);
                  setImageReady(true);
                }}
                className="sketch-edge-blend block h-full w-full object-fill"
                draggable={false}
              />

              {/* Animação leve de piscar sobreposta com precisão nos olhos */}
              <svg
                viewBox="0 0 1229 1600"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full"
              >
                <defs>
                  <filter
                    id="eyelid-soft"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feGaussianBlur stdDeviation="2.2" />
                  </filter>
                </defs>

                {/* Pálpebra do olho esquerdo (cobre a pupila preservando a sobrancelha) */}
                <path
                  d="M 450 795 Q 497 792 544 796 L 542 831 Q 496 835 452 830 Z"
                  fill="#F9D11D"
                  filter="url(#eyelid-soft)"
                  className="sketch-eyelid-left"
                />

                {/* Pálpebra do olho direito (preserva a sobrancelha e o traço do nariz) */}
                <path
                  d="M 677 795 Q 710 792 744 796 L 743 831 Q 710 834 678 830 Z"
                  fill="#F8D015"
                  filter="url(#eyelid-soft)"
                  className="sketch-eyelid-right"
                />

                {/* Traço orgânico do olho esquerdo fechado */}
                <g className="sketch-lash-left">
                  <path
                    d="M 460 809 Q 496 818 532 808"
                    fill="none"
                    stroke="#381603"
                    strokeWidth="6.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 468 812 Q 497 819 525 811"
                    fill="none"
                    stroke="#512003"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                </g>

                {/* Traço orgânico do olho direito fechado */}
                <g className="sketch-lash-right">
                  <path
                    d="M 681 809 Q 710 817 739 808"
                    fill="none"
                    stroke="#381603"
                    strokeWidth="6.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 687 812 Q 710 818 733 811"
                    fill="none"
                    stroke="#512003"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                </g>
              </svg>
            </motion.div>
          ) : (
            <div className="flex h-64 w-52 items-center justify-center border border-[#512003]/25 bg-[#F3C718]/60 text-sm font-medium text-[#2A1203]">
              Ilustração indisponível
            </div>
          )}
        </div>

        {/* Linha de base em tinta escura que atua como barra de progresso */}
        <div className="w-full max-w-[260px] sm:max-w-[290px]">
          <div
            aria-hidden="true"
            className="relative h-[2px] w-full overflow-hidden bg-[#512003]/20"
          >
            <motion.div
              className="h-full w-full origin-left bg-[#2A1203]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.12, ease: 'linear' }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
