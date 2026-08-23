import React, { useState } from 'react';
import { Achievement, PartyPokemon } from '../types';
import { POKEMON_TYPES } from '../data/pokemonTypes';
import { Trophy, Crown, Sparkles, CheckCircle2, Lock, Gift } from 'lucide-react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AchievementsViewProps {
  achievements: Achievement[];
  onClaimLegendary: (achievement: Achievement) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
  onClaimLegendary,
}) => {
  const [celebrationAchievement, setCelebrationAchievement] = useState<Achievement | null>(null);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400" />
              Santuario de Legendarios & Logros Heroicos
            </h2>
            <span className="bg-amber-500/20 text-amber-300 font-black text-xs px-2.5 py-0.5 rounded-full border border-amber-500/40">
              {unlockedCount} / {achievements.length} Desbloqueados
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Los Pokémon legendarios y míticos <strong>nunca salen de huevos</strong>. Se ganan únicamente completando grandes hitos de constancia, estudio y actividad física.
          </p>
        </div>
      </div>

      {/* Grid of Legendary Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => {
          const typeInfo = POKEMON_TYPES[ach.rewardPokemonType];
          const progressPercent = Math.min(100, Math.round((ach.currentCount / ach.targetCount) * 100));
          const isReadyToClaim = !ach.unlocked && ach.currentCount >= ach.targetCount;

          return (
            <div
              key={ach.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all relative overflow-hidden ${
                ach.unlocked
                  ? 'border-amber-500/50 bg-amber-950/10'
                  : isReadyToClaim
                  ? 'border-emerald-500/70 ring-2 ring-emerald-500/50 animate-pulse'
                  : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className="text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase"
                    style={{
                      backgroundColor: typeInfo?.color || '#888',
                      color: typeInfo?.textColor || '#fff',
                    }}
                  >
                    Tipo {typeInfo?.label}
                  </span>

                  {ach.unlocked ? (
                    <span className="text-[10px] font-black text-amber-400 flex items-center gap-1 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40">
                      <Crown className="w-3 h-3" /> Reclamado
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Bloqueado
                    </span>
                  )}
                </div>

                {/* Sprite / Silhouette */}
                <div className="flex items-center gap-4 my-2">
                  <div className="w-20 h-20 bg-slate-800/80 rounded-2xl flex items-center justify-center p-1 border border-slate-700">
                    <img
                      src={ach.rewardSprite}
                      alt={ach.rewardPokemonName}
                      className={`w-18 h-18 object-contain pixelated drop-shadow ${
                        ach.unlocked || isReadyToClaim
                          ? 'animate-pulse'
                          : 'brightness-0 contrast-200 opacity-30'
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm font-black text-white leading-snug">
                      {ach.title}
                    </h4>
                    <p className="text-xs text-amber-300/90 font-bold mt-0.5">
                      Recompensa: {ach.rewardPokemonName}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Progress and Claim */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Progreso:</span>
                  <span className="text-white">
                    {ach.currentCount.toLocaleString()} / {ach.targetCount.toLocaleString()}
                  </span>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ach.unlocked
                        ? 'bg-amber-400'
                        : isReadyToClaim
                        ? 'bg-emerald-400'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {isReadyToClaim && (
                  <button
                    onClick={() => {
                      soundFx.playLevelUp();
                      confetti({ particleCount: 120, spread: 100 });
                      setCelebrationAchievement(ach);
                      onClaimLegendary(ach);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" /> ¡Reclamar a {ach.rewardPokemonName}!
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Celebration Modal */}
      {celebrationAchievement && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-4 animate-scaleUp">
            <span className="text-4xl">👑✨</span>
            <h3 className="text-xl font-black text-amber-300 uppercase tracking-wide">
              ¡Pokémon Legendario Despertado!
            </h3>
            <p className="text-xs text-slate-300">
              Has demostrado un compromiso y disciplina sobresalientes.
            </p>

            <div className="w-36 h-36 mx-auto flex items-center justify-center bg-slate-800 rounded-3xl border border-amber-500/50 p-2 shadow-inner">
              <img
                src={celebrationAchievement.rewardSprite}
                alt={celebrationAchievement.rewardPokemonName}
                className="w-32 h-32 object-contain pixelated animate-bounce"
              />
            </div>

            <div className="text-lg font-black text-white">
              ¡{celebrationAchievement.rewardPokemonName} se ha unido a tu equipo!
            </div>

            <button
              onClick={() => setCelebrationAchievement(null)}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
            >
              ¡Continuar mi Aventura!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
