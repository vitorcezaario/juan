import type { ReactNode } from 'react';

export type SketchVariant = 'a' | 'b' | 'c' | 'd';

interface SketchBoxProps {
  variant?: SketchVariant;
  className?: string;
  contentClassName?: string;
  children?: ReactNode;
  label?: string;
  /** Adiciona moldura interna dupla irregular (estilo recorte/passe-partout de zine) */
  doubleFrame?: boolean;
  /** Adiciona pequenos riscos de hachura diagonal nos cantos */
  cornerTicks?: boolean;
  /** Adiciona sombra deslocada em hachura de caneta (estética quadrinho/animação underground) */
  crosshatchShadow?: boolean;
  /** Adiciona cantoneiras desenhadas à mão no interior da moldura (sem conteúdo falso) */
  photoCorners?: boolean;
  /** Adiciona leve sangramento de tinta colorida ao passar o mouse */
  bleedHover?: boolean;
}

const BOX_PATHS: Record<
  SketchVariant,
  { primary: string; secondary: string; overshoots: string }
> = {
  a: {
    primary:
      'M 1.1 2.2 C 21 0.6, 48 2.8, 73 1.2 C 86 0.8, 94 2.1, 98.8 1.5 C 99.6 24, 97.9 56, 99.1 81 C 99.3 90, 98.3 95, 98.8 98.3 C 76 99.5, 49 97.4, 24 98.9 C 12 99.1, 5 98.0, 1.5 98.6 C 0.6 74, 2.3 44, 0.9 21 C 0.8 11, 1.6 5, 1.1 2.2 Z',
    secondary:
      'M 2.3 3.3 C 28 1.9, 64 3.6, 97.6 2.5 C 98.5 31, 97.2 66, 98.0 97.1 C 70 98.3, 33 96.7, 2.6 97.5 C 1.8 68, 2.9 35, 2.3 3.3',
    overshoots:
      'M -0.8 2.4 L 5.2 1.8 M 1.2 -0.6 L 1.6 5.4 M 94.8 1.7 L 100.8 1.3 M 98.6 -0.7 L 99.0 5.3 M 98.6 94.4 L 99.1 100.7 M 94.6 98.4 L 100.7 98.1 M -0.7 98.5 L 5.4 98.8 M 1.3 94.2 L 1.7 100.6',
  },
  b: {
    primary:
      'M 1.7 1.5 C 26 2.9, 55 0.7, 81 2.3 C 90 2.6, 95 1.4, 98.4 2.0 C 97.6 27, 99.5 58, 98.1 83 C 98.0 91, 99.0 96, 98.4 98.5 C 72 97.2, 46 99.4, 19 97.8 C 10 97.6, 4 98.7, 1.3 97.9 C 2.4 72, 0.7 43, 2.1 19 C 2.2 10, 1.2 4, 1.7 1.5 Z',
    secondary:
      'M 2.7 2.6 C 32 3.8, 66 1.8, 97.3 3.0 C 96.8 33, 98.4 67, 97.4 97.3 C 66 96.4, 34 98.2, 2.4 97.0 C 3.2 68, 1.9 36, 2.7 2.6',
    overshoots:
      'M -0.6 1.7 L 5.0 2.1 M 1.6 -0.8 L 2.0 5.2 M 94.6 1.9 L 100.6 2.3 M 98.2 -0.6 L 98.5 5.4 M 98.2 94.5 L 98.7 100.6 M 94.4 98.2 L 100.6 98.6 M -0.8 97.8 L 5.1 98.2 M 1.2 94.1 L 1.6 100.5',
  },
  c: {
    primary:
      'M 1.4 2.4 C 24 1.0, 52 2.4, 78 0.9 C 88 0.7, 94 2.3, 98.7 2.0 C 99.3 30, 97.6 59, 98.9 84 C 99.0 92, 98.1 96, 98.6 97.9 C 74 99.1, 45 97.8, 21 99.0 C 11 99.1, 4 98.2, 1.5 98.7 C 0.8 70, 2.4 42, 1.1 18 C 1.0 10, 1.8 5, 1.4 2.4 Z',
    secondary:
      'M 2.5 3.4 C 30 2.1, 70 1.9, 97.7 3.0 C 98.2 37, 97.0 64, 97.6 96.8 C 71 98.0, 29 97.3, 2.4 97.8 C 1.8 68, 2.9 37, 2.5 3.4',
    overshoots:
      'M -0.9 2.5 L 4.8 2.0 M 1.3 -0.5 L 1.7 5.5 M 95.0 2.0 L 100.8 1.8 M 98.5 -0.7 L 98.9 5.2 M 98.4 94.3 L 98.8 100.5 M 94.7 97.9 L 100.7 98.2 M -0.7 98.7 L 5.2 98.4 M 1.4 94.5 L 1.8 100.7',
  },
  d: {
    primary:
      'M 1.9 1.8 C 28 0.5, 57 2.7, 83 1.1 C 91 0.9, 95 2.0, 98.3 1.5 C 99.2 26, 98.0 59, 99.0 82 C 99.2 91, 98.3 95, 98.8 98.5 C 71 97.4, 43 99.3, 18 97.9 C 9 97.8, 4 98.6, 1.3 98.0 C 2.1 71, 0.7 40, 1.7 17 C 1.6 9, 2.2 4, 1.9 1.8 Z',
    secondary:
      'M 2.9 2.8 C 33 1.6, 68 3.3, 97.3 2.4 C 98.1 31, 97.5 69, 97.9 97.4 C 68 96.7, 31 98.0, 2.3 97.1 C 2.9 69, 1.8 35, 2.9 2.8',
    overshoots:
      'M -0.6 1.9 L 5.1 1.5 M 1.8 -0.7 L 2.2 5.3 M 94.8 1.6 L 100.6 1.2 M 98.2 -0.6 L 98.6 5.3 M 98.6 94.5 L 99.0 100.7 M 94.8 98.4 L 100.8 98.7 M -0.8 97.9 L 5.2 98.3 M 1.2 94.2 L 1.6 100.5',
  },
};

export function SketchBox({
  variant = 'a',
  className = '',
  contentClassName = 'p-4',
  children,
  label,
  doubleFrame = false,
  cornerTicks = false,
  crosshatchShadow = true,
  photoCorners = false,
  bleedHover = false,
}: SketchBoxProps) {
  const paths = BOX_PATHS[variant];

  return (
    <div
      aria-label={label}
      className={`sketch-boil-hover group relative flex flex-col bg-[var(--page-surface)] transition-colors duration-150 ${
        bleedHover ? 'hover:bg-[var(--page-surface)]' : ''
      } ${className}`}
    >
      {/* Sombra deslocada feita com hachura cruzada de caneta */}
      {crosshatchShadow && (
        <div
          aria-hidden="true"
          className="sketch-crosshatch pointer-events-none absolute inset-0 -z-10 translate-x-[7px] translate-y-[7px] opacity-80 transition-transform duration-200 ease-out group-hover:translate-x-[9px] group-hover:translate-y-[9px] motion-reduce:transition-none"
        />
      )}

      {/* Sangramento sutil de tinta (rosa/carmesim) nas bordas ao interagir */}
      {bleedHover && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1.5 -z-20 rounded-[2px] bg-[var(--page-accent-soft)] opacity-0 blur-[8px] transition-opacity duration-200 group-hover:opacity-100"
        />
      )}

      {/* Moldura vetorial expressionista com traço irregular, passadas duplas e cantos ultrapassados */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="sketch-boil-target pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
      >
        <path
          d={paths.secondary}
          fill="none"
          stroke="var(--page-ink-soft)"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.34"
        />
        <path
          d={paths.primary}
          fill="none"
          stroke="var(--page-ink)"
          strokeWidth="2.45"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.96"
        />
        <path
          d={paths.overshoots}
          fill="none"
          stroke="var(--page-ink)"
          strokeWidth="1.45"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.65"
        />
        {doubleFrame && (
          <path
            d="M 4.1 4.9 C 31 3.8, 69 5.5, 95.9 4.5 C 96.5 34, 95.0 67, 95.8 95.2 C 69 96.1, 32 94.3, 4.3 95.4 C 3.6 67, 5.0 34, 4.1 4.9 Z"
            fill="none"
            stroke="var(--page-ink-soft)"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.52"
          />
        )}
      </svg>

      {/* Hachuras diagonais rabiscadas nos cantos */}
      {cornerTicks && (
        <>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="pointer-events-none absolute top-2 left-2 z-20 h-4 w-4 opacity-55"
          >
            <path
              d="M 2 10 L 10 2 M 2 16 L 16 2 M 3 21 L 21 3"
              fill="none"
              stroke="var(--page-ink)"
              strokeWidth="1.45"
              strokeLinecap="round"
            />
          </svg>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="pointer-events-none absolute right-2 bottom-2 z-20 h-4 w-4 opacity-55"
          >
            <path
              d="M 22 14 L 14 22 M 22 8 L 8 22 M 21 3 L 3 21"
              fill="none"
              stroke="var(--page-ink)"
              strokeWidth="1.45"
              strokeLinecap="round"
            />
          </svg>
        </>
      )}

      {/* Cantoneiras físicas de caderno / álbum dentro do quadro vazio */}
      {photoCorners && (
        <>
          <PhotoCornerMark className="top-3.5 left-3.5" />
          <PhotoCornerMark className="top-3.5 right-3.5 rotate-90" />
          <PhotoCornerMark className="right-3.5 bottom-3.5 rotate-180" />
          <PhotoCornerMark className="bottom-3.5 left-3.5 -rotate-90" />
        </>
      )}

      {/* Espaço interno pronto para receber imagens e conteúdo */}
      <div className={`relative z-10 flex-1 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}

function PhotoCornerMark({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 22 22"
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 h-4 w-4 opacity-45 ${className}`}
      fill="none"
    >
      <path
        d="M 2 18 C 2.4 11, 2 6, 2.5 2.4 C 6.5 2, 12 2.4, 18.5 2.1"
        stroke="var(--page-ink)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 2.5 9.5 L 9.5 2.5"
        stroke="var(--page-ink-soft)"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

interface SketchDividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'a' | 'b' | 'c';
  dashed?: boolean;
  className?: string;
}

const HORIZONTAL_DIVIDERS: Record<
  'a' | 'b' | 'c',
  { primary: string; secondary: string }
> = {
  a: {
    primary: 'M 0.5 6.4 C 24 3.8, 49 8.1, 74 5.0 C 86 3.9, 94 6.9, 99.5 5.6',
    secondary: 'M 2.5 8.2 C 31 6.1, 62 8.9, 97.5 7.1',
  },
  b: {
    primary: 'M 0.6 5.2 C 28 7.7, 56 3.7, 82 6.9 C 90 7.7, 95 5.0, 99.4 6.1',
    secondary: 'M 4 7.5 C 34 8.7, 67 5.7, 96 8.0',
  },
  c: {
    primary: 'M 0.4 6.1 C 19 7.4, 42 4.3, 68 6.6 C 82 7.5, 92 4.7, 99.6 5.8',
    secondary: 'M 1.8 4.3 C 35 3.5, 69 5.4, 98.2 4.1',
  },
};

const VERTICAL_DIVIDERS: Record<
  'a' | 'b' | 'c',
  { primary: string; secondary: string }
> = {
  a: {
    primary: 'M 6.2 0.5 C 4.2 26, 7.8 51, 5.4 76 C 4.4 87, 6.7 94, 5.8 99.5',
    secondary: 'M 8.0 2.5 C 6.6 32, 8.6 66, 7.3 97.5',
  },
  b: {
    primary: 'M 5.4 0.5 C 7.4 29, 4.1 58, 6.8 83 C 7.5 90, 5.2 95, 6.1 99.5',
    secondary: 'M 4.1 3.0 C 5.5 35, 3.6 68, 4.9 97.0',
  },
  c: {
    primary: 'M 6.0 0.4 C 7.1 21, 4.6 45, 6.4 70 C 7.3 84, 4.9 93, 5.9 99.6',
    secondary: 'M 7.8 2.0 C 8.4 36, 6.7 69, 7.7 98.0',
  },
};

export function SketchDivider({
  orientation = 'horizontal',
  variant = 'a',
  dashed = false,
  className = '',
}: SketchDividerProps) {
  if (orientation === 'vertical') {
    const paths = VERTICAL_DIVIDERS[variant];
    return (
      <div
        aria-hidden="true"
        className={`flex h-full w-4 items-stretch justify-center ${className}`}
      >
        <svg
          viewBox="0 0 12 100"
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >
          {!dashed && (
            <path
              d={paths.secondary}
              fill="none"
              stroke="var(--page-ink-soft)"
              strokeWidth="1.05"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.28"
            />
          )}
          <path
            d={paths.primary}
            fill="none"
            stroke="var(--page-ink)"
            strokeWidth={dashed ? '1.6' : '2.1'}
            strokeLinecap="round"
            strokeDasharray={dashed ? '5 6' : undefined}
            vectorEffect="non-scaling-stroke"
            opacity={dashed ? '0.58' : '0.88'}
          />
        </svg>
      </div>
    );
  }

  const paths = HORIZONTAL_DIVIDERS[variant];
  return (
    <div
      aria-hidden="true"
      className={`flex h-3.5 w-full items-center ${className}`}
    >
      <svg
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
      >
        {!dashed && (
          <path
            d={paths.secondary}
            fill="none"
            stroke="var(--page-ink-soft)"
            strokeWidth="1.05"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.28"
          />
        )}
        <path
          d={paths.primary}
          fill="none"
          stroke="var(--page-ink)"
          strokeWidth={dashed ? '1.55' : '2.1'}
          strokeLinecap="round"
          strokeDasharray={dashed ? '5 6' : undefined}
          vectorEffect="non-scaling-stroke"
          opacity={dashed ? '0.54' : '0.88'}
        />
      </svg>
    </div>
  );
}

/** Seta expressiva rabiscada com traço duplo e ponta angulosa */
export function SketchArrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="h-7 w-7 overflow-visible"
      fill="none"
    >
      {direction === 'left' ? (
        <>
          {/* Risco secundário nervoso */}
          <path
            d="M 25 16.9 C 19 15.8, 13 17.1, 7.4 16.4"
            stroke="var(--page-ink-soft)"
            strokeWidth="1.25"
            strokeLinecap="round"
            opacity="0.42"
          />
          {/* Traço principal da haste */}
          <path
            d="M 25.5 16.1 C 19 15.6, 13.5 16.4, 6.8 15.9"
            stroke="var(--page-ink)"
            strokeWidth="2.55"
            strokeLinecap="round"
          />
          {/* Ponta angulosa estilo bico de pena */}
          <path
            d="M 15.2 7.8 C 12.1 10.8, 9.4 13.2, 6.2 15.9 C 9.6 18.6, 12.4 21.1, 15.6 24.3"
            stroke="var(--page-ink)"
            strokeWidth="2.55"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 14.3 9.8 L 8.2 15.8 L 14.4 22.4"
            stroke="var(--page-accent)"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
        </>
      ) : (
        <>
          <path
            d="M 7 15.3 C 13 16.4, 19 15.1, 24.6 15.8"
            stroke="var(--page-ink-soft)"
            strokeWidth="1.25"
            strokeLinecap="round"
            opacity="0.42"
          />
          <path
            d="M 6.5 16.1 C 13 16.6, 18.5 15.8, 25.2 16.3"
            stroke="var(--page-ink)"
            strokeWidth="2.55"
            strokeLinecap="round"
          />
          <path
            d="M 16.8 7.8 C 19.9 10.8, 22.6 13.2, 25.8 16.1 C 22.4 18.6, 19.6 21.1, 16.4 24.3"
            stroke="var(--page-ink)"
            strokeWidth="2.55"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 17.7 9.8 L 23.8 16.0 L 17.6 22.4"
            stroke="var(--page-accent)"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
        </>
      )}
    </svg>
  );
}

/** Bolinha rabiscada de paginação com preenchimento hachurado estilo caneta esferográfica */
export function SketchScribbleDot({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 22 22"
      aria-hidden="true"
      className={`h-4.5 w-4.5 overflow-visible ${active ? 'sketch-ink-bleed' : ''}`}
      fill="none"
    >
      {active && (
        <>
          {/* Sangramento suave da caneta marca-texto */}
          <circle
            cx="11"
            cy="11"
            r="8.2"
            fill="var(--page-accent-soft)"
          />
          {/* Preenchimento rabiscado em zigue-zague (como o nariz hachurado na referência) */}
          <path
            d="M 5.8 8.4 L 13.8 4.8 M 4.8 11.4 L 16.4 6.6 M 5.2 14.3 L 17.1 9.5 M 6.8 16.5 L 16.5 12.6 M 9.5 17.7 L 15.4 15.3"
            stroke="var(--page-accent)"
            strokeWidth="1.95"
            strokeLinecap="round"
          />
        </>
      )}
      <path
        d="M 11.2 3.2 C 15.8 2.8, 19.0 6.4, 18.7 11.1 C 18.4 15.6, 15.1 18.9, 10.6 18.7 C 6.0 18.5, 3.0 15.1, 3.3 10.6 C 3.6 6.2, 6.8 3.6, 11.2 3.2 Z"
        stroke="var(--page-ink)"
        strokeWidth={active ? '2.25' : '1.65'}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? '1' : '0.48'}
      />
    </svg>
  );
}
