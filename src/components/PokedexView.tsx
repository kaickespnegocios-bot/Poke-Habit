import React, { useState } from 'react';
import { PokedexEntry, PokemonType } from '../types';
import { POKEMON_TYPES } from '../data/pokemonTypes';
import { Search, Filter, Sparkles, BookOpen, Crown, X, Info } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface PokedexViewProps {
  pokedex: PokedexEntry[];
  capturedIds: number[];
}

export const PokedexView: React.FC<PokedexViewProps> = ({
  pokedex,
  capturedIds,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'captured' | 'missing'>('all');
  const [selectedEntry, setSelectedEntry] = useState<PokedexEntry | null>(null);

  const capturedCount = pokedex.filter((p) => capturedIds.includes(p.id)).length;
  const totalCount = pokedex.length;

  const filteredPokedex = pokedex.filter((entry) => {
    const isCaptured = capturedIds.includes(entry.id);
    if (filterStatus === 'captured' && !isCaptured) return false;
    if (filterStatus === 'missing' && isCaptured) return false;
    if (filterType !== 'all' && !entry.types.includes(filterType as PokemonType)) return false;
    if (
      searchTerm.trim() &&
      !entry.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) &&
      !entry.id.toString().includes(searchTerm.trim())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header & Pokédex Progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-red-500" />
              Pokédex Nacional Dinámica
            </h2>
            <span className="bg-red-600/20 text-red-300 font-black text-xs px-2.5 py-0.5 rounded-full border border-red-500/40">
              {capturedCount} / {totalCount} Registrados
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Datos reales de PokeAPI cacheados en local. Los Pokémon legendarios solo pueden desbloquearse mediante logros heroicos.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o #Nº..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Filter Tabs & Type Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/60 text-xs font-bold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'all' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({totalCount})
          </button>
          <button
            onClick={() => setFilterStatus('captured')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'captured' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Capturados ({capturedCount})
          </button>
          <button
            onClick={() => setFilterStatus('missing')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'missing' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Por Descubrir ({totalCount - capturedCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="all">Todos los Tipos</option>
            {Object.keys(POKEMON_TYPES).map((typeKey) => (
              <option key={typeKey} value={typeKey}>
                {POKEMON_TYPES[typeKey as PokemonType].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Pokémon Entries */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredPokedex.map((entry) => {
          const isCaptured = capturedIds.includes(entry.id);
          const primaryType = entry.types[0] || 'normal';
          const typeInfo = POKEMON_TYPES[primaryType];

          return (
            <div
              key={entry.id}
              onClick={() => {
                setSelectedEntry(entry);
                soundFx.playClick();
              }}
              className={`bg-slate-900 border rounded-2xl p-3.5 flex flex-col items-center text-center transition-all cursor-pointer group shadow-sm ${
                isCaptured
                  ? 'border-slate-800 hover:border-red-500'
                  : 'border-slate-850 opacity-60 hover:opacity-90'
              }`}
            >
              <div className="w-full flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>#{entry.id.toString().padStart(3, '0')}</span>
                {entry.isLegendary && (
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-current" />
                )}
              </div>

              <div className="relative w-16 h-16 flex items-center justify-center my-1">
                {isCaptured ? (
                  <img
                    src={entry.sprite}
                    alt={entry.name}
                    className="w-16 h-16 object-contain pixelated group-hover:scale-110 transition-transform drop-shadow"
                  />
                ) : (
                  <img
                    src={entry.sprite}
                    alt={entry.name}
                    className="w-16 h-16 object-contain pixelated brightness-0 contrast-200 opacity-40"
                  />
                )}
              </div>

              <h4 className="text-xs font-bold text-white truncate w-full mt-1">
                {isCaptured ? entry.name : '???'}
              </h4>

              <div className="flex gap-1 mt-1.5">
                {isCaptured ? (
                  entry.types.map((t) => (
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
                  ))
                ) : (
                  <span className="text-[8px] font-bold bg-slate-800 text-slate-500 px-2 py-0.2 rounded-full">
                    No registrado
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Inspection Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSelectedEntry(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-36 h-36 mx-auto flex items-center justify-center relative">
                <img
                  src={selectedEntry.officialArtwork || selectedEntry.sprite}
                  alt={selectedEntry.name}
                  className={`w-32 h-32 object-contain drop-shadow-xl ${
                    capturedIds.includes(selectedEntry.id)
                      ? 'animate-pulse'
                      : 'brightness-0 opacity-40'
                  }`}
                  style={{ animationDuration: '4s' }}
                />
              </div>

              <span className="text-xs font-mono font-bold text-red-400">
                Nº {selectedEntry.id.toString().padStart(3, '0')}
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                {capturedIds.includes(selectedEntry.id) ? selectedEntry.name : '??? Desconocido'}
              </h3>

              <div className="flex justify-center gap-1.5 mt-2">
                {selectedEntry.types.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-black px-3 py-0.5 rounded-full uppercase"
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

            {/* Description & Physics */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3 text-xs">
              <p className="text-slate-300 italic leading-relaxed text-center">
                "{selectedEntry.description}"
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700 text-center text-slate-400">
                <div>
                  <span className="block text-[10px] font-bold uppercase text-slate-500">Altura</span>
                  <span className="font-bold text-white">{selectedEntry.height / 10} m</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase text-slate-500">Peso</span>
                  <span className="font-bold text-white">{selectedEntry.weight / 10} kg</span>
                </div>
              </div>
            </div>

            {/* Special status note */}
            {selectedEntry.isLegendary && (
              <div className="bg-amber-500/20 text-amber-300 border border-amber-500/40 p-3 rounded-xl text-center text-xs font-bold">
                👑 Pokémon Legendario. Solo se desbloquea en la sección de Logros Legendarios.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
