/**
 * PokéQuest Procedural 8-bit / Chiptune Web Audio Engine
 * Provides authentic GameBoy/GBA style Sound Effects and Multi-Track Background Music.
 */

export type MusicTrackId =
  | 'route1'
  | 'pallet_town'
  | 'pokecenter'
  | 'pokemart'
  | 'study_lofi'
  | 'camp_lofi'
  | 'cycling_road'
  | 'surf_theme'
  | 'lavender_town'
  | 'battle'
  | 'gym_leader'
  | 'victory';

export interface TrackMetadata {
  id: MusicTrackId;
  title: string;
  subtitle: string;
  mood: string;
  tempo: number; // BPM
  isLofi?: boolean;
}

export const MUSIC_TRACKS: Record<MusicTrackId, TrackMetadata> = {
  route1: {
    id: 'route1',
    title: 'Ruta 1 (Kanto)',
    subtitle: 'Aventura & Tareas Diarias',
    mood: 'Alegre • Exploración',
    tempo: 128,
  },
  pallet_town: {
    id: 'pallet_town',
    title: 'Pueblo Paleta',
    subtitle: 'Hogar & Orígenes de Entrenador',
    mood: 'Nostálgico • Paz',
    tempo: 98,
    isLofi: true,
  },
  pokecenter: {
    id: 'pokecenter',
    title: 'Centro Pokémon',
    subtitle: 'Equipo Pokémon & Curación',
    mood: 'Relajante • Curación',
    tempo: 104,
  },
  pokemart: {
    id: 'pokemart',
    title: 'PokéMart & Bazar',
    subtitle: 'Tienda de Objetos & Semillas de Bayas',
    mood: 'Animado • Compras',
    tempo: 136,
  },
  study_lofi: {
    id: 'study_lofi',
    title: 'Pokémon Lo-Fi Study Beats',
    subtitle: 'Pomodoro & Concentración de Estudios',
    mood: 'Calma Profunda • Focus Lo-Fi',
    tempo: 84,
    isLofi: true,
  },
  camp_lofi: {
    id: 'camp_lofi',
    title: 'Campamento Pokémon & Huerto',
    subtitle: 'Cuidados de Pokémon & Cultivo de Bayas',
    mood: 'Acogedor • Campestre',
    tempo: 96,
    isLofi: true,
  },
  cycling_road: {
    id: 'cycling_road',
    title: 'Camino de Bicis (Cycling Road)',
    subtitle: 'Hábitos Saludables & Pasos',
    mood: 'Enérgico • Fitness',
    tempo: 144,
  },
  surf_theme: {
    id: 'surf_theme',
    title: 'Tema de Surf (A lomos de Lapras)',
    subtitle: 'Viaje Fluvial & Fluidez Mental',
    mood: 'Ondulante • Aventura Acuática',
    tempo: 116,
  },
  lavender_town: {
    id: 'lavender_town',
    title: 'Pueblo Lavanda (Chiptune Misterioso)',
    subtitle: 'Atmósfera Enigmática 8-bit',
    mood: 'Místico • Concentración Extra',
    tempo: 108,
  },
  battle: {
    id: 'battle',
    title: 'Combate de Entrenador / Examen',
    subtitle: 'Flashcards & Evaluación Académica',
    mood: 'Tensión • Dinámico',
    tempo: 152,
  },
  gym_leader: {
    id: 'gym_leader',
    title: 'Batalla de Líder de Gimnasio',
    subtitle: 'Boss de Examen Final',
    mood: 'Épico • Adrenalina Máxima',
    tempo: 160,
  },
  victory: {
    id: 'victory',
    title: '¡Victoria de Entrenador & Fanfarria!',
    subtitle: 'Santuario de Legendarios & Logros',
    mood: 'Triunfal • Épico',
    tempo: 120,
  },
};

// Note to Frequency mapping (Hz)
const NOTE_FREQS: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, Db4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23,
  Gb4: 369.99, G4: 392.0, Ab4: 415.3, A4: 440.0, Bb4: 466.16, B4: 493.88,
  C5: 523.25, Db5: 554.37, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46,
  Gb5: 739.99, G5: 783.99, Ab5: 830.61, A5: 880.0, Bb5: 932.33, B5: 987.77,
  C6: 1046.5, D6: 1174.66, E6: 1318.51, F6: 1396.91, G6: 1567.98,
  REST: 0,
};

type NoteDef = [string, number]; // [noteName, duration in beats]

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private sfxEnabled: boolean = true;
  private musicEnabled: boolean = false;
  private autoChangeByZone: boolean = true;
  private isShuffleMode: boolean = false;
  private sfxVolume: number = 0.5;
  private musicVolume: number = 0.35;

  private currentTrackId: MusicTrackId = 'route1';
  private isMusicPlaying: boolean = false;
  private musicSchedulerInterval: number | null = null;
  private currentStep: number = 0;
  private loopsPlayed: number = 0;
  private nextNoteTime: number = 0;
  private masterMusicGain: GainNode | null = null;
  private activeMusicOscillators: { stop: (t: number) => void }[] = [];

  // Listeners for UI state sync
  private onStateChangeListeners: Array<() => void> = [];

  constructor() {
    // Lazy initialized on first user interaction
  }

  public subscribe(listener: () => void) {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.onStateChangeListeners.forEach((l) => l());
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // ==========================================
  // SFX CONFIG & CONTROLS
  // ==========================================
  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    this.notify();
  }

  public isSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
    this.notify();
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  public setAutoChangeByZone(enabled: boolean) {
    this.autoChangeByZone = enabled;
    if (enabled) {
      this.isShuffleMode = false;
    }
    this.notify();
  }

  public isAutoChangeByZone(): boolean {
    return this.autoChangeByZone;
  }

  public setShuffleMode(enabled: boolean) {
    this.isShuffleMode = enabled;
    if (enabled) {
      this.autoChangeByZone = false;
    }
    this.notify();
  }

  public isShuffleEnabled(): boolean {
    return this.isShuffleMode;
  }

  public playNextTrack() {
    const trackKeys = Object.keys(MUSIC_TRACKS) as MusicTrackId[];
    if (this.isShuffleMode) {
      const remaining = trackKeys.filter((t) => t !== this.currentTrackId);
      const randomTrack = remaining[Math.floor(Math.random() * remaining.length)] || 'route1';
      this.setTrack(randomTrack, true);
    } else {
      const currentIndex = trackKeys.indexOf(this.currentTrackId);
      const nextIndex = (currentIndex + 1) % trackKeys.length;
      this.setTrack(trackKeys[nextIndex], true);
    }
  }

  public playPrevTrack() {
    const trackKeys = Object.keys(MUSIC_TRACKS) as MusicTrackId[];
    const currentIndex = trackKeys.indexOf(this.currentTrackId);
    const prevIndex = (currentIndex - 1 + trackKeys.length) % trackKeys.length;
    this.setTrack(trackKeys[prevIndex], true);
  }

  public playPomodoroLofi() {
    this.setTrack('study_lofi', true);
    if (!this.musicEnabled) {
      this.setMusicEnabled(true);
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    this.notify();
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.masterMusicGain && this.ctx) {
      this.masterMusicGain.gain.setValueAtTime(this.musicVolume * 0.4, this.ctx.currentTime);
    }
    this.notify();
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public getCurrentTrackId(): MusicTrackId {
    return this.currentTrackId;
  }

  // ==========================================
  // RETRO SOUND EFFECTS (8-BIT SFX)
  // ==========================================

  public playClick() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.04);

      gain.gain.setValueAtTime(0.08 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  public playSelect() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(783.99, now + 0.04); // G5

      gain.gain.setValueAtTime(0.12 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  public playCancel() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(392.0, now + 0.05); // G4

      gain.gain.setValueAtTime(0.1 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  public playToggle() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

      gain.gain.setValueAtTime(0.15 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  public playTaskComplete() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);

        gain.gain.setValueAtTime(0.16 * this.sfxVolume, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.14);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.14);
      });
    } catch {}
  }

  public playLevelUp() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Classic Pokémon Level Up Fanfare
      const melody = [
        { f: 392.0, d: 0.09 },  // G4
        { f: 392.0, d: 0.09 },  // G4
        { f: 392.0, d: 0.09 },  // G4
        { f: 523.25, d: 0.18 }, // C5
        { f: 659.25, d: 0.18 }, // E5
        { f: 783.99, d: 0.28 }, // G5
        { f: 659.25, d: 0.14 }, // E5
        { f: 783.99, d: 0.38 }, // G5
      ];

      let t = now;
      melody.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.14 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + note.d);
        t += note.d * 0.92;
      });
    } catch {}
  }

  public playHeal() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Pokémon Center 6-Tone Healing Chime
      const notes = [
        { f: 659.25, d: 0.12 }, // E5
        { f: 587.33, d: 0.12 }, // D5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.22 }, // G5
        { f: 659.25, d: 0.16 }, // E5
        { f: 1046.5, d: 0.45 }, // C6
      ];

      let t = now;
      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.2 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + note.d);
        t += note.d * 0.95;
      });
    } catch {}
  }

  public playAttackHit() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);

      gain.gain.setValueAtTime(0.22 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  public playSuperEffective() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // High-impact explosion + chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'square';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(220, now + 0.18);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.exponentialRampToValueAtTime(110, now + 0.18);

      gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.2);
      osc2.stop(now + 0.2);
    } catch {}
  }

  public playFaint() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.35);

      gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  public playItemBuy() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Cash register 2-chime
      const notes = [783.99, 1046.5]; // G5, C6
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);

        gain.gain.setValueAtTime(0.18 * this.sfxVolume, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.12);
      });
    } catch {}
  }

  public playItemUse() {
    this.playItemBuy();
  }

  public playSave() {
    this.playToggle();
  }

  public playRareCandy() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [659.25, 783.99, 987.77, 1318.51, 1567.98];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.06);

        gain.gain.setValueAtTime(0.18 * this.sfxVolume, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.2);
      });
    } catch {}
  }

  public playCaptureSuccess() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [659.25, 783.99, 987.77, 1318.51];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);

        gain.gain.setValueAtTime(0.2 * this.sfxVolume, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.25);
      });
    } catch {}
  }

  public playVictory() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Grand Pokémon Gym / Legendary Victory Fanfare
      const fanfare = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 523.25, d: 0.12 }, // C5
        { f: 523.25, d: 0.12 }, // C5
        { f: 523.25, d: 0.28 }, // C5
        { f: 415.3, d: 0.28 },  // G#4
        { f: 466.16, d: 0.28 }, // A#4
        { f: 523.25, d: 0.18 }, // C5
        { f: 466.16, d: 0.14 }, // A#4
        { f: 523.25, d: 0.6 },  // C5
      ];

      let t = now;
      fanfare.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(n.f, t);

        gain.gain.setValueAtTime(0.22 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + n.d);
        t += n.d * 0.95;
      });
    } catch {}
  }

  public playEggCrack() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.09);

      gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  public playPomodoroBell() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Gentle brass bell / meditation chime
      const bellFreqs = [523.25, 1046.5, 1567.98];
      bellFreqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.18 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.2);
      });
    } catch {}
  }

  // ==========================================
  // PROCEDURAL MULTI-TRACK BACKGROUND MUSIC
  // ==========================================

  public setTrack(trackId: MusicTrackId, forced: boolean = false) {
    if (this.currentTrackId === trackId && this.isMusicPlaying && !forced) {
      return;
    }
    this.currentTrackId = trackId;
    if (this.musicEnabled) {
      this.startMusic();
    }
    this.notify();
  }

  public handleZoneChange(tabKey: string) {
    if (!this.autoChangeByZone) return;

    switch (tabKey) {
      case 'dashboard':
      case 'tasks':
        this.setTrack('route1');
        break;
      case 'party':
        this.setTrack('pokecenter');
        break;
      case 'pokemon_care':
        this.setTrack('camp_lofi');
        break;
      case 'shop':
        this.setTrack('pokemart');
        break;
      case 'study':
        this.setTrack('study_lofi');
        break;
      case 'daily':
        this.setTrack('cycling_road');
        break;
      case 'pokedex':
        this.setTrack('pallet_town');
        break;
      case 'skills':
        this.setTrack('surf_theme');
        break;
      case 'achievements':
        this.setTrack('victory');
        break;
      case 'sexual_health':
        this.setTrack('lavender_town');
        break;
      default:
        this.setTrack('route1');
        break;
    }
  }

  public toggleMusic(): boolean {
    const nextState = !this.musicEnabled;
    this.setMusicEnabled(nextState);
    return nextState;
  }

  public startMusic() {
    this.stopMusic();
    const ctx = this.getContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    this.currentStep = 0;
    this.loopsPlayed = 0;
    this.nextNoteTime = ctx.currentTime + 0.05;

    // Master gain node for music
    this.masterMusicGain = ctx.createGain();
    this.masterMusicGain.gain.setValueAtTime(this.musicVolume * 0.35, ctx.currentTime);
    this.masterMusicGain.connect(ctx.destination);

    // Start scheduling loop
    this.musicSchedulerInterval = window.setInterval(() => {
      this.scheduleMusicPattern();
    }, 40);

    this.notify();
  }

  public stopMusic() {
    if (this.musicSchedulerInterval !== null) {
      clearInterval(this.musicSchedulerInterval);
      this.musicSchedulerInterval = null;
    }

    if (this.ctx) {
      const now = this.ctx.currentTime;
      this.activeMusicOscillators.forEach((osc) => {
        try {
          osc.stop(now + 0.05);
        } catch {}
      });
    }
    this.activeMusicOscillators = [];
    this.isMusicPlaying = false;
    this.notify();
  }

  private scheduleMusicPattern() {
    const ctx = this.ctx;
    if (!ctx || !this.isMusicPlaying || !this.masterMusicGain) return;

    const track = MUSIC_TRACKS[this.currentTrackId];
    const beatDuration = 60 / track.tempo; // Duration of 1 beat (quarter note) in seconds
    const stepDuration = beatDuration / 2; // Eighth note step

    // Schedule ahead 150ms
    while (this.nextNoteTime < ctx.currentTime + 0.15) {
      this.playStepNotes(this.currentTrackId, this.currentStep, this.nextNoteTime, stepDuration);
      this.nextNoteTime += stepDuration;
      this.currentStep = (this.currentStep + 1) % 32; // 32 sixteenth/eighth-step loops
      if (this.currentStep === 0) {
        this.loopsPlayed++;
        if (this.isShuffleMode && this.loopsPlayed >= 2) {
          this.loopsPlayed = 0;
          const trackKeys = Object.keys(MUSIC_TRACKS) as MusicTrackId[];
          const next = trackKeys[Math.floor(Math.random() * trackKeys.length)];
          this.currentTrackId = next;
          this.notify();
        }
      }
    }
  }

  private playStepNotes(trackId: MusicTrackId, step: number, time: number, stepDuration: number) {
    if (!this.ctx || !this.masterMusicGain) return;

    const trackScore = this.getTrackScore(trackId, step);
    if (!trackScore) return;

    // 1. Lead Melody Note (Square Wave 50% duty)
    if (trackScore.lead && NOTE_FREQS[trackScore.lead]) {
      const freq = NOTE_FREQS[trackScore.lead];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, time);

      const noteLength = stepDuration * (trackScore.leadLen || 0.9);
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + noteLength);

      osc.connect(gain);
      gain.connect(this.masterMusicGain);

      osc.start(time);
      osc.stop(time + noteLength);
      this.activeMusicOscillators.push(osc);
    }

    // 2. Harmony / Chords (Square or Triangle Wave)
    if (trackScore.harmony && NOTE_FREQS[trackScore.harmony]) {
      const freq = NOTE_FREQS[trackScore.harmony];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = trackId === 'study_lofi' ? 'sine' : 'square';
      osc.frequency.setValueAtTime(freq, time);

      const noteLength = stepDuration * (trackScore.harmLen || 0.8);
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + noteLength);

      osc.connect(gain);
      gain.connect(this.masterMusicGain);

      osc.start(time);
      osc.stop(time + noteLength);
      this.activeMusicOscillators.push(osc);
    }

    // 3. Bass Line (Triangle Wave)
    if (trackScore.bass && NOTE_FREQS[trackScore.bass]) {
      const freq = NOTE_FREQS[trackScore.bass];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      const noteLength = stepDuration * 0.85;
      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + noteLength);

      osc.connect(gain);
      gain.connect(this.masterMusicGain);

      osc.start(time);
      osc.stop(time + noteLength);
      this.activeMusicOscillators.push(osc);
    }

    // 4. Subtle 8-Bit Percussion / Noise tick on beats
    if (trackScore.percussion && step % 2 === 0) {
      this.playChiptunePercussion(time, trackScore.percussion);
    }

    // Clean up old osc references
    if (this.activeMusicOscillators.length > 60) {
      this.activeMusicOscillators = this.activeMusicOscillators.slice(-30);
    }
  }

  private playChiptunePercussion(time: number, type: 'kick' | 'snare' | 'hihat') {
    if (!this.ctx || !this.masterMusicGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (type === 'kick') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, time);
        osc.frequency.exponentialRampToValueAtTime(30, time + 0.07);

        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);

        osc.connect(gain);
        gain.connect(this.masterMusicGain);

        osc.start(time);
        osc.stop(time + 0.07);
      } else if (type === 'snare' || type === 'hihat') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(type === 'snare' ? 240 : 800, time);
        osc.frequency.exponentialRampToValueAtTime(50, time + 0.04);

        gain.gain.setValueAtTime(type === 'snare' ? 0.15 : 0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

        osc.connect(gain);
        gain.connect(this.masterMusicGain);

        osc.start(time);
        osc.stop(time + 0.04);
      }
    } catch {}
  }

  // Melodies and Chord Progressions for the distinct tracks
  private getTrackScore(trackId: MusicTrackId, step: number): {
    lead?: string;
    leadLen?: number;
    harmony?: string;
    harmLen?: number;
    bass?: string;
    percussion?: 'kick' | 'snare' | 'hihat';
  } {
    switch (trackId) {
      case 'route1': {
        // Cheerful Pallet Town / Route 1 Style Melody
        const leads = [
          'G5', 'A5', 'B5', 'C6', 'D6', 'B5', 'G5', 'E5',
          'F5', 'G5', 'A5', 'F5', 'D5', 'REST', 'D5', 'E5',
          'F5', 'G5', 'A5', 'B5', 'C6', 'G5', 'E5', 'C5',
          'D5', 'E5', 'F5', 'D5', 'C5', 'REST', 'REST', 'REST',
        ];
        const harmonies = [
          'E5', 'F5', 'G5', 'A5', 'B5', 'G5', 'E5', 'C5',
          'D5', 'E5', 'F5', 'D5', 'B4', 'REST', 'B4', 'C5',
          'D5', 'E5', 'F5', 'G5', 'A5', 'E5', 'C5', 'G4',
          'B4', 'C5', 'D5', 'B4', 'G4', 'REST', 'REST', 'REST',
        ];
        const basses = [
          'C3', 'G3', 'C3', 'G3', 'G3', 'D3', 'G3', 'D3',
          'D3', 'A3', 'D3', 'A3', 'G3', 'D3', 'G3', 'B3',
          'F3', 'C3', 'F3', 'C3', 'C3', 'G3', 'C3', 'E3',
          'G3', 'D3', 'G3', 'B3', 'C3', 'G3', 'C3', 'REST',
        ];
        return {
          lead: leads[step],
          harmony: harmonies[step],
          bass: basses[step],
          percussion: step % 4 === 0 ? 'kick' : step % 4 === 2 ? 'snare' : 'hihat',
        };
      }

      case 'pokecenter': {
        // Peaceful Relaxing Waltz (Pokemon Center Theme Style)
        const leads = [
          'E5', 'REST', 'G5', 'REST', 'C6', 'REST', 'B5', 'A5',
          'G5', 'REST', 'E5', 'REST', 'D5', 'REST', 'REST', 'REST',
          'F5', 'REST', 'A5', 'REST', 'D6', 'REST', 'C6', 'B5',
          'A5', 'REST', 'F5', 'REST', 'G5', 'REST', 'REST', 'REST',
        ];
        const harmonies = [
          'C5', 'REST', 'E5', 'REST', 'G5', 'REST', 'G5', 'F5',
          'E5', 'REST', 'C5', 'REST', 'B4', 'REST', 'REST', 'REST',
          'D5', 'REST', 'F5', 'REST', 'A5', 'REST', 'A5', 'G5',
          'F5', 'REST', 'D5', 'REST', 'E5', 'REST', 'REST', 'REST',
        ];
        const basses = [
          'C3', 'E3', 'G3', 'E3', 'C3', 'E3', 'G3', 'E3',
          'G3', 'B3', 'D4', 'B3', 'G3', 'B3', 'D4', 'B3',
          'D3', 'F3', 'A3', 'F3', 'D3', 'F3', 'A3', 'F3',
          'G3', 'B3', 'D4', 'B3', 'C3', 'E3', 'G3', 'REST',
        ];
        return {
          lead: leads[step],
          harmony: harmonies[step],
          bass: basses[step],
          percussion: step % 4 === 0 ? 'kick' : 'hihat',
        };
      }

      case 'pokemart': {
        // Upbeat Syncopated Shop Theme
        const leads = [
          'C5', 'E5', 'G5', 'C6', 'B5', 'G5', 'E5', 'REST',
          'A5', 'F5', 'D5', 'F5', 'G5', 'REST', 'G5', 'REST',
          'C5', 'E5', 'G5', 'C6', 'D6', 'C6', 'B5', 'A5',
          'G5', 'E5', 'D5', 'B4', 'C5', 'REST', 'REST', 'REST',
        ];
        const basses = [
          'C3', 'REST', 'G3', 'C3', 'G3', 'REST', 'D3', 'G3',
          'F3', 'REST', 'C3', 'F3', 'G3', 'REST', 'D3', 'G3',
          'C3', 'REST', 'G3', 'C3', 'F3', 'REST', 'C3', 'F3',
          'G3', 'REST', 'D3', 'G3', 'C3', 'G3', 'C3', 'REST',
        ];
        return {
          lead: leads[step],
          bass: basses[step],
          percussion: step % 4 === 0 ? 'kick' : step % 4 === 2 ? 'snare' : 'hihat',
        };
      }

      case 'study_lofi': {
        // Calming Lavender / Focus Lofi Chiptune Loop
        const leads = [
          'C5', 'E5', 'G5', 'B5', 'C6', 'B5', 'G5', 'E5',
          'A4', 'C5', 'E5', 'G5', 'A5', 'G5', 'E5', 'C5',
          'F4', 'A4', 'C5', 'E5', 'F5', 'E5', 'C5', 'A4',
          'G4', 'B4', 'D5', 'F5', 'G5', 'F5', 'D5', 'B4',
        ];
        const harmonies = [
          'G4', 'REST', 'E4', 'REST', 'G4', 'REST', 'E4', 'REST',
          'E4', 'REST', 'C4', 'REST', 'E4', 'REST', 'C4', 'REST',
          'C4', 'REST', 'A3', 'REST', 'C4', 'REST', 'A3', 'REST',
          'D4', 'REST', 'B3', 'REST', 'D4', 'REST', 'B3', 'REST',
        ];
        const basses = [
          'C3', 'REST', 'G3', 'REST', 'C3', 'REST', 'G3', 'REST',
          'A3', 'REST', 'E3', 'REST', 'A3', 'REST', 'E3', 'REST',
          'F3', 'REST', 'C3', 'REST', 'F3', 'REST', 'C3', 'REST',
          'G3', 'REST', 'D3', 'REST', 'G3', 'REST', 'D3', 'REST',
        ];
        return {
          lead: leads[step],
          harmony: harmonies[step],
          bass: basses[step],
          percussion: step % 8 === 0 ? 'kick' : step % 8 === 4 ? 'snare' : undefined,
        };
      }

      case 'cycling_road': {
        // Fast Driving 144 BPM Cycling Road Theme
        const leads = [
          'C5', 'D5', 'E5', 'G5', 'E5', 'D5', 'C5', 'D5',
          'E5', 'G5', 'A5', 'C6', 'A5', 'G5', 'E5', 'REST',
          'F5', 'G5', 'A5', 'C6', 'A5', 'F5', 'E5', 'G5',
          'D5', 'E5', 'F5', 'D5', 'C5', 'REST', 'REST', 'REST',
        ];
        const basses = [
          'C3', 'C3', 'G3', 'C3', 'C3', 'C3', 'G3', 'C3',
          'A3', 'A3', 'E3', 'A3', 'A3', 'A3', 'E3', 'A3',
          'F3', 'F3', 'C3', 'F3', 'C3', 'C3', 'G3', 'C3',
          'G3', 'G3', 'D3', 'G3', 'C3', 'G3', 'C3', 'REST',
        ];
        return {
          lead: leads[step],
          bass: basses[step],
          percussion: step % 2 === 0 ? 'kick' : 'snare',
        };
      }

      case 'battle': {
        // Fast Dramatic Pokémon Boss Battle Chiptune
        const leads = [
          'Eb5', 'D5', 'Eb5', 'F5', 'Eb5', 'D5', 'C5', 'REST',
          'Gb5', 'F5', 'Gb5', 'Ab5', 'Gb5', 'F5', 'Eb5', 'REST',
          'C6', 'Bb5', 'Ab5', 'G5', 'Ab5', 'Bb5', 'C6', 'REST',
          'Db6', 'C6', 'Bb5', 'Ab5', 'G5', 'F5', 'Eb5', 'D5',
        ];
        const basses = [
          'C3', 'C3', 'Eb3', 'C3', 'C3', 'C3', 'Eb3', 'C3',
          'C3', 'C3', 'Eb3', 'C3', 'C3', 'C3', 'Eb3', 'C3',
          'Ab3', 'Ab3', 'C3', 'Ab3', 'Bb3', 'Bb3', 'D3', 'Bb3',
          'G3', 'G3', 'B3', 'G3', 'C3', 'G3', 'C3', 'REST',
        ];
        return {
          lead: leads[step],
          bass: basses[step],
          percussion: step % 2 === 0 ? 'kick' : 'snare',
        };
      }

      case 'pallet_town': {
        // Peaceful Acoustic Pallet Town Nostalgia
        const leads = [
          'G5', 'REST', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5',
          'C5', 'REST', 'D5', 'E5', 'D5', 'REST', 'REST', 'REST',
          'G5', 'REST', 'E5', 'G5', 'C6', 'B5', 'A5', 'G5',
          'A5', 'REST', 'B5', 'C6', 'C6', 'REST', 'REST', 'REST',
        ];
        const harmonies = [
          'E5', 'REST', 'C5', 'E5', 'F5', 'E5', 'C5', 'B4',
          'A4', 'REST', 'B4', 'C5', 'B4', 'REST', 'REST', 'REST',
          'E5', 'REST', 'C5', 'E5', 'G5', 'G5', 'F5', 'E5',
          'F5', 'REST', 'G5', 'G5', 'E5', 'REST', 'REST', 'REST',
        ];
        const basses = [
          'C3', 'REST', 'G3', 'C3', 'F3', 'REST', 'C3', 'G3',
          'A3', 'REST', 'E3', 'A3', 'G3', 'REST', 'D3', 'G3',
          'C3', 'REST', 'G3', 'C3', 'F3', 'REST', 'C3', 'F3',
          'G3', 'REST', 'D3', 'G3', 'C3', 'G3', 'C3', 'REST',
        ];
        return {
          lead: leads[step],
          harmony: harmonies[step],
          bass: basses[step],
          percussion: step % 8 === 0 ? 'kick' : undefined,
        };
      }

      case 'camp_lofi': {
        // Cozy Berry Farm & Pokemon Camp Loop
        const leads = [
          'E5', 'G5', 'A5', 'C6', 'B5', 'G5', 'E5', 'REST',
          'D5', 'F5', 'A5', 'D6', 'C6', 'A5', 'F5', 'REST',
          'E5', 'G5', 'C6', 'E6', 'D6', 'C6', 'A5', 'G5',
          'F5', 'E5', 'D5', 'B4', 'C5', 'REST', 'REST', 'REST',
        ];
        const harmonies = [
          'C5', 'E5', 'F5', 'G5', 'G5', 'E5', 'C5', 'REST',
          'B4', 'D5', 'F5', 'A5', 'A5', 'F5', 'D5', 'REST',
          'C5', 'E5', 'G5', 'C6', 'B5', 'A5', 'F5', 'E5',
          'D5', 'C5', 'B4', 'G4', 'G4', 'REST', 'REST', 'REST',
        ];
        const basses = [
          'C3', 'REST', 'G3', 'REST', 'F3', 'REST', 'C3', 'REST',
          'D3', 'REST', 'A3', 'REST', 'G3', 'REST', 'D3', 'REST',
          'C3', 'REST', 'G3', 'REST', 'F3', 'REST', 'C3', 'REST',
          'G3', 'REST', 'D3', 'REST', 'C3', 'REST', 'G3', 'REST',
        ];
        return {
          lead: leads[step],
          harmony: harmonies[step],
          bass: basses[step],
          percussion: step % 4 === 0 ? 'kick' : step % 4 === 2 ? 'snare' : 'hihat',
        };
      }

      case 'surf_theme': {
        // Lapras Ocean Flow Surf Melody
        const leads = [
          'C5', 'E5', 'G5', 'A5', 'B5', 'C6', 'B5', 'G5',
          'A5', 'C6', 'D6', 'E6', 'D6', 'B5', 'G5', 'REST',
          'F5', 'A5', 'C6', 'D6', 'E6', 'F6', 'E6', 'C6',
          'D6', 'C6', 'B5', 'A5', 'G5', 'REST', 'REST', 'REST',
        ];
        const basses = [
          'C3', 'G3', 'E3', 'G3', 'G3', 'D3', 'B3', 'D3',
          'A3', 'E3', 'C3', 'E3', 'G3', 'D3', 'B3', 'D3',
          'F3', 'C3', 'A3', 'C3', 'C3', 'G3', 'E3', 'G3',
          'D3', 'A3', 'F3', 'A3', 'G3', 'D3', 'G3', 'REST',
        ];
        return {
          lead: leads[step],
          bass: basses[step],
          percussion: step % 4 === 0 ? 'kick' : 'hihat',
        };
      }

      case 'lavender_town': {
        // Mysterious Chiptune Tone (Lavender Town Style)
        const leads = [
          'C6', 'G5', 'B5', 'F#5', 'C6', 'G5', 'B5', 'F#5',
          'E5', 'G5', 'B5', 'E6', 'D6', 'B5', 'G5', 'E5',
          'C6', 'G5', 'B5', 'F#5', 'C6', 'G5', 'B5', 'F#5',
          'B5', 'G5', 'E5', 'B4', 'C5', 'REST', 'REST', 'REST',
        ];
        const harmonies = [
          'REST', 'E5', 'REST', 'D#5', 'REST', 'E5', 'REST', 'D#5',
          'REST', 'C5', 'REST', 'B4', 'REST', 'C5', 'REST', 'B4',
          'REST', 'E5', 'REST', 'D#5', 'REST', 'E5', 'REST', 'D#5',
          'REST', 'E5', 'REST', 'G4', 'E4', 'REST', 'REST', 'REST',
        ];
        const basses = [
          'C3', 'REST', 'G3', 'REST', 'B2', 'REST', 'F#3', 'REST',
          'E3', 'REST', 'B3', 'REST', 'G3', 'REST', 'E3', 'REST',
          'C3', 'REST', 'G3', 'REST', 'B2', 'REST', 'F#3', 'REST',
          'E3', 'REST', 'B3', 'REST', 'C3', 'REST', 'E3', 'REST',
        ];
        return {
          lead: leads[step],
          harmony: harmonies[step],
          bass: basses[step],
        };
      }

      case 'gym_leader': {
        // Fast Adrenaline Gym Leader / Final Exam Battle
        const leads = [
          'C6', 'C6', 'Bb5', 'C6', 'Eb6', 'D6', 'C6', 'Bb5',
          'G5', 'Bb5', 'C6', 'Eb6', 'F6', 'Eb6', 'D6', 'C6',
          'Ab5', 'Bb5', 'C6', 'Db6', 'Eb6', 'Db6', 'C6', 'Bb5',
          'C6', 'Eb6', 'G6', 'F6', 'Eb6', 'D6', 'C6', 'REST',
        ];
        const basses = [
          'C3', 'C3', 'C3', 'C3', 'Eb3', 'Eb3', 'Eb3', 'Eb3',
          'G3', 'G3', 'G3', 'G3', 'F3', 'F3', 'F3', 'F3',
          'Ab3', 'Ab3', 'Ab3', 'Ab3', 'Bb3', 'Bb3', 'Bb3', 'Bb3',
          'C3', 'Eb3', 'G3', 'Bb3', 'C4', 'G3', 'C3', 'REST',
        ];
        return {
          lead: leads[step],
          bass: basses[step],
          percussion: step % 2 === 0 ? 'kick' : 'snare',
        };
      }

      case 'victory': {
        // Glorious Victory Fanfare & Anthem
        const leads = [
          'C5', 'E5', 'G5', 'C6', 'REST', 'C6', 'REST', 'C6',
          'B5', 'C6', 'D6', 'B5', 'G5', 'REST', 'REST', 'REST',
          'F5', 'A5', 'C6', 'F6', 'REST', 'F6', 'REST', 'F6',
          'E6', 'D6', 'C6', 'B5', 'C6', 'REST', 'REST', 'REST',
        ];
        const harmonies = [
          'G4', 'C5', 'E5', 'G5', 'REST', 'G5', 'REST', 'G5',
          'G5', 'A5', 'B5', 'G5', 'E5', 'REST', 'REST', 'REST',
          'A4', 'C5', 'F5', 'A5', 'REST', 'A5', 'REST', 'A5',
          'G5', 'F5', 'E5', 'D5', 'E5', 'REST', 'REST', 'REST',
        ];
        const basses = [
          'C3', 'G3', 'C3', 'G3', 'C3', 'G3', 'C3', 'G3',
          'G3', 'D3', 'G3', 'D3', 'G3', 'D3', 'G3', 'D3',
          'F3', 'C3', 'F3', 'C3', 'F3', 'C3', 'F3', 'C3',
          'G3', 'D3', 'G3', 'B3', 'C3', 'G3', 'C3', 'REST',
        ];
        return {
          lead: leads[step],
          harmony: harmonies[step],
          bass: basses[step],
          percussion: step % 4 === 0 ? 'kick' : step % 4 === 2 ? 'snare' : 'hihat',
        };
      }
    }
  }
}

export const soundFx = new RetroAudioEngine();
