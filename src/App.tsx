/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { LoadingScreen } from './components/LoadingScreen';
import { NeocitiesSketchLayout } from './components/NeocitiesSketchLayout';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [replayCount, setReplayCount] = useState(0);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleReplayLoading = useCallback(() => {
    setReplayCount((count) => count + 1);
    setIsLoading(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-white text-[#2A1203]">
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen
            key={replayCount}
            onComplete={handleLoadingComplete}
          />
        )}
      </AnimatePresence>

      {/* Esboço estrutural estilo Neocities (sem textos, pronto para receber imagens) */}
      <main className="min-h-screen w-full bg-white">
        <NeocitiesSketchLayout />
      </main>

      {/* Controle discreto para rever a tela de carregamento */}
      {!isLoading && (
        <button
          type="button"
          onClick={handleReplayLoading}
          className="fixed right-5 bottom-5 inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white/95 px-3.5 py-2 text-xs font-medium whitespace-nowrap text-neutral-600 shadow-xs backdrop-blur-xs transition-colors duration-150 hover:border-[#EABA12] hover:bg-[#F8D11D]/20 hover:text-[#2A1203] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A1203]"
        >
          <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Rever loading</span>
        </button>
      )}
    </div>
  );
}
