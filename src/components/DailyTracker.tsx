import React, { useState } from 'react';
import { DailyHabit, PartyPokemon, TrainerProfile } from '../types';
import { POKEMON_TYPES } from '../data/pokemonTypes';
import {
  Flame,
  Footprints,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Trophy,
  Sparkles,
  Zap,
  Gift,
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface DailyTrackerProps {
  trainer: TrainerProfile;
  dailyHabits: DailyHabit[];
  party: PartyPokemon[];
  onToggleHabit: (habitId: string) => void;
  onAddHabit: (habit: Omit<DailyHabit, 'id' | 'completed'>) => void;
  onDeleteHabit: (habitId: string) => void;
  onAddSteps: (steps: number) => void;
  onClaimDailyBonus: () => void;
}

export const DailyTracker: React.FC<DailyTrackerProps> = ({
  trainer,
  dailyHabits,
  party,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
  onAddSteps,
  onClaimDailyBonus,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRewardGold, setNewRewardGold] = useState(20);

  const completedCount = dailyHabits.filter((h) => h.completed).length;
  const totalCount = dailyHabits.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const isAllCompleted = completedCount === dailyHabits.length && dailyHabits.length > 0;

  const hasWalkingBonus = party.some((p) => p.types.includes('flying') || p.types.includes('normal'));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddHabit({
      title: newTitle.trim(),
      type: 'manual',
      pokemonType: 'normal',
      xpReward: 35,
      goldReward: newRewardGold,
    });

    setNewTitle('');
    setShowAddModal(false);
    soundFx.playClick();
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header & Streak Flame Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white">Daily Tracker & Pasos Health Connect</h2>
            <span className="bg-orange-500/20 text-orange-300 font-black text-xs px-2.5 py-0.5 rounded-full border border-orange-500/40 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-current text-orange-400" />
              Racha de {trainer.dailyStreak} días
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cumple tus hábitos diarios y tu objetivo de pasos para mantener encendida la llama de Moltres y ganar recompensas.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Añadir Hábito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Health Connect Step Widget & Walk Simulator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Health Connect API</h3>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  Sincronización activa
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 text-center space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Pasos Registrados Hoy
            </span>
            <div className="text-4xl font-black text-white tracking-tight">
              {trainer.stepsToday.toLocaleString()}
            </div>
            <span className="text-xs text-slate-400">
              Meta diaria: <strong className="text-slate-200">{trainer.stepGoal.toLocaleString()} pasos</strong>
            </span>

            {/* HP style bar */}
            <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-700 overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (trainer.stepsToday / trainer.stepGoal) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Bonus companion info */}
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Zap className="w-4 h-4" /> Compañero de Caminata
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {hasWalkingBonus ? (
                <span className="text-amber-300 font-bold">
                  ✨ ¡Tienes un Pokémon Volador/Normal activo! Ganas +50% XP extra al caminar.
                </span>
              ) : (
                'Lleva un Pokémon de tipo Volador o Normal en tu equipo para ganar un 50% de XP extra por pasos.'
              )}
            </p>
          </div>

          {/* Step simulator triggers */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              Simulador de Actividad Física
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onAddSteps(500)}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                +500 pasos
              </button>
              <button
                onClick={() => onAddSteps(1000)}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                +1.000 pasos
              </button>
              <button
                onClick={() => onAddSteps(5000)}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                +5.000 pasos
              </button>
            </div>
          </div>
        </div>

        {/* MID & RIGHT: Habits Checklist & 100% Completion Chest */}
        <div className="lg:col-span-2 space-y-4">
          {/* Daily Progress & Chest */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-white">Progreso de Hábitos de Hoy</span>
                <span className="text-amber-400 font-black">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {isAllCompleted && (
              <button
                onClick={() => {
                  soundFx.playLevelUp();
                  confetti({ particleCount: 75, spread: 80 });
                  onClaimDailyBonus();
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5 animate-pulse"
              >
                <Gift className="w-4 h-4" /> Reclamar Cofre 100% (+100 ₽)
              </button>
            )}
          </div>

          {/* Habit Checklist items */}
          <div className="space-y-2.5">
            {dailyHabits.map((habit) => {
              const isStepHabit = habit.type === 'health_connect_steps';
              const typeInfo = POKEMON_TYPES[habit.pokemonType];

              return (
                <div
                  key={habit.id}
                  onClick={() => {
                    if (!isStepHabit) {
                      soundFx.playTaskComplete();
                      onToggleHabit(habit.id);
                    }
                  }}
                  className={`bg-slate-900 border rounded-2xl p-4 shadow-md flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    habit.completed
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      className={`p-1.5 rounded-xl transition-colors ${
                        habit.completed ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-500 bg-slate-800'
                      }`}
                    >
                      {habit.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <h4
                        className={`text-sm font-bold leading-tight ${
                          habit.completed ? 'text-slate-400 line-through' : 'text-white'
                        }`}
                      >
                        {habit.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-[9px] font-black px-2 py-0.2 rounded-full uppercase"
                          style={{
                            backgroundColor: typeInfo?.color || '#888',
                            color: typeInfo?.textColor || '#fff',
                          }}
                        >
                          {typeInfo?.label || habit.pokemonType}
                        </span>
                        {isStepHabit && (
                          <span className="text-[10px] text-emerald-400 font-bold">
                            (Automático con Health Connect)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right text-xs font-black">
                      <span className="text-cyan-300 block">+{habit.xpReward} XP</span>
                      <span className="text-amber-300">+{habit.goldReward} ₽</span>
                    </div>

                    {!isStepHabit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHabit(habit.id);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-500" />
                Añadir Hábito Diario
              </h3>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Nombre del Hábito
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Beber té verde y estirar 10 min"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Recompensa de Oro Diario
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={newRewardGold}
                  onChange={(e) => setNewRewardGold(parseInt(e.target.value) || 20)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl shadow cursor-pointer"
                >
                  Crear Hábito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
