// 📂 Imports das imagens locais
import alfaiataria from "../assets/images/alfaiataria.jpg";
import barroco from "../assets/images/barroco.jpg";
import boho_chic from "../assets/images/boho_chic.png";
import casual_chic from "../assets/images/casual_chic.jpg";
import classico from "../assets/images/classico.jpg";
import color_block from "../assets/images/color_block.jpg";
import cottagecore from "../assets/images/cottagecore.jpg";
import criativo from "../assets/images/criativo.jpg";
import esportivo_deluxe from "../assets/images/esportivo_deluxe.jpg";
import esportivo from "../assets/images/esportivo.jpg";
import executivo from "../assets/images/executivo.jpg";
import folk from "../assets/images/folk.jpg";
import futurista from "../assets/images/futurista.jpg";
import geometrico from "../assets/images/geometrico.jpg";
import glamour from "../assets/images/glamour.jpg";
import gotico from "../assets/images/gotico.jpg";
import high_fashion from "../assets/images/high_fashion.jpg";
import dramatico from "../assets/images/dramatico.jpg";
import lady_like from "../assets/images/lady_like.jpg";
import militar from "../assets/images/militar.png";
import minimalista from "../assets/images/minimalista.png";
import moderno from "../assets/images/moderno.jpg";
import natural from "../assets/images/natural.jpg";
import pop_art from "../assets/images/pop_art.jpg";
import preppy from "../assets/images/preppy.jpg";
import provençal from "../assets/images/provençal.jpg";
import retro from "../assets/images/retro.png";
import romantico from "../assets/images/romantico.png";
import rustico from "../assets/images/rustico.jpg";
import safari from "../assets/images/safari.jpg";
import sofisticado from "../assets/images/sofisticado.png";
import streetwear from "../assets/images/streetwear.jpg";
import tropical from "../assets/images/tropical.jpg";
import urbano from "../assets/images/urbano.png";
import vibrante from "../assets/images/vibrante.jpg";
import vintage from "../assets/images/vintage.jpg";

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
      "bg-blue-900",
      "bg-slate-800",
      "bg-gray-500",
      "bg-red-950",
      "bg-indigo-950",
      "bg-sky-950",
    ],
    styles: [
      "minimalista",
      "dramatico",
      "alfaiataria",
      "moderno",
      "classico",
      "sofisticado",
    ],
  },

  light: {
    label: "Clara",
    hex: "#E3C1A0",
    season: "Inverno",
    description:
      "Fica bem com tons suaves, frios e neutros claros. Azul profundo e bege criam harmonia delicada.",
    colors: [
      "bg-blue-700",
      "bg-gray-300",
      "bg-neutral-600",
      "bg-stone-700",
      "bg-emerald-800",
      "bg-purple-900",
    ],
    styles: [
      "romantico",
      "classico",
      "casual_chic",
      "vintage",
      "cottagecore",
      "lady_like",
    ],
  },

  medium: {
    label: "Média",
    hex: "#CFA880",
    season: "Primavera",
    description:
      "Peles médias brilham com tons quentes moderados como terracota, caramelo, marrons claros e verdes musgo.",
    colors: [
      "bg-amber-700",
      "bg-orange-900",
      "bg-yellow-900",
      "bg-green-800",
      "bg-stone-700",
      "bg-blue-900",
    ],
    styles: ["natural", "esportivo", "urbano", "safari", "folk", "preppy"],
  },

  tan: {
    label: "Bronzeada",
    hex: "#A67B51",
    season: "Primavera",
    description:
      "Combina muito com tons terrosos, vinho, oliva e dourado médio.",
    colors: [
      "bg-green-900",
      "bg-red-900",
      "bg-yellow-800",
      "bg-stone-800",
      "bg-amber-800",
      "bg-gray-700",
    ],
    styles: ["boho_chic", "natural", "militar", "rustico", "glamour", "folk"],
  },

  dark: {
    label: "Escura",
    hex: "#7A4B28",
    season: "Verão",
    description:
      "Tons ricos e profundos como azul marinho, roxo, vermelho escuro e verde esmeralda realçam a pele.",
    colors: [
      "bg-blue-600",
      "bg-indigo-900",
      "bg-fuchsia-400",
      "bg-red-800",
      "bg-yellow-200",
      "bg-emerald-400",
    ],
    styles: [
      "sofisticado",
      "executivo",
      "urbano",
      "high_fashion",
      "moderno",
      "vibrante",
    ],
  },

  deep: {
    label: "Retinta",
    hex: "#422618",
    season: "Verão",
    description:
      "Contraste elevado combina com preto, vinho, azul noite, oliva escuro e branco gelo.",
    colors: [
      "bg-black",
      "bg-sky-50",
      "bg-blue-950",
      "bg-purple-950",
      "bg-green-900",
      "bg-red-900",
    ],
    styles: [
      "streetwear",
      "high_fashion",
      "classico",
      "moderno",
      "minimalista",
      "urbano",
    ],
  },
};

// --- CLOSET ---

export const initialClosetData: Record<string, ClosetItem[]> = {
  head: [
    {
      id: "h1",
      name: "Boné NY Preto",
      image:
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "h2",
      name: "Beanie Cinza",
      image:
        "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "h3",
      name: "Bucket Hat",
      image:
        "https://images.unsplash.com/photo-1622445272461-c6580cab8755?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "h4",
      name: "Boné Bege",
      image:
        "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=300&auto=format&fit=crop",
    },
  ],
  top: [
    {
      id: "t1",
      name: "Camiseta Branca",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "t2",
      name: "Camisa Linho",
      image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "t3",
      name: "Moletom Preto",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "t4",
      name: "Jaqueta Jeans",
      image:
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=300&auto=format&fit=crop",
    },
  ],
  bottom: [
    {
      id: "b1",
      name: "Calça Chino",
      image:
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "b2",
      name: "Jeans Azul",
      image:
        "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "b3",
      name: "Shorts Preto",
      image:
        "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "b4",
      name: "Calça Cargo",
      image:
        "https://images.unsplash.com/photo-1517445312882-efe062fa46f2?q=80&w=300&auto=format&fit=crop",
    },
  ],
  feet: [
    {
      id: "f1",
      name: "Tênis Branco",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "f2",
      name: "Bota Chelsea",
      image:
        "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "f3",
      name: "Sneaker Colorido",
      image:
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "f4",
      name: "Mocassim",
      image:
        "https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=300&auto=format&fit=crop",
    },
  ],
};

// --- STYLE IMAGES ---

export const styleImagesData: Record<string, string> = {
  minimalista: minimalista,
  dramatico: dramatico,
  alfaiataria: alfaiataria,
  gotico_suave: gotico,
  moderno: moderno,
  futurista: futurista,
  romantico: romantico,
  lady_like: lady_like,
  provencal: provençal,
  classico: classico,
  vintage: vintage,
  cottagecore: cottagecore,
  criativo: criativo,
  tropical: tropical,
  esportivo: esportivo,
  color_block: color_block,
  casual_chic: casual_chic,
  preppy: preppy,
  boho_chic: boho_chic,
  natural: natural,
  folk: folk,
  safari: safari,
  militar: militar,
  rustico: rustico,
  sofisticado: sofisticado,
  glamour: glamour,
  urbano: urbano,
  executivo: executivo,
  retro: retro,
  barroco: barroco,
  streetwear: streetwear,
  high_fashion: high_fashion,
  vibrante: vibrante,
  geometrico: geometrico,
  esportivo_deluxe: esportivo_deluxe,
  pop_art: pop_art,
};
