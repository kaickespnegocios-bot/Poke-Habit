export type PokemonType =
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'psychic'
  | 'ice'
  | 'dragon'
  | 'dark'
  | 'fairy'
  | 'normal'
  | 'fighting'
  | 'flying'
  | 'poison'
  | 'ground'
  | 'rock'
  | 'bug'
  | 'ghost'
  | 'steel';

export type TaskDifficulty = 'facil' | 'media' | 'dificil' | 'legendaria';

export type TaskCategory =
  | 'hogar_cocina'
  | 'hogar_fregar'
  | 'hogar_barrer'
  | 'hogar_ordenar'
  | 'hogar_basura'
  | 'hogar_jardin'
  | 'hogar_cristales'
  | 'estudio_general'
  | 'salud_ejercicio'
  | 'personal_finanzas'
  | 'personal_creatividad';

export interface PokemonMove {
  name: string;
  type: PokemonType;
}

export interface PokemonStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
}

export type PokemonMood = 'feliz' | 'energico' | 'hambriento' | 'cansado' | 'mimoso' | 'entusiasmado';

export interface PartyPokemon {
  id: string; // unique instance id
  pokemonId: number; // PokeAPI id
  name: string;
  nickname?: string;
  level: number;
  currentXp: number;
  maxXp: number; // level * 100
  hp: number;
  maxHp: number;
  types: PokemonType[];
  sprite: string;
  animatedSprite?: string;
  officialArtwork?: string;
  moves: PokemonMove[];
  nature: string;
  isLegendary?: boolean;
  isMythical?: boolean;
  isInParty?: boolean;
  capturedAt: number;
  evolutionTargetId?: number;
  evolutionTargetName?: string;
  evolutionLevel?: number;
  // Care & Mood Needs
  mood?: PokemonMood;
  hunger?: number; // 0 to 100 (100 = lleno)
  happiness?: number; // 0 to 100
  cleanliness?: number; // 0 to 100
  energy?: number; // 0 to 100
  lastCareTimestamp?: number;
}

export type BerryId = 'oran' | 'sitrus' | 'pecha' | 'razz' | 'nanab' | 'pinap';

export interface BerryItemInfo {
  id: BerryId;
  name: string;
  description: string;
  effect: string;
  growthSec: number;
  seedCost: number;
  color: string;
  sprite: string;
  hungerRestore: number;
  happinessBonus: number;
  energyBonus: number;
  hpRestore: number;
}

export interface BerryPlot {
  id: string;
  plotIndex: number;
  berryType: BerryId | null;
  plantedAt: number | null;
  durationSec: number;
  isWatered: boolean;
  isFertilized: boolean;
  yieldAmount: number;
}

export interface BerryGardenState {
  plots: BerryPlot[];
  berries: Record<BerryId, number>;
  seeds: Record<BerryId, number>;
  fertilizerCount: number;
  hasWailmerPail: boolean;
}

export interface GradeRewardTier {
  id: string;
  minAverage: number;
  title: string;
  description: string;
  rewardGold: number;
  rewardItems: { id: string; name: string; count: number }[];
  rewardEgg?: EggRarity;
  rewardTitle?: string;
  claimed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  pokemonType: PokemonType;
  difficulty: TaskDifficulty;
  xpReward: number;
  goldReward: number;
  completed: boolean;
  completedAt?: number;
  isRecurringDaily?: boolean;
  assignedPokemonId?: string; // or 'all'
}

export interface DailyHabit {
  id: string;
  title: string;
  type: 'manual' | 'health_connect_steps';
  targetSteps?: number;
  completed: boolean;
  pokemonType: PokemonType;
  xpReward: number;
  goldReward: number;
}

export interface Subject3ESO {
  id: string;
  name: string;
  pokemonType: PokemonType;
  iconName: string;
  color: string;
  description: string;
  currentGrade?: number; // 0 to 10
  trimester1?: number;
  trimester2?: number;
  trimester3?: number;
  finalGrade?: number;
  isCustom?: boolean;
}

export interface ExamBoss {
  id: string;
  subjectId: string;
  title: string;
  date: string; // YYYY-MM-DD
  maxHp: number;
  currentHp: number;
  status: 'upcoming' | 'ready_for_eval' | 'passed' | 'failed';
  grade?: number;
  bossPokemonId: number;
  bossPokemonName: string;
  bossSprite: string;
  rewardGold: number;
  rewardXp: number;
  badgeName: string;
  badgeSprite: string;
  photos?: string[];
  notes?: string;
  examContent?: string; // Lo que entraba / temario
}

export interface Flashcard {
  id: string;
  subjectId: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface SkillStats {
  fitness: { level: number; xp: number; maxXp: number };
  intelligence: { level: number; xp: number; maxXp: number };
  cooking: { level: number; xp: number; maxXp: number };
  creativity: { level: number; xp: number; maxXp: number };
  finance: { level: number; xp: number; maxXp: number };
  sexualHealth: { level: number; xp: number; maxXp: number };
}

export interface SexualHealthLog {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  type: 'masturbation' | 'measurement' | 'reflection';
  mood?: 'bien' | 'neutral' | 'cansado' | 'estresado' | 'culpable';
  energyLevel?: number; // 1-5
  measurementCm?: number;
  measurementGirthCm?: number;
  notes?: string;
}

export interface PrivatePhoto {
  id: string;
  title: string;
  photoUrl: string; // data base64
  category: 'examen' | 'personal' | 'progreso' | 'otro';
  uploadedAt: number;
  notes?: string;
}

export interface SexualHealthState {
  hasPin: boolean;
  pinCode?: string;
  isUnlocked: boolean;
  discreetMode: boolean;
  logs: SexualHealthLog[];
  gallery: PrivatePhoto[];
  lastMeasurementCm?: number;
  totalMasturbationCount: number;
}

export type EggRarity = 'comun' | 'raro' | 'epico';

export interface Egg {
  id: string;
  rarity: EggRarity;
  name: string;
  stepsRequired: number;
  currentSteps: number;
  isIncubating: boolean;
  hatchCandidates: number[]; // Pokémon IDs
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'egg' | 'potion' | 'candy' | 'ball' | 'seed' | 'farming';
  icon: string;
  rarity?: EggRarity;
  healAmount?: number;
  catchBonus?: number;
  berryId?: BerryId;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  unlocked: boolean;
  rewardPokemonId: number;
  rewardPokemonName: string;
  rewardPokemonType: PokemonType;
  rewardSprite: string;
  isLegendary: boolean;
}

export interface TrainerProfile {
  name: string;
  email?: string;
  level: number;
  gold: number;
  avatarSprite: string;
  trainerTitle?: string;
  trainerClass?: string;
  favoriteType?: PokemonType;
  themeColor?: string;
  starterChosen: boolean;
  dailyStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  stepsToday: number;
  stepGoal: number;
  healthConnectGranted: boolean;
  isGoogleFitConnected?: boolean;
  googleFitEmail?: string;
  googleFitLastSync?: string;
  totalTasksCompleted: number;
  totalStepsAllTime: number;
  totalPomodorosDone: number;
  soundEnabled: boolean;
}

export interface PokedexEntry {
  id: number;
  name: string;
  types: PokemonType[];
  sprite: string;
  officialArtwork: string;
  isLegendary: boolean;
  isMythical: boolean;
  captured: boolean;
  height: number; // in decimetres
  weight: number; // in hectograms
  description: string;
}
