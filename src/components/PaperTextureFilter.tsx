interface PaperTextureFilterProps {
  /** Semente da textura para variar o padrão das dobras */
  seed?: number;
  /** Intensidade do relevo de papel amassado (padrão sutil estilo zine físico) */
  surfaceScale?: number;
}

/**
 * Componente de definições de filtros SVG para simular papel de zine físico
 * amassado e com dobras sutis, aplicado dinamicamente sobre `.paper-sheet-grain`.
 */
export function PaperTextureFilter({
  seed = 5,
  surfaceScale = 2.8,
}: PaperTextureFilterProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none fixed top-0 left-0 h-0 w-0 overflow-hidden"
    >
      <defs>
        {/* Textura orgânica de papel amassado + fibra fina de papel xerox/zine */}
        <filter
          id="zine-crumpled-paper"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
        >
          {/* Macro-vincos e amassados irregulares */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0085 0.013"
            numOctaves="5"
            seed={seed}
            result="crumpleNoise"
          />
          <feDiffuseLighting
            in="crumpleNoise"
            lightingColor="#ffffff"
            surfaceScale={surfaceScale}
            diffuseConstant="1.05"
            result="crumpleLight"
          >
            <feDistantLight azimuth="48" elevation="56" />
          </feDiffuseLighting>

          {/* Fibra fina de papel físico */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.55"
            numOctaves="2"
            seed={seed + 7}
            result="fiberNoise"
          />
          <feColorMatrix
            in="fiberNoise"
            type="matrix"
            values="
              0.12 0    0    0 0.88
              0    0.12 0    0 0.88
              0    0    0.12 0 0.88
              0    0    0    1 0
            "
            result="fiberSoft"
          />

          <feBlend
            in="crumpleLight"
            in2="fiberSoft"
            mode="multiply"
            result="combinedPaper"
          />
          <feColorMatrix
            in="combinedPaper"
            type="saturate"
            values="0"
          />
        </filter>

        {/* Variante de dobra/vinco alongado para folhas dobradas de zine */}
        <filter
          id="zine-fold-crease"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency="0.0035 0.018"
            numOctaves="4"
            seed={seed + 13}
            result="foldNoise"
          />
          <feDiffuseLighting
            in="foldNoise"
            lightingColor="#ffffff"
            surfaceScale={surfaceScale * 1.15}
            diffuseConstant="1.05"
            result="foldLight"
          >
            <feDistantLight azimuth="35" elevation="52" />
          </feDiffuseLighting>
          <feColorMatrix in="foldLight" type="saturate" values="0" />
        </filter>
      </defs>
    </svg>
  );
}
