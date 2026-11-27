/**
 * Camada sutil de poeira, fiapos e arranhões de filme 16mm / zine antigo.
 * Usa animações CSS assíncronas em steps(1) para movimento orgânico sem repetição óbvia.
 */
export function FilmScratchOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[36] overflow-hidden select-none"
    >
      {/* Arranhão vertical fino principal (pula de posição e pisca de forma irregular) */}
      <div className="film-scratch-line-a" />

      {/* Segundo arranhão vertical tracejado mais sutil com ciclo assíncrono */}
      <div className="film-scratch-line-b" />

      {/* Camada 1 de poeira e fiapos orgânicos de filme/xerox */}
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="film-dust-layer-a absolute inset-0 h-full w-full"
        fill="none"
      >
        {/* Pequeno fiapo curvo */}
        <path
          d="M 168 142 C 173 148, 170 158, 179 162"
          stroke="var(--page-ink)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Pontinhos irregulares de poeira */}
        <circle cx="942" cy="184" r="1.4" fill="var(--page-ink)" />
        <circle cx="950" cy="191" r="0.8" fill="var(--page-ink)" />
        <ellipse
          cx="284"
          cy="618"
          rx="1.8"
          ry="1.1"
          transform="rotate(-24 284 618)"
          fill="var(--page-ink)"
        />
        {/* Micro-risco diagonal */}
        <path
          d="M 1034 522 L 1044 548"
          stroke="var(--page-ink)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <circle cx="512" cy="96" r="1.1" fill="var(--page-ink)" />
        <path
          d="M 738 690 C 742 686, 749 688, 753 682"
          stroke="var(--page-ink)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>

      {/* Camada 2 de poeira com ciclo primo diferente para parecer aleatória */}
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="film-dust-layer-b absolute inset-0 h-full w-full"
        fill="none"
      >
        <path
          d="M 862 284 C 869 289, 875 282, 882 288"
          stroke="var(--page-ink)"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
        <circle cx="196" cy="432" r="1.3" fill="var(--page-ink)" />
        <circle cx="188" cy="441" r="0.7" fill="var(--page-ink)" />
        <path
          d="M 382 214 L 385 232"
          stroke="var(--page-ink)"
          strokeWidth="0.85"
          strokeLinecap="round"
        />
        <ellipse
          cx="1068"
          cy="662"
          rx="1.6"
          ry="0.9"
          transform="rotate(32 1068 662)"
          fill="var(--page-ink)"
        />
        <circle cx="642" cy="744" r="1.2" fill="var(--page-ink)" />
      </svg>
    </div>
  );
}
