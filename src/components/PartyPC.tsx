import React, { useState } from 'react';
import { PartyPokemon } from '../types';
import { POKEMON_TYPES } from '../data/pokemonTypes';
import {
  Heart,
  Sparkles,
  ArrowRightLeft,
  Candy,
  Trash2,
  Edit2,
  Check,
  Shield,
  Zap,
  Activity,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface PartyPCProps {
  party: PartyPokemon[];
  pcBox: PartyPokemon[];
  inventory: { [itemId: string]: number };
  onMoveToPc: (pokemonId: string) => void;
  onMoveToParty: (pokemonId: string) => void;
  onHealPokemon: (pokemonId: string, potionItemId: string) => void;
  onUseRareCandy: (pokemonId: string) => void;
  onEvolvePokemon: (pokemon: PartyPokemon) => void;
  onRenamePokemon: (pokemonId: string, newNickname: string) => void;
}

export const PartyPC: React.FC<PartyPCProps> = ({
  party,
  pcBox,
  inventory,
  onMoveToPc,
  onMoveToParty,
  onHealPokemon,
  onUseRareCandy,
  onEvolvePokemon,
  onRenamePokemon,
}) => {
  const [selectedPokemon, setSelectedPokemon] = useState<PartyPokemon | null>(party[0] || null);
  const [isEditingNick, setIsEditingNick] = useState<boolean>(false);
  const [tempNickname, setTempNickname] = useState<string>('');

  const potionsCount = inventory['potion_normal'] || 0;
  const superPotionsCount = inventory['potion_super'] || 0;
  const rareCandyCount = inventory['rare_candy'] || 0;

  const handleSelect = (pkmn: PartyPokemon) => {
    setSelectedPokemon(pkmn);
    setIsEditingNick(false);
    soundFx.playClick();
  };

  const handleSaveNick = () => {
    if (selectedPokemon && tempNickname.trim()) {
      onRenamePokemon(selectedPokemon.id, tempNickname.trim());
      selectedPokemon.nickname = tempNickname.trim();
      setIsEditingNick(false);
      soundFx.playClick();
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Equipo Activo (Party) & PC Box</h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestiona tus 6 Pokémon activos y tu almacén ilimitado del PC de Bill. Usa pociones y caramelos raros.
          </p>
        </div>

        {/* Inventory Quick Bar */}
        <div className="flex items-center gap-2 text-xs font-bold shrink-0">
          <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300 flex items-center gap-1.5">
            <span>🧪 Pociones:</span>
            <span className="text-white font-black">{potionsCount + superPotionsCount}</span>
          </div>
          <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300 flex items-center gap-1.5">
            <span>🍬 Rare Candy:</span>
            <span className="text-amber-300 font-black">{rareCandyCount}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT & MID: Party List + PC Box Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* Party (Max 6) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                Equipo Activo ({party.length} / 6)
              </h3>
              <span className="text-xs text-slate-400">Reciben XP de tareas</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {party.map((pkmn) => {
                const isSelected = selectedPokemon?.id === pkmn.id;
                const hpPercent = Math.max(0, Math.min(100, Math.round((pkmn.hp / pkmn.maxHp) * 100)));
                const canEvolve =
                  pkmn.evolutionLevel && pkmn.level >= pkmn.evolutionLevel && pkmn.evolutionTargetName;

                return (
                  <div
                    key={pkmn.id}
                    onClick={() => handleSelect(pkmn)}
                    className={`bg-slate-800/80 border rounded-2xl p-3.5 flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-red-500 ring-2 ring-red-500/50 shadow-lg'
                        : 'border-slate-700/70 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={pkmn.sprite}
                        alt={pkmn.name}
                        className="w-14 h-14 object-contain pixelated drop-shadow"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-xs truncate">
                          {pkmn.nickname || pkmn.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 block">
                          Nivel {pkmn.level} • {pkmn.nature}
                        </span>
                        <div className="flex gap-1 mt-1">
                          {pkmn.types.map((t) => (
                            <span
                              key={t}
                              className="text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase"
                              style={{
                                backgroundColor: POKEMON_TYPES[t]?.color || '#888',
                                color: POKEMON_TYPES[t]?.textColor || '#fff',
                              }}
                            >
                              {POKEMON_TYPES[t]?.label || t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* HP Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-0.5">
                        <span>HP</span>
                        <span>{pkmn.hp} / {pkmn.maxHp}</span>
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

                    {/* Evolution trigger pill */}
                    {canEvolve && (
                      <div className="mt-2 text-center bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold py-0.5 rounded-lg animate-bounce">
                        ✨ ¡Listo para evolucionar!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PC Box Storage (Unlimited) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">
                Almacén del PC ({pcBox.length} Pokémon)
              </h3>
              <span className="text-xs text-slate-400">Toca para inspeccionar o mover a Party</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {pcBox.map((pkmn) => {
                const isSelected = selectedPokemon?.id === pkmn.id;
                return (
                  <div
                    key={pkmn.id}
                    onClick={() => handleSelect(pkmn)}
                    className={`bg-slate-800/60 border rounded-xl p-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'border-red-500 ring-2 ring-red-500/40'
                        : 'border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    <img
                      src={pkmn.sprite}
                      alt={pkmn.name}
                      className="w-12 h-12 object-contain pixelated"
                    />
                    <span className="text-[11px] font-bold text-white truncate w-full mt-1">
                      {pkmn.nickname || pkmn.name}
                    </span>
                    <span className="text-[9px] text-slate-400">Nv.{pkmn.level}</span>
                  </div>
                );
              })}

              {pcBox.length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-500 text-xs">
                  Tu PC Box está vacío. Los Pokémon extra que consigas de huevos o capturas se guardarán aquí.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Detailed Pokémon Inspection Card */}
        {selectedPokemon ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
            <div>
              {/* Pokémon Hero Visual */}
              <div className="bg-gradient-to-b from-slate-800 to-slate-850 border border-slate-700 rounded-2xl p-5 flex flex-col items-center text-center relative overflow-hidden">
                <div className="w-32 h-32 flex items-center justify-center">
                  <img
                    src={selectedPokemon.officialArtwork || selectedPokemon.sprite}
                    alt={selectedPokemon.name}
                    className="w-28 h-28 object-contain drop-shadow-xl animate-pulse"
                    style={{ animationDuration: '4s' }}
                  />
                </div>

                <div className="mt-2 w-full">
                  {isEditingNick ? (
                    <div className="flex items-center gap-1 justify-center">
                      <input
                        type="text"
                        value={tempNickname}
                        onChange={(e) => setTempNickname(e.target.value)}
                        className="bg-slate-900 border border-red-500 rounded px-2 py-0.5 text-xs text-white font-bold text-center"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveNick}
                        className="p-1 bg-emerald-600 rounded text-white"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5">
                      <h3 className="text-base font-black text-white">
                        {selectedPokemon.nickname || selectedPokemon.name}
                      </h3>
                      <button
                        onClick={() => {
                          setTempNickname(selectedPokemon.nickname || selectedPokemon.name);
                          setIsEditingNick(true);
                        }}
                        className="text-slate-400 hover:text-white p-0.5"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-slate-400">
                    Especie: {selectedPokemon.name} • Naturaleza: {selectedPokemon.nature}
                  </p>

                  <div className="flex justify-center gap-1.5 mt-2">
                    {selectedPokemon.types.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase"
                        style={{
                          backgroundColor: POKEMON_TYPES[t]?.color || '#888',
                          color: POKEMON_TYPES[t]?.textColor || '#fff',
                        }}
                      >
                        {POKEMON_TYPES[t]?.label || t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats & Progress */}
              <div className="space-y-3 mt-4">
                {/* Level & XP */}
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-white">Nivel {selectedPokemon.level}</span>
                    <span className="text-cyan-300">
                      {selectedPokemon.currentXp} / {selectedPokemon.maxXp} XP
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (selectedPokemon.currentXp / selectedPokemon.maxXp) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* HP */}
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-white flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-400 fill-current" /> Salud (HP)
                    </span>
                    <span className="text-emerald-300">
                      {selectedPokemon.hp} / {selectedPokemon.maxHp} HP
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        selectedPokemon.hp / selectedPokemon.maxHp > 0.5
                          ? 'bg-emerald-400'
                          : selectedPokemon.hp / selectedPokemon.maxHp > 0.2
                          ? 'bg-amber-400'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(100, (selectedPokemon.hp / selectedPokemon.maxHp) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Moves */}
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                    Movimientos Conocidos
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {selectedPokemon.moves.map((m, i) => (
                      <div
                        key={i}
                        className="bg-slate-900/80 px-2 py-1 rounded text-[11px] font-bold text-slate-200 border border-slate-800 truncate"
                      >
                        {m.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Heal, Rare Candy, Evolve, Move Party/PC */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              {/* Evolution Button if ready */}
              {selectedPokemon.evolutionLevel &&
                selectedPokemon.level >= selectedPokemon.evolutionLevel &&
                selectedPokemon.evolutionTargetName && (
                  <button
                    onClick={() => onEvolvePokemon(selectedPokemon)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-1.5 animate-pulse"
                  >
                    <Sparkles className="w-4 h-4" /> ¡Evolucionar a {selectedPokemon.evolutionTargetName}!
                  </button>
                )}

              <div className="grid grid-cols-2 gap-2">
                {/* Potion Button */}
                <button
                  onClick={() => {
                    if (potionsCount > 0) {
                      onHealPokemon(selectedPokemon.id, 'potion_normal');
                    } else if (superPotionsCount > 0) {
                      onHealPokemon(selectedPokemon.id, 'potion_super');
                    } else {
                      soundFx.playClick();
                    }
                  }}
                  disabled={potionsCount === 0 && superPotionsCount === 0}
                  className="py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  🧪 Curar HP ({potionsCount + superPotionsCount})
                </button>

                {/* Rare Candy Button */}
                <button
                  onClick={() => onUseRareCandy(selectedPokemon.id)}
                  disabled={rareCandyCount === 0}
                  className="py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-amber-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  🍬 Caramelo Raro ({rareCandyCount})
                </button>
              </div>

              {/* Move Between Party and PC Box */}
              {party.some((p) => p.id === selectedPokemon.id) ? (
                <button
                  onClick={() => onMoveToPc(selectedPokemon.id)}
                  disabled={party.length <= 1}
                  className="w-full py-2 bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" /> Enviar al PC de Bill
                </button>
              ) : (
                <button
                  onClick={() => onMoveToParty(selectedPokemon.id)}
                  disabled={party.length >= 6}
                  className="w-full py-2 bg-red-600 hover:bg-red-500 disabled:opacity-30 text-white text-xs font-bold rounded-xl shadow cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" /> Mover al Equipo Activo
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-center text-center text-slate-500 text-xs">
            Selecciona un Pokémon de la lista para ver sus datos.
          </div>
        )}
      </div>
    </div>
  );
};
