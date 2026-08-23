import { PokemonType, TaskCategory } from '../types';

export interface TypeInfo {
  name: PokemonType;
  label: string;
  color: string;
  textColor: string;
  bgLight: string;
  border: string;
}

export const POKEMON_TYPES: Record<PokemonType, TypeInfo> = {
  fire: {
    name: 'fire',
    label: 'Fuego',
    color: '#F08030',
    textColor: '#FFFFFF',
    bgLight: '#FFF0E6',
    border: '#E06818',
  },
  water: {
    name: 'water',
    label: 'Agua',
    color: '#6890F0',
    textColor: '#FFFFFF',
    bgLight: '#EDF4FF',
    border: '#4A76E0',
  },
  grass: {
    name: 'grass',
    label: 'Planta',
    color: '#78C850',
    textColor: '#FFFFFF',
    bgLight: '#EFFCEB',
    border: '#5EAC34',
  },
  electric: {
    name: 'electric',
    label: 'Eléctrico',
    color: '#F8D030',
    textColor: '#544100',
    bgLight: '#FFFAEB',
    border: '#DEB514',
  },
  psychic: {
    name: 'psychic',
    label: 'Psíquico',
    color: '#F85888',
    textColor: '#FFFFFF',
    bgLight: '#FFF0F5',
    border: '#E03C70',
  },
  ice: {
    name: 'ice',
    label: 'Hielo',
    color: '#98D8D8',
    textColor: '#1A4D4D',
    bgLight: '#F0FFFF',
    border: '#72BEBE',
  },
  dragon: {
    name: 'dragon',
    label: 'Dragón',
    color: '#7038F8',
    textColor: '#FFFFFF',
    bgLight: '#F3EDFF',
    border: '#531BDC',
  },
  dark: {
    name: 'dark',
    label: 'Siniestro',
    color: '#705848',
    textColor: '#FFFFFF',
    bgLight: '#F5EFEB',
    border: '#533F31',
  },
  fairy: {
    name: 'fairy',
    label: 'Hada',
    color: '#EE99AC',
    textColor: '#FFFFFF',
    bgLight: '#FFF2F5',
    border: '#D97A8F',
  },
  normal: {
    name: 'normal',
    label: 'Normal',
    color: '#A8A878',
    textColor: '#FFFFFF',
    bgLight: '#F7F7F0',
    border: '#8C8C5A',
  },
  fighting: {
    name: 'fighting',
    label: 'Lucha',
    color: '#C03028',
    textColor: '#FFFFFF',
    bgLight: '#FFECEB',
    border: '#9E221B',
  },
  flying: {
    name: 'flying',
    label: 'Volador',
    color: '#A890F0',
    textColor: '#FFFFFF',
    bgLight: '#F4F0FF',
    border: '#8B70DF',
  },
  poison: {
    name: 'poison',
    label: 'Veneno',
    color: '#A040A0',
    textColor: '#FFFFFF',
    bgLight: '#FAF0FA',
    border: '#822882',
  },
  ground: {
    name: 'ground',
    label: 'Tierra',
    color: '#E0C068',
    textColor: '#FFFFFF',
    bgLight: '#FCF7EB',
    border: '#C4A346',
  },
  rock: {
    name: 'rock',
    label: 'Roca',
    color: '#B8A038',
    textColor: '#FFFFFF',
    bgLight: '#FAF6E6',
    border: '#9A8420',
  },
  bug: {
    name: 'bug',
    label: 'Bicho',
    color: '#A8B820',
    textColor: '#FFFFFF',
    bgLight: '#F8FBE4',
    border: '#8A9908',
  },
  ghost: {
    name: 'ghost',
    label: 'Fantasma',
    color: '#705598',
    textColor: '#FFFFFF',
    bgLight: '#F2EDFA',
    border: '#533B79',
  },
  steel: {
    name: 'steel',
    label: 'Acero',
    color: '#B8B8D0',
    textColor: '#FFFFFF',
    bgLight: '#F3F3F9',
    border: '#9898B6',
  },
};

export interface CategoryMapping {
  category: TaskCategory;
  name: string;
  defaultType: PokemonType;
  icon: string;
  description: string;
}

export const CATEGORY_MAPPINGS: Record<TaskCategory, CategoryMapping> = {
  hogar_cocina: {
    category: 'hogar_cocina',
    name: 'Cocina & Preparar comida',
    defaultType: 'fire',
    icon: 'Utensils',
    description: 'Cocinar, hornear o preparar la comida diaria (+50% XP si tienes Pokémon tipo Fuego).',
  },
  hogar_fregar: {
    category: 'hogar_fregar',
    name: 'Fregar platos & Lavar ropa',
    defaultType: 'water',
    icon: 'Droplets',
    description: 'Lavar platos, poner lavadora o tender ropa (+50% XP para tipo Agua).',
  },
  hogar_barrer: {
    category: 'hogar_barrer',
    name: 'Barrer, fregar suelo & Aspirar',
    defaultType: 'ground',
    icon: 'Sparkles',
    description: 'Limpiar suelos y aspirar polvo (+50% XP para tipo Tierra o Normal).',
  },
  hogar_ordenar: {
    category: 'hogar_ordenar',
    name: 'Ordenar habitación & Escritorio',
    defaultType: 'psychic',
    icon: 'FolderKanban',
    description: 'Organizar cajones, ropa y libros (+50% XP para tipo Psíquico).',
  },
  hogar_basura: {
    category: 'hogar_basura',
    name: 'Tirar la basura & Reciclar',
    defaultType: 'poison',
    icon: 'Trash2',
    description: 'Bajar bolsas al contenedor y reciclar (+50% XP para tipo Veneno).',
  },
  hogar_jardin: {
    category: 'hogar_jardin',
    name: 'Cuidar plantas & Jardín',
    defaultType: 'grass',
    icon: 'Leaf',
    description: 'Regar macetas y mantener el jardín (+50% XP para tipo Planta).',
  },
  hogar_cristales: {
    category: 'hogar_cristales',
    name: 'Limpiar cristales & Espejos',
    defaultType: 'flying',
    icon: 'Wind',
    description: 'Dejar transparentes ventanas y espejos (+50% XP para tipo Volador o Hielo).',
  },
  estudio_general: {
    category: 'estudio_general',
    name: 'Estudio & Deberes 3º ESO',
    defaultType: 'psychic',
    icon: 'GraduationCap',
    description: 'Repaso y tareas escolares (+50% XP según la asignatura).',
  },
  salud_ejercicio: {
    category: 'salud_ejercicio',
    name: 'Salud, Deporte & Caminar',
    defaultType: 'fighting',
    icon: 'Dumbbell',
    description: 'Gimnasio, caminata o entrenamiento (+50% XP para tipo Lucha).',
  },
  personal_finanzas: {
    category: 'personal_finanzas',
    name: 'Ahorro & Gestión Personal',
    defaultType: 'steel',
    icon: 'Coins',
    description: 'Anotar gastos, presupuesto y metas (+50% XP para tipo Acero).',
  },
  personal_creatividad: {
    category: 'personal_creatividad',
    name: 'Creatividad, Música & Arte',
    defaultType: 'fairy',
    icon: 'Palette',
    description: 'Dibujar, tocar instrumento o escribir (+50% XP para tipo Hada).',
  },
};
