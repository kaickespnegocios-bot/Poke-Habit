import { PartyPokemon, PokemonType } from '../types';

export interface StarterOption {
  pokemonId: number;
  name: string;
  generation: number;
  types: PokemonType[];
  description: string;
  sprite: string;
  officialArtwork: string;
  evolutionLevel: number;
  evolutionTargetId: number;
  evolutionTargetName: string;
  moves: { name: string; type: PokemonType }[];
  nature: string;
  baseHp: number;
}

export const STARTERS: StarterOption[] = [
  // Gen 1
  {
    pokemonId: 1,
    name: 'Bulbasaur',
    generation: 1,
    types: ['grass', 'poison'],
    description: 'La semilla en su lomo va creciendo lentamente. Excelente compañero para tareas de jardín y biología.',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    evolutionLevel: 16,
    evolutionTargetId: 2,
    evolutionTargetName: 'Ivysaur',
    moves: [
      { name: 'Placaje', type: 'normal' },
      { name: 'Látigo Cepa', type: 'grass' },
    ],
    nature: 'Docile',
    baseHp: 45,
  },
  {
    pokemonId: 4,
    name: 'Charmander',
    generation: 1,
    types: ['fire'],
    description: 'La llama en la punta de su cola indica su energía vital. Perfecto para apasionados de la cocina y la física/química.',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    evolutionLevel: 16,
    evolutionTargetId: 5,
    evolutionTargetName: 'Charmeleon',
    moves: [
      { name: 'Arañazo', type: 'normal' },
      { name: 'Ascuas', type: 'fire' },
    ],
    nature: 'Brave',
    baseHp: 39,
  },
  {
    pokemonId: 7,
    name: 'Squirtle',
    generation: 1,
    types: ['water'],
    description: 'Su caparazón redondeado reduce la resistencia al agua. Ideal para fregar, lavar ropa y mantener todo impecable.',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
    evolutionLevel: 16,
    evolutionTargetId: 8,
    evolutionTargetName: 'Wartortle',
    moves: [
      { name: 'Placaje', type: 'normal' },
      { name: 'Pistola Agua', type: 'water' },
    ],
    nature: 'Relaxed',
    baseHp: 44,
  },
  {
    pokemonId: 25,
    name: 'Pikachu',
    generation: 1,
    types: ['electric'],
    description: 'Almacena electricidad en sus mejillas. Un compañero leal para la tecnología, productividad y energía matutina.',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    evolutionLevel: 22,
    evolutionTargetId: 26,
    evolutionTargetName: 'Raichu',
    moves: [
      { name: 'Impactrueno', type: 'electric' },
      { name: 'Ataque Rápido', type: 'normal' },
    ],
    nature: 'Hasty',
    baseHp: 35,
  },
  // Gen 2
  {
    pokemonId: 152,
    name: 'Chikorita',
    generation: 2,
    types: ['grass'],
    description: 'Agita la hoja aromática de su cabeza para calmar el ambiente. Maravilloso para hábitos tranquilos y constancia.',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/152.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png',
    evolutionLevel: 16,
    evolutionTargetId: 153,
    evolutionTargetName: 'Bayleef',
    moves: [
      { name: 'Placaje', type: 'normal' },
      { name: 'Hoja Afilada', type: 'grass' },
    ],
    nature: 'Calm',
    baseHp: 45,
  },
  {
    pokemonId: 155,
    name: 'Cyndaquil',
    generation: 2,
    types: ['fire'],
    description: 'Es tímido y suele enroscarse. Cuando se concentra en una meta, el fuego de su lomo arde con gran potencia.',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/155.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/155.png',
    evolutionLevel: 14,
    evolutionTargetId: 156,
    evolutionTargetName: 'Quilava',
    moves: [
      { name: 'Placaje', type: 'normal' },
      { name: 'Rueda Fuego', type: 'fire' },
    ],
    nature: 'Modest',
    baseHp: 39,
  },
  {
    pokemonId: 158,
    name: 'Totodile',
    generation: 2,
    types: ['water'],
    description: 'Pequeño pero con unas mandíbulas formidables y energía inagotable para afrontar grandes listas de tareas.',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/158.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/158.png',
    evolutionLevel: 18,
    evolutionTargetId: 159,
    evolutionTargetName: 'Croconaw',
    moves: [
      { name: 'Arañazo', type: 'normal' },
      { name: 'Pistola Agua', type: 'water' },
    ],
    nature: 'Jolly',
    baseHp: 50,
  },
  // Gen 3
  {
    pokemonId: 252,
    name: 'Treecko',
    generation: 3,
    types: ['grass'],
    description: 'Calmado y reflexivo, escala cualquier pared con rapidez. Un estratega genial para planificar exámenes.',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/252.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/252.png',
    evolutionLevel: 16,
    evolutionTargetId: 253,
    evolutionTargetName: 'Grovyle',
    moves: [
      { name: 'Destructor', type: 'normal' },
      { name: 'Megaagotar', type: 'grass' },
    ],
    nature: 'Timid',
    baseHp: 40,
  },
  {
    pokemonId: 255,
    name: 'Torchic',
    generation: 3,
    types: ['fire'],
    description: 'Tiene un saco de fuego interior que calienta a su entrenador. Conforme entrena, despierta un espíritu de lucha.',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/255.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/255.png',
    evolutionLevel: 16,
    evolutionTargetId: 256,
    evolutionTargetName: 'Combusken',
    moves: [
      { name: 'Arañazo', type: 'normal' },
      { name: 'Ascuas', type: 'fire' },
    ],
    nature: 'Adamant',
    baseHp: 45,
  },
  {
    pokemonId: 258,
    name: 'Mudkip',
    generation: 3,
    types: ['water'],
    description: 'Usa la aleta de su cabeza como radar para detectar cambios de corriente. Muy resistente y disciplinado.',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/258.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/258.png',
    evolutionLevel: 16,
    evolutionTargetId: 259,
    evolutionTargetName: 'Marshtomp',
    moves: [
      { name: 'Placaje', type: 'normal' },
      { name: 'Pistola Agua', type: 'water' },
    ],
    nature: 'Impish',
    baseHp: 50,
  },
  // Gen 4
  {
    pokemonId: 387,
    name: 'Turtwig',
    generation: 4,
    types: ['grass'],
    description: 'Su concha está hecha de tierra enriquecida. La constancia es su mayor virtud para el estudio diario.',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/387.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/387.png',
    evolutionLevel: 18,
    evolutionTargetId: 388,
    evolutionTargetName: 'Grotle',
    moves: [
      { name: 'Placaje', type: 'normal' },
      { name: 'Absorber', type: 'grass' },
    ],
    nature: 'Careful',
    baseHp: 55,
  },
  {
    pokemonId: 390,
    name: 'Chimchar',
    generation: 4,
    types: ['fire'],
    description: 'Muy ágil y lleno de energía. Ideal para entrenamientos físicos, deportes y jornadas intensas.',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/390.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/390.png',
    evolutionLevel: 14,
    evolutionTargetId: 391,
    evolutionTargetName: 'Monferno',
    moves: [
      { name: 'Arañazo', type: 'normal' },
      { name: 'Ascuas', type: 'fire' },
    ],
    nature: 'Naive',
    baseHp: 44,
  },
  {
    pokemonId: 393,
    name: 'Piplup',
    generation: 4,
    types: ['water'],
    description: 'Orgulloso y determinado. Nunca se rinde ante exámenes difíciles o retos complicados.',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/393.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/393.png',
    evolutionLevel: 16,
    evolutionTargetId: 394,
    evolutionTargetName: 'Prinplup',
    moves: [
      { name: 'Destructor', type: 'normal' },
      { name: 'Burbuja', type: 'water' },
    ],
    nature: 'Quiet',
    baseHp: 53,
  },
];

export function createStarterPartyPokemon(starter: StarterOption, nickname?: string): PartyPokemon {
  const level = 5;
  const maxHp = starter.baseHp + level * 5;
  return {
    id: `pokemon_${Date.now()}_${starter.pokemonId}`,
    pokemonId: starter.pokemonId,
    name: starter.name,
    nickname: nickname && nickname.trim() ? nickname.trim() : starter.name,
    level: level,
    currentXp: 0,
    maxXp: level * 100, // level 5 * 100 = 500
    hp: maxHp,
    maxHp: maxHp,
    types: starter.types,
    sprite: starter.sprite,
    officialArtwork: starter.officialArtwork,
    moves: starter.moves,
    nature: starter.nature,
    isLegendary: false,
    isMythical: false,
    capturedAt: Date.now(),
    evolutionTargetId: starter.evolutionTargetId,
    evolutionTargetName: starter.evolutionTargetName,
    evolutionLevel: starter.evolutionLevel,
  };
}
