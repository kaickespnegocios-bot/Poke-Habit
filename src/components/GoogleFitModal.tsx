import React, { useState } from 'react';
import { TrainerProfile } from '../types';
import {
  Footprints,
  Activity,
  CheckCircle2,
  RefreshCw,
  X,
  Flame,
  Heart,
  TrendingUp,
  Sparkles,
  Link2,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface GoogleFitModalProps {
  trainer: TrainerProfile;
  isOpen: boolean;
  onClose: () => void;
  onSyncSteps: (newSteps: number) => void;
  onToggleConnection: (connected: boolean, email?: string) => void;
}

export const GoogleFitModal: React.FC<GoogleFitModalProps> = ({
  trainer,
  isOpen,
  onClose,
  onSyncSteps,
  onToggleConnection,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [manualStepsToAdd, setManualStepsToAdd] = useState(1000);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const isConnected = !!trainer.isGoogleFitConnected;

  const handleConnectGoogle = () => {
    soundFx.playLevelUp();
    setIsSyncing(true);
    setTimeout(() => {
      onToggleConnection(true, 'ikercito.gonser@gmail.com');
      setIsSyncing(false);
      setSyncFeedback('¡Cuenta de Google Fit vinculada con éxito!');
      setTimeout(() => setSyncFeedback(null), 3000);
    }, 800);
  };

  const handleDisconnect = () => {
    soundFx.playCancel();
    onToggleConnection(false, '');
  };

  const handleSyncNow = () => {
    soundFx.playCaptureSuccess();
    setIsSyncing(true);
    setTimeout(() => {
      // Add realistic walk step batch
      const randomAdd = Math.floor(Math.random() * 800) + 400;
      onSyncSteps(trainer.stepsToday + randomAdd);
      setIsSyncing(false);
      setSyncFeedback(`✓ Sincronizados +${randomAdd} pasos desde Google Fit API`);
      setTimeout(() => setSyncFeedback(null), 3500);
    }, 900);
  };

  const handleManualAdd = () => {
    soundFx.playSelect();
    onSyncSteps(trainer.stepsToday + manualStepsToAdd);
    setSyncFeedback(`✓ Añadidos +${manualStepsToAdd.toLocaleString()} pasos manualmente`);
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl w-full max-w-md shadow-2xl text-white overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-2xl shadow">
              <Footprints className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">Google Fit & Salud Web</h3>
              <p className="text-xs text-emerald-100">Sincronización de actividad y pasos</p>
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

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Status Banner */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                }`}
              >
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Estado de Vinculación</p>
                <p className="text-sm font-black text-white">
                  {isConnected ? 'Conectado a Google Fit' : 'Desconectado'}
                </p>
                {isConnected && (
                  <p className="text-[10px] text-emerald-400 font-mono">
                    {trainer.googleFitEmail || 'Cuenta activa'}
                  </p>
                )}
              </div>
            </div>

            {isConnected ? (
              <button
                onClick={handleDisconnect}
                className="text-[11px] font-bold text-red-400 hover:text-red-300 bg-red-950/40 border border-red-800/60 px-2.5 py-1 rounded-xl cursor-pointer"
              >
                Desvincular
              </button>
            ) : (
              <button
                onClick={handleConnectGoogle}
                disabled={isSyncing}
                className="text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow active:scale-95 transition-transform"
              >
                <Link2 className="w-3.5 h-3.5" /> Conectar
              </button>
            )}
          </div>

          {/* Feedback message */}
          {syncFeedback && (
            <div className="bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-bold p-3 rounded-2xl animate-fadeIn flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{syncFeedback}</span>
            </div>
          )}

          {/* Live Step Tracker Summary */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Pasos de Hoy
              </span>
              <span className="text-xs text-emerald-400 font-black">
                {Math.min(100, Math.round((trainer.stepsToday / trainer.stepGoal) * 100))}% de la meta
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {trainer.stepsToday.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-bold">
                / {trainer.stepGoal.toLocaleString()} pasos
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-700 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (trainer.stepsToday / trainer.stepGoal) * 100)}%`,
                }}
              />
            </div>

            {/* Calories / Active metrics estimation */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-[10px] text-slate-400">Calorías Quemadas</p>
                  <p className="text-xs font-bold text-white">
                    {Math.round(trainer.stepsToday * 0.04)} kcal
                  </p>
                </div>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-[10px] text-slate-400">Distancia Estimada</p>
                  <p className="text-xs font-bold text-white">
                    {((trainer.stepsToday * 0.75) / 1000).toFixed(2)} km
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sincronización Manual & Simulador de Sensor */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider">
              Acciones de Sincronización:
            </h4>

            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow active:scale-95 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Consultando Google Fit API...' : 'Sincronizar Pasos Ahora'}
            </button>

            {/* Quick Step Injector */}
            <div className="flex items-center gap-2 pt-1">
              {[500, 1000, 2500, 5000].map((steps) => (
                <button
                  key={steps}
                  onClick={() => {
                    soundFx.playClick();
                    setManualStepsToAdd(steps);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                    manualStepsToAdd === steps
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  +{steps >= 1000 ? `${steps / 1000}k` : steps}
                </button>
              ))}
              <button
                onClick={handleManualAdd}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-[11px] font-bold text-emerald-300 cursor-pointer"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
