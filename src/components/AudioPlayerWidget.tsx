import React, { useState, useEffect } from 'react';
import {
  soundFx,
  MUSIC_TRACKS,
  MusicTrackId,
} from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Music,
  Radio,
  Play,
  Square,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Zap,
  Shuffle,
  SkipForward,
  SkipBack,
  Coffee,
} from 'lucide-react';

interface AudioPlayerWidgetProps {
  currentTab: string;
}

export const AudioPlayerWidget: React.FC<AudioPlayerWidgetProps> = ({ currentTab }) => {
  const [, setTick] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = soundFx.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  // When tab changes, let audio engine update track if auto-change is enabled
  useEffect(() => {
    soundFx.handleZoneChange(currentTab);
  }, [currentTab]);

  const isMusicOn = soundFx.isMusicEnabled();
  const isSfxOn = soundFx.isSfxEnabled();
  const currentTrackId = soundFx.getCurrentTrackId();
  const currentTrack = MUSIC_TRACKS[currentTrackId] || MUSIC_TRACKS.route1;
  const isAutoZone = soundFx.isAutoChangeByZone();
  const isShuffle = soundFx.isShuffleEnabled();
  const musicVolume = soundFx.getMusicVolume();

  const handleToggleMusic = () => {
    soundFx.playClick();
    soundFx.toggleMusic();
  };

  const handleToggleSfx = () => {
    soundFx.setSfxEnabled(!isSfxOn);
    soundFx.playToggle();
  };

  const handleSelectTrack = (trackId: MusicTrackId) => {
    soundFx.playClick();
    soundFx.setTrack(trackId, true);
  };

  const handleToggleAutoZone = () => {
    soundFx.playClick();
    soundFx.setAutoChangeByZone(!isAutoZone);
    if (!isAutoZone) {
      soundFx.handleZoneChange(currentTab);
    }
  };

  const handleToggleShuffle = () => {
    soundFx.playClick();
    soundFx.setShuffleMode(!isShuffle);
  };

  const handleNextTrack = () => {
    soundFx.playClick();
    soundFx.playNextTrack();
  };

  const handlePrevTrack = () => {
    soundFx.playClick();
    soundFx.playPrevTrack();
  };

  const handlePlayPomodoroLofi = () => {
    soundFx.playClick();
    soundFx.playPomodoroLofi();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundFx.setMusicVolume(val);
  };

  return (
    <div className="fixed bottom-16 sm:bottom-4 right-3 sm:right-6 z-40 max-w-xs sm:max-w-sm transition-all duration-300">
      {/* Collapsed Bar / Pill */}
      {!isExpanded ? (
        <div className="bg-slate-900/95 border-2 border-red-500/80 backdrop-blur-md rounded-2xl p-2 shadow-2xl flex items-center gap-2 text-white animate-fadeIn">
          {/* Animated Equalizer Bars */}
          <button
            onClick={() => {
              soundFx.playClick();
              setIsExpanded(true);
            }}
            className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-750 px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors text-left"
          >
            <div className="w-5 h-5 flex items-center justify-center text-red-400">
              <Music className={`w-4 h-4 ${isMusicOn ? 'animate-bounce text-red-400' : 'text-slate-500'}`} />
            </div>

            <div className="max-w-[110px] sm:max-w-[140px] overflow-hidden">
              <p className="text-[11px] font-black text-white truncate leading-tight">
                {isMusicOn ? currentTrack.title : 'Música Silenciada'}
              </p>
              <div className="flex items-center gap-1">
                {isMusicOn ? (
                  <span className="flex items-end gap-0.5 h-2">
                    <span className="w-0.5 h-2 bg-red-400 animate-pulse" />
                    <span className="w-0.5 h-3 bg-amber-400 animate-pulse delay-75" />
                    <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse delay-150" />
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-400">8-bit PokéRadio</span>
                )}
                <span className="text-[9px] text-slate-400 truncate">
                  {isShuffle ? '🔀 Shuffle' : currentTrack.mood.split('•')[0]}
                </span>
              </div>
            </div>

            <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Skip buttons */}
          <button
            onClick={handleNextTrack}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-transform active:scale-90"
            title="Siguiente canción Pokémon"
          >
            <SkipForward className="w-3 h-3" />
          </button>

          {/* Quick Play/Stop button */}
          <button
            onClick={handleToggleMusic}
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-transform active:scale-90 cursor-pointer shadow-md ${
              isMusicOn
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title={isMusicOn ? 'Detener música' : 'Reproducir música 8-bit'}
          >
            {isMusicOn ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          {/* SFX quick toggle */}
          <button
            onClick={handleToggleSfx}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              isSfxOn ? 'bg-slate-800 text-emerald-400' : 'bg-slate-800 text-slate-500'
            }`}
            title={isSfxOn ? 'Efectos de sonido activos' : 'Efectos de sonido silenciados'}
          >
            {isSfxOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      ) : (
        /* Expanded Player Drawer */
        <div className="bg-slate-900/98 border-2 border-red-500 backdrop-blur-lg rounded-3xl p-4 shadow-2xl text-white w-72 sm:w-84 space-y-3 animate-scaleUp">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-red-600/20 text-red-400 rounded-lg">
                <Radio className="w-4 h-4 animate-spin-slow" />
              </span>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">
                  PokéRadio 8-bit FM
                </h4>
                <p className="text-[10px] text-slate-400">12 Melodías Clásicas & Lo-Fi</p>
              </div>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                setIsExpanded(false);
              }}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Now Playing Banner */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-red-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {isMusicOn ? 'En Reproducción' : 'En Pausa'}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{currentTrack.tempo} BPM</span>
            </div>

            <div>
              <h3 className="text-sm font-black text-white">{currentTrack.title}</h3>
              <p className="text-[11px] text-slate-300">{currentTrack.subtitle}</p>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">{currentTrack.mood}</p>
            </div>

            {/* Controls Bar: Prev, Play, Next, Lofi Pomodoro */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevTrack}
                  className="p-1.5 bg-slate-700/70 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white cursor-pointer active:scale-95"
                  title="Pista anterior"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleToggleMusic}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all ${
                    isMusicOn ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isMusicOn ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>{isMusicOn ? 'Pausar' : 'Play'}</span>
                </button>
                <button
                  onClick={handleNextTrack}
                  className="p-1.5 bg-slate-700/70 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white cursor-pointer active:scale-95"
                  title="Pista siguiente"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* LoFi Focus Pomodoro Shortcut */}
              <button
                onClick={handlePlayPomodoroLofi}
                className="px-2.5 py-1 bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-500/40 rounded-lg text-[10px] font-bold text-indigo-200 flex items-center gap-1 cursor-pointer transition-colors"
                title="Activar Lo-Fi Pokémon para Pomodoro"
              >
                <Coffee className="w-3 h-3 text-indigo-400" />
                <span>Lo-Fi Focus</span>
              </button>
            </div>
          </div>

          {/* Mode Toggles: Zone vs Shuffle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleToggleAutoZone}
              className={`p-2 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition-all ${
                isAutoZone
                  ? 'bg-red-950/40 border-red-500/60 text-white'
                  : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isAutoZone ? 'text-amber-400' : 'text-slate-500'}`} />
              <div className="overflow-hidden">
                <p className="text-[10px] font-black truncate leading-tight">Por Zona</p>
                <p className="text-[8px] text-slate-400 truncate">{isAutoZone ? 'Activo' : 'Manual'}</p>
              </div>
            </button>

            <button
              onClick={handleToggleShuffle}
              className={`p-2 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition-all ${
                isShuffle
                  ? 'bg-purple-950/50 border-purple-500/70 text-white'
                  : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Shuffle className={`w-3.5 h-3.5 ${isShuffle ? 'text-purple-400' : 'text-slate-500'}`} />
              <div className="overflow-hidden">
                <p className="text-[10px] font-black truncate leading-tight">Aleatorio</p>
                <p className="text-[8px] text-slate-400 truncate">{isShuffle ? 'Shuffle ON' : 'Orden Normal'}</p>
              </div>
            </button>
          </div>

          {/* Volume Slider & SFX */}
          <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">Volumen BGM:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={handleVolumeChange}
              className="w-full accent-red-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
            <span className="text-[10px] font-mono text-slate-300">{Math.round(musicVolume * 100)}%</span>
            <button
              onClick={handleToggleSfx}
              className={`p-1 rounded-lg text-[9px] font-bold flex items-center gap-1 cursor-pointer border ${
                isSfxOn ? 'bg-slate-700 border-slate-600 text-emerald-400' : 'bg-slate-800 border-slate-800 text-slate-500'
              }`}
              title="Efectos de sonido"
            >
              {isSfxOn ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            </button>
          </div>

          {/* Track Selection List */}
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5 flex items-center justify-between">
              <span>Cancionero Pokémon (12 Tracks):</span>
              <span className="text-[9px] text-slate-500">Chiptune 8-bit</span>
            </p>
            <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto no-scrollbar pr-1">
              {(Object.keys(MUSIC_TRACKS) as MusicTrackId[]).map((tid) => {
                const tr = MUSIC_TRACKS[tid];
                const isSelected = currentTrackId === tid;
                return (
                  <button
                    key={tid}
                    onClick={() => handleSelectTrack(tid)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-red-600/30 border border-red-500/60 text-white font-bold'
                        : 'bg-slate-800/40 hover:bg-slate-800 border border-transparent text-slate-300'
                    }`}
                  >
                    <div className="truncate pr-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[11px] truncate leading-tight font-semibold">{tr.title}</p>
                        {tr.isLofi && (
                          <span className="px-1 py-0.2 text-[8px] bg-indigo-950 text-indigo-300 border border-indigo-700/50 rounded">
                            Lo-Fi
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-400 truncate">{tr.subtitle}</p>
                    </div>
                    {isSelected && isMusicOn && (
                      <span className="text-[10px] text-red-400 font-bold ml-1">▶</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
