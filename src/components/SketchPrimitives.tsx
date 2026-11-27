import type { ReactNode } from 'react';

export type SketchVariant = 'a' | 'b' | 'c' | 'd';

interface SketchBoxProps {
  variant?: SketchVariant;
  className?: string;
  contentClassName?: string;
  children?: ReactNode;
  label?: string;
  /** Adiciona uma faixa superior desenhada à mão (estilo janela/painel Neocities, sem texto) */
  windowBar?: boolean;
  /** Adiciona moldura interna dupla sutil (estilo retrato/iluminura) */
  doubleFrame?: boolean;
  /** Adiciona pequenos riscos de hachura nos cantos */
  cornerTicks?: boolean;
}

const BOX_PATHS: Record<
  SketchVariant,
  { primary: string; secondary: string; corners: string }
> = {
  a: {
    primary:
      'M 1.3 2.1 C 26 0.9, 71 2.6, 98.6 1.7 C 99.3 28, 98.1 73, 98.8 97.9 C 72 99.1, 29 97.5, 1.8 98.4 C 0.9 71, 2.2 28, 1.3 2.1 Z',
    secondary:
      'M 2.3 3.0 C 32 2.0, 68 3.2, 97.7 2.4 C 98.3 34, 97.4 67, 97.9 97.1 C 69 98.1, 31 96.8, 2.6 97.5',
    corners:
      'M 0.3 2.2 L 4.0 1.8 M 96.4 1.8 L 99.6 1.6 M 98.7 95.8 L 98.9 99.2 M 0.8 98.3 L 4.3 98.5',
  },
  b: {
    primary:
      'M 1.8 1.6 C 34 2.7, 67 1.1, 98.2 2.2 C 97.7 31, 99.2 68, 98.3 98.2 C 66 97.3, 33 99.0, 1.5 97.8 C 2.3 68, 0.9 33, 1.8 1.6 Z',
    secondary:
      'M 2.6 2.5 C 36 3.5, 65 2.0, 97.4 3.0 C 97.0 34, 98.3 67, 97.5 97.2 C 65 96.5, 34 98.1, 2.5 97.0',
    corners:
      'M 1.7 0.5 L 1.9 4.4 M 98.1 0.8 L 98.3 4.7 M 95.8 98.1 L 99.4 98.3 M 0.6 97.7 L 4.0 98.0',
  },
  c: {
    primary:
      'M 1.5 2.3 C 29 1.4, 74 1.0, 98.6 2.1 C 99.1 35, 97.8 65, 98.5 97.6 C 73 98.8, 27 98.2, 1.6 98.6 C 1.1 66, 2.1 35, 1.5 2.3 Z',
    secondary:
      'M 2.4 3.2 C 31 2.2, 71 2.0, 97.8 2.9 C 98.2 38, 97.1 64, 97.7 96.8 C 71 97.9, 29 97.4, 2.4 97.7',
    corners:
      'M 0.5 2.4 L 3.8 2.1 M 96.2 2.0 L 99.5 2.2 M 98.4 95.5 L 98.6 99.1 M 1.5 95.8 L 1.7 99.3',
  },
  d: {
    primary:
      'M 2.0 1.9 C 31 0.8, 69 2.4, 98.1 1.5 C 98.9 29, 98.4 71, 98.7 98.4 C 68 97.6, 30 98.9, 1.4 97.9 C 1.9 70, 0.8 30, 2.0 1.9 Z',
    secondary:
      'M 2.8 2.8 C 33 1.7, 68 3.2, 97.3 2.4 C 98.0 31, 97.6 69, 97.9 97.4 C 68 96.8, 31 98.0, 2.3 97.1',
    corners:
      'M 1.9 0.6 L 2.1 4.2 M 95.9 1.6 L 99.3 1.4 M 96.0 98.3 L 99.4 98.5 M 0.5 97.8 L 3.9 98.1',
  },
};

export function SketchBox({
  variant = 'a',
  className = '',
  contentClassName = 'p-4',
  children,
  label,
  windowBar = false,
  doubleFrame = false,
  cornerTicks = false,
}: SketchBoxProps) {
  const paths = BOX_PATHS[variant];

  return (
    <div
      aria-label={label}
      className={`group relative flex flex-col bg-white transition-colors duration-150 hover:bg-[#F8D11D]/[0.07] ${className}`}
    >
      {/* Moldura vetorial com traço irregular de caneta */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          d={paths.secondary}
          fill="none"
          stroke="#512003"
          strokeWidth="1.05"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.22"
        />
        <path
          d={paths.primary}
          fill="none"
          stroke="#2A1203"
          strokeWidth="2.05"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="transition-opacity duration-150 group-hover:opacity-100"
          opacity="0.92"
        />
        <path
          d={paths.corners}
          fill="none"
          stroke="#2A1203"
          strokeWidth="1.35"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.52"
        />
        {doubleFrame && (
          <path
            d="M 4.4 5.2 C 33 4.3, 68 5.6, 95.6 4.8 C 96.2 33, 95.1 67, 95.7 95.1 C 69 95.8, 32 94.5, 4.5 95.3 C 3.9 68, 4.9 33, 4.4 5.2 Z"
            fill="none"
            stroke="#512003"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.45"
          />
        )}
      </svg>

      {/* Pequenos detalhes rabiscados nos cantos (sem texto, estética caderno/codex) */}
      {cornerTicks && (
        <>
          <svg
            viewBox="0 0 18 18"
            aria-hidden="true"
            className="pointer-events-none absolute top-2 left-2 h-3.5 w-3.5 opacity-45"
          >
            <path
              d="M 2 9 L 9 2 M 2 14 L 14 2"
              fill="none"
              stroke="#512003"
              strokeWidth="1.35"
              strokeLinecap="round"
            />
          </svg>
          <svg
            viewBox="0 0 18 18"
            aria-hidden="true"
            className="pointer-events-none absolute right-2 bottom-2 h-3.5 w-3.5 opacity-45"
          >
            <path
              d="M 16 9 L 9 16 M 16 4 L 4 16"
              fill="none"
              stroke="#512003"
              strokeWidth="1.35"
              strokeLinecap="round"
            />
          </svg>
        </>
      )}

      {/* Barra superior estilo janelinha Neocities rabiscada à mão (vazia, sem texto) */}
      {windowBar && (
        <div
          aria-hidden="true"
          className="relative z-10 flex h-8 shrink-0 items-center justify-end px-3.5 pt-1"
        >
          {/* Três quadradinhos/bolinhas rabiscados imitando controles de janela */}
          <svg
            viewBox="0 0 46 14"
            className="h-3.5 w-11 opacity-65"
            fill="none"
          >
            <path
              d="M 3 8.5 L 11 8.1"
              stroke="#2A1203"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M 18.5 3.4 L 27.2 3.1 L 26.8 10.7 L 18.2 10.4 Z"
              stroke="#2A1203"
              strokeWidth="1.45"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 35 3.5 L 42.5 10.8 M 42.3 3.4 L 35.2 10.6"
              stroke="#2A1203"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Linha divisória irregular logo abaixo da barrinha da janela */}
          <svg
            viewBox="0 0 100 6"
            preserveAspectRatio="none"
            className="pointer-events-none absolute right-1 bottom-0 left-1 h-1.5 w-[calc(100%-8px)]"
          >
            <path
              d="M 0.5 3.4 C 28 2.2, 61 4.3, 99.5 2.9"
              fill="none"
              stroke="#2A1203"
              strokeWidth="1.6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.78"
            />
          </svg>
        </div>
      )}

      {/* Espaço interno pronto para receber imagens e conteúdo nas próximas etapas */}
      <div className={`relative z-10 flex-1 ${contentClassName}`}>
        {children}
      </div>
    </div>
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
    primary: 'M 0.5 6.4 C 24 4.1, 49 7.8, 74 5.2 C 86 4.0, 94 6.7, 99.5 5.6',
    secondary: 'M 2.5 8.1 C 31 6.3, 62 8.7, 97.5 7.2',
  },
  b: {
    primary: 'M 0.6 5.2 C 28 7.5, 56 3.9, 82 6.8 C 90 7.6, 95 5.1, 99.4 6.1',
    secondary: 'M 4 7.4 C 34 8.6, 67 5.8, 96 7.9',
  },
  c: {
    primary: 'M 0.4 6.1 C 19 7.2, 42 4.5, 68 6.4 C 82 7.4, 92 4.8, 99.6 5.8',
    secondary: 'M 1.8 4.4 C 35 3.6, 69 5.3, 98.2 4.2',
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
              stroke="#512003"
              strokeWidth="1"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.22"
            />
          )}
          <path
            d={paths.primary}
            fill="none"
            stroke="#2A1203"
            strokeWidth={dashed ? '1.5' : '1.9'}
            strokeLinecap="round"
            strokeDasharray={dashed ? '5 6' : undefined}
            vectorEffect="non-scaling-stroke"
            opacity={dashed ? '0.52' : '0.82'}
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
            stroke="#512003"
            strokeWidth="1"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.22"
          />
        )}
        <path
          d={paths.primary}
          fill="none"
          stroke="#2A1203"
          strokeWidth={dashed ? '1.45' : '1.9'}
          strokeLinecap="round"
          strokeDasharray={dashed ? '5 6' : undefined}
          vectorEffect="non-scaling-stroke"
          opacity={dashed ? '0.48' : '0.82'}
        />
      </svg>
    </div>
  );
}

/** Moldura externa dupla estilo página-dentro-da-página / zine Neocities */
export function SketchPageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="paper-sheet-grain relative mx-auto w-full max-w-[1060px] bg-white p-5 sm:p-7 lg:p-8">
      {/* Moldura externa rabiscada com dupla linha e marcas de registro nos cantos */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          d="M 0.5 0.9 C 32 0.3, 69 1.2, 99.5 0.6 C 99.8 33, 99.2 68, 99.6 99.4 C 68 99.8, 31 99.1, 0.6 99.5 C 0.2 67, 0.9 32, 0.5 0.9 Z"
          fill="none"
          stroke="#2A1203"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.9"
        />
        <path
          d="M 1.4 1.6 C 34 1.1, 67 1.9, 98.7 1.4 C 99.0 34, 98.5 67, 98.8 98.6 C 67 99.0, 33 98.4, 1.4 98.7 C 1.1 66, 1.7 33, 1.4 1.6 Z"
          fill="none"
          stroke="#512003"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.34"
        />
      </svg>

      {/* Cruzinhas discretas desenhadas nos quatro cantos da folha */}
      <CornerMark className="-top-3 -left-3" />
      <CornerMark className="-top-3 -right-3" />
      <CornerMark className="-bottom-3 -left-3" />
      <CornerMark className="-right-3 -bottom-3" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

function CornerMark({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`pointer-events-none absolute h-3.5 w-3.5 opacity-55 ${className}`}
    >
      <path
        d="M 8 2.2 L 7.8 13.8 M 2.2 8.2 L 13.8 7.8"
        fill="none"
        stroke="#2A1203"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    </svg>
  );
}
