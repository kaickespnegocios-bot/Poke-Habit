import React from 'react';
import { SkillStats } from '../types';
import {
  Dumbbell,
  Brain,
  Utensils,
  Palette,
  Coins,
  Heart,
  Sparkles,
  Zap,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

interface SkillTreeProps {
  skillStats: SkillStats;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ skillStats }) => {
  const statsList = [
    {
      id: 'fitness',
      name: 'Fitness & Actividad Física',
      data: skillStats.fitness,
      icon: <Dumbbell className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-500 to-teal-400',
      bgLight: 'bg-emerald-950/20 border-emerald-500/40',
      source: 'Alimentado por pasos de Health Connect y tareas de Salud/Deporte.',
      perks: [
        'Nv. 2: +10% XP adicional al caminar',
        'Nv. 4: Huevos eclosionan 15% más rápido',
        'Nv. 6: Desbloqueo de encuentros con Pokémon tipo Lucha',
      ],
    },
    {
      id: 'intelligence',
      name: 'Intelligence & Estudio Académico',
      data: skillStats.intelligence,
      icon: <Brain className="w-6 h-6 text-pink-400" />,
      color: 'from-pink-500 to-rose-400',
      bgLight: 'bg-pink-950/20 border-pink-500/40',
      source: 'Alimentado por bloques Pomodoro de 3º ESO y victorias en Repaso de Flashcards.',
      perks: [
        'Nv. 2: +15% daño en Boss Battles de exámenes',
        'Nv. 4: Nuevas preguntas de combate desbloqueadas',
        'Nv. 6: Bonus de oro al aprobar exámenes con sobresaliente',
      ],
    },
    {
      id: 'cooking',
      name: 'Cooking & Nutrición del Hogar',
      data: skillStats.cooking,
      icon: <Utensils className="w-6 h-6 text-orange-400" />,
      color: 'from-orange-500 to-amber-400',
      bgLight: 'bg-orange-950/20 border-orange-500/40',
      source: 'Alimentado por tareas de cocina, preparar comidas y nutrición saludable.',
      perks: [
        'Nv. 2: Pociones curan +20% HP extra a tu equipo',
        'Nv. 4: Multiplicador de oro en tareas de cocina x1.3',
        'Nv. 6: Habilidad de preparar bayas curativas',
      ],
    },
    {
      id: 'creativity',
      name: 'Creativity & Expresión Artística',
      data: skillStats.creativity,
      icon: <Palette className="w-6 h-6 text-purple-400" />,
      color: 'from-purple-500 to-indigo-400',
      bgLight: 'bg-purple-950/20 border-purple-500/40',
      source: 'Alimentado por tareas de música, plástica, lectura y proyectos creativos.',
      perks: [
        'Nv. 2: Desbloquea avatares de entrenador exclusivos',
        'Nv. 4: Bonus de XP en asignaturas de Música y Plástica',
        'Nv. 6: Probabilidad de encontrar Pokémon shiny / raros aumentada',
      ],
    },
    {
      id: 'finance',
      name: 'Finance & Gestión Personal',
      data: skillStats.finance,
      icon: <Coins className="w-6 h-6 text-amber-400" />,
      color: 'from-amber-500 to-yellow-400',
      bgLight: 'bg-amber-950/20 border-amber-500/40',
      source: 'Alimentado por registrar ahorros, presupuesto y orden personal.',
      perks: [
        'Nv. 2: Descuento del 10% en toda la tienda PokéMart',
        'Nv. 4: +20% de Oro obtenido en todas las misiones',
        'Nv. 6: Acceso al Huevo Legendario Oculto',
      ],
    },
    {
      id: 'sexualHealth',
      name: 'Salud Sexual & Autocontrol',
      data: skillStats.sexualHealth,
      icon: <Heart className="w-6 h-6 text-rose-400" />,
      color: 'from-rose-500 to-pink-400',
      bgLight: 'bg-rose-950/20 border-rose-500/40',
      source: 'Alimentado por registros conscientes de intimidad, control y medidas corporales.',
      perks: [
        'Nv. 2: Mayor claridad mental y foco en Pomodoro (+10% XP)',
        'Nv. 4: Desbloqueo de temas visuales exclusivos para Entrenador',
        'Nv. 6: Medalla de Maestría en Autodisciplina & Bienestar',
      ],
    },
  ];

  const totalSkillLevels =
    skillStats.fitness.level +
    skillStats.intelligence.level +
    skillStats.cooking.level +
    skillStats.creativity.level +
    skillStats.finance.level +
    skillStats.sexualHealth.level;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-red-500" />
              Árbol de Habilidades (Stats de Vida Real)
            </h2>
            <span className="bg-red-600/20 text-red-300 font-black text-xs px-2.5 py-0.5 rounded-full border border-red-500/40">
              Nivel Total Acumulado: {totalSkillLevels}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tus acciones en el mundo real (caminar, estudiar, cocinar, ahorrar) suben los atributos de tu personaje y desbloquean ventajas permanentes en el juego.
          </p>
        </div>
      </div>

      {/* Grid of 5 Real Life Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {statsList.map((stat) => {
          const progressPercent = Math.min(
            100,
            Math.round((stat.data.xp / stat.data.maxXp) * 100)
          );

          return (
            <div
              key={stat.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 ${stat.bgLight}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-slate-800 rounded-2xl border border-slate-700 shadow">
                    {stat.icon}
                  </div>
                  <span className="text-xs font-black bg-slate-800 text-white px-3 py-1 rounded-full border border-slate-700">
                    Nivel {stat.data.level}
                  </span>
                </div>

                <h3 className="text-base font-black text-white">{stat.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{stat.source}</p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-400">Progreso al Nivel {stat.data.level + 1}:</span>
                    <span className="text-white">
                      {stat.data.xp} / {stat.data.maxXp} XP
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Perks List */}
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1.5 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Ventajas Desbloqueables:
                </span>
                {stat.perks.map((perk, i) => {
                  const requiredLvl = (i + 1) * 2;
                  const isUnlocked = stat.data.level >= requiredLvl;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 ${
                        isUnlocked ? 'text-emerald-300 font-bold' : 'text-slate-500'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          isUnlocked ? 'text-emerald-400' : 'text-slate-600'
                        }`}
                      />
                      <span>{perk}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
