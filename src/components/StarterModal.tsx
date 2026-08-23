import React, { useState } from 'react';
import { STARTERS, createStarterPartyPokemon } from '../data/starters';
import { PartyPokemon, TrainerProfile, PokemonType } from '../types';
import { POKEMON_TYPES } from '../data/pokemonTypes';
import {
  Sparkles,
  User,
  Check,
  ChevronRight,
  ChevronLeft,
  Shield,
  Palette,
  Award,
  Crown,
  Zap,
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface StarterModalProps {
  initialTrainer?: TrainerProfile;
  onComplete: (trainerUpdates: Partial<TrainerProfile>, starter: PartyPokemon) => void;
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
    name: 'Red (Rojo)',
    region: 'Kanto',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png',
    classTag: 'Campeón Legendario',
  },
  {
    id: 'leaf',
    name: 'Leaf (Hoja)',
    region: 'Kanto',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/leaf.png',
    classTag: 'Aventurera Clásica',
  },
  {
    id: 'blue',
    name: 'Blue (Azul)',
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
    name: 'Lyra / Lira',
    region: 'Johto',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/lyra.png',
    classTag: 'Criadora Pokémon',
  },
  {
    id: 'brendan',
    name: 'Brendan / Bruno',
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
    name: 'Lucas / León',
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
    name: 'Hilbert / Lucho',
    region: 'Teselia',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/hilbert.png',
    classTag: 'Héroe del Ideal',
  },
  {
    id: 'hilda',
    name: 'Hilda / Liza',
    region: 'Teselia',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/hilda.png',
    classTag: 'Heroína de la Verdad',
  },
  {
    id: 'ash',
    name: 'Ash Ketchum',
    region: 'Pueblo Paleta',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/ash.png',
    classTag: 'Maestro Mundial',
  },
];

const TRAINER_TITLES = [
  'Aspirante a Campeón',
  'Estudiante de 3º ESO',
  'Entrenador Guay',
  'Líder de Gimnasio',
  'Criador Pokémon',
  'Científico PokéQuest',
  'Maestro Pokémon',
  'Especialista Dragón',
];

const THEME_COLORS = [
  { name: 'Rojo Fuego', hex: '#ef4444' },
  { name: 'Azul Agua', hex: '#3b82f6' },
  { name: 'Verde Planta', hex: '#10b981' },
  { name: 'Ámbar Eléctrico', hex: '#f59e0b' },
  { name: 'Púrpura Psíquico', hex: '#8b5cf6' },
  { name: 'Rosa Hada', hex: '#ec4899' },
];

export const StarterModal: React.FC<StarterModalProps> = ({
  initialTrainer,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Username
  const [trainerName, setTrainerName] = useState<string>(
    initialTrainer?.name && initialTrainer.name !== 'Entrenador Red' ? initialTrainer.name : ''
  );
  const [nameError, setNameError] = useState<string>('');

  // Step 2: Character customization
  const [selectedAvatar, setSelectedAvatar] = useState<string>('red');
  const [selectedTitle, setSelectedTitle] = useState<string>('Estudiante de 3º ESO');
  const [favoriteType, setFavoriteType] = useState<PokemonType>('fire');
  const [themeColor, setThemeColor] = useState<string>('#ef4444');

  // Step 3: Starter Pokemon
  const [selectedPokemonId, setSelectedPokemonId] = useState<number>(4); // Charmander default

  const gen1Starters = STARTERS.filter((s) => s.generation === 1);
  const currentStarter = STARTERS.find((s) => s.pokemonId === selectedPokemonId) || STARTERS[0];
  const activeAvatarObj = TRAINER_AVATARS.find((a) => a.id === selectedAvatar) || TRAINER_AVATARS[0];

  // Validate Trainer Name (Alphanumeric and spaces only, 3-16 chars)
  const handleNameChange = (val: string) => {
    setTrainerName(val);
    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_ ]*$/;
    if (!regex.test(val)) {
      setNameError('Solo se permiten letras, números y espacios (sin símbolos especiales).');
    } else if (val.trim().length > 0 && val.trim().length < 3) {
      setNameError('El nombre debe tener al menos 3 caracteres.');
    } else if (val.trim().length > 16) {
      setNameError('Máximo 16 caracteres.');
    } else {
      setNameError('');
    }
  };

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = trainerName.trim();
    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_ ]+$/;

    if (!cleanName || cleanName.length < 3) {
      setNameError('Por favor introduce un nombre de al menos 3 caracteres.');
      soundFx.playCancel();
      return;
    }

    if (!regex.test(cleanName)) {
      setNameError('El nombre no puede contener caracteres especiales.');
      soundFx.playCancel();
      return;
    }

    setNameError('');
    soundFx.playLevelUp();
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    soundFx.playLevelUp();
    setStep(3);
  };

  const handleFinalConfirm = () => {
    soundFx.playVictory();
    confetti({ particleCount: 120, spread: 90 });

    const starterInstance = createStarterPartyPokemon(currentStarter);
    const trainerUpdates: Partial<TrainerProfile> = {
      name: trainerName.trim(),
      avatarSprite: activeAvatarObj.spriteUrl,
      trainerClass: selectedTitle,
      favoriteType: favoriteType,
      themeColor: themeColor,
    };

    onComplete(trainerUpdates, starterInstance);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-red-500 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl space-y-5 text-center animate-scaleUp my-auto">
        {/* Step Indicator Header */}
        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span
              className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center ${
                step >= 1 ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-500'
              }`}
            >
              1
            </span>
            <div className={`w-8 h-1 rounded-full ${step >= 2 ? 'bg-red-600' : 'bg-slate-800'}`} />
            <span
              className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center ${
                step >= 2 ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-500'
              }`}
            >
              2
            </span>
            <div className={`w-8 h-1 rounded-full ${step >= 3 ? 'bg-red-600' : 'bg-slate-800'}`} />
            <span
              className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center ${
                step >= 3 ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-500'
              }`}
            >
              3
            </span>
          </div>

          <span className="text-xs font-black uppercase text-red-400 tracking-wider">
            Paso {step} de 3
          </span>
        </div>

        {/* ======================= PASO 1: NOMBRE DE ENTRENADOR ======================= */}
        {step === 1 && (
          <form onSubmit={handleNextFromStep1} className="space-y-4 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-red-600/20 border-2 border-red-500/60 rounded-3xl mx-auto flex items-center justify-center text-red-400 shadow-inner">
              <User className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                ¡Bienvenido al Mundo de PokéQuest!
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 max-w-sm mx-auto">
                El Profesor Oak te da la bienvenida. Antes de comenzar tu viaje de hábitos y estudio, dinos:
                <strong className="text-white block mt-1">¿Cómo te llamas, joven Entrenador?</strong>
              </p>
            </div>

            <div className="max-w-sm mx-auto space-y-2">
              <input
                type="text"
                value={trainerName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej. Red, Satoshi, Alex..."
                maxLength={16}
                autoFocus
                className={`w-full text-center text-lg font-black bg-slate-950 border-2 rounded-2xl py-3 text-white focus:outline-none transition-all ${
                  nameError
                    ? 'border-red-500 ring-2 ring-red-500/30'
                    : trainerName.trim().length >= 3
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'border-slate-700 focus:border-red-500'
                }`}
              />

              {nameError ? (
                <p className="text-xs text-red-400 font-bold animate-bounce">{nameError}</p>
              ) : trainerName.trim().length >= 3 ? (
                <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Nombre de Entrenador válido
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Sin caracteres especiales • Mínimo 3 letras
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={trainerName.trim().length < 3 || !!nameError}
              className="w-full max-w-sm mx-auto py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-2xl shadow-xl cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Continuar a Personalizar Personaje</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ======================= PASO 2: PERSONALIZAR PERSONAJE ======================= */}
        {step === 2 && (
          <div className="space-y-4 text-left animate-fadeIn">
            <div className="text-center">
              <h2 className="text-xl font-black text-white">
                Personaliza a tu Entrenador: <span className="text-red-400">{trainerName}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Elige tu apariencia visual, sprite y clase de entrenador:
              </p>
            </div>

            {/* Avatar Sprites Selection */}
            <div>
              <label className="text-xs font-black uppercase text-slate-300 block mb-2">
                1. Selecciona tu Avatar Clásico:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto no-scrollbar p-1">
                {TRAINER_AVATARS.map((av) => {
                  const isSelected = av.id === selectedAvatar;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(av.id);
                        soundFx.playClick();
                      }}
                      className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-500 bg-red-950/40 ring-2 ring-red-500/50 scale-105 shadow-lg'
                          : 'border-slate-800 bg-slate-800/60 hover:bg-slate-800'
                      }`}
                    >
                      <img
                        src={av.spriteUrl}
                        alt={av.name}
                        className="w-12 h-12 object-contain pixelated drop-shadow"
                      />
                      <span className="text-[10px] font-bold text-white mt-1 truncate max-w-full">
                        {av.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title & Favorite Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-black uppercase text-slate-300 block mb-1">
                  2. Título de Entrenador:
                </label>
                <select
                  value={selectedTitle}
                  onChange={(e) => setSelectedTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-500"
                >
                  {TRAINER_TITLES.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-300 block mb-1">
                  3. Tipo Pokémon Preferido:
                </label>
                <select
                  value={favoriteType}
                  onChange={(e) => setFavoriteType(e.target.value as PokemonType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-500 capitalize"
                >
                  {(Object.keys(POKEMON_TYPES) as PokemonType[]).map((t) => (
                    <option key={t} value={t}>
                      {POKEMON_TYPES[t].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setStep(1);
                }}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Atrás
              </button>

              <button
                type="button"
                onClick={handleNextFromStep2}
                className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs rounded-xl shadow-xl cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <span>Siguiente: Elegir Pokémon Inicial</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================= PASO 3: ELEGIR POKÉMON INICIAL ======================= */}
        {step === 3 && (
          <div className="space-y-4 text-center animate-fadeIn">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                ¡Elige a tu Compañero Inicial!
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                {trainerName}, este Pokémon te acompañará en todas tus tareas, hábitos diarios y batallas de estudio:
              </p>
            </div>

            {/* Starter options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {gen1Starters.map((starter) => {
                const isSelected = starter.pokemonId === selectedPokemonId;
                const typeInfo = POKEMON_TYPES[starter.types[0]];

                return (
                  <div
                    key={starter.pokemonId}
                    onClick={() => {
                      setSelectedPokemonId(starter.pokemonId);
                      soundFx.playClick();
                    }}
                    className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between ${
                      isSelected
                        ? 'border-red-500 bg-slate-800 ring-2 ring-red-500/50 scale-105 shadow-xl'
                        : 'border-slate-800 bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-14 h-14 flex items-center justify-center">
                      <img
                        src={starter.officialArtwork}
                        alt={starter.name}
                        className="w-14 h-14 object-contain drop-shadow"
                      />
                    </div>
                    <h4 className="text-xs font-black text-white mt-1">{starter.name}</h4>
                    <span
                      className="text-[9px] font-black px-2 py-0.2 rounded-full uppercase mt-1"
                      style={{
                        backgroundColor: typeInfo.color,
                        color: typeInfo.textColor,
                      }}
                    >
                      {typeInfo.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Selected Starter Details */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 text-left space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {currentStarter.name} — Nivel 5
                </h3>
                <span className="text-[10px] text-slate-400">
                  Evoluciona a {currentStarter.evolutionTargetName} (Nv. {currentStarter.evolutionLevel})
                </span>
              </div>

              <p className="text-[11px] text-slate-300 italic">
                "{currentStarter.description}"
              </p>

              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-slate-400 font-bold">Movimientos:</span>
                {currentStarter.moves.map((m, i) => (
                  <span
                    key={i}
                    className="text-[9px] bg-slate-900 px-2 py-0.5 rounded text-white font-mono border border-slate-800"
                  >
                    {m.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Final Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setStep(2);
                }}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Atrás
              </button>

              <button
                type="button"
                onClick={handleFinalConfirm}
                className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-xl cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>¡Empezar Aventura con {currentStarter.name}! 🚀</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

