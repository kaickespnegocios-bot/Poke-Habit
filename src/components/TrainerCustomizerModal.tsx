import React, { useState } from 'react';
import { TrainerProfile, PokemonType } from '../types';
import {
  Sparkles,
  Check,
  X,
  Palette,
  Award,
  Crown,
  Zap,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface TrainerCustomizerModalProps {
  trainer: TrainerProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<TrainerProfile>) => void;
}

interface AvatarOption {
  id: string;
  name: string;
  region: string;
  spriteUrl: string;
  classTag: string;
}

const TRAINER_AVATARS: AvatarOption[] = [
  {
    id: 'red',
    name: 'Red (Kanto)',
    region: 'Kanto',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png',
    classTag: 'Campeón Legendario',
  },
  {
    id: 'leaf',
    name: 'Leaf (Kanto)',
    region: 'Kanto',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/leaf.png',
    classTag: 'Aventurera Clásica',
  },
  {
    id: 'blue',
    name: 'Blue (Rival)',
    region: 'Kanto',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/blue.png',
    classTag: 'Líder de Gimnasio',
  },
  {
    id: 'ethan',
    name: 'Ethan / Gold',
    region: 'Johto',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/ethan.png',
    classTag: 'Campeón de Johto',
  },
  {
    id: 'lyra',
    name: 'Lyra / Kris',
    region: 'Johto',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/lyra.png',
    classTag: 'Criadora Pokémon',
  },
  {
    id: 'brendan',
    name: 'Brendan',
    region: 'Hoenn',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/brendan.png',
    classTag: 'Explorador Esmeralda',
  },
  {
    id: 'may',
    name: 'May / Aura',
    region: 'Hoenn',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/may.png',
    classTag: 'Coordinadora Estrella',
  },
  {
    id: 'lucas',
    name: 'Lucas',
    region: 'Sinnoh',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/lucas.png',
    classTag: 'Investigador Platino',
  },
  {
    id: 'dawn',
    name: 'Dawn / Maya',
    region: 'Sinnoh',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/dawn.png',
    classTag: 'Maestra de Concursos',
  },
  {
    id: 'hilbert',
    name: 'Hilbert / Touya',
    region: 'Teselia',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/hilbert.png',
    classTag: 'Héroe del Ideal',
  },
  {
    id: 'hilda',
    name: 'Hilda / Touko',
    region: 'Teselia',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/hilda.png',
    classTag: 'Heroína de la Verdad',
  },
  {
    id: 'calem',
    name: 'Calem',
    region: 'Kalos',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/calem.png',
    classTag: 'Especialista Mega-Evolución',
  },
  {
    id: 'serena',
    name: 'Serena',
    region: 'Kalos',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/serena.png',
    classTag: 'Reina del Escenario',
  },
  {
    id: 'ash',
    name: 'Ash Ketchum (Kanto)',
    region: 'Anime / Pueblo Paleta',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/ash.png',
    classTag: 'Maestro Mundial',
  },
];

const TRAINER_CLASSES = [
  'Aspirante a Campeón',
  'Entrenador Guay',
  'Estudiante de 3º ESO',
  'Líder de Gimnasio',
  'Criador Pokémon',
  'Científico PokéQuest',
  'Nadador / Fitness',
  'Especialista Dragón',
  'As de la Estrategia',
];

const THEME_COLORS = [
  { name: 'Rojo Carmesí (Kanto)', hex: '#ef4444' },
  { name: 'Azul Agua (Johto)', hex: '#3b82f6' },
  { name: 'Verde Hoja (Hoenn)', hex: '#10b981' },
  { name: 'Ámbar Trueno (Teselia)', hex: '#f59e0b' },
  { name: 'Púrpura Psíquico (Sinnoh)', hex: '#8b5cf6' },
  { name: 'Rosa Hada (Kalos)', hex: '#ec4899' },
  { name: 'Oscuro Sombra (Galar)', hex: '#1e293b' },
];

export const TrainerCustomizerModal: React.FC<TrainerCustomizerModalProps> = ({
  trainer,
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(trainer.avatarSprite);
  const [selectedClass, setSelectedClass] = useState(trainer.trainerTitle || 'Aspirante a Campeón');
  const [selectedName, setSelectedName] = useState(trainer.name);
  const [selectedColor, setSelectedColor] = useState(trainer.themeColor || '#ef4444');

  if (!isOpen) return null;

  const handleSave = () => {
    soundFx.playLevelUp();
    onSave({
      avatarSprite: selectedAvatar,
      trainerTitle: selectedClass,
      name: selectedName.trim() || trainer.name,
      themeColor: selectedColor,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border-2 border-red-500 rounded-3xl w-full max-w-xl shadow-2xl text-white overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-rose-600 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-white/20 rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            </span>
            <div>
              <h3 className="font-black text-lg text-white">Personalizar Entrenador</h3>
              <p className="text-xs text-red-100">Elige tu sprite, clase y estilo único</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playCancel();
              onClose();
            }}
            className="p-1.5 bg-black/20 hover:bg-black/40 rounded-xl text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Live Preview Card */}
          <div className="bg-slate-800/80 border-2 border-slate-700 rounded-2xl p-4 flex items-center gap-4 shadow-inner">
            <div
              className="relative w-16 h-16 rounded-2xl border-2 p-1.5 flex items-center justify-center shadow-lg transition-colors"
              style={{ borderColor: selectedColor, backgroundColor: `${selectedColor}20` }}
            >
              <img
                src={selectedAvatar}
                alt="Avatar Preview"
                className="w-12 h-12 object-contain pixelated"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-black text-white text-base truncate">{selectedName}</h4>
                <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  Nv. {trainer.level}
                </span>
              </div>
              <p className="text-xs font-semibold text-amber-400 mt-0.5 flex items-center gap-1">
                <Crown className="w-3 h-3" /> {selectedClass}
              </p>
              <p className="text-[10px] text-slate-400">
                🔥 Racha: {trainer.dailyStreak} días • 🪙 {trainer.gold} ₽
              </p>
            </div>
          </div>

          {/* Trainer Name Input */}
          <div>
            <label className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-1.5">
              Nombre de tu Entrenador:
            </label>
            <input
              type="text"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              maxLength={22}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Select Avatar Grid */}
          <div>
            <label className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-2">
              Seleccionar Sprite de Entrenador:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto no-scrollbar pr-1">
              {TRAINER_AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.spriteUrl;
                return (
                  <button
                    key={av.id}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedAvatar(av.spriteUrl);
                    }}
                    className={`p-2.5 rounded-2xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-red-600/30 border-red-500 ring-2 ring-red-500/50 shadow-md'
                        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <img
                      src={av.spriteUrl}
                      alt={av.name}
                      className="w-10 h-10 object-contain pixelated bg-slate-900/80 rounded-xl p-1 border border-slate-700 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-white truncate leading-tight">
                        {av.name}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">{av.classTag}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Title / Class */}
          <div>
            <label className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-2">
              Clase de Entrenador / Título Honorífico:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TRAINER_CLASSES.map((tc) => {
                const isSel = selectedClass === tc;
                return (
                  <button
                    key={tc}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedClass(tc);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSel
                        ? 'bg-amber-400 text-slate-950 shadow font-black scale-105'
                        : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {tc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Color */}
          <div>
            <label className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-2">
              Color de Acento de la Tarjeta:
            </label>
            <div className="flex flex-wrap gap-2">
              {THEME_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedColor(c.hex);
                  }}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 ${
                    selectedColor === c.hex
                      ? 'scale-125 border-white ring-2 ring-white/50 shadow'
                      : 'border-transparent hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex gap-2.5">
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-transform"
          >
            <Check className="w-4 h-4" /> Guardar Personalización
          </button>
          <button
            onClick={() => {
              soundFx.playCancel();
              onClose();
            }}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm rounded-2xl cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
