const UPLOADED_VINYL_SRC =
  '/assets/aistudio/566b10c1-15de-4f1d-95f8-04530e845c19_47c03bf3.jpg';

interface DrawnVinylDiscProps {
  /** Sombra mais leve para a miniatura do card do Last.fm */
  compact?: boolean;
}

/**
 * Disco de vinil desenhado à mão enviado pelo usuário:
 * - Faixa externa dos sulcos escurecida em tom de vinil preto preservando os riscos originais
 * - Selo central clareado para papel branco mantendo o traço preto, o círculo azul e o furo originais
 */
export function DrawnVinylDisc({ compact = false }: DrawnVinylDiscProps) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-full bg-[#121112] ring-1 ring-[var(--page-ink)]/35 ${
        compact
          ? 'shadow-[0_4px_10px_rgba(0,0,0,0.3)]'
          : 'shadow-[0_12px_26px_rgba(0,0,0,0.35)]'
      }`}
    >
      <div className="relative h-full w-full scale-[1.028]">
        {/* Camada 1: faixa do vinil escurecida mantendo textura de grafite e sulcos em caneta azul */}
        <img
          src={UPLOADED_VINYL_SRC}
          alt=""
          width={1557}
          height={1600}
          decoding="async"
          referrerPolicy="no-referrer"
          draggable={false}
          className="block h-full w-full object-fill brightness-[0.36] contrast-[1.7] saturate-[1.35] select-none"
        />

        {/* Brilho diagonal sutil típico de vinil escuro sobre os sulcos desenhados */}
        <div
          aria-hidden="true"
          className="drawn-vinyl-sheen pointer-events-none absolute inset-0"
        />

        {/* Camada 2: selo central recortado exatamente no anel preto com fundo branco limpo */}
        <img
          src={UPLOADED_VINYL_SRC}
          alt=""
          width={1557}
          height={1600}
          decoding="async"
          referrerPolicy="no-referrer"
          draggable={false}
          className="drawn-vinyl-white-label pointer-events-none absolute inset-0 block h-full w-full object-fill brightness-[1.36] contrast-[1.45] select-none"
        />
      </div>
    </div>
  );
}
