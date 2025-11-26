// src/data/constants.ts

// --- TIPOS E INTERFACES ---

export interface Palette {
  label: string;
  hex: string;
  season: string;
  description: string;
  colors: string[];
  styles: string[];
}

export type SkinToneKey =
  | "very_light"
  | "light"
  | "medium"
  | "tan"
  | "dark"
  | "deep";

export interface FitMetrics {
  height: number;
  weight: number;
  preference: "tight" | "regular" | "loose";
}

export interface ClosetItem {
  id: string;
  name: string;
  image: string;
}

// --- DADOS ---

export const colorPalettes: Record<SkinToneKey, Palette> = {
  very_light: {
    label: "Muito Clara",
    hex: "#FAE7D0",
    season: "Inverno",
    description:
      "Combina melhor com tons limpos, frios e contrastantes. Neutros intensos e azuis profundos equilibram a pele.",
    colors: [
      "bg-blue-900",     // azul marinho
      "bg-slate-800",    // cinza azulado escuro
      "bg-gray-500",     // cinza claro
      "bg-red-950",  // vinho intenso
      "bg-indigo-950",      // preto azulado
      "bg-sky-950",        // branco gelo intenso
    ],
    styles: [
      "minimalista",
      "dramatico",
      "alfaiataria",
      "moderno",
      "clean",
      "contemporaneo",
    ],
  },

  light: {
    label: "Clara",
    hex: "#E3C1A0",
    season: "Inverno",
    description:
      "Fica bem com tons suaves, frios e neutros claros. Azul profundo e bege criam harmonia delicada.",
    colors: [
      "bg-blue-700",       // azul profundo
      "bg-gray-300",       // cinza frio claro
      "bg-neutral-600",    // cinza neutro médio
      "bg-stone-700",      // marrom terroso escuro
      "bg-emerald-800",    // verde fechado
      "bg-purple-900",     // roxo profundo
    ],
    styles: [
      "romantico_natural",
      "classico",
      "soft_casual",
      "vintage_clean",
      "cottagecore_neutro",
      "casual_chic",
    ],
  },

  medium: {
    label: "Média",
    hex: "#CFA880",
    season: "Primavera",
    description:
      "Peles médias brilham com tons quentes moderados como terracota, caramelo, marrons claros e verdes musgo.",
    colors: [
      "bg-amber-700",   // caramelo
      "bg-orange-900",  // terracota
      "bg-yellow-900",  // mostarda queimado
      "bg-green-800",   // musgo médio
      "bg-stone-700",   // café
      "bg-blue-900",    // marinho profundo
    ],
    styles: [
      "casual_natural",
      "esportivo_classico",
      "urbano_clean",
      "safari_moderno",
      "terroso",
      "preppy_neutro",
    ],
  },

  tan: {
    label: "Bronzeada",
    hex: "#A67B51",
    season: "Primavera",
    description:
      "Combina muito com tons terrosos, vinho, oliva e dourado médio.",
    colors: [
      "bg-green-900",   // oliva profundo
      "bg-red-900",     // bordô/vinho profundo
      "bg-yellow-800",  // dourado médio
      "bg-stone-800",   // marrom amargo
      "bg-amber-800",   // dourado queimado
      "bg-gray-700",    // grafite suave
    ],
    styles: [
      "boho_chic",
      "natural_urbano",
      "militar",
      "rustico_moderno",
      "chic_terroso",
      "folk",
    ],
  },

  dark: {
    label: "Escura",
    hex: "#7A4B28",
    season: "Verão",
    description:
      "Marinho, vinho, oliva escuro e especiarias criam profundidade vibrante e elegante.",
    colors: [
      "bg-blue-600",   // azul marinho
      "bg-indigo-900",  // índigo profundo
      "bg-fuchsia-400", // rosa pastel
      "bg-red-800",     // vinho escuro
      "bg-yellow-200",  // amarelo claro
      "bg-emerald-400",   // verde whatsapp
    ],
    styles: [
      "sofisticado",
      "executivo",
      "urbano_premium",
      "classico_forte",
      "minimalista_escuro",
      "moderno",
    ],
  },

  deep: {
    label: "Retinta",
    hex: "#422618",
    season: "Verão",
    description:
      "Contraste elevado combina com preto, vinho, azul noite, oliva escuro e branco gelo.",
    colors: [
      "bg-black",       // preto puro
      "bg-sky-50",       // branco gelo
      "bg-blue-950",    // azul noite
      "bg-purple-950",  // ameixa
      "bg-green-900",   // oliva escuro
      "bg-red-900",     // vinho profundo
    ],
    styles: [
      "streetwear_premium",
      "high_fashion",
      "classico_impactante",
      "moderno_forte",
      "minimalista_contrastado",
      "urbano_elegante",
    ],
  },
};

// --- CLOSET ---

export const initialClosetData: Record<string, ClosetItem[]> = {
  head: [
    { id: "h1", name: "Boné NY Preto", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=300&auto=format&fit=crop" },
    { id: "h2", name: "Beanie Cinza", image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=300&auto=format&fit=crop" },
    { id: "h3", name: "Bucket Hat", image: "https://images.unsplash.com/photo-1622445272461-c6580cab8755?q=80&w=300&auto=format&fit=crop" },
    { id: "h4", name: "Boné Bege", image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=300&auto=format&fit=crop" },
  ],
  top: [
    { id: "t1", name: "Camiseta Branca", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=300&auto=format&fit=crop" },
    { id: "t2", name: "Camisa Linho", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=300&auto=format&fit=crop" },
    { id: "t3", name: "Moletom Preto", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=300&auto=format&fit=crop" },
    { id: "t4", name: "Jaqueta Jeans", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=300&auto=format&fit=crop" },
  ],
  bottom: [
    { id: "b1", name: "Calça Chino", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=300&auto=format&fit=crop" },
    { id: "b2", name: "Jeans Azul", image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=300&auto=format&fit=crop" },
    { id: "b3", name: "Shorts Preto", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=300&auto=format&fit=crop" },
    { id: "b4", name: "Calça Cargo", image: "https://images.unsplash.com/photo-1517445312882-efe062fa46f2?q=80&w=300&auto=format&fit=crop" },
  ],
  feet: [
    { id: "f1", name: "Tênis Branco", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=300&auto=format&fit=crop" },
    { id: "f2", name: "Bota Chelsea", image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=300&auto=format&fit=crop" },
    { id: "f3", name: "Sneaker Colorido", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=300&auto=format&fit=crop" },
    { id: "f4", name: "Mocassim", image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=300&auto=format&fit=crop" },
  ],
};

// --- STYLE IMAGES ---

export const style_images_data: Record<string, string> = {
  minimalista: "https://images.unsplash.com/photo-1733209589780-99d3a8a3b3e4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  dramatico: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  alfaiataria: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop",
  gotico_suave: "https://images.unsplash.com/photo-1536243297275-48b4d1b82405?q=80&w=600&auto=format&fit=crop",
  moderno: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
  futurista: "https://images.unsplash.com/photo-1529139574466-a302c2d3e739?q=80&w=600&auto=format&fit=crop",
  romantico: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=600&auto=format&fit=crop",
  lady_like: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
  provencal: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=600&auto=format&fit=crop",
  classico: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=600&auto=format&fit=crop",
  vintage: "https://images.unsplash.com/photo-1550614000-4b9519e02a15?q=80&w=600&auto=format&fit=crop",
  cottagecore: "https://images.unsplash.com/photo-1502163140606-888448ae8cfe?q=80&w=600&auto=format&fit=crop",
  criativo: "https://images.unsplash.com/photo-1496747611176-843222e1e57?q=80&w=600&auto=format&fit=crop",
  tropical: "https://images.unsplash.com/photo-1527016021513-b09758b777d5?q=80&w=600&auto=format&fit=crop",
  esportivo: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
  color_block: "https://images.unsplash.com/photo-1509631179647-b84917147c2a?q=80&w=600&auto=format&fit=crop",
  casual_chic: "https://images.unsplash.com/photo-1704775991663-c8e2892c11c3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  preppy: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop",
  boho_chic: "https://images.unsplash.com/photo-1519725946194-c7da41215570?q=80&w=600&auto=format&fit=crop",
  natural: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
  folk: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=600&auto=format&fit=crop",
  safari: "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?q=80&w=600&auto=format&fit=crop",
  militar: "https://images.unsplash.com/photo-1588117260148-447885143a6d?q=80&w=600&auto=format&fit=crop",
  rustico: "https://images.unsplash.com/photo-1485230946086-1d99d529a730?q=80&w=600&auto=format&fit=crop",
  sofisticado: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=600&auto=format&fit=crop",
  glamour: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=600&auto=format&fit=crop",
  urbano: "https://images.unsplash.com/photo-1550928431-ee0ec6db30d3?q=80&w=600&auto=format&fit=crop",
  executivo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
  retro: "https://images.unsplash.com/photo-1550614000-4b9519e02a15?q=80&w=600&auto=format&fit=crop",
  barroco: "https://images.unsplash.com/photo-1550928431-ee0ec6db30d3?q=80&w=600&auto=format&fit=crop",
  streetwear: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop",
  high_fashion: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=600&auto=format&fit=crop",
  vibrante: "https://images.unsplash.com/photo-1496747611176-843222e1e57?q=80&w=600&auto=format&fit=crop",
  geometrico: "https://images.unsplash.com/photo-1462002596489-4d6cb6007421?q=80&w=600&auto=format&fit=crop",
  esportivo_deluxe: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
  pop_art: "https://images.unsplash.com/photo-1616892790299-44520b2996a1?q=80&w=600&auto=format&fit=crop",
};
