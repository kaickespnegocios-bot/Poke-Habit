import React, { useState, useEffect } from 'react';
import {
  PartyPokemon,
  BerryPlot,
  BerryGardenState,
  BerryId,
  PokemonMood,
  TrainerProfile,
} from '../types';
import {
  Sparkles,
  Heart,
  Utensils,
  Bath,
  Moon,
  Smile,
  Frown,
  Meh,
  Award,
  Plus,
  Droplets,
  Sprout,
  Sun,
  Timer,
  ShoppingBag,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface PokemonCareTabProps {
  party: PartyPokemon[];
  garden: BerryGardenState;
  trainer: TrainerProfile;
  inventory: { [itemId: string]: number };
  onFeedPokemon: (pokemonId: string, berryId: BerryId) => void;
  onCleanPokemon: (pokemonId: string) => void;
  onPlayWithPokemon: (pokemonId: string) => void;
  onRestPokemon: (pokemonId: string) => void;
  onPetPokemon: (pokemonId: string) => void;
  onPlantBerry: (plotId: number, berryType: BerryId) => void;
  onWaterBerry: (plotId: number) => void;
  onHarvestBerry: (plotId: number) => void;
  onOpenShopForSeeds: () => void;
}

const BERRY_INFO: Record<BerryId, { name: string; icon: string; desc: string; color: string; seedId: string }> = {
  oran: { name: 'Baya Aranja', icon: '🫐', desc: '+25 Hambre, +15 Felicidad, Cura 20 HP', color: '#3b82f6', seedId: 'seed_oran' },
  cheri: { name: 'Baya Zreza', icon: '🍒', desc: '+20 Hambre, +25 Energía, +15 Felicidad', color: '#ef4444', seedId: 'seed_cheri' },
  pecha: { name: 'Baya Meloc', icon: '🍑', desc: '+30 Hambre, +20 Limpieza, +15 Felicidad', color: '#f43f5e', seedId: 'seed_pecha' },
  rawst: { name: 'Baya Safre', icon: '🫐', desc: '+20 Hambre, +30 Energía, Refrescante', color: '#06b6d4', seedId: 'seed_rawst' },
  razz: { name: 'Baya Frambu', icon: '🍓', desc: '+15 Hambre, +40 Felicidad, +20 Afecto', color: '#ec4899', seedId: 'seed_razz' },
  nanab: { name: 'Baya Latano', icon: '🍌', desc: '+25 Hambre, +25 Felicidad, Calmante', color: '#eab308', seedId: 'seed_nanab' },
};

const MOOD_EMOJIS: Record<PokemonMood, { label: string; emoji: string; color: string }> = {
  ecstatic: { label: '¡Radiante & Éuforico!', emoji: '🌟', color: 'text-amber-300' },
  happy: { label: 'Muy Feliz', emoji: '😊', color: 'text-emerald-400' },
  content: { label: 'Tranquilo', emoji: '🙂', color: 'text-blue-300' },
  hungry: { label: 'Hambriento', emoji: '🍖', color: 'text-orange-400' },
  tired: { label: 'Cansado', emoji: '🥱', color: 'text-indigo-300' },
  sad: { label: 'Triste / Descuidado', emoji: '😢', color: 'text-purple-300' },
  grumpy: { label: 'Gruñón', emoji: '😠', color: 'text-rose-400' },
};

export const PokemonCareTab: React.FC<PokemonCareTabProps> = ({
  party,
  garden,
  trainer,
  inventory,
  onFeedPokemon,
  onCleanPokemon,
  onPlayWithPokemon,
  onRestPokemon,
  onPetPokemon,
  onPlantBerry,
  onWaterBerry,
  onHarvestBerry,
  onOpenShopForSeeds,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'camp' | 'garden'>('camp');
  const [selectedPokemonId, setSelectedPokemonId] = useState<string>(party[0]?.id || '');
  const [showFeedModal, setShowFeedModal] = useState<boolean>(false);
  const [selectedPlotForPlanting, setSelectedPlotForPlanting] = useState<number | null>(null);
  const [interactionAnimation, setInteractionAnimation] = useState<string | null>(null);

  // Sync selected pokemon if party changes
  useEffect(() => {
    if (!party.some((p) => p.id === selectedPokemonId) && party.length > 0) {
      setSelectedPokemonId(party[0].id);
    }
  }, [party, selectedPokemonId]);

  const activePokemon = party.find((p) => p.id === selectedPokemonId) || party[0];

  const triggerAnimation = (text: string) => {
    setInteractionAnimation(text);
    setTimeout(() => setInteractionAnimation(null), 2000);
  };

  const handleFeed = (berryId: BerryId) => {
    if (!activePokemon) return;
    onFeedPokemon(activePokemon.id, berryId);
    soundFx.playSuperEffective();
    confetti({ particleCount: 30, spread: 50 });
    triggerAnimation(`¡${activePokemon.name} ha disfrutado la ${BERRY_INFO[berryId].name}! 🍓✨`);
    setShowFeedModal(false);
  };

  const handleClean = () => {
    if (!activePokemon) return;
    onCleanPokemon(activePokemon.id);
    soundFx.playLevelUp();
    triggerAnimation(`¡Has bañado y cepillado a ${activePokemon.name}! 🧼🫧`);
  };

  const handlePlay = () => {
    if (!activePokemon) return;
    onPlayWithPokemon(activePokemon.id);
    soundFx.playCaught();
    confetti({ particleCount: 35, spread: 60 });
    triggerAnimation(`¡Jugaste a la pelota con ${activePokemon.name}! 🎾💖`);
  };

  const handleRest = () => {
    if (!activePokemon) return;
    onRestPokemon(activePokemon.id);
    soundFx.playToggle();
    triggerAnimation(`¡${activePokemon.name} está descansando plácidamente! 💤✨`);
  };

  const handlePet = () => {
    if (!activePokemon) return;
    onPetPokemon(activePokemon.id);
    soundFx.playClick();
    confetti({ particleCount: 20, spread: 40 });
    triggerAnimation(`¡Acariciaste a ${activePokemon.name}! ¡Te tiene mucho cariño! ❤️`);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              Campamento Pokémon & Huerto de Bayas
            </h2>
            <span className="bg-emerald-500/20 text-emerald-300 font-black text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              {party.length} Compañeros
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cuida las necesidades de tu equipo Pokémon (hambre, felicidad, limpieza, energía) y cultiva bayas frescas en tu huerto para alimentarlos.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/60 text-xs font-bold shrink-0">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveSubTab('camp');
            }}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'camp' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Cuidados & Campamento
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveSubTab('garden');
            }}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'garden' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            Huerto de Bayas ({garden.plots.filter((p) => p.state === 'ready').length} listas)
          </button>
        </div>
      </div>

      {/* Floating Interaction Feedback Banner */}
      {interactionAnimation && (
        <div className="bg-emerald-950/90 border-2 border-emerald-500 text-emerald-200 px-4 py-2.5 rounded-2xl text-center text-xs font-black shadow-2xl animate-bounce">
          {interactionAnimation}
        </div>
      )}

      {/* ===================== SUBTAB 1: CAMPAMENTO & CUIDADOS ===================== */}
      {activeSubTab === 'camp' && (
        <div className="space-y-6">
          {/* Pokemon Selector Strip */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-md">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
              Selecciona el Pokémon a cuidar:
            </p>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {party.map((pokemon) => {
                const isSelected = pokemon.id === (activePokemon?.id || '');
                const moodInfo = MOOD_EMOJIS[pokemon.mood || 'happy'];
                const avgNeeds = Math.round(
                  ((pokemon.hunger ?? 85) +
                    (pokemon.happiness ?? 85) +
                    (pokemon.cleanliness ?? 85) +
                    (pokemon.energy ?? 85)) /
                    4
                );

                return (
                  <button
                    key={pokemon.id}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedPokemonId(pokemon.id);
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all cursor-pointer min-w-[170px] text-left shrink-0 ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 shadow-lg shadow-emerald-900/40'
                        : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={pokemon.sprite}
                        alt={pokemon.name}
                        className="w-12 h-12 object-contain pixelated drop-shadow"
                      />
                      <span className="absolute -top-1 -right-1 text-xs">{moodInfo.emoji}</span>
                    </div>
                    <div className="overflow-hidden min-w-0">
                      <h4 className="text-xs font-black text-white truncate">{pokemon.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">Nv. {pokemon.level}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-12 bg-slate-950 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full rounded-full"
                            style={{ width: `${avgNeeds}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-emerald-400">{avgNeeds}%</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Pokemon Stage & Controls */}
          {activePokemon ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive Pokemon Playpen */}
              <div className="lg:col-span-6 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-between text-center relative overflow-hidden">
                {/* Mood Tag */}
                <div className="w-full flex items-center justify-between z-10">
                  <span className="text-xs font-black px-3 py-1 bg-slate-800/90 rounded-full border border-slate-700 text-white flex items-center gap-1.5">
                    <span>{MOOD_EMOJIS[activePokemon.mood || 'happy'].emoji}</span>
                    <span>{MOOD_EMOJIS[activePokemon.mood || 'happy'].label}</span>
                  </span>

                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    Afecto: {activePokemon.affection ?? 80}/100
                  </span>
                </div>

                {/* Center Mascot with bounce & heart particle triggers */}
                <div className="my-8 relative group">
                  <div className="w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl absolute inset-0 -z-0" />
                  <img
                    src={activePokemon.sprite}
                    alt={activePokemon.name}
                    onClick={handlePet}
                    className="w-44 h-44 object-contain pixelated drop-shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300 cursor-pointer z-10 animate-pulse-slow"
                    title="¡Haz clic para acariciar a tu Pokémon!"
                  />
                  <p className="text-[11px] font-bold text-slate-400 mt-2 flex items-center justify-center gap-1">
                    👆 Haz clic para acariciar
                  </p>
                </div>

                {/* Interactive Action Buttons Bar */}
                <div className="w-full grid grid-cols-4 gap-2 z-10">
                  <button
                    onClick={() => setShowFeedModal(true)}
                    className="flex flex-col items-center justify-center gap-1 bg-slate-800/90 hover:bg-emerald-600 hover:text-white p-2.5 rounded-2xl border border-slate-700 transition-all cursor-pointer shadow active:scale-95 group"
                  >
                    <Utensils className="w-5 h-5 text-orange-400 group-hover:text-white" />
                    <span className="text-[11px] font-black">Alimentar</span>
                  </button>

                  <button
                    onClick={handleClean}
                    className="flex flex-col items-center justify-center gap-1 bg-slate-800/90 hover:bg-blue-600 hover:text-white p-2.5 rounded-2xl border border-slate-700 transition-all cursor-pointer shadow active:scale-95 group"
                  >
                    <Bath className="w-5 h-5 text-blue-400 group-hover:text-white" />
                    <span className="text-[11px] font-black">Bañar</span>
                  </button>

                  <button
                    onClick={handlePlay}
                    className="flex flex-col items-center justify-center gap-1 bg-slate-800/90 hover:bg-pink-600 hover:text-white p-2.5 rounded-2xl border border-slate-700 transition-all cursor-pointer shadow active:scale-95 group"
                  >
                    <Heart className="w-5 h-5 text-pink-400 group-hover:text-white" />
                    <span className="text-[11px] font-black">Jugar</span>
                  </button>

                  <button
                    onClick={handleRest}
                    className="flex flex-col items-center justify-center gap-1 bg-slate-800/90 hover:bg-indigo-600 hover:text-white p-2.5 rounded-2xl border border-slate-700 transition-all cursor-pointer shadow active:scale-95 group"
                  >
                    <Moon className="w-5 h-5 text-indigo-400 group-hover:text-white" />
                    <span className="text-[11px] font-black">Descansar</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Needs Metrics & Health Cards */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-base font-black text-white flex items-center justify-between">
                      <span>Estado y Necesidades de {activePokemon.name}</span>
                      <span className="text-xs font-mono text-emerald-400">Nv. {activePokemon.level}</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Mantén las 4 barras altas para que tu Pokémon gane <strong>+50% de XP</strong> en batallas y tareas.
                    </p>
                  </div>

                  {/* Need 1: Hunger */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-orange-400" /> Hambre / Saciedad
                      </span>
                      <span className={activePokemon.hunger && activePokemon.hunger > 40 ? 'text-orange-400' : 'text-red-400 font-black'}>
                        {activePokemon.hunger ?? 80} / 100
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-orange-600 to-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${activePokemon.hunger ?? 80}%` }}
                      />
                    </div>
                  </div>

                  {/* Need 2: Happiness */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-pink-400" /> Felicidad & Ánimo
                      </span>
                      <span className="text-pink-400">
                        {activePokemon.happiness ?? 85} / 100
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-pink-600 to-rose-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${activePokemon.happiness ?? 85}%` }}
                      />
                    </div>
                  </div>

                  {/* Need 3: Cleanliness */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Bath className="w-3.5 h-3.5 text-blue-400" /> Limpieza & Aseo
                      </span>
                      <span className="text-blue-400">
                        {activePokemon.cleanliness ?? 90} / 100
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${activePokemon.cleanliness ?? 90}%` }}
                      />
                    </div>
                  </div>

                  {/* Need 4: Energy */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5 text-indigo-400" /> Energía & Vitalidad
                      </span>
                      <span className="text-indigo-400">
                        {activePokemon.energy ?? 80} / 100
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-indigo-600 to-violet-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${activePokemon.energy ?? 80}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Berry Stock Summary */}
                  <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-white flex items-center gap-1">
                        🍓 Despensa de Bayas Cosechadas:
                      </h4>
                      <p className="text-[10px] text-slate-400">Listas para alimentarlos</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {(Object.keys(BERRY_INFO) as BerryId[]).map((bid) => {
                        const count = garden.inventory[bid] || 0;
                        return (
                          <span
                            key={bid}
                            className={`px-2 py-0.5 rounded-lg text-xs font-bold border flex items-center gap-1 ${
                              count > 0
                                ? 'bg-slate-800 border-slate-700 text-white'
                                : 'bg-slate-900/50 border-slate-800 text-slate-600'
                            }`}
                            title={`${BERRY_INFO[bid].name}: ${count}`}
                          >
                            <span>{BERRY_INFO[bid].icon}</span>
                            <span className="font-mono text-[10px]">{count}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ===================== SUBTAB 2: HUERTO DE BAYAS ===================== */}
      {activeSubTab === 'garden' && (
        <div className="space-y-6">
          {/* Garden Controls & Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-400" />
                Parcelas de Cultivo Pokémon (6 Parcelas)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Planta semillas compradas en el PokéMart, riégalas para acelerar su crecimiento y cosecha bayas para alimentar y mimar a tus Pokémon.
              </p>
            </div>

            <button
              onClick={onOpenShopForSeeds}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              Comprar Semillas en PokéMart
            </button>
          </div>

          {/* Berry Plots Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {garden.plots.map((plot) => {
              const berry = plot.berryType ? BERRY_INFO[plot.berryType] : null;
              const isReady = plot.state === 'ready';
              const isGrowing = plot.state === 'growing' || plot.state === 'sprout';
              const isWatered = plot.isWatered;

              return (
                <div
                  key={plot.id}
                  className={`bg-slate-900 border rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all ${
                    isReady
                      ? 'border-emerald-500/80 bg-emerald-950/20 shadow-emerald-900/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Top Plot Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                        Parcela #{plot.id}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                          plot.state === 'ready'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                            : plot.state === 'empty'
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {plot.state === 'empty'
                          ? 'Tierra Lista'
                          : plot.state === 'ready'
                          ? '¡Lista para cosechar!'
                          : 'Creciendo'}
                      </span>
                    </div>

                    {/* Visual Soil & Plant */}
                    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 text-center my-2 flex flex-col items-center justify-center min-h-[130px]">
                      {plot.state === 'empty' ? (
                        <div className="text-slate-600">
                          <span className="text-4xl block mb-1">🟫</span>
                          <span className="text-xs font-bold text-slate-400">Parcela Vacía</span>
                        </div>
                      ) : plot.state === 'ready' ? (
                        <div className="animate-bounce">
                          <span className="text-5xl block mb-1">{berry?.icon || '🍓'}</span>
                          <span className="text-xs font-black text-emerald-300">{berry?.name} Madura</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-4xl block mb-1">{isWatered ? '🌱' : '🌿'}</span>
                          <span className="text-xs font-bold text-amber-300">
                            {berry?.name || 'Baya'} (Creciendo)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Water Status */}
                    {plot.state !== 'empty' && (
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
                        <span className="flex items-center gap-1 font-bold">
                          <Droplets className={`w-3.5 h-3.5 ${isWatered ? 'text-cyan-400' : 'text-slate-500'}`} />
                          {isWatered ? 'Regada (Crecimiento x2)' : 'Seca (Riega para acelerar)'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-800">
                    {plot.state === 'empty' ? (
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedPlotForPlanting(plot.id);
                        }}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Sprout className="w-4 h-4" /> Sembrar Baya
                      </button>
                    ) : plot.state === 'ready' ? (
                      <button
                        onClick={() => {
                          onHarvestBerry(plot.id);
                          soundFx.playLevelUp();
                          confetti({ particleCount: 50, spread: 60 });
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center justify-center gap-1.5 animate-pulse"
                      >
                        <Sparkles className="w-4 h-4" /> Cosechar Bayas Frescas ✨
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onWaterBerry(plot.id);
                          soundFx.playClick();
                        }}
                        disabled={isWatered}
                        className={`w-full py-2 font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition-all ${
                          isWatered
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer'
                        }`}
                      >
                        <Droplets className="w-4 h-4" />
                        {isWatered ? '¡Tierra Húmeda!' : 'Regar con Regadera'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== MODAL: FEED POKEMON ===================== */}
      {showFeedModal && activePokemon && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-orange-400" />
                Alimentar a {activePokemon.name}
              </h3>
              <button
                onClick={() => setShowFeedModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Selecciona una baya de tu despensa para alimentar a tu Pokémon y subir su energía y felicidad:
            </p>

            <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto no-scrollbar">
              {(Object.keys(BERRY_INFO) as BerryId[]).map((bid) => {
                const b = BERRY_INFO[bid];
                const count = garden.inventory[bid] || 0;

                return (
                  <button
                    key={bid}
                    onClick={() => handleFeed(bid)}
                    disabled={count <= 0}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      count > 0
                        ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 cursor-pointer text-white'
                        : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{b.icon}</span>
                      <div>
                        <h4 className="text-xs font-black">{b.name}</h4>
                        <p className="text-[10px] text-slate-400">{b.desc}</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                      x{count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
              <span className="text-slate-400">¿Sin bayas?</span>
              <button
                onClick={() => {
                  setShowFeedModal(false);
                  setActiveSubTab('garden');
                }}
                className="text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Ir al Huerto a cultivar 🌱
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: PLANT BERRY ===================== */}
      {selectedPlotForPlanting !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-400" />
                Sembrar en Parcela #{selectedPlotForPlanting}
              </h3>
              <button
                onClick={() => setSelectedPlotForPlanting(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Elige qué semilla plantar en esta parcela fértil:
            </p>

            <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto no-scrollbar">
              {(Object.keys(BERRY_INFO) as BerryId[]).map((bid) => {
                const b = BERRY_INFO[bid];
                const seedQty = inventory[b.seedId] || 0;

                return (
                  <button
                    key={bid}
                    onClick={() => {
                      onPlantBerry(selectedPlotForPlanting, bid);
                      soundFx.playClick();
                      setSelectedPlotForPlanting(null);
                    }}
                    disabled={seedQty <= 0}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      seedQty > 0
                        ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 cursor-pointer text-white'
                        : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{b.icon}</span>
                      <div>
                        <h4 className="text-xs font-black">{b.name}</h4>
                        <p className="text-[10px] text-slate-400">{b.desc}</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                      Semillas: {seedQty}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
              <span className="text-slate-400">¿No tienes semillas?</span>
              <button
                onClick={() => {
                  setSelectedPlotForPlanting(null);
                  onOpenShopForSeeds();
                }}
                className="text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Comprar en Tienda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
