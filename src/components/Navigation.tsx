import React, { useState } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  GraduationCap,
  Users,
  Footprints,
  BookOpen,
  ShoppingBag,
  Trophy,
  GitBranch,
  Heart,
  Sparkles,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export type TabKey =
  | 'dashboard'
  | 'tasks'
  | 'study'
  | 'party'
  | 'pokemon_care'
  | 'daily'
  | 'pokedex'
  | 'shop'
  | 'achievements'
  | 'skills'
  | 'sexual_health';

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  pendingTasksCount: number;
  pendingHabitsCount: number;
  readyEvolutionsCount: number;
  hungryPokemonCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  pendingTasksCount,
  pendingHabitsCount,
  readyEvolutionsCount,
  hungryPokemonCount = 0,
}) => {
  const [showMoreModal, setShowMoreModal] = useState(false);

  const tabs: {
    id: TabKey;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    highlight?: boolean;
    category?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      category: 'Principal',
    },
    {
      id: 'tasks',
      label: 'Hábitos',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      category: 'Productividad',
    },
    {
      id: 'study',
      label: 'Estudios',
      icon: <GraduationCap className="w-4 h-4" />,
      category: 'Productividad',
    },
    {
      id: 'party',
      label: 'Equipo & PC',
      icon: <Users className="w-4 h-4" />,
      badge: readyEvolutionsCount > 0 ? readyEvolutionsCount : undefined,
      category: 'Pokémon',
    },
    {
      id: 'pokemon_care',
      label: 'Cuidados & Bayas',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      badge: hungryPokemonCount > 0 ? hungryPokemonCount : undefined,
      category: 'Pokémon',
    },
    {
      id: 'daily',
      label: 'Daily & Pasos',
      icon: <Footprints className="w-4 h-4" />,
      badge: pendingHabitsCount > 0 ? pendingHabitsCount : undefined,
      category: 'Salud',
    },
    {
      id: 'pokedex',
      label: 'Pokédex',
      icon: <BookOpen className="w-4 h-4" />,
      category: 'Pokémon',
    },
    {
      id: 'shop',
      label: 'Tienda & Semillas',
      icon: <ShoppingBag className="w-4 h-4" />,
      category: 'Pokémon',
    },
    {
      id: 'achievements',
      label: 'Legendarios',
      icon: <Trophy className="w-4 h-4" />,
      category: 'Logros',
    },
    {
      id: 'skills',
      label: 'Skill Tree',
      icon: <GitBranch className="w-4 h-4" />,
      category: 'Progreso',
    },
    {
      id: 'sexual_health',
      label: 'Salud Sexual',
      icon: <Heart className="w-4 h-4 text-rose-400" />,
      highlight: true,
      category: 'Privado',
    },
  ];

  const handleSelect = (tabId: TabKey) => {
    soundFx.playClick();
    onTabChange(tabId);
    setShowMoreModal(false);
  };

  // Primary mobile tabs
  const mobilePrimaryTabs: TabKey[] = ['dashboard', 'tasks', 'study', 'party', 'pokemon_care'];
  const isMoreActive = !mobilePrimaryTabs.includes(activeTab);

  return (
    <>
      {/* Desktop / Tablet Top Horizontal Scroll Tab Bar */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-[53px] z-30 shadow">
        <div className="max-w-7xl mx-auto px-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1 py-1.5 min-w-max">
            {tabs.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 touch-manipulation min-h-[40px] ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  } ${
                    t.highlight && !isActive
                      ? 'border border-emerald-500/40 text-emerald-300 bg-emerald-950/30'
                      : ''
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                  {t.badge !== undefined && (
                    <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-sm animate-pulse">
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Native-like Mobile Bottom Navigation Bar (Visible on mobile screens) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/98 border-t border-slate-800 backdrop-blur-lg px-2 py-1 flex items-center justify-around shadow-2xl safe-area-bottom">
        {/* Dashboard */}
        <button
          onClick={() => handleSelect('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer min-w-[56px] min-h-[48px] touch-manipulation ${
            activeTab === 'dashboard'
              ? 'text-red-500 font-black'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-0.5">Inicio</span>
        </button>

        {/* Tasks */}
        <button
          onClick={() => handleSelect('tasks')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer min-w-[56px] min-h-[48px] touch-manipulation ${
            activeTab === 'tasks'
              ? 'text-red-500 font-black'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <CheckSquare className={`w-5 h-5 ${activeTab === 'tasks' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-0.5">Tareas</span>
          {pendingTasksCount > 0 && (
            <span className="absolute top-1 right-2 bg-amber-400 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
              {pendingTasksCount}
            </span>
          )}
        </button>

        {/* Study */}
        <button
          onClick={() => handleSelect('study')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer min-w-[56px] min-h-[48px] touch-manipulation ${
            activeTab === 'study'
              ? 'text-red-500 font-black'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <GraduationCap className={`w-5 h-5 ${activeTab === 'study' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-0.5">Estudio</span>
        </button>

        {/* Party */}
        <button
          onClick={() => handleSelect('party')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer min-w-[56px] min-h-[48px] touch-manipulation ${
            activeTab === 'party'
              ? 'text-red-500 font-black'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <Users className={`w-5 h-5 ${activeTab === 'party' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-0.5">Equipo</span>
          {readyEvolutionsCount > 0 && (
            <span className="absolute top-1 right-2 bg-emerald-400 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow animate-bounce">
              ★
            </span>
          )}
        </button>

        {/* More Menu */}
        <button
          onClick={() => {
            soundFx.playClick();
            setShowMoreModal(true);
          }}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer min-w-[56px] min-h-[48px] touch-manipulation ${
            isMoreActive
              ? 'text-red-500 font-black'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <MoreHorizontal className={`w-5 h-5 ${isMoreActive ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-0.5">{isMoreActive ? 'Activo' : 'Más'}</span>
          {(pendingHabitsCount > 0) && (
            <span className="absolute top-1 right-2 w-2 h-2 bg-amber-400 rounded-full" />
          )}
        </button>
      </div>

      {/* Mobile "Más Secciones" Bottom Sheet Modal */}
      {showMoreModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:hidden animate-fadeIn">
          <div className="bg-slate-900 border-t-2 border-red-500 rounded-t-3xl w-full p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎒</span>
                <h3 className="font-black text-white text-base">Todas las Secciones</h3>
              </div>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowMoreModal(false);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of Sections */}
            <div className="grid grid-cols-2 gap-2.5">
              {tabs.map((t) => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelect(t.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer min-h-[52px] touch-manipulation ${
                      isActive
                        ? 'bg-red-600 border-red-500 text-white shadow-lg'
                        : 'bg-slate-800/80 border-slate-700/70 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl ${
                        isActive ? 'bg-white/20' : 'bg-slate-900 text-red-400'
                      }`}
                    >
                      {t.icon}
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-xs font-black truncate">{t.label}</p>
                      <p className="text-[10px] text-slate-400 truncate">{t.category}</p>
                    </div>
                    {t.badge !== undefined && (
                      <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                        {t.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
