import React, { useState } from 'react';
import { Egg, EggRarity, PartyPokemon, ShopItem, TrainerProfile } from '../types';
import { INITIAL_SHOP_ITEMS } from '../data/initialData';
import {
  ShoppingBag,
  Coins,
  Egg as EggIcon,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Footprints,
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface PokeMartProps {
  trainer: TrainerProfile;
  inventory: { [itemId: string]: number };
  eggs: Egg[];
  onBuyItem: (item: ShopItem) => void;
  onStartIncubating: (eggId: string) => void;
  onHatchEgg: (egg: Egg) => void;
  onAccelerateEggSteps: (eggId: string, steps: number) => void;
}

export const PokeMart: React.FC<PokeMartProps> = ({
  trainer,
  inventory,
  eggs,
  onBuyItem,
  onStartIncubating,
  onHatchEgg,
  onAccelerateEggSteps,
}) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'incubator'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredItems = INITIAL_SHOP_ITEMS.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const incubatingEgg = eggs.find((e) => e.isIncubating);
  const unincubatedEggs = eggs.filter((e) => !e.isIncubating);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-red-500" />
              PokéMart & Incubadora de Huevos
            </h2>
            <span className="bg-amber-500/20 text-amber-300 font-black text-xs px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              {trainer.gold} ₽ Disponibles
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compra pociones curativas, caramelos raros para subir de nivel y huevos Pokémon. Los pasos de Health Connect incuban tus huevos.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/60 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'shop' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏪 Tienda Pokémon
          </button>
          <button
            onClick={() => setActiveTab('incubator')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'incubator' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🥚 Incubadora ({eggs.length})
          </button>
        </div>
      </div>

      {/* SHOP VIEW */}
      {activeTab === 'shop' && (
        <div className="space-y-5">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'all' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos los Artículos
            </button>
            <button
              onClick={() => setSelectedCategory('seed')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'seed' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌱 Semillas de Bayas
            </button>
            <button
              onClick={() => setSelectedCategory('egg')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'egg' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🥚 Huevos Pokémon
            </button>
            <button
              onClick={() => setSelectedCategory('potion')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'potion' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🧪 Pociones
            </button>
            <button
              onClick={() => setSelectedCategory('candy')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'candy' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🍬 Caramelos Raros
            </button>
            <button
              onClick={() => setSelectedCategory('ball')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'ball' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔴 Poké Balls
            </button>
          </div>

          {/* Shop Item Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const canAfford = trainer.gold >= item.cost;
              const ownedQty = inventory[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{item.icon}</span>
                      {ownedQty > 0 && (
                        <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-full border border-slate-700">
                          Tienes: {ownedQty}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {item.name}
                    </h4>

                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-black text-amber-300 flex items-center gap-1">
                      <Coins className="w-4 h-4" /> {item.cost} ₽
                    </span>

                    <button
                      onClick={() => {
                        if (canAfford) {
                          soundFx.playTaskComplete();
                          onBuyItem(item);
                        } else {
                          soundFx.playClick();
                        }
                      }}
                      disabled={!canAfford}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:hover:bg-red-600 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-transform active:scale-95"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* INCUBATOR VIEW */}
      {activeTab === 'incubator' && (
        <div className="space-y-6">
          {/* Active Incubator Slot */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <EggIcon className="w-5 h-5 text-amber-400" />
                  Incubadora Principal
                </h3>
                <p className="text-xs text-slate-400">
                  Los pasos reales leídos de Health Connect se suman automáticamente a la incubación.
                </p>
              </div>
            </div>

            {incubatingEgg ? (
              <div className="bg-slate-800/80 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div className="w-28 h-28 bg-slate-900/80 rounded-full flex items-center justify-center border-4 border-amber-400/40 animate-pulse text-5xl shadow-inner">
                  🥚
                </div>

                <div className="flex-1 space-y-2">
                  <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600/40">
                    Huevo {incubatingEgg.rarity.toUpperCase()}
                  </span>
                  <h4 className="text-lg font-black text-white">{incubatingEgg.name}</h4>
                  <p className="text-xs text-slate-300">
                    Pasos dados: <strong>{incubatingEgg.currentSteps.toLocaleString()}</strong> de{' '}
                    <strong>{incubatingEgg.stepsRequired.toLocaleString()}</strong> pasos requeridos.
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 border border-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (incubatingEgg.currentSteps / incubatingEgg.stepsRequired) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {incubatingEgg.currentSteps >= incubatingEgg.stepsRequired ? (
                    <button
                      onClick={() => {
                        soundFx.playEggCrack();
                        confetti({ particleCount: 100, spread: 90 });
                        onHatchEgg(incubatingEgg);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer transition-transform active:scale-95 animate-bounce"
                    >
                      ✨ ¡Eclosionar Huevo Ahora!
                    </button>
                  ) : (
                    <button
                      onClick={() => onAccelerateEggSteps(incubatingEgg.id, 500)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer"
                    >
                      ⚡ Simular +500 pasos
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-800/40 border border-slate-800 rounded-2xl text-slate-400 text-xs space-y-2">
                <span className="text-3xl block">🥚</span>
                <p>No tienes ningún huevo en la incubadora en este momento.</p>
                <p className="text-[11px] text-slate-500">
                  Selecciona uno de tus huevos comprados abajo o consigue uno en la tienda.
                </p>
              </div>
            )}
          </div>

          {/* Stored Eggs List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="font-bold text-white text-sm">Huevos en Inventario ({unincubatedEggs.length})</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {unincubatedEggs.map((egg) => (
                <div
                  key={egg.id}
                  className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🥚</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{egg.name}</h4>
                      <span className="text-[10px] text-slate-400">
                        {egg.stepsRequired.toLocaleString()} pasos para eclosionar
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onStartIncubating(egg.id);
                    }}
                    disabled={!!incubatingEgg}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-30 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                  >
                    Incubar
                  </button>
                </div>
              ))}

              {unincubatedEggs.length === 0 && (
                <div className="col-span-full text-center py-6 text-slate-500 text-xs">
                  No tienes más huevos guardados. Compra huevos en la pestaña "Tienda Pokémon".
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
