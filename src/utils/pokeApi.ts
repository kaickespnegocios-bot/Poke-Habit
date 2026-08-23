import { PartyPokemon, PokedexEntry, PokemonType } from '../types';

const CACHE_PREFIX = 'pokeapi_cache_';

export interface PokeApiResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: { name: string } }[];
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: { front_default: string };
      showdown?: { front_default: string };
    };
  };
  species: { name: string; url: string };
}

export interface PokeApiSpeciesResponse {
  is_legendary: boolean;
  is_mythical: boolean;
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
  evolution_chain: { url: string };
}

// Popular and classic Pokémon dataset with accurate data to ensure instant response & offline reliability
export const LOCAL_POKEDEX_DATA: PokedexEntry[] = [
  {
    id: 1,
    name: 'Bulbasaur',
    types: ['grass', 'poison'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    isLegendary: false,
    isMythical: false,
    captured: true,
    height: 7,
    weight: 69,
    description: 'La semilla de su lomo almacena nutrientes y crece absorbiendo la luz solar.',
  },
  {
    id: 2,
    name: 'Ivysaur',
    types: ['grass', 'poison'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 10,
    weight: 130,
    description: 'Cuando el capullo de su lomo empieza a oler bien, es síntoma de que florecerá pronto.',
  },
  {
    id: 3,
    name: 'Venusaur',
    types: ['grass', 'poison'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 20,
    weight: 1000,
    description: 'Llena el aire con un aroma fascinante que tranquiliza las emociones de quienes lo rodean.',
  },
  {
    id: 4,
    name: 'Charmander',
    types: ['fire'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 6,
    weight: 85,
    description: 'La llama que arde en la punta de su cola expresa sus emociones y vitalidad.',
  },
  {
    id: 5,
    name: 'Charmeleon',
    types: ['fire'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 11,
    weight: 190,
    description: 'Es de naturaleza agresiva. En combate agita su cola ígnea y desgarra con afiladas garras.',
  },
  {
    id: 6,
    name: 'Charizard',
    types: ['fire', 'flying'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 17,
    weight: 905,
    description: 'Vuela en busca de rivales fuertes y echa un fuego tan caliente que funde cualquier roca.',
  },
  {
    id: 7,
    name: 'Squirtle',
    types: ['water'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 5,
    weight: 90,
    description: 'Se protege dentro de su concha y luego dispara agua a presión con gran puntería.',
  },
  {
    id: 8,
    name: 'Wartortle',
    types: ['water'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 10,
    weight: 225,
    description: 'Su larga cola cubierta de suave pelaje es símbolo de longevidad y sabiduría.',
  },
  {
    id: 9,
    name: 'Blastoise',
    types: ['water'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 16,
    weight: 855,
    description: 'Los cañones de su caparazón disparan chorros de agua capaces de perforar planchas de acero.',
  },
  {
    id: 16,
    name: 'Pidgey',
    types: ['normal', 'flying'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 3,
    weight: 18,
    description: 'Tiene un sentido de la orientación asombroso. Regresa a su nido sin importar la distancia.',
  },
  {
    id: 25,
    name: 'Pikachu',
    types: ['electric'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 4,
    weight: 60,
    description: 'Genera descargas eléctricas con las bolsas rojas de sus mejillas.',
  },
  {
    id: 26,
    name: 'Raichu',
    types: ['electric'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 8,
    weight: 300,
    description: 'Su cola larga le sirve de toma de tierra para protegerse de su propio alto voltaje.',
  },
  {
    id: 39,
    name: 'Jigglypuff',
    types: ['normal', 'fairy'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 5,
    weight: 55,
    description: 'Graba en quien lo escucha una dulce nana que induce un sueño irresistible.',
  },
  {
    id: 52,
    name: 'Meowth',
    types: ['normal'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 4,
    weight: 42,
    description: 'Le fascinan los objetos brillantes y redondos, especialmente las monedas de oro.',
  },
  {
    id: 54,
    name: 'Psyduck',
    types: ['water'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 8,
    weight: 196,
    description: 'Padece continuos dolores de cabeza; cuando se intensifican, desata misteriosos poderes psíquicos.',
  },
  {
    id: 65,
    name: 'Alakazam',
    types: ['psychic'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 15,
    weight: 480,
    description: 'Su coeficiente intelectual supera los 5000 puntos y recuerda todo lo sucedido desde su nacimiento.',
  },
  {
    id: 66,
    name: 'Machop',
    types: ['fighting'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 8,
    weight: 195,
    description: 'Entrena levantando rocas gigantes para volverse invencible y disciplinado.',
  },
  {
    id: 74,
    name: 'Geodude',
    types: ['rock', 'ground'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/74.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 4,
    weight: 200,
    description: 'Suele confundirse con una roca común en senderos montañosos.',
  },
  {
    id: 92,
    name: 'Gastly',
    types: ['ghost', 'poison'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 13,
    weight: 1,
    description: 'Su cuerpo gaseoso puede deslizarse por cualquier rendija sin ser detectado.',
  },
  {
    id: 94,
    name: 'Gengar',
    types: ['ghost', 'poison'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 15,
    weight: 405,
    description: 'Se esconde en las sombras de la gente por diversión y absorbe el calor circundante.',
  },
  {
    id: 126,
    name: 'Magmar',
    types: ['fire'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/126.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/126.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 13,
    weight: 445,
    description: 'Nacido en el cráter de un volcán, su cuerpo entero está envuelto en llamas ondulantes.',
  },
  {
    id: 131,
    name: 'Lapras',
    types: ['water', 'ice'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 25,
    weight: 2200,
    description: 'De índole pacífica y gentil, transporta a humanos y Pokémon sobre su lomo por el océano.',
  },
  {
    id: 133,
    name: 'Eevee',
    types: ['normal'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 3,
    weight: 65,
    description: 'Posee una estructura genética irregular que le permite evolucionar en diversas formas.',
  },
  {
    id: 143,
    name: 'Snorlax',
    types: ['normal'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 21,
    weight: 4600,
    description: 'Come 400 kilos de comida al día y luego se echa a dormir plácidamente.',
  },
  {
    id: 144,
    name: 'Articuno',
    types: ['ice', 'flying'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png',
    isLegendary: true,
    isMythical: false,
    captured: false,
    height: 17,
    weight: 554,
    description: 'Legendaria ave de hielo. Puede congelar el aire circundante batiendo sus alas.',
  },
  {
    id: 145,
    name: 'Zapdos',
    types: ['electric', 'flying'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png',
    isLegendary: true,
    isMythical: false,
    captured: false,
    height: 16,
    weight: 526,
    description: 'Legendaria ave del trueno. Se dice que mora en el corazón de nubes de tormenta.',
  },
  {
    id: 146,
    name: 'Moltres',
    types: ['fire', 'flying'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png',
    isLegendary: true,
    isMythical: false,
    captured: false,
    height: 20,
    weight: 600,
    description: 'Legendaria ave de fuego. Cada aleteo ilumina el cielo nocturno con un brillo carmesí.',
  },
  {
    id: 147,
    name: 'Dratini',
    types: ['dragon'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/147.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/147.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 18,
    weight: 33,
    description: 'Muda de piel continuamente a medida que acumula energía mística en su interior.',
  },
  {
    id: 149,
    name: 'Dragonite',
    types: ['dragon', 'flying'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 22,
    weight: 2100,
    description: 'Capaz de dar la vuelta al mundo en tan solo 16 horas con vuelo ultrasónico.',
  },
  {
    id: 150,
    name: 'Mewtwo',
    types: ['psychic'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
    isLegendary: true,
    isMythical: false,
    captured: false,
    height: 20,
    weight: 1220,
    description: 'Creado mediante manipulación genética avanzada. Posee las habilidades de combate más extremas.',
  },
  {
    id: 151,
    name: 'Mew',
    types: ['psychic'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png',
    isLegendary: false,
    isMythical: true,
    captured: false,
    height: 4,
    weight: 40,
    description: 'Se cree que contiene la composición genética de todos los Pokémon existentes.',
  },
  {
    id: 152,
    name: 'Chikorita',
    types: ['grass'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/152.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 9,
    weight: 64,
    description: 'Le encanta tomar el sol. Su hoja despide una fragancia suave y relajante.',
  },
  {
    id: 155,
    name: 'Cyndaquil',
    types: ['fire'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/155.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/155.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 5,
    weight: 79,
    description: 'Cuando se asusta o enfada, las llamas brotan con furia de su espalda.',
  },
  {
    id: 158,
    name: 'Totodile',
    types: ['water'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/158.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/158.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 6,
    weight: 95,
    description: 'Sus poderosas fauces pueden morder cualquier cosa en señal de juego o cariño.',
  },
  {
    id: 243,
    name: 'Raikou',
    types: ['electric'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/243.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/243.png',
    isLegendary: true,
    isMythical: false,
    captured: false,
    height: 19,
    weight: 1780,
    description: 'Encarna la velocidad del rayo. Su rugido hace temblar la tierra como un trueno.',
  },
  {
    id: 244,
    name: 'Entei',
    types: ['fire'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/244.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/244.png',
    isLegendary: true,
    isMythical: false,
    captured: false,
    height: 21,
    weight: 1980,
    description: 'Se dice que nace cada vez que entra en erupción un nuevo volcán.',
  },
  {
    id: 245,
    name: 'Suicune',
    types: ['water'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/245.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/245.png',
    isLegendary: true,
    isMythical: false,
    captured: false,
    height: 20,
    weight: 1870,
    description: 'Personifica la pureza de las aguas manantiales. Purifica lagos al tocarlos.',
  },
  {
    id: 249,
    name: 'Lugia',
    types: ['psychic', 'flying'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png',
    isLegendary: true,
    isMythical: false,
    captured: false,
    height: 52,
    weight: 2160,
    description: 'Guardián legendario de los mares. Sus alas desatan tormentas de 40 días.',
  },
  {
    id: 250,
    name: 'Ho-Oh',
    types: ['fire', 'flying'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/250.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/250.png',
    isLegendary: true,
    isMythical: false,
    captured: false,
    height: 38,
    weight: 1990,
    description: 'Vuela continuamente por los cielos del mundo dejando una estela con los 7 colores del arcoíris.',
  },
  {
    id: 252,
    name: 'Treecko',
    types: ['grass'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/252.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/252.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 5,
    weight: 50,
    description: 'Posee pequeños ganchos en las plantas de sus patas para trepar por paredes y techos.',
  },
  {
    id: 255,
    name: 'Torchic',
    types: ['fire'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/255.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/255.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 4,
    weight: 25,
    description: 'Su interior arde como un horno caliente. Lanza bolas de fuego de 1000 grados.',
  },
  {
    id: 258,
    name: 'Mudkip',
    types: ['water'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/258.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/258.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 4,
    weight: 76,
    description: 'En el agua respira usando las branquias de sus mejillas y nada a gran velocidad.',
  },
  {
    id: 384,
    name: 'Rayquaza',
    types: ['dragon', 'flying'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/384.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png',
    isLegendary: true,
    isMythical: false,
    captured: false,
    height: 70,
    weight: 2065,
    description: 'Habita en la capa de ozono y desciende solo para apaciguar colisiones titánicas.',
  },
  {
    id: 448,
    name: 'Lucario',
    types: ['fighting', 'steel'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 12,
    weight: 540,
    description: 'Puede percibir las auras de todos los seres vivos y anticipar sus movimientos.',
  },
  {
    id: 445,
    name: 'Garchomp',
    types: ['dragon', 'ground'],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
    officialArtwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png',
    isLegendary: false,
    isMythical: false,
    captured: false,
    height: 19,
    weight: 950,
    description: 'Vuela a velocidad supersónica como un avión a reacción mientras busca presas.',
  },
];

// Egg Hatching pools: STRICTLY NON-LEGENDARY and NON-MYTHICAL
export const COMMON_EGG_POOL = [16, 52, 54, 66, 74, 92, 133, 39]; // Pidgey, Meowth, Psyduck, Machop, Geodude, Gastly, Eevee, Jigglypuff
export const RARE_EGG_POOL = [1, 4, 7, 25, 147, 152, 155, 158, 252, 255, 258]; // Starters + Dratini
export const EPIC_EGG_POOL = [131, 143, 149, 448, 445, 65, 94]; // Lapras, Snorlax, Dragonite, Lucario, Garchomp, Alakazam, Gengar

// Cache in Local Storage helper
export async function fetchPokemonData(idOrName: string | number): Promise<PokedexEntry | null> {
  const cacheKey = `${CACHE_PREFIX}${idOrName}`;
  const localMatch = LOCAL_POKEDEX_DATA.find(
    (p) => p.id === Number(idOrName) || p.name.toLowerCase() === String(idOrName).toLowerCase()
  );

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // ignore
  }

  // Try live network with PokeAPI
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${String(idOrName).toLowerCase()}`);
    if (!res.ok) throw new Error('PokeAPI response not ok');
    const data: PokeApiResponse = await res.json();

    let isLegendary = false;
    let isMythical = false;
    let desc = localMatch?.description || `${data.name} registrado en la Pokédex.`;

    try {
      const speciesRes = await fetch(data.species.url);
      if (speciesRes.ok) {
        const speciesData: PokeApiSpeciesResponse = await speciesRes.json();
        isLegendary = speciesData.is_legendary;
        isMythical = speciesData.is_mythical;
        const spanishEntry = speciesData.flavor_text_entries.find((f) => f.language.name === 'es');
        if (spanishEntry) {
          desc = spanishEntry.flavor_text.replace(/[\n\f]/g, ' ');
        }
      }
    } catch {
      // ignore species fetch error
    }

    const types = data.types.map((t) => t.type.name as PokemonType);
    const entry: PokedexEntry = {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      types,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
      officialArtwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
      isLegendary,
      isMythical,
      captured: false,
      height: data.height,
      weight: data.weight,
      description: desc,
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch {
      // storage full
    }
    return entry;
  } catch {
    // Return local catalog match if available
    return localMatch || null;
  }
}

export const POKEDEX_DATABASE: PokedexEntry[] = LOCAL_POKEDEX_DATA;

export function getRandomCatchablePokemon(rarity: 'comun' | 'raro' | 'epico' = 'comun'): PokedexEntry {
  // STRICT RULE: Never hatch legendary or mythical pokemon from eggs!
  const nonLegendaries = LOCAL_POKEDEX_DATA.filter((p) => !p.isLegendary && !p.isMythical);

  let pool = nonLegendaries;
  if (rarity === 'comun') {
    // Basic unevolved common pokemon
    pool = nonLegendaries.filter((p) => [1, 4, 7, 10, 13, 16, 19, 21, 23, 27, 29, 32, 41, 43, 60, 69, 74].includes(p.id)) || nonLegendaries;
  } else if (rarity === 'raro') {
    pool = nonLegendaries.filter((p) => [25, 37, 58, 63, 77, 92, 116, 120, 123, 133].includes(p.id)) || nonLegendaries;
  } else if (rarity === 'epico') {
    pool = nonLegendaries.filter((p) => [131, 143, 147, 148, 130, 94, 65, 59, 6].includes(p.id)) || nonLegendaries;
  }

  const selected = pool[Math.floor(Math.random() * pool.length)] || nonLegendaries[0];
  return selected;
}

export function createPartyPokemonFromPokedex(entry: PokedexEntry, level: number = 5): PartyPokemon {
  const maxHp = Math.floor(entry.weight * 0.2 + level * 5 + 30);
  return {
    id: `pkmn_${Date.now()}_${entry.id}`,
    pokemonId: entry.id,
    name: entry.name,
    nickname: entry.name,
    level,
    currentXp: 0,
    maxXp: level * 100,
    hp: maxHp,
    maxHp,
    types: entry.types,
    sprite: entry.sprite,
    officialArtwork: entry.officialArtwork,
    moves: [
      { name: 'Placaje', type: 'normal' },
      { name: entry.types[0] === 'fire' ? 'Ascuas' : entry.types[0] === 'water' ? 'Pistola Agua' : entry.types[0] === 'grass' ? 'Látigo Cepa' : 'Ataque Rápido', type: entry.types[0] || 'normal' },
    ],
    nature: 'Docile',
    isLegendary: entry.isLegendary,
    isMythical: entry.isMythical,
    capturedAt: Date.now(),
  };
}
