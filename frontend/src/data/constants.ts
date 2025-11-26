// src/data/constants.ts

// --- TIPOS E INTERFACES (Adicione 'export' em tudo) ---

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

// --- DADOS (Adicione 'export' em tudo) ---

export const colorPalettes: Record<SkinToneKey, Palette> = {
  very_light: {
    label: "Muito Clara",
    hex: "#FAE7D0",
    season: "Inverno Frio",
    description:
      "Pele com subtom frio. Cores puras, gélidas e contrastantes realçam sua beleza natural.",
    colors: [
      "bg-blue-500",
      "bg-pink-600",
      "bg-emerald-500",
      "bg-purple-700",
      "bg-gray-900",
      "bg-slate-200",
    ],
    styles: [
      "Minimalista",
      "Dramático",
      "Alfaiataria",
      "Gótico Suave",
      "Moderno",
      "Futurista",
    ],
  },
  light: {
    label: "Clara",
    hex: "#E3C1A0",
    season: "Verão Suave",
    description:
      "Contraste delicado. Tons pastéis, lavanda e azul bebê harmonizam perfeitamente.",
    colors: [
      "bg-sky-200",
      "bg-rose-300",
      "bg-indigo-300",
      "bg-teal-200",
      "bg-purple-300",
      "bg-slate-400",
    ],
    styles: [
      "Romântico",
      "Lady Like",
      "Provençal",
      "Clássico",
      "Vintage",
      "Cottagecore",
    ],
  },
  medium: {
    label: "Média",
    hex: "#CFA880",
    season: "Primavera Quente",
    description:
      "Pele dourada e vibrante. Cores alegres como coral, turquesa e dourado são ideais.",
    colors: [
      "bg-orange-400",
      "bg-lime-500",
      "bg-yellow-400",
      "bg-cyan-500",
      "bg-red-500",
      "bg-amber-300",
    ],
    styles: [
      "Criativo",
      "Tropical",
      "Esportivo",
      "Color Block",
      "Casual Chic",
      "Preppy",
    ],
  },
  tan: {
    label: "Bronzeada",
    hex: "#A67B51",
    season: "Outono Profundo",
    description:
      "Tons terrosos, mostarda e verde militar complementam seu bronzeado natural.",
    colors: [
      "bg-orange-800",
      "bg-green-800",
      "bg-yellow-700",
      "bg-red-900",
      "bg-stone-700",
      "bg-amber-700",
    ],
    styles: ["Boho Chic", "Natural", "Folk", "Safari", "Militar", "Rústico"],
  },
  dark: {
    label: "Escura",
    hex: "#7A4B28",
    season: "Outono Escuro",
    description:
      "Pele rica e quente. Tons de especiarias, vinhos profundos e azul marinho ficam elegantes.",
    colors: [
      "bg-rose-900",
      "bg-blue-900",
      "bg-emerald-900",
      "bg-yellow-600",
      "bg-purple-900",
      "bg-orange-900",
    ],
    styles: [
      "Sofisticado",
      "Glamour",
      "Urbano",
      "Executivo",
      "Retrô",
      "Barroco",
    ],
  },
  deep: {
    label: "Retinta",
    hex: "#422618",
    season: "Inverno Brilhante",
    description:
      "Alto contraste e profundidade. Cores neon, branco puro e cores primárias vibrantes.",
    colors: [
      "bg-fuchsia-600",
      "bg-blue-600",
      "bg-yellow-300",
      "bg-white",
      "bg-red-600",
      "bg-violet-600",
    ],
    styles: [
      "Streetwear",
      "High Fashion",
      "Vibrante",
      "Geométrico",
      "Esportivo Deluxe",
      "Pop Art",
    ],
  },
};

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

export const styleImagesData: Record<string, string> = {
  Minimalista:
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&auto=format&fit=crop",
  Dramático:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  Alfaiataria:
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop",
  "Gótico Suave":
    "https://images.unsplash.com/photo-1536243297275-48b4d1b82405?q=80&w=600&auto=format&fit=crop",
  Moderno:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
  Futurista:
    "https://images.unsplash.com/photo-1529139574466-a302c2d3e739?q=80&w=600&auto=format&fit=crop",
  Romântico:
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=600&auto=format&fit=crop",
  "Lady Like":
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
  Provençal:
    "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=600&auto=format&fit=crop",
  Clássico:
    "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=600&auto=format&fit=crop",
  Vintage:
    "https://images.unsplash.com/photo-1550614000-4b9519e02a15?q=80&w=600&auto=format&fit=crop",
  Cottagecore:
    "https://images.unsplash.com/photo-1502163140606-888448ae8cfe?q=80&w=600&auto=format&fit=crop",
  Criativo:
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop",
  Tropical:
    "https://images.unsplash.com/photo-1527016021513-b09758b777d5?q=80&w=600&auto=format&fit=crop",
  Esportivo:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
  "Color Block":
    "https://images.unsplash.com/photo-1509631179647-b84917147c2a?q=80&w=600&auto=format&fit=crop",
  "Casual Chic":
    "https://images.unsplash.com/photo-1589465885857-44edb59ef526?q=80&w=600&auto=format&fit=crop",
  Preppy:
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop",
  "Boho Chic":
    "https://images.unsplash.com/photo-1519725946194-c7da41215570?q=80&w=600&auto=format&fit=crop",
  Natural:
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
  Folk: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=600&auto=format&fit=crop",
  Safari:
    "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?q=80&w=600&auto=format&fit=crop",
  Militar:
    "https://images.unsplash.com/photo-1588117260148-447885143a6d?q=80&w=600&auto=format&fit=crop",
  Rústico:
    "https://images.unsplash.com/photo-1485230946086-1d99d529a730?q=80&w=600&auto=format&fit=crop",
  Sofisticado:
    "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=600&auto=format&fit=crop",
  Glamour:
    "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=600&auto=format&fit=crop",
  Urbano:
    "https://images.unsplash.com/photo-1550928431-ee0ec6db30d3?q=80&w=600&auto=format&fit=crop",
  Executivo:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
  Retrô:
    "https://images.unsplash.com/photo-1550614000-4b9519e02a15?q=80&w=600&auto=format&fit=crop",
  Barroco:
    "https://images.unsplash.com/photo-1550928431-ee0ec6db30d3?q=80&w=600&auto=format&fit=crop",
  Streetwear:
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop",
  "High Fashion":
    "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=600&auto=format&fit=crop",
  Vibrante:
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop",
  Geométrico:
    "https://images.unsplash.com/photo-1462002596489-4d6cb6007421?q=80&w=600&auto=format&fit=crop",
  "Esportivo Deluxe":
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
  "Pop Art":
    "https://images.unsplash.com/photo-1616892790299-44520b2996a1?q=80&w=600&auto=format&fit=crop",
};
