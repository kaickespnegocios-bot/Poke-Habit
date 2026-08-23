import React, { useState } from 'react';
import { PartyPokemon, PokemonType, Task, TaskCategory, TaskDifficulty } from '../types';
import { CATEGORY_MAPPINGS, POKEMON_TYPES } from '../data/pokemonTypes';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Zap,
  Filter,
  Flame,
  X,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface TasksQuestsProps {
  tasks: Task[];
  party: PartyPokemon[];
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onDeleteTask: (id: string) => void;
  onCompleteTaskWithReward: (task: Task, targetPokemonId: string | 'all') => void;
}

export const TasksQuests: React.FC<TasksQuestsProps> = ({
  tasks,
  party,
  onAddTask,
  onDeleteTask,
  onCompleteTaskWithReward,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('pending');
  const [showAddModal, setShowAddModal] = useState(false);
  const [completeModalTask, setCompleteModalTask] = useState<Task | null>(null);
  const [selectedPartyTarget, setSelectedPartyTarget] = useState<string>('all');

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('hogar_ordenar');
  const [newDifficulty, setNewDifficulty] = useState<TaskDifficulty>('media');

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'pending' && t.completed) return false;
    if (filterStatus === 'completed' && !t.completed) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  const getDifficultyRewards = (diff: TaskDifficulty) => {
    switch (diff) {
      case 'facil':
        return { xp: 30, gold: 15 };
      case 'media':
        return { xp: 70, gold: 35 };
      case 'dificil':
        return { xp: 150, gold: 80 };
      case 'legendaria':
        return { xp: 350, gold: 200 };
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const mapping = CATEGORY_MAPPINGS[newCategory];
    const rewards = getDifficultyRewards(newDifficulty);

    onAddTask({
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      category: newCategory,
      pokemonType: mapping.defaultType,
      difficulty: newDifficulty,
      xpReward: rewards.xp,
      goldReward: rewards.gold,
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
    soundFx.playClick();
  };

  const hasMatchingTypeBonus = (taskType: PokemonType) => {
    return party.some((p) => p.types.includes(taskType));
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header & Stats Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white">Hábitos & Misiones Diarias</h2>
            <span className="bg-red-600/30 text-red-300 font-black text-xs px-2.5 py-0.5 rounded-full border border-red-500/40">
              {tasks.filter((t) => !t.completed).length} Pendientes
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gana XP para tus Pokémon y Oro del juego. Si el tipo del hábito o tarea coincide con tus Pokémon activos, ¡obtienes <strong>+50% de XP bonus</strong>!
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nuevo Hábito / Tarea
        </button>
      </div>

      {/* Filter Tabs & Categories */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        {/* Status toggles */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/60 text-xs font-bold">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'pending' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pendientes ({tasks.filter((t) => !t.completed).length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'completed' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Completadas ({tasks.filter((t) => t.completed).length})
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'all' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas
          </button>
        </div>

        {/* Category dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-red-500"
          >
            <option value="all">Todas las categorías</option>
            {Object.values(CATEGORY_MAPPINGS).map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredTasks.map((task) => {
          const typeInfo = POKEMON_TYPES[task.pokemonType];
          const hasBonus = hasMatchingTypeBonus(task.pokemonType);
          const finalXp = hasBonus ? Math.round(task.xpReward * 1.5) : task.xpReward;

          return (
            <div
              key={task.id}
              className={`bg-slate-900 border rounded-2xl p-4 shadow-md flex flex-col justify-between transition-all ${
                task.completed
                  ? 'border-slate-800/60 opacity-60'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Badges row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{
                        backgroundColor: typeInfo?.color || '#888',
                        color: typeInfo?.textColor || '#fff',
                      }}
                    >
                      Tipo {typeInfo?.label || task.pokemonType}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        task.difficulty === 'legendaria'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : task.difficulty === 'dificil'
                          ? 'bg-purple-500/20 text-purple-300'
                          : task.difficulty === 'media'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {task.difficulty}
                    </span>
                    {hasBonus && !task.completed && (
                      <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shadow">
                        <Zap className="w-2.5 h-2.5" /> +50% XP Bonus
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    title="Eliminar tarea"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3
                  className={`text-base font-bold text-white leading-snug ${
                    task.completed ? 'line-through text-slate-400' : ''
                  }`}
                >
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Reward & Complete Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-xs font-black">
                  <span className="text-cyan-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    +{finalXp} XP {hasBonus && <span className="text-[10px] text-amber-300">(Bonus!)</span>}
                  </span>
                  <span className="text-amber-300">+{task.goldReward} ₽</span>
                </div>

                {!task.completed ? (
                  <button
                    onClick={() => {
                      setCompleteModalTask(task);
                      soundFx.playClick();
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completar
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Realizada
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="col-span-2 text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            ✨ No hay tareas en esta vista. ¡Pulsa "Nueva Tarea" para crear misiones!
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-500" />
                Crear Nueva Misión del Hogar
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Nombre de la Tarea / Misión
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Fregar sartenes y limpiar encimera"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detalles adicionales o instrucciones..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-red-500 font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Categoría del Hogar
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-red-500"
                  >
                    {Object.values(CATEGORY_MAPPINGS).map((cat) => (
                      <option key={cat.category} value={cat.category}>
                        {cat.name} ({POKEMON_TYPES[cat.defaultType].label})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Dificultad
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as TaskDifficulty)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-red-500"
                  >
                    <option value="facil">Fácil (+30 XP, +15 ₽)</option>
                    <option value="media">Media (+70 XP, +35 ₽)</option>
                    <option value="dificil">Difícil (+150 XP, +80 ₽)</option>
                    <option value="legendaria">Legendaria (+350 XP, +200 ₽)</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-1">
                <p>
                  🔥 Tipo asignado: <strong className="text-red-400">{POKEMON_TYPES[CATEGORY_MAPPINGS[newCategory].defaultType].label}</strong>.
                </p>
                <p className="text-[11px] text-slate-400">
                  {CATEGORY_MAPPINGS[newCategory].description}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Crear Misión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Task XP Allocation Modal */}
      {completeModalTask && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="text-center">
              <span className="text-3xl">🎉</span>
              <h3 className="text-lg font-black text-white mt-1">¡Misión Completada!</h3>
              <p className="text-xs text-slate-300 font-semibold">{completeModalTask.title}</p>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Oro obtenido:</span>
                <span className="font-black text-amber-300">+{completeModalTask.goldReward} ₽</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">XP a repartir:</span>
                <span className="font-black text-cyan-300">
                  +{hasMatchingTypeBonus(completeModalTask.pokemonType)
                    ? Math.round(completeModalTask.xpReward * 1.5)
                    : completeModalTask.xpReward}{' '}
                  XP
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                ¿A qué Pokémon asignar el XP?
              </label>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                <label className="flex items-center gap-2.5 p-2 bg-slate-800 rounded-xl border border-slate-700 cursor-pointer hover:border-red-500 transition-colors">
                  <input
                    type="radio"
                    name="xp_target"
                    value="all"
                    checked={selectedPartyTarget === 'all'}
                    onChange={() => setSelectedPartyTarget('all')}
                    className="accent-red-600"
                  />
                  <div className="text-xs">
                    <strong className="text-white">Reparto equitativo</strong>
                    <p className="text-[10px] text-slate-400">Dividir XP entre los {party.length} miembros activos</p>
                  </div>
                </label>

                {party.map((pkmn) => (
                  <label
                    key={pkmn.id}
                    className="flex items-center gap-2.5 p-2 bg-slate-800 rounded-xl border border-slate-700 cursor-pointer hover:border-red-500 transition-colors"
                  >
                    <input
                      type="radio"
                      name="xp_target"
                      value={pkmn.id}
                      checked={selectedPartyTarget === pkmn.id}
                      onChange={() => setSelectedPartyTarget(pkmn.id)}
                      className="accent-red-600"
                    />
                    <img src={pkmn.sprite} alt={pkmn.name} className="w-8 h-8 object-contain pixelated" />
                    <div className="text-xs">
                      <strong className="text-white">{pkmn.nickname || pkmn.name}</strong>
                      <p className="text-[10px] text-slate-400">
                        Nivel {pkmn.level} • {pkmn.currentXp}/{pkmn.maxXp} XP
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCompleteModalTask(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (completeModalTask) {
                    onCompleteTaskWithReward(completeModalTask, selectedPartyTarget);
                    setCompleteModalTask(null);
                  }
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
              >
                Recibir Recompensas ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
