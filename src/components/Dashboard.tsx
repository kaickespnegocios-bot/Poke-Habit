import React from 'react';
import {
  TrainerProfile,
  PartyPokemon,
  Task,
  DailyHabit,
  ExamBoss,
  Egg,
  SkillStats,
} from '../types';
import { POKEMON_TYPES } from '../data/pokemonTypes';
import {
  Footprints,
  Flame,
  Coins,
  Trophy,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  Egg as EggIcon,
  CheckCircle2,
  Heart,
  Zap,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface DashboardProps {
  trainer: TrainerProfile;
  party: PartyPokemon[];
  tasks: Task[];
  dailyHabits: DailyHabit[];
  examBosses: ExamBoss[];
  eggs: Egg[];
  skillStats: SkillStats;
  onNavigate: (tab: any) => void;
  onCompleteTask: (task: Task) => void;
  onAddSteps: (steps: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  trainer,
  party,
  tasks,
  dailyHabits,
  examBosses,
  eggs,
  skillStats,
  onNavigate,
  onCompleteTask,
  onAddSteps,
}) => {
  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 3);
  const completedHabitsCount = dailyHabits.filter((h) => h.completed).length;
  const habitPercentage = Math.round((completedHabitsCount / (dailyHabits.length || 1)) * 100);

  const upcomingExam = examBosses.find((b) => b.status === 'upcoming');
  const incubatingEgg = eggs.find((e) => e.isIncubating);

  const stepPercent = Math.min(100, Math.round((trainer.stepsToday / trainer.stepGoal) * 100));

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Hero Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trainer Profile Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-red-600 to-rose-400 rounded-2xl p-1 shadow-md flex items-center justify-center shrink-0 border border-white/20">
                {trainer.avatarSprite ? (
                  <img
                    src={trainer.avatarSprite}
                    alt={trainer.name}
                    className="w-12 h-12 object-contain pixelated drop-shadow"
                  />
                ) : (
                  <img
                    src={party[0]?.sprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'}
                    alt="Partner"
                    className="w-12 h-12 object-contain pixelated drop-shadow"
                  />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white truncate">{trainer.name}</h2>
                  <span className="bg-red-900/60 border border-red-500/50 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                    {trainer.trainerClass || 'Entrenador'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Nivel de Entrenador <span className="text-white font-bold">{trainer.level}</span>
                </p>
              </div>
            </div>

            {/* Streak & Gold info */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 flex items-center gap-2.5">
                <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                    Racha Diaria
                  </span>
                  <span className="text-sm font-black text-orange-300">
                    {trainer.dailyStreak} {trainer.dailyStreak === 1 ? 'día' : 'días'} 🔥
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                    Oro Total
                  </span>
                  <span className="text-sm font-black text-amber-300">
                    {trainer.gold} ₽
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Tareas hechas: <strong className="text-white">{trainer.totalTasksCompleted}</strong></span>
            <span>Estudio Pomodoros: <strong className="text-white">{trainer.totalPomodorosDone}</strong></span>
          </div>
        </div>

        {/* Health Connect Step Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Health Connect — Pasos</h3>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Sincronizado hoy
                </span>
              </div>
            </div>
            <span className="text-xs font-black bg-emerald-950 text-emerald-300 px-2 py-1 rounded-lg border border-emerald-800">
              {stepPercent}%
            </span>
          </div>

          <div className="my-2">
            <div className="flex justify-between items-baseline text-xs mb-1">
              <span className="text-2xl font-black text-white tracking-tight">
                {trainer.stepsToday.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400">pasos</span>
              </span>
              <span className="text-slate-400 text-xs font-medium">
                Meta: {trainer.stepGoal.toLocaleString()}
              </span>
            </div>

            {/* Custom HP-style bar */}
            <div className="w-full bg-slate-800 rounded-full h-3.5 p-0.5 border border-slate-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  stepPercent >= 100
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : stepPercent >= 50
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-500'
                    : 'bg-gradient-to-r from-red-500 to-amber-500'
                }`}
                style={{ width: `${stepPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              💡 Cada 1.000 pasos ganas <strong className="text-emerald-300">+25 XP</strong> y <strong className="text-amber-300">+10 Oro</strong> (+50% bonus con Pokémon Volador/Normal).
            </p>
          </div>

          {/* Quick Step simulator for instant testing */}
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Simular:</span>
            <button
              onClick={() => onAddSteps(500)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] text-emerald-300 font-bold rounded-lg transition-colors border border-slate-700 cursor-pointer"
            >
              +500 pasos
            </button>
            <button
              onClick={() => onAddSteps(2000)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] text-emerald-300 font-bold rounded-lg transition-colors border border-slate-700 cursor-pointer"
            >
              +2.000 pasos
            </button>
            <button
              onClick={() => onNavigate('daily')}
              className="ml-auto text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
            >
              Detalles <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Daily Tracker & Habits Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Hábitos Diarios</h3>
                <span className="text-xs text-slate-400">
                  {completedHabitsCount} de {dailyHabits.length} completados
                </span>
              </div>
            </div>
            <span className="text-xs font-black bg-indigo-950 text-indigo-300 px-2 py-1 rounded-lg border border-indigo-800">
              {habitPercentage}%
            </span>
          </div>

          <div className="space-y-1.5 my-2">
            {dailyHabits.slice(0, 3).map((habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-800/60 border border-slate-700/50"
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      habit.completed ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span
                    className={`truncate ${
                      habit.completed ? 'text-slate-400 line-through' : 'text-slate-200 font-medium'
                    }`}
                  >
                    {habit.title}
                  </span>
                </div>
                <span className="text-[10px] text-amber-300 font-bold ml-2">+{habit.goldReward}₽</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('daily')}
            className="w-full mt-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold rounded-xl border border-indigo-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Abrir Checklist Diario <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Party Row */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-600/20 text-red-400 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Equipo Activo (Party)</h3>
              <p className="text-xs text-slate-400">
                Máximo 6 Pokémon. Ganan XP al completar tareas y caminar.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('party')}
            className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            Gestionar PC Box ({party.length}/6) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {party.map((pkmn, idx) => {
            const primaryType = pkmn.types[0] || 'normal';
            const typeConfig = POKEMON_TYPES[primaryType];
            const hpPercent = Math.max(0, Math.min(100, Math.round((pkmn.hp / pkmn.maxHp) * 100)));
            const xpPercent = Math.min(100, Math.round((pkmn.currentXp / pkmn.maxXp) * 100));

            return (
              <div
                key={pkmn.id}
                onClick={() => onNavigate('party')}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-red-500/50 rounded-xl p-3 flex flex-col items-center text-center transition-all cursor-pointer group shadow-sm"
              >
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <img
                    src={pkmn.sprite}
                    alt={pkmn.name}
                    className="w-16 h-16 object-contain pixelated group-hover:scale-110 transition-transform drop-shadow"
                  />
                  <span className="absolute bottom-0 right-0 bg-slate-900/90 text-white font-black text-[10px] px-1.5 py-0.2 rounded border border-slate-700">
                    Nv.{pkmn.level}
                  </span>
                </div>

                <h4 className="font-bold text-white text-xs mt-2 truncate w-full">
                  {pkmn.nickname || pkmn.name}
                </h4>

                <div className="flex gap-1 mt-1">
                  {pkmn.types.map((t) => (
                    <span
                      key={t}
                      className="text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase"
                      style={{
                        backgroundColor: POKEMON_TYPES[t]?.color || '#999',
                        color: POKEMON_TYPES[t]?.textColor || '#fff',
                      }}
                    >
                      {POKEMON_TYPES[t]?.label || t}
                    </span>
                  ))}
                </div>

                {/* HP Bar */}
                <div className="w-full mt-2">
                  <div className="flex justify-between text-[9px] text-slate-400 font-semibold mb-0.5">
                    <span>HP</span>
                    <span>{pkmn.hp}/{pkmn.maxHp}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        hpPercent > 50 ? 'bg-emerald-400' : hpPercent > 20 ? 'bg-amber-400' : 'bg-red-500'
                      }`}
                      style={{ width: `${hpPercent}%` }}
                    />
                  </div>
                </div>

                {/* EXP Bar */}
                <div className="w-full mt-1">
                  <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${xpPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty Party Slots */}
          {Array.from({ length: Math.max(0, 6 - party.length) }).map((_, i) => (
            <div
              key={`empty_${i}`}
              onClick={() => onNavigate('shop')}
              className="border-2 border-dashed border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center text-center text-slate-600 hover:border-slate-700 hover:text-slate-400 transition-colors cursor-pointer min-h-[140px]"
            >
              <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center mb-1">
                <EggIcon className="w-5 h-5 text-slate-600" />
              </div>
              <span className="text-[11px] font-bold">Hueco Libre</span>
              <span className="text-[9px]">Abrir huevo en tienda</span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Split: Quick Quests (Hogar) & Active Exam Boss */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quick Tasks Hogar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Misiones del Hogar Pendientes
              </h3>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                Ver todas ({tasks.filter((t) => !t.completed).length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingTasks.map((task) => {
                const typeInfo = POKEMON_TYPES[task.pokemonType];
                return (
                  <div
                    key={task.id}
                    className="bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 rounded-xl p-3.5 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase"
                          style={{
                            backgroundColor: typeInfo?.color || '#888',
                            color: typeInfo?.textColor || '#fff',
                          }}
                        >
                          {typeInfo?.label || task.pokemonType}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-700/60 px-2 py-0.5 rounded">
                          {task.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white leading-tight">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center gap-2 text-xs font-black">
                        <span className="text-cyan-300">+{task.xpReward} XP</span>
                        <span className="text-amber-300">+{task.goldReward} ₽</span>
                      </div>
                      <button
                        onClick={() => {
                          soundFx.playTaskComplete();
                          onCompleteTask(task);
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-black rounded-lg transition-transform active:scale-95 shadow cursor-pointer"
                      >
                        Completar
                      </button>
                    </div>
                  </div>
                );
              })}

              {pendingTasks.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  ✨ ¡No tienes tareas pendientes! Añade nuevas tareas desde la sección de Tareas Hogar.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            🎁 Completar tareas tiene un <strong>15% de probabilidad</strong> de desatar un <strong>Encuentro Pokémon Salvaje</strong> o un cofre misterioso.
          </div>
        </div>

        {/* 3º ESO Exam Boss Battle Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Gym Boss Examen 3º ESO</h3>
                  <p className="text-xs text-slate-400">Estudiar en Pomodoro debilita el HP del jefe</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('study')}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                Estudio Hub <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingExam ? (
              <div className="bg-gradient-to-br from-slate-800 to-slate-850 border border-amber-500/30 rounded-xl p-4 my-2">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={upcomingExam.bossSprite}
                      alt={upcomingExam.bossPokemonName}
                      className="w-16 h-16 object-contain pixelated drop-shadow animate-bounce"
                      style={{ animationDuration: '3s' }}
                    />
                    <span className="absolute -top-1 -right-1 text-base">
                      {upcomingExam.badgeSprite}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-white">{upcomingExam.title}</h4>
                      <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                        {upcomingExam.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-semibold mt-0.5">
                      Jefe: <span className="text-amber-400 font-bold">{upcomingExam.bossPokemonName}</span>
                    </p>

                    {/* Boss HP Bar */}
                    <div className="mt-2.5">
                      <div className="flex justify-between text-[10px] text-slate-300 font-bold mb-1">
                        <span>HP del Examen:</span>
                        <span>{upcomingExam.currentHp} / {upcomingExam.maxHp} HP</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 to-orange-400 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(100, (upcomingExam.currentHp / upcomingExam.maxHp) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                  <span className="text-slate-300 font-medium">
                    Recompensa: <strong className="text-amber-300">+{upcomingExam.rewardGold} ₽</strong> y <strong>{upcomingExam.badgeName}</strong>
                  </span>
                  <button
                    onClick={() => onNavigate('study')}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition-transform active:scale-95 cursor-pointer shadow"
                  >
                    Iniciar Pomodoro
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs bg-slate-800/40 rounded-xl border border-slate-800">
                📚 No hay exámenes programados. Añade tus fechas de examen desde el Hub de Estudio 3º ESO.
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Mini-juego Repaso: Combate por Flashcards</span>
            <button
              onClick={() => onNavigate('study')}
              className="text-cyan-400 hover:text-cyan-300 font-bold"
            >
              Jugar Repaso ⚔️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
