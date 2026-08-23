import React, { useState } from 'react';
import {
  SexualHealthState,
  SexualHealthLog,
  PrivatePhoto,
  SkillStats,
} from '../types';
import {
  Heart,
  Shield,
  Lock,
  Unlock,
  KeyRound,
  Plus,
  Trash2,
  Calendar,
  Ruler,
  Activity,
  Sparkles,
  Eye,
  EyeOff,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  X,
  Upload,
  ZoomIn,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface SexualHealthTabProps {
  state?: SexualHealthState;
  sexualHealthState?: SexualHealthState;
  skillStats?: SkillStats;
  onUpdateState?: (newState: SexualHealthState) => void;
  onAddXp?: (skillKey: keyof SkillStats, amount: number) => void;
}

export const SexualHealthTab: React.FC<SexualHealthTabProps> = ({
  state: propState,
  sexualHealthState,
  skillStats,
  onUpdateState,
  onAddXp,
}) => {
  const rawState = propState || sexualHealthState;
  const state: SexualHealthState = {
    hasPin: rawState?.hasPin ?? false,
    pinCode: rawState?.pinCode ?? '',
    isUnlocked: rawState?.isUnlocked ?? true,
    discreetMode: rawState?.discreetMode ?? false,
    logs: Array.isArray(rawState?.logs) ? rawState.logs : [],
    gallery: Array.isArray(rawState?.gallery) ? rawState.gallery : [],
    lastMeasurementCm: rawState?.lastMeasurementCm ?? 14.5,
    totalMasturbationCount:
      rawState?.totalMasturbationCount ??
      (Array.isArray(rawState?.logs) ? rawState.logs.filter((l) => l.type === 'masturbation').length : 0),
  };

  const safeSkill = skillStats?.sexualHealth || {
    level: 1,
    xp: 0,
    maxXp: 100,
  };

  const [activeSubTab, setActiveSubTab] = useState<'tracker' | 'measurements' | 'gallery'>('tracker');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showSetPinModal, setShowSetPinModal] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');

  // Masturbation Log Form
  const [logMood, setLogMood] = useState<'bien' | 'neutral' | 'cansado' | 'estresado' | 'culpable'>('bien');
  const [logEnergy, setLogEnergy] = useState<number>(4);
  const [logNotes, setLogNotes] = useState('');
  const [showAddLogModal, setShowAddLogModal] = useState(false);

  // Measurement Form
  const [measureLength, setMeasureLength] = useState<string>('14.5');
  const [measureGirth, setMeasureGirth] = useState<string>('11.0');
  const [measureNotes, setMeasureNotes] = useState('');
  const [showAddMeasureModal, setShowAddMeasureModal] = useState(false);

  // Gallery Upload
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<'personal' | 'examen' | 'progreso' | 'otro'>('progreso');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedViewingPhoto, setSelectedViewingPhoto] = useState<PrivatePhoto | null>(null);

  const notifyStateChange = (next: SexualHealthState) => {
    if (onUpdateState) {
      onUpdateState(next);
    }
  };

  // PIN Unlock Check
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.hasPin || pinInput === state.pinCode) {
      soundFx.playLevelUp();
      notifyStateChange({
        ...state,
        isUnlocked: true,
      });
      setPinError(false);
      setPinInput('');
    } else {
      soundFx.playCancel();
      setPinError(true);
    }
  };

  const handleLock = () => {
    soundFx.playClick();
    notifyStateChange({
      ...state,
      isUnlocked: false,
    });
  };

  const handleSetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length < 4) return;
    soundFx.playSave();
    notifyStateChange({
      ...state,
      hasPin: true,
      pinCode: newPinInput,
      isUnlocked: true,
    });
    setShowSetPinModal(false);
    setNewPinInput('');
  };

  // Add Masturbation Entry
  const handleAddMasturbationLog = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playTaskComplete();
    const newLog: SexualHealthLog = {
      id: `sh_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      type: 'masturbation',
      mood: logMood,
      energyLevel: logEnergy,
      notes: logNotes.trim() || undefined,
    };

    notifyStateChange({
      ...state,
      logs: [newLog, ...state.logs],
      totalMasturbationCount: state.totalMasturbationCount + 1,
    });

    onAddXp?.('sexualHealth', 40);
    setShowAddLogModal(false);
    setLogNotes('');
  };

  // Add Measurement Entry
  const handleAddMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    const lenVal = parseFloat(measureLength);
    const girthVal = measureGirth ? parseFloat(measureGirth) : undefined;
    if (isNaN(lenVal) || lenVal <= 0) return;

    soundFx.playLevelUp();
    const newLog: SexualHealthLog = {
      id: `meas_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      type: 'measurement',
      measurementCm: lenVal,
      measurementGirthCm: girthVal,
      notes: measureNotes.trim() || undefined,
    };

    notifyStateChange({
      ...state,
      logs: [newLog, ...state.logs],
      lastMeasurementCm: lenVal,
    });

    onAddXp?.('sexualHealth', 50);
    setShowAddMeasureModal(false);
    setMeasureNotes('');
  };

  // Handle Photo File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoPreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoPreview) return;

    soundFx.playCaptureSuccess();
    const newPhoto: PrivatePhoto = {
      id: `photo_${Date.now()}`,
      title: photoTitle.trim() || `Foto Privada ${state.gallery.length + 1}`,
      photoUrl: photoPreview,
      category: photoCategory,
      uploadedAt: Date.now(),
    };

    notifyStateChange({
      ...state,
      gallery: [newPhoto, ...state.gallery],
    });

    setShowUploadModal(false);
    setPhotoPreview(null);
    setPhotoTitle('');
  };

  const handleDeletePhoto = (photoId: string) => {
    soundFx.playCancel();
    notifyStateChange({
      ...state,
      gallery: state.gallery.filter((p) => p.id !== photoId),
    });
    if (selectedViewingPhoto?.id === photoId) {
      setSelectedViewingPhoto(null);
    }
  };

  const handleDeleteLog = (logId: string) => {
    soundFx.playCancel();
    notifyStateChange({
      ...state,
      logs: state.logs.filter((l) => l.id !== logId),
    });
  };

  // If PIN is enabled and locked, show PIN lock screen
  if (state.hasPin && !state.isUnlocked) {
    return (
      <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 max-w-md mx-auto shadow-2xl text-center space-y-5 animate-fadeIn my-6">
        <div className="w-16 h-16 bg-rose-950/60 border-2 border-rose-500 rounded-3xl mx-auto flex items-center justify-center text-rose-400 shadow-inner">
          <Lock className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <h3 className="font-black text-xl text-white">Área Íntima & Galería Protegida</h3>
          <p className="text-xs text-slate-400 mt-1">
            Introduce tu código PIN de 4 dígitos para acceder a tus registros privados
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="••••"
              className="w-40 mx-auto text-center tracking-[0.5em] text-2xl font-mono bg-slate-950 border-2 border-rose-500 rounded-2xl py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
              autoFocus
            />
            {pinError && (
              <p className="text-xs text-rose-400 font-bold mt-2 animate-bounce">
                PIN incorrecto. Inténtalo de nuevo.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-transform"
          >
            <Unlock className="w-4 h-4" /> Desbloquear Sección
          </button>
        </form>
      </div>
    );
  }

  const masturbationLogs = state.logs.filter((l) => l.type === 'masturbation');
  const measurementLogs = state.logs.filter((l) => l.type === 'measurement');

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-pink-600 to-red-600 rounded-3xl p-4 sm:p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-white/20 rounded-2xl shadow">
            <Heart className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-xl sm:text-2xl tracking-wide">
                Salud Sexual & Intimidad
              </h2>
              <span className="text-[10px] bg-rose-950/80 text-rose-100 font-bold px-2 py-0.5 rounded-full border border-rose-400/40">
                Privado & Seguro
              </span>
            </div>
            <p className="text-xs text-rose-100 mt-0.5">
              Registro consciente, control corporal, medidas y galería privada encriptada
            </p>
          </div>
        </div>

        {/* Action Controls (Lock / PIN setup) */}
        <div className="flex items-center gap-2">
          {state.hasPin ? (
            <button
              onClick={handleLock}
              className="px-3.5 py-2 bg-black/30 hover:bg-black/50 border border-white/25 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Bloquear con PIN ahora"
            >
              <Lock className="w-3.5 h-3.5 text-rose-200" />
              <span>Bloquear</span>
            </button>
          ) : (
            <button
              onClick={() => setShowSetPinModal(true)}
              className="px-3.5 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Activar PIN de Seguridad</span>
            </button>
          )}
        </div>
      </div>

      {/* Skill Level Card for Sexual Health */}
      <div className="bg-slate-900 border-2 border-rose-500/60 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-500/60 flex items-center justify-center text-rose-400 font-black text-lg">
            Nv. {safeSkill.level}
          </div>
          <div>
            <h4 className="font-black text-white text-sm sm:text-base flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Habilidad: Salud Sexual & Autoconocimiento
            </h4>
            <p className="text-xs text-slate-400">
              {safeSkill.xp} / {safeSkill.maxXp} XP • +40 XP por registro reflexivo
            </p>
          </div>
        </div>

        <div className="w-full sm:w-48">
          <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-700 overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-500 to-pink-400 h-full rounded-full transition-all"
              style={{
                width: `${Math.min(
                  100,
                  (safeSkill.xp / safeSkill.maxXp) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Registro / Medidas / Galería */}
      <div className="flex bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 gap-1.5">
        <button
          onClick={() => {
            soundFx.playClick();
            setActiveSubTab('tracker');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeSubTab === 'tracker'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Control & Masturbación</span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            setActiveSubTab('measurements');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeSubTab === 'measurements'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>Cuánto me Mide</span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            setActiveSubTab('gallery');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeSubTab === 'gallery'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Galería Privada ({state.gallery.length})</span>
        </button>
      </div>

      {/* SECTION 1: MASTURBATION TRACKER */}
      {activeSubTab === 'tracker' && (
        <div className="space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Total Registros</span>
              <p className="text-2xl font-black text-white mt-1">
                {state.totalMasturbationCount} veces
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Última Sesión</span>
              <p className="text-sm font-bold text-rose-300 mt-1">
                {masturbationLogs[0] ? masturbationLogs[0].date : 'Sin registros'}
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Autocontrol & Balance</span>
              <p className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Hábitos saludables
              </p>
            </div>
          </div>

          {/* Add Log Button */}
          <div className="flex justify-between items-center">
            <h3 className="font-black text-white text-base">Historial de Registro</h3>
            <button
              onClick={() => {
                soundFx.playClick();
                setShowAddLogModal(true);
              }}
              className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" /> Registrar Sesión
            </button>
          </div>

          {/* Logs List */}
          <div className="space-y-2">
            {masturbationLogs.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-xs">
                No hay registros aún. Pulsa en "Registrar Sesión" para llevar el control.
              </div>
            ) : (
              masturbationLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{log.date}</span>
                        {log.mood && (
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.2 rounded-full capitalize">
                            Ánimo: {log.mood}
                          </span>
                        )}
                        {log.energyLevel && (
                          <span className="text-[10px] text-amber-400 font-bold">
                            ⚡ {log.energyLevel}/5
                          </span>
                        )}
                      </div>
                      {log.notes && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{log.notes}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: MEASUREMENTS */}
      {activeSubTab === 'measurements' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-white text-base">Control de Medidas Corporales</h3>
                <p className="text-xs text-slate-400">
                  Seguimiento de longitud y grosor en cm para tu desarrollo físico
                </p>
              </div>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowAddMeasureModal(true);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow active:scale-95 transition-transform"
              >
                <Plus className="w-4 h-4" /> Nueva Medición
              </button>
            </div>

            {/* Current Big Metric */}
            <div className="bg-slate-950/80 border-2 border-rose-500/50 rounded-2xl p-4 flex items-center justify-around">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Última Longitud</span>
                <p className="text-3xl font-black text-rose-400 mt-1">
                  {state.lastMeasurementCm ? `${state.lastMeasurementCm} cm` : '--'}
                </p>
              </div>

              <div className="h-10 w-px bg-slate-800" />

              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Registros</span>
                <p className="text-3xl font-black text-white mt-1">
                  {measurementLogs.length}
                </p>
              </div>
            </div>
          </div>

          {/* Measurements History List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Historial de Medidas:
            </h4>
            {measurementLogs.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 text-center text-slate-400 text-xs">
                No hay mediciones guardadas aún.
              </div>
            ) : (
              measurementLogs.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400 font-bold">
                      <Ruler className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm">
                          {m.measurementCm} cm
                        </span>
                        {m.measurementGirthCm && (
                          <span className="text-xs text-slate-400 font-mono">
                            (Grosor: {m.measurementGirthCm} cm)
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-bold ml-2">
                          {m.date}
                        </span>
                      </div>
                      {m.notes && <p className="text-[11px] text-slate-400">{m.notes}</p>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteLog(m.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: PRIVATE GALLERY */}
      {activeSubTab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-white text-base">Galería Privada Segura</h3>
              <p className="text-xs text-slate-400">
                Fotos guardadas de forma local y protegidas con tu PIN de acceso
              </p>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                setShowUploadModal(true);
              }}
              className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow active:scale-95 transition-transform"
            >
              <Upload className="w-4 h-4" /> Subir Foto Privada
            </button>
          </div>

          {state.gallery.length === 0 ? (
            <div className="bg-slate-900/60 border-2 border-dashed border-slate-800 rounded-3xl p-10 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-2xl mx-auto flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-400">
                Tu galería privada está vacía. Puedes subir fotos de progreso o imágenes que quieras guardar en privado.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {state.gallery.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-rose-500/70 transition-all"
                >
                  <div
                    onClick={() => setSelectedViewingPhoto(photo)}
                    className="aspect-square bg-slate-950 cursor-pointer overflow-hidden relative"
                  >
                    <img
                      src={photo.photoUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <ZoomIn className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="p-2.5 flex items-center justify-between bg-slate-900/90">
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{photo.title}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(photo.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 cursor-pointer flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: REGISTRAR MASTURBACIÓN */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl w-full max-w-md shadow-2xl text-white p-5 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-base text-white">Registrar Sesión</h3>
              <button
                onClick={() => setShowAddLogModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMasturbationLog} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  ¿Cómo te has sentido? (Estado de ánimo)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['bien', 'neutral', 'cansado', 'estresado', 'culpable'] as const).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setLogMood(m)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                        logMood === m
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Nivel de energía posterior (1 a 5):
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setLogEnergy(lvl)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        logEnergy === lvl
                          ? 'bg-amber-400 text-slate-950 font-black scale-105'
                          : 'bg-slate-800 border border-slate-700 text-slate-300'
                      }`}
                    >
                      ⚡ {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Notas / Observaciones (opcional):
                </label>
                <input
                  type="text"
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="Ej. Sesión para relajarme antes de dormir"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl cursor-pointer shadow"
              >
                Guardar Registro (+40 XP)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NUEVA MEDICIÓN */}
      {showAddMeasureModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl w-full max-w-md shadow-2xl text-white p-5 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-base text-white">Añadir Medición Corporal</h3>
              <button
                onClick={() => setShowAddMeasureModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMeasurement} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Longitud (en centímetros cm):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="35"
                  value={measureLength}
                  onChange={(e) => setMeasureLength(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Grosor / Circunferencia (cm, opcional):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="25"
                  value={measureGirth}
                  onChange={(e) => setMeasureGirth(e.target.value)}
                  placeholder="Ej. 11.5"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Notas:
                </label>
                <input
                  type="text"
                  value={measureNotes}
                  onChange={(e) => setMeasureNotes(e.target.value)}
                  placeholder="Ej. Medición mensual de seguimiento"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl cursor-pointer shadow"
              >
                Guardar Medición (+50 XP)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBIR FOTO PRIVADA */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl w-full max-w-md shadow-2xl text-white p-5 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-base text-white">Subir a Galería Privada</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setPhotoPreview(null);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Título / Descripción de la foto:
                </label>
                <input
                  type="text"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="Ej. Progreso Agosto"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Seleccionar Imagen (JPG, PNG, WebP):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-600 file:text-white hover:file:bg-rose-500 cursor-pointer"
                  required
                />
              </div>

              {photoPreview && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 bg-black">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={!photoPreview}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-black text-xs rounded-xl cursor-pointer shadow"
              >
                Guardar en Galería Privada
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW PHOTO FULLSCREEN */}
      {selectedViewingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative max-w-3xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedViewingPhoto(null)}
              className="absolute -top-10 right-0 p-2 bg-slate-800/80 rounded-full text-white hover:bg-slate-700"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedViewingPhoto.photoUrl}
              alt={selectedViewingPhoto.title}
              className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-slate-800"
            />
            <p className="text-white font-bold text-sm mt-3">{selectedViewingPhoto.title}</p>
          </div>
        </div>
      )}

      {/* MODAL: SET PIN CODE */}
      {showSetPinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl w-full max-w-sm shadow-2xl text-white p-5 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-base text-white">Configurar PIN de Seguridad</h3>
              <button
                onClick={() => setShowSetPinModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSetPin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Introduce 4 números para tu PIN:
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ej. 1234"
                  className="w-full text-center text-xl tracking-[0.4em] font-mono bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={newPinInput.length < 4}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-black text-xs rounded-xl cursor-pointer shadow"
              >
                Guardar y Activar PIN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
