import React, { useState, useRef } from "react";
import {
  Sparkles,
  RefreshCw,
  Upload,
  Shirt,
  Check,
  Layers,
  Share2,
  Download,
  Scissors,
  Sun,
  Heart,
  Package,
  Archive,
  X,
  LayoutGrid,
  Footprints,
  HardHat,
  Glasses,
} from "lucide-react";
import { getCookie } from "../utils/cookie";

// --- URL DA API ---
const API_URL = "/api/try-on-diffusion/";
const CLOSET_API_URL = "/api/closet/";

// --- Tipos ---
interface ClothingType {
  id: string;
  label: string;
  icon: React.ElementType;
  closetCategory: "head" | "top" | "bottom" | "feet";
}

// Lista expandida e completa de tipos de roupa
const CLOTHING_TYPES: ClothingType[] = [
  // --- Tronco (Top) ---
  { id: "t-shirt", label: "Camiseta", icon: Shirt, closetCategory: "top" },
  { id: "shirt", label: "Camisa Social", icon: Shirt, closetCategory: "top" },
  { id: "blouse", label: "Blusa", icon: Heart, closetCategory: "top" },
  { id: "sweatshirt", label: "Moletom", icon: Archive, closetCategory: "top" },
  { id: "jacket", label: "Jaqueta", icon: Package, closetCategory: "top" },
  { id: "dress", label: "Vestido", icon: Scissors, closetCategory: "top" }, // Vestido é tratado como corpo inteiro/top pela IA

  // --- Pernas (Bottom) ---
  { id: "pants", label: "Calça", icon: Layers, closetCategory: "bottom" },
  { id: "shorts", label: "Shorts", icon: Sun, closetCategory: "bottom" },
  { id: "skirt", label: "Saia", icon: Scissors, closetCategory: "bottom" },

  // --- Pés (Feet) ---
  { id: "sneakers", label: "Tênis", icon: Footprints, closetCategory: "feet" },
  { id: "boots", label: "Bota", icon: Footprints, closetCategory: "feet" },
  { id: "shoes", label: "Sapato", icon: Footprints, closetCategory: "feet" },
  {
    id: "sandals",
    label: "Sandália",
    icon: Footprints,
    closetCategory: "feet",
  },

  // --- Cabeça (Head) ---
  { id: "cap", label: "Boné", icon: HardHat, closetCategory: "head" },
  { id: "hat", label: "Chapéu", icon: HardHat, closetCategory: "head" },
  { id: "glasses", label: "Óculos", icon: Glasses, closetCategory: "head" },
];

interface TryOnState {
  userImage: string | null;
  userFile: File | null;
  clothImage: string | null;
  clothFile: File | null;
  category: string;
  isGenerating: boolean;
  resultImage: string | null;
  error: string | null;
}

interface ClosetItem {
  id: number;
  name: string;
  image: string;
  category: "head" | "top" | "bottom" | "feet";
  subcategory?: string;
}

const TryOn = () => {
  const userFileInputRef = useRef<HTMLInputElement>(null);
  const clothFileInputRef = useRef<HTMLInputElement>(null);

  const [tryOnState, setTryOnState] = useState<TryOnState>({
    userImage: null,
    userFile: null,
    clothImage: null,
    clothFile: null,
    category: "t-shirt",
    isGenerating: false,
    resultImage: null,
    error: null,
  });

  // Estados para o Seletor de Closet
  const [showClosetModal, setShowClosetModal] = useState(false);
  const [closetItems, setClosetItems] = useState<ClosetItem[]>([]);
  const [isLoadingCloset, setIsLoadingCloset] = useState(false);

  // --- CARREGAR CLOSET ---
  const fetchCloset = async () => {
    setIsLoadingCloset(true);
    try {
      const res = await fetch(CLOSET_API_URL);
      if (res.ok) {
        const data = await res.json();
        setClosetItems(data);
      }
    } catch (error) {
      console.error("Erro ao carregar closet", error);
    } finally {
      setIsLoadingCloset(false);
    }
  };

  const handleOpenClosetSelector = () => {
    if (closetItems.length === 0) fetchCloset();
    setShowClosetModal(true);
  };

  // --- SELECIONAR ITEM DO CLOSET ---
  const handleSelectClosetItem = async (item: ClosetItem) => {
    try {
      // 1. Converte URL para File
      const response = await fetch(item.image);
      const blob = await response.blob();
      const file = new File([blob], item.name + ".jpg", { type: blob.type });

      // 2. Ajusta a categoria do TryOn automaticamente
      let aiCategory = "t-shirt";

      // Se o item do closet tem subcategoria (ex: 'jacket'), usa ela.
      if (item.subcategory) {
        // Verifica se essa subcategoria existe na lista de tipos do TryOn
        const match = CLOTHING_TYPES.find((t) => t.id === item.subcategory);
        if (match) aiCategory = match.id;
      } else {
        // Fallback genérico se for item antigo sem subcategoria
        if (item.category === "bottom") aiCategory = "pants";
        if (item.category === "feet") aiCategory = "sneakers";
        if (item.category === "head") aiCategory = "cap";
      }

      setTryOnState((prev) => ({
        ...prev,
        clothImage: item.image,
        clothFile: file,
        category: aiCategory, // Categoria ajustada automaticamente
        error: null,
      }));
      setShowClosetModal(false);
    } catch (error) {
      console.error("Erro ao processar imagem", error);
      alert("Erro ao carregar item.");
    }
  };

  // --- UPLOAD MANUAL ---
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "user" | "cloth"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const newState = { ...tryOnState, error: null };

      if (type === "user") {
        newState.userImage = previewUrl;
        newState.userFile = file;
      } else {
        newState.clothImage = previewUrl;
        newState.clothFile = file;
      }

      setTryOnState(newState);
      event.target.value = "";
    }
  };

  // --- GERAR PROVADOR ---
  const handleGenerate = async () => {
    if (!tryOnState.userFile || !tryOnState.clothFile) return;

    setTryOnState((prev) => ({
      ...prev,
      isGenerating: true,
      error: null,
      resultImage: null,
    }));

    const formData = new FormData();
    formData.append("clothing_image", tryOnState.clothFile);
    formData.append("avatar_image", tryOnState.userFile);
    formData.append("category", tryOnState.category);

    try {
      await fetch("/api/csrf/");
      const csrftoken = getCookie("csrftoken");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken || "",
        },
        body: formData,
      });

      if (response.ok) {
        const contentType = response.headers.get("Content-Type") || "";

        if (contentType.includes("application/json")) {
          const data = await response.json();
          const finalUrl =
            data.url ||
            (data.image ? `data:image/png;base64,${data.image}` : null);
          if (finalUrl) {
            setTryOnState((prev) => ({
              ...prev,
              isGenerating: false,
              resultImage: finalUrl,
            }));
          } else {
            throw new Error(data.error || "Imagem inválida retornada pela IA");
          }
        } else if (
          contentType.includes("image") ||
          contentType.includes("octet-stream")
        ) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setTryOnState((prev) => ({
            ...prev,
            isGenerating: false,
            resultImage: imageUrl,
          }));
        } else {
          const text = await response.text();
          throw new Error(
            `Resposta inesperada do servidor: ${text.slice(0, 50)}`
          );
        }
      } else {
        let errorMessage = "Erro no servidor Django.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Erro no Try-On:", error);
      setTryOnState((prev) => ({
        ...prev,
        isGenerating: false,
        error: error.message || "Falha na comunicação.",
      }));
    }
  };

  const resetTryOn = () =>
    setTryOnState({
      userImage: null,
      userFile: null,
      clothImage: null,
      clothFile: null,
      category: "t-shirt",
      isGenerating: false,
      resultImage: null,
      error: null,
    });

  // --- FILTRAGEM ESTRITA DO MODAL ---
  const currentCategoryInfo = CLOTHING_TYPES.find(
    (c) => c.id === tryOnState.category
  );

  const filteredClosetItems = closetItems.filter((item) => {
    // 1. Primeiro verifica a macrotendência (top, bottom, feet, head)
    if (item.category !== currentCategoryInfo?.closetCategory) return false;

    // 2. Se o item tem subcategoria definida, ela DEVE bater com a selecionada no TryOn
    // Ex: Se usuário escolheu 'jacket', só mostra itens com subcategory='jacket'
    if (item.subcategory && item.subcategory !== "other") {
      return item.subcategory === tryOnState.category;
    }

    // Itens sem subcategoria (legado) ou 'other' aparecem em todos da macro-categoria?
    // Para limpar a visualização como você pediu, vamos esconder itens que não batem.
    // Se o item não tem subcategoria definida (antigo), vamos permitir APENAS se for uma categoria padrão (ex: t-shirt)
    // ou podemos optar por esconder para forçar organização.

    // Vamos assumir Filtragem Rígida: Se não tem subcategoria ou não bate, não mostra.
    return false;
  });

  return (
    <div className="animate-fade-in h-[calc(100vh-140px)] relative">
      {/* MODAL DE SELEÇÃO DO CLOSET */}
      {showClosetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in bg-black/30">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <LayoutGrid className="text-purple-600" /> Selecionar do Armário
              </h3>
              <button
                onClick={() => setShowClosetModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50">
              {isLoadingCloset ? (
                <div className="flex justify-center py-20 text-slate-400">
                  <RefreshCw className="animate-spin" />
                </div>
              ) : filteredClosetItems.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <p className="mb-2 text-4xl">📭</p>
                  <p className="font-medium text-slate-600">
                    Nenhuma peça do tipo{" "}
                    <strong>{currentCategoryInfo?.label}</strong> encontrada.
                  </p>
                  <p className="text-xs mt-2 text-slate-400 max-w-xs mx-auto">
                    Cadastre roupas no Armário com a categoria{" "}
                    <strong>{currentCategoryInfo?.label}</strong> para vê-las
                    aqui.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredClosetItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectClosetItem(item)}
                      className="cursor-pointer group bg-white rounded-xl p-2 border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-slate-100 relative">
                        <img
                          src={item.image}
                          className="w-full h-full object-cover"
                          alt={item.name}
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                      <p className="text-xs font-bold text-slate-700 truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate capitalize">
                        {item.subcategory
                          ? CLOTHING_TYPES.find(
                              (t) => t.id === item.subcategory
                            )?.label || item.subcategory
                          : item.category}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="text-purple-600" size={24} /> Provador IA
          Generativa
        </h3>
        <button
          onClick={resetTryOn}
          className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          <RefreshCw size={14} /> Reiniciar
        </button>
      </div>

      <input
        type="file"
        ref={userFileInputRef}
        onChange={(e) => handleFileUpload(e, "user")}
        className="hidden"
        accept="image/*"
      />
      <input
        type="file"
        ref={clothFileInputRef}
        onChange={(e) => handleFileUpload(e, "cloth")}
        className="hidden"
        accept="image/*"
      />

      <div className="grid grid-cols-12 gap-8 h-[90%]">
        <div className="col-span-5 flex flex-col gap-6">
          {/* 1. UPLOAD FOTO USUÁRIO */}
          <div
            onClick={() => userFileInputRef.current?.click()}
            className={`flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${
              tryOnState.userImage
                ? "border-purple-500 bg-purple-50"
                : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            {tryOnState.userImage ? (
              <>
                <img
                  src={tryOnState.userImage}
                  className="absolute inset-0 w-full h-full object-contain p-2 opacity-90 group-hover:opacity-100 transition bg-slate-50"
                  alt="User Preview"
                />
                <div className="absolute top-3 right-3 bg-white p-1 rounded-full shadow-sm">
                  <Check className="text-green-600" size={16} />
                </div>
              </>
            ) : (
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3">
                  <Upload className="text-slate-400" />
                </div>
                <p className="font-bold text-slate-700">1. Sua Foto</p>
              </div>
            )}
          </div>

          {/* 2. SELEÇÃO DA PEÇA */}
          <div
            className={`flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all relative overflow-hidden group ${
              tryOnState.clothImage
                ? "border-purple-500 bg-purple-50"
                : "border-slate-300"
            }`}
          >
            {tryOnState.clothImage ? (
              <div
                onClick={() =>
                  setTryOnState((p) => ({
                    ...p,
                    clothImage: null,
                    clothFile: null,
                  }))
                }
                className="cursor-pointer w-full h-full relative"
              >
                <img
                  src={tryOnState.clothImage}
                  className="absolute inset-0 w-full h-full object-contain p-2 opacity-90 hover:opacity-100 transition bg-slate-50"
                  alt="Cloth Preview"
                />
                <div className="absolute top-3 right-3 bg-white p-1 rounded-full shadow-sm">
                  <Check className="text-green-600" size={16} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition text-white font-bold">
                  Trocar
                </div>
              </div>
            ) : (
              <div className="text-center p-6 w-full flex flex-col gap-3">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto">
                  <Shirt className="text-slate-400" />
                </div>
                <p className="font-bold text-slate-700">2. A Peça</p>

                <div className="flex gap-2 justify-center w-full px-4">
                  <button
                    onClick={() => clothFileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2"
                  >
                    <Upload size={14} /> Upload
                  </button>

                  <button
                    onClick={handleOpenClosetSelector}
                    className="flex-1 py-2 px-3 bg-purple-50 border border-purple-200 rounded-lg text-xs font-bold text-purple-700 hover:bg-purple-100 flex items-center justify-center gap-2"
                  >
                    <LayoutGrid size={14} /> Armário
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. TIPO DE PEÇA (Botões de Categoria) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-sm">
              <Layers size={16} className="text-purple-600" /> 3. Tipo de Peça:{" "}
              {currentCategoryInfo?.label}
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {CLOTHING_TYPES.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() =>
                      setTryOnState((prev) => ({ ...prev, category: type.id }))
                    }
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition border ${
                      tryOnState.category === type.id
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    } flex items-center gap-1`}
                  >
                    <IconComponent size={14} /> {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={
              !tryOnState.userFile ||
              !tryOnState.clothFile ||
              tryOnState.isGenerating
            }
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
              !tryOnState.userImage || !tryOnState.clothImage
                ? "bg-slate-300 cursor-not-allowed"
                : tryOnState.isGenerating
                ? "bg-purple-800"
                : "bg-slate-900 hover:bg-purple-600 shadow-lg hover:shadow-purple-200"
            }`}
          >
            {tryOnState.isGenerating ? (
              <>
                <RefreshCw className="animate-spin" size={20} /> Processando
                IA...
              </>
            ) : (
              <>
                <Sparkles size={20} /> Gerar Provador
              </>
            )}
          </button>

          {tryOnState.error && (
            <div className="p-3 bg-red-100 text-red-700 text-sm rounded-xl text-center border border-red-200">
              {tryOnState.error}
            </div>
          )}
        </div>

        {/* 4. RESULTADO (Coluna Direita) */}
        <div className="col-span-7 bg-slate-100 rounded-3xl relative overflow-hidden border border-slate-200 flex items-center justify-center">
          {tryOnState.resultImage ? (
            <div className="relative w-full h-full group">
              <img
                src={tryOnState.resultImage}
                className="w-full h-full object-contain animate-fade-in"
                alt="Resultado Try-On"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-4">
                <button className="bg-white/20 backdrop-blur text-white p-3 rounded-full hover:bg-white/40 transition">
                  <Share2 size={20} />
                </button>
                <a
                  href={tryOnState.resultImage}
                  download="look-gerado.png"
                  className="bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition flex items-center gap-2"
                >
                  <Download size={18} /> Baixar
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 max-w-xs">
              <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Sparkles className="text-purple-300" size={32} />
              </div>
              <h4 className="font-bold text-slate-400 text-lg">
                4. Gerar o Resultado
              </h4>
              <p className="text-sm text-slate-400 mt-2">
                Selecione as imagens e o tipo de peça para começar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TryOn;
