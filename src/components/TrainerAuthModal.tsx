import React, { useState } from 'react';
import { TrainerProfile } from '../types';
import {
  User,
  Shield,
  Check,
  LogOut,
  Mail,
  Sparkles,
  Award,
  X,
  KeyRound,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface TrainerAuthModalProps {
  trainer: TrainerProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTrainer: (updated: Partial<TrainerProfile>) => void;
  onOpenCustomizer: () => void;
  onOpenGoogleFit: () => void;
}

export const TrainerAuthModal: React.FC<TrainerAuthModalProps> = ({
  trainer,
  isOpen,
  onClose,
  onUpdateTrainer,
  onOpenCustomizer,
  onOpenGoogleFit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(trainer.name);
  const [emailInput, setEmailInput] = useState(trainer.email || '');
  const [loginTab, setLoginTab] = useState<'profile' | 'accounts'>('profile');
  const [savedProfiles, setSavedProfiles] = useState<TrainerProfile[]>([
    trainer,
    {
      ...trainer,
      name: 'Entrenadora Leaf',
      email: 'leaf@pokeclub.com',
      avatarSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/leaf.png',
      trainerTitle: 'Especialista en Hierba',
      level: 2,
    },
  ]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSave();
    onUpdateTrainer({
      name: nameInput.trim() || 'Entrenador',
      email: emailInput.trim(),
    });
    setIsEditing(false);
  };

  const handleSwitchProfile = (p: TrainerProfile) => {
    soundFx.playSelect();
    onUpdateTrainer({
      name: p.name,
      email: p.email,
      avatarSprite: p.avatarSprite,
      trainerTitle: p.trainerTitle,
      trainerClass: p.trainerClass,
      level: p.level,
    });
    setNameInput(p.name);
    setEmailInput(p.email || '');
  };

  const handleGoogleLogin = () => {
    soundFx.playLevelUp();
    // Simulate / Connect Google Account session
    const googleEmail = 'ikercito.gonser@gmail.com';
    onUpdateTrainer({
      email: googleEmail,
      isGoogleFitConnected: true,
      googleFitEmail: googleEmail,
      googleFitLastSync: new Date().toLocaleTimeString(),
    });
    setEmailInput(googleEmail);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border-2 border-red-500 rounded-3xl w-full max-w-md shadow-2xl text-white overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 bg-white/20 rounded-2xl border-2 border-white/40 p-1 flex items-center justify-center shadow">
              <img
                src={trainer.avatarSprite}
                alt={trainer.name}
                className="w-10 h-10 object-contain pixelated"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png';
                }}
              />
            </div>
            <div>
              <h3 className="font-black text-lg text-white leading-tight">
                {trainer.name}
              </h3>
              <p className="text-xs text-red-100 font-medium">
                {trainer.trainerTitle || 'Entrenador Pokémon'} • Nv. {trainer.level}
              </p>
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

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1">
          <button
            onClick={() => setLoginTab('profile')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              loginTab === 'profile'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mi Tarjeta de Entrenador
          </button>
          <button
            onClick={() => setLoginTab('accounts')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              loginTab === 'accounts'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cuentas & Perfiles
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {loginTab === 'profile' ? (
            <>
              {/* Profile Details or Edit Form */}
              {!isEditing ? (
                <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
                    <span className="text-xs text-slate-400 font-semibold">Correo / ID</span>
                    <span className="text-xs font-mono text-emerald-300">
                      {trainer.email || 'Sin vincular (Invitado)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
                    <span className="text-xs text-slate-400 font-semibold">Racha Actual</span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      🔥 {trainer.dailyStreak} días (Récord: {trainer.bestStreak}d)
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
                    <span className="text-xs text-slate-400 font-semibold">Saldo Poké-monedas</span>
                    <span className="text-xs font-bold text-amber-300">
                      🪙 {trainer.gold.toLocaleString()} ₽
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-semibold">Google Fit Sync</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        trainer.isGoogleFitConnected
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {trainer.isGoogleFitConnected ? '✓ Vinculado' : 'No conectado'}
                    </span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Nombre de Entrenador
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Ej. Entrenador Red"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                      maxLength={25}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Correo Electrónico / ID de Cuenta
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="usuario@ejemplo.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    >
                      <Check className="w-4 h-4" /> Guardar Cambios
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                {!isEditing && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setIsEditing(true);
                    }}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <User className="w-4 h-4 text-red-400" />
                    Editar Nombre & Datos de Perfil
                  </button>
                )}

                {/* Open Avatar Customizer */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenCustomizer();
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-red-600/90 to-rose-600/90 hover:from-red-500 hover:to-rose-500 border border-red-400/40 rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
                  Personalizar mi Avatar Pokémon
                </button>

                {/* Google Fit Sync button */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenGoogleFit();
                  }}
                  className="w-full py-2.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 rounded-2xl text-xs font-bold text-emerald-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Vincular Google Fit & Sincronizar Pasos
                </button>
              </div>
            </>
          ) : (
            /* Accounts & Session Management */
            <div className="space-y-3">
              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/60 text-xs text-slate-300">
                <p className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  Inicio de Sesión y Perfiles Locales
                </p>
                <p className="text-[11px] text-slate-400">
                  Tus datos se guardan en tu dispositivo. Puedes conectar Google para sincronizar pasos y cambiar de perfil rápidamente.
                </p>
              </div>

              {/* Google One-Click Login */}
              <button
                onClick={handleGoogleLogin}
                className="w-full py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all shadow active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {trainer.isGoogleFitConnected ? 'Cuenta Google Conectada' : 'Continuar con Cuenta Google'}
              </button>

              {/* Profiles List */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Cambiar de Perfil de Entrenador:
                </p>
                {savedProfiles.map((p, idx) => {
                  const isCurrent = p.name === trainer.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSwitchProfile(p)}
                      className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-red-600/20 border-red-500/80 text-white'
                          : 'bg-slate-850 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.avatarSprite}
                          alt={p.name}
                          className="w-8 h-8 object-contain pixelated bg-slate-900/80 rounded-xl p-0.5 border border-slate-700"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{p.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {p.trainerTitle || 'Entrenador'} • Nv. {p.level}
                          </p>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full">
                          Activo
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
