import React from 'react';
import { TrainerProfile } from '../types';
import { Footprints, Coins, Flame } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  trainer: TrainerProfile;
  onOpenGoogleFitModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  trainer,
  onOpenGoogleFitModal,
}) => {
  return (
    <header className="bg-slate-900/95 backdrop-blur-md text-white shadow-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between sm:justify-center gap-2 sm:gap-6">
        {/* Racha Diaria */}
        <div
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 bg-orange-500/15 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 px-3 sm:px-4 py-1.5 rounded-2xl shadow-xs transition-colors"
          title="Racha Diaria de Actividad"
        >
          <Flame className="w-4 h-4 text-orange-400 animate-bounce shrink-0" />
          <span className="font-black text-xs sm:text-sm text-orange-100 whitespace-nowrap">
            {trainer.dailyStreak || 1}{' '}
            <span className="font-bold text-[10px] sm:text-xs text-orange-300/80">días</span>
          </span>
        </div>

        {/* Pasos Hoy (Conexión Google Fit) */}
        <button
          onClick={() => {
            onOpenGoogleFitModal?.();
            soundFx.playClick();
          }}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 px-3 sm:px-4 py-1.5 rounded-2xl shadow-xs cursor-pointer transition-all active:scale-95"
          title="Pasos Hoy • Clic para vincular Google Fit"
        >
          <Footprints className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-black text-xs sm:text-sm text-emerald-100 whitespace-nowrap">
            {trainer.stepsToday.toLocaleString()}{' '}
            <span className="font-bold text-[10px] sm:text-xs text-emerald-300/80">pasos</span>
          </span>
          {trainer.googleFitConnected && (
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" title="Google Fit sincronizado" />
          )}
        </button>

        {/* Monedas PokéQuest */}
        <div
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 bg-amber-500/15 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 sm:px-4 py-1.5 rounded-2xl shadow-xs transition-colors"
          title="Poké-Monedas Disponibles"
        >
          <Coins className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-black text-xs sm:text-sm text-amber-100 whitespace-nowrap">
            {trainer.gold.toLocaleString()}{' '}
            <span className="font-bold text-[10px] sm:text-xs text-amber-300/80">₽</span>
          </span>
        </div>
      </div>
    </header>
  );
};
