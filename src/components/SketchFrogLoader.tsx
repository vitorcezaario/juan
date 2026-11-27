import { useReducedMotion } from 'motion/react';

interface SketchFrogLoaderProps {
  progress: number;
}

type FrogPose = 'sit' | 'squish' | 'jump' | 'land';

interface FlipbookFrame {
  x: number;
  y: number;
  tilt: number;
  pose: FrogPose;
}

// 13 quadros travados (estilo flipbook de caderno / baixo FPS)
const FLIPBOOK_FRAMES: FlipbookFrame[] = [
  // Pulo 1
  { x: 36, y: 55, tilt: -2, pose: 'sit' },
  { x: 36, y: 56, tilt: 4, pose: 'squish' },
  { x: 72, y: 31, tilt: -17, pose: 'jump' },
  { x: 106, y: 56, tilt: 7, pose: 'land' },
  // Pulo 2
  { x: 106, y: 55, tilt: 1, pose: 'sit' },
  { x: 106, y: 56, tilt: 5, pose: 'squish' },
  { x: 142, y: 28, tilt: -14, pose: 'jump' },
  { x: 176, y: 56, tilt: 6, pose: 'land' },
  // Pulo 3
  { x: 176, y: 55, tilt: -2, pose: 'sit' },
  { x: 176, y: 56, tilt: 4, pose: 'squish' },
  { x: 211, y: 33, tilt: -19, pose: 'jump' },
  { x: 244, y: 56, tilt: 5, pose: 'land' },
  // Final sentado
  { x: 244, y: 55, tilt: 0, pose: 'sit' },
];

export function SketchFrogLoader({ progress }: SketchFrogLoaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, progress));

  const frameIndex = prefersReducedMotion
    ? FLIPBOOK_FRAMES.length - 1
    : Math.min(
        FLIPBOOK_FRAMES.length - 1,
        Math.floor((clamped / 100) * (FLIPBOOK_FRAMES.length - 1)),
      );

  const frame = FLIPBOOK_FRAMES[frameIndex];
  const boil = frameIndex % 2;
  const completedHops = Math.floor(frameIndex / 4);

  return (
    <div className="mt-1 w-full max-w-[280px] sm:max-w-[300px]">
      <svg
        viewBox="0 0 280 68"
        aria-hidden="true"
        className="block h-auto w-full overflow-visible"
      >
        {/* Linha de chão rabiscada alternando levemente entre 2 desenhos (line boil) */}
        <path
          d={
            boil === 0
              ? 'M 14 56.5 L 68 55.3 L 138 56.7 L 204 55.4 L 266 56.2'
              : 'M 15 55.8 L 76 56.8 L 146 55.4 L 212 56.6 L 265 55.7'
          }
          fill="none"
          stroke="#512003"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.38"
        />

        {/* Rabisquinhos amadores de mato nas pontas */}
        <g
          stroke="#512003"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.38"
        >
          <path d={boil === 0 ? 'M 20 56 L 16 49' : 'M 20 56 L 17 48.5'} fill="none" />
          <path d={boil === 0 ? 'M 23 56 L 26 50.5' : 'M 23 56 L 25 50'} fill="none" />
          <path d={boil === 0 ? 'M 258 56 L 255 49' : 'M 258 56 L 256 49.5'} fill="none" />
          <path d={boil === 0 ? 'M 261 56 L 265 50' : 'M 261 56 L 264 51'} fill="none" />
        </g>

        {/* Marquinhas rabiscadas nos lugares onde o sapinho já pousou */}
        {completedHops >= 1 && (
          <path
            d="M 48 44 Q 72 28 95 45"
            fill="none"
            stroke="#512003"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeDasharray="3 6"
            opacity="0.34"
          />
        )}
        {completedHops >= 2 && (
          <path
            d="M 118 44 Q 142 25 165 44"
            fill="none"
            stroke="#512003"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeDasharray="3 6"
            opacity="0.34"
          />
        )}
        {completedHops >= 3 && (
          <path
            d="M 188 45 Q 211 29 233 45"
            fill="none"
            stroke="#512003"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeDasharray="3 6"
            opacity="0.34"
          />
        )}

        {/* Risquinhos de poeira / impacto que surgem abruptamente no pouso */}
        {frame.pose === 'land' && (
          <g
            stroke="#2A1203"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.65"
          >
            <path d={`M ${frame.x - 19} 53 L ${frame.x - 25} 49`} />
            <path d={`M ${frame.x - 18} 56 L ${frame.x - 24} 55`} />
            <path d={`M ${frame.x + 19} 53 L ${frame.x + 25} 49`} />
          </g>
        )}

        {/* Risquinhos de movimento rabiscados embaixo quando está no ar */}
        {frame.pose === 'jump' && (
          <g
            stroke="#512003"
            strokeWidth="1.45"
            strokeLinecap="round"
            opacity="0.55"
          >
            <path d={`M ${frame.x - 18} ${frame.y + 10} L ${frame.x - 26} ${frame.y + 15}`} />
            <path d={`M ${frame.x - 10} ${frame.y + 13} L ${frame.x - 18} ${frame.y + 19}`} />
          </g>
        )}

        {/* Sombra rabiscada simples no chão */}
        <path
          d={
            frame.pose === 'jump'
              ? `M ${frame.x - 8} 57 L ${frame.x + 8} 57`
              : `M ${frame.x - 14} 57 L ${frame.x + 14} 57`
          }
          stroke="#512003"
          strokeWidth={frame.pose === 'jump' ? '2.2' : '3.2'}
          strokeLinecap="round"
          opacity={frame.pose === 'jump' ? '0.18' : '0.26'}
        />

        {/* Sapinho em 4 poses desenhadas à mão (sem interpolação suave) */}
        <g transform={`translate(${frame.x} ${frame.y}) rotate(${frame.tilt})`}>
          {frame.pose === 'sit' && <FrogSitPose boil={boil} />}
          {frame.pose === 'squish' && <FrogSquishPose />}
          {frame.pose === 'jump' && <FrogJumpPose />}
          {frame.pose === 'land' && <FrogLandPose />}
        </g>
      </svg>
    </div>
  );
}

function FrogSitPose({ boil }: { boil: number }) {
  return (
    <g stroke="#2A1203" strokeLinecap="round" strokeLinejoin="round">
      {/* Corpo meio tortinho feito à caneta */}
      <path
        d={
          boil === 0
            ? 'M -13 -2 C -16 -9 -9 -19 2 -18 C 9 -18 15 -14 17 -9 C 18 -5 16 -2 11 -1.5 L -13 -2 Z'
            : 'M -13.5 -2.2 C -15.5 -9.5 -8.5 -18.5 1.5 -18.3 C 8.5 -18 14.5 -14.5 17.3 -9.3 C 18.2 -5.2 15.5 -2.1 10.5 -1.6 L -13.5 -2.2 Z'
        }
        fill="#F8D11D"
        strokeWidth="2.3"
      />
      {/* Hachuras rabiscadas no dorso */}
      <g stroke="#512003" strokeWidth="1.2" opacity="0.65">
        <path d="M -9 -11 L -5 -5.5" />
        <path d="M -5.5 -14 L -1.5 -7.5" />
        <path d="M -1.5 -14.5 L 2 -9.5" />
        <path d="M -8 -7.5 L -1.5 -12" />
      </g>
      {/* Olhos saltados meio desiguais (charme amador) */}
      <circle cx="12.5" cy="-18.5" r="3.6" fill="#F8D11D" strokeWidth="2" />
      <circle cx="13.4" cy="-18.3" r="1.4" fill="#2A1203" stroke="none" />
      <circle cx="5.2" cy="-19.8" r="4.5" fill="#F8D11D" strokeWidth="2.2" />
      <circle cx="6.5" cy="-19.4" r="1.6" fill="#2A1203" stroke="none" />
      {/* Sobrancelha reta meio séria igual ao personagem */}
      <path d="M 1.5 -21.8 L 9.5 -21.4" fill="none" strokeWidth="1.7" />
      <path d="M 9.8 -20.4 L 15.5 -20.1" fill="none" strokeWidth="1.5" />
      {/* Boca reta meio torta */}
      <path d="M 9.5 -8.8 L 16.8 -9.5" fill="none" strokeWidth="1.8" />
      {/* Patinha da frente */}
      <path d="M 7.5 -6.5 L 10.5 -0.2 L 14.5 0" fill="none" strokeWidth="2" />
      {/* Pata dobrada de trás */}
      <path
        d="M -3.5 -8.5 C -12 -10 -15 -4.5 -8.5 -1.5 L -13.5 0.2 L -6 0.2"
        fill="#F8D11D"
        strokeWidth="2.15"
      />
    </g>
  );
}

function FrogSquishPose() {
  return (
    <g stroke="#2A1203" strokeLinecap="round" strokeLinejoin="round">
      {/* Corpo bem amassadinho preparando o pulo */}
      <path
        d="M -16 -1.5 C -18 -7 -10 -13.5 2 -13 C 10 -12.8 17 -9.5 19 -5.5 C 19.5 -2.5 16 -1 10 -1 L -16 -1.5 Z"
        fill="#F8D11D"
        strokeWidth="2.35"
      />
      <g stroke="#512003" strokeWidth="1.2" opacity="0.65">
        <path d="M -10 -8.5 L -6 -4" />
        <path d="M -5.5 -10 L -1.5 -5" />
        <path d="M -1 -10 L 2.5 -6" />
        <path d="M -9 -5.5 L -2 -8.5" />
      </g>
      {/* Olhos abaixados */}
      <circle cx="13" cy="-14" r="3.5" fill="#F8D11D" strokeWidth="2" />
      <circle cx="14" cy="-13.8" r="1.4" fill="#2A1203" stroke="none" />
      <circle cx="5.8" cy="-15" r="4.3" fill="#F8D11D" strokeWidth="2.2" />
      <circle cx="7.2" cy="-14.7" r="1.6" fill="#2A1203" stroke="none" />
      <path d="M 2 -16.8 L 9.8 -16.4" fill="none" strokeWidth="1.7" />
      <path d="M 10 -6.2 L 18 -6.6" fill="none" strokeWidth="1.8" />
      {/* Patinhas bem esmagadas no chão */}
      <path d="M 8 -4.5 L 12 0 L 16 0" fill="none" strokeWidth="2" />
      <path
        d="M -4 -6.5 C -13.5 -8 -17 -3 -10 -0.5 L -15 0.3 L -7 0.3"
        fill="#F8D11D"
        strokeWidth="2.15"
      />
    </g>
  );
}

function FrogJumpPose() {
  return (
    <g stroke="#2A1203" strokeLinecap="round" strokeLinejoin="round">
      {/* Perna de trás bem esticada e desengonçada no ar */}
      <path
        d="M -11 -4 L -23 4 L -27 1 M -23 4 L -26 7"
        fill="none"
        strokeWidth="2.2"
      />
      {/* Corpo esticado para frente */}
      <path
        d="M -14 -4 C -15 -11 -7 -18 4 -17 C 11 -16.5 17 -13 19 -8.5 C 20 -5.5 16 -2.5 10 -2.5 C 2 -2.5 -7 -2 -14 -4 Z"
        fill="#F8D11D"
        strokeWidth="2.3"
      />
      <g stroke="#512003" strokeWidth="1.2" opacity="0.65">
        <path d="M -9 -10 L -4.5 -5.5" />
        <path d="M -4.5 -13 L -0.5 -7.5" />
        <path d="M 0 -13.5 L 3.5 -8.5" />
      </g>
      {/* Olhos arregaladinhos no pulo */}
      <circle cx="13.5" cy="-17.5" r="3.7" fill="#F8D11D" strokeWidth="2" />
      <circle cx="14.7" cy="-17.5" r="1.45" fill="#2A1203" stroke="none" />
      <circle cx="6.2" cy="-18.8" r="4.5" fill="#F8D11D" strokeWidth="2.2" />
      <circle cx="7.8" cy="-18.6" r="1.65" fill="#2A1203" stroke="none" />
      {/* Boca aberta de leve "o" ou risco curto */}
      <path d="M 11.5 -8.5 Q 15 -7.5 17.8 -9.2" fill="none" strokeWidth="1.8" />
      {/* Patinha da frente esticada pra alcançar o chão */}
      <path d="M 9 -6 L 15 -1 L 19 -2 M 15 -1 L 17.5 1.5" fill="none" strokeWidth="2" />
      {/* Outra perna traseira esticada */}
      <path
        d="M -7 -7 L -17 1 L -22 -0.5 M -17 1 L -20 4.5"
        fill="none"
        strokeWidth="2.2"
      />
    </g>
  );
}

function FrogLandPose() {
  return (
    <g stroke="#2A1203" strokeLinecap="round" strokeLinejoin="round">
      {/* Corpo dando uma tombadinha pra frente na chegada */}
      <path
        d="M -14 -2 C -16.5 -8 -9.5 -15 2 -14.5 C 10 -14 16.5 -10.5 18.2 -6 C 19 -3 15.5 -1.2 10 -1.2 L -14 -2 Z"
        fill="#F8D11D"
        strokeWidth="2.35"
      />
      <g stroke="#512003" strokeWidth="1.2" opacity="0.65">
        <path d="M -9 -9.5 L -5 -4.5" />
        <path d="M -5 -11.5 L -1 -6" />
        <path d="M -1 -11.5 L 2.5 -7" />
      </g>
      <circle cx="13" cy="-15.2" r="3.6" fill="#F8D11D" strokeWidth="2" />
      <circle cx="14" cy="-15" r="1.4" fill="#2A1203" stroke="none" />
      <circle cx="5.5" cy="-16.4" r="4.4" fill="#F8D11D" strokeWidth="2.2" />
      <circle cx="6.8" cy="-16" r="1.55" fill="#2A1203" stroke="none" />
      <path d="M 1.8 -18.3 L 9.5 -17.6" fill="none" strokeWidth="1.7" />
      <path d="M 10 -6.8 L 17.2 -7.4" fill="none" strokeWidth="1.8" />
      <path d="M 8 -5 L 11.5 0 L 15.5 0" fill="none" strokeWidth="2" />
      <path
        d="M -3.5 -7.5 C -12.5 -9 -15.5 -3.5 -9 -1 L -14 0.3 L -6.5 0.3"
        fill="#F8D11D"
        strokeWidth="2.15"
      />
    </g>
  );
}
