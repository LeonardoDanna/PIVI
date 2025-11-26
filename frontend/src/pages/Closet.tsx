import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  Heart,
  Loader2,
  Save,
  Upload,
  Trash2,
  X,
  Pipette,
  History,
  Clock,
  Shuffle,
  RefreshCw,
  CloudRain,
  Snowflake,
  Sun,
  Sparkles,
} from "lucide-react";
import { getCookie } from "../utils/cookie";

// --- Interfaces TypeScript ---
type CategoryKey = "head" | "top" | "bottom" | "feet";

interface ClosetItem {
  id: string | number;
  name: string;
  size?: string;
  color?: string;
  image: string;
  category?: CategoryKey;
}

interface ClosetData {
  head: ClosetItem[];
  top: ClosetItem[];
  bottom: ClosetItem[];
  feet: ClosetItem[];
}

interface WeatherState {
  temp: number;
  condition: string;
  label: string;
}

interface OutfitImages {
  head: string | null;
  top: string | null;
  bottom: string | null;
  feet: string | null;
}

interface Outfit {
  id: number;
  createdAt: string;
  isFavorite: boolean;
  weatherAtTime: WeatherState;
  images: OutfitImages;
}

interface ClosetSelection {
  head: string | number | null;
  top: string | number | null;
  bottom: string | number | null;
  feet: string | number | null;
}

const categoryLabels: Record<CategoryKey, string> = {
  head: "Cabeça / Acessórios",
  top: "Tronco",
  bottom: "Pernas",
  feet: "Pés",
};

// --- Funções Auxiliares ---
const getLuminance = (hex: string) => {
  if (!hex || !hex.startsWith("#")) return 128;
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 24) & 0xff;
  const g = (rgb >> 16) & 0xff;
  const b = (rgb >> 8) & 0xff;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const isNeutral = (hex: string | undefined) => {
  if (!hex) return true;
  const lum = getLuminance(hex);
  return lum < 40 || lum > 200;
};

const Closet = () => {
  const [closetItems, setClosetItems] = useState<ClosetData>({
    head: [],
    top: [],
    bottom: [],
    feet: [],
  });
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  const [weather, setWeather] = useState<WeatherState>({
    temp: 28,
    condition: "sunny",
    label: "Ensolarado",
  });

  const [closetSelection, setClosetSelection] = useState<ClosetSelection>({
    head: null,
    top: null,
    bottom: null,
    feet: null,
  });

  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>(() => {
    const saved = localStorage.getItem("userSavedOutfits");
    return saved ? JSON.parse(saved) : [];
  });

  const [historyFilter, setHistoryFilter] = useState("all");
  const [isOutfitSaved, setIsOutfitSaved] = useState(false);
  const [isSavingOutfit, setIsSavingOutfit] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadCategory, setUploadCategory] = useState<CategoryKey | null>(
    null
  );
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(
    null
  );
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [newItemMetadata, setNewItemMetadata] = useState({
    name: "",
    size: "",
    color: "#000000",
  });

  const categories: CategoryKey[] = ["head", "top", "bottom", "feet"];

  // --- CARREGAR ROUPAS DA API ---
  useEffect(() => {
    fetchClosetItems();
  }, []);

  const fetchClosetItems = async () => {
    setIsLoadingItems(true);
    try {
      const response = await fetch("/api/closet/");
      if (response.ok) {
        const data: ClosetItem[] = await response.json();
        const organized: ClosetData = {
          head: [],
          top: [],
          bottom: [],
          feet: [],
        };

        data.forEach((item) => {
          if (item.category && organized[item.category]) {
            organized[item.category].push(item);
          }
        });
        setClosetItems(organized);
      }
    } catch (error) {
      console.error("Erro ao buscar roupas:", error);
    } finally {
      setIsLoadingItems(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("userSavedOutfits", JSON.stringify(savedOutfits));
  }, [savedOutfits]);

  const getSafeImage = (category: CategoryKey, id: string | number | null) => {
    if (!id) return null;
    const item = closetItems[category].find((i) => i.id === id);
    return item ? item.image : null;
  };

  const handleSmartSuggestion = () => {
    const hasTops = closetItems.top.length > 0;
    const hasBottoms = closetItems.bottom.length > 0;

    if (!hasTops || !hasBottoms) {
      alert("Adicione peças ao armário primeiro (pelo menos Tronco e Pernas)!");
      return;
    }

    const isHot = weather.temp >= 25;

    const suitableBottoms = closetItems.bottom.filter((item) => {
      const name = item.name.toLowerCase();
      if (isHot) return name.includes("shorts") || name.includes("bermuda");
      return !name.includes("shorts") && !name.includes("bermuda");
    });
    const poolBottom =
      suitableBottoms.length > 0 ? suitableBottoms : closetItems.bottom;
    const selectedBottom =
      poolBottom[Math.floor(Math.random() * poolBottom.length)];

    let poolTops = closetItems.top;
    if (selectedBottom.color && !isNeutral(selectedBottom.color)) {
      const neutralTops = closetItems.top.filter((top) => isNeutral(top.color));
      if (neutralTops.length > 0) poolTops = neutralTops;
    }
    const selectedTop = poolTops[Math.floor(Math.random() * poolTops.length)];

    const selectedHead =
      closetItems.head.length > 0 && Math.random() > 0.5
        ? closetItems.head[Math.floor(Math.random() * closetItems.head.length)]
        : null;

    const selectedFeet =
      closetItems.feet.length > 0
        ? closetItems.feet[Math.floor(Math.random() * closetItems.feet.length)]
        : null;

    setClosetSelection({
      head: selectedHead ? selectedHead.id : null,
      top: selectedTop.id,
      bottom: selectedBottom.id,
      feet: selectedFeet ? selectedFeet.id : null,
    });
  };

  const handleSaveOutfit = (asFavorite = false) => {
    if (isOutfitSaved || isLiking) return;
    if (!closetSelection.top || !closetSelection.bottom) {
      alert("Selecione pelo menos uma parte de cima e uma de baixo.");
      return;
    }

    if (asFavorite) setIsLiking(true);
    else setIsSavingOutfit(true);

    const newOutfit: Outfit = {
      id: Date.now(),
      createdAt: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      isFavorite: asFavorite,
      weatherAtTime: weather,
      images: {
        head: getSafeImage("head", closetSelection.head),
        top: getSafeImage("top", closetSelection.top),
        bottom: getSafeImage("bottom", closetSelection.bottom),
        feet: getSafeImage("feet", closetSelection.feet),
      },
    };

    setTimeout(() => {
      setSavedOutfits((prev) => [newOutfit, ...prev]);
      if (asFavorite) {
        setIsLiking(false);
      } else {
        setIsSavingOutfit(false);
        setIsOutfitSaved(true);
        setTimeout(() => setIsOutfitSaved(false), 2000);
      }
    }, 800);
  };

  const handleShuffle = () => handleSmartSuggestion();
  const handleClearAll = () =>
    setClosetSelection({ head: null, top: null, bottom: null, feet: null });
  const handleDeleteHistoryItem = (id: number) =>
    setSavedOutfits((prev) => prev.filter((outfit) => outfit.id !== id));
  const handleToggleFavoriteHistory = (id: number) => {
    setSavedOutfits((prev) =>
      prev.map((outfit) =>
        outfit.id === id
          ? { ...outfit, isFavorite: !outfit.isFavorite }
          : outfit
      )
    );
  };

  const handleAddClick = (category: CategoryKey) => {
    setUploadCategory(category);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && uploadCategory) {
      setPendingFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPendingImagePreview(e.target.result as string);

          // Define tamanho padrão baseado na categoria
          let defaultSize = "M";
          if (uploadCategory === "feet") defaultSize = "38";
          if (uploadCategory === "bottom") defaultSize = "40";
          if (uploadCategory === "head") defaultSize = "U";

          setNewItemMetadata({
            name: file.name.split(".")[0].substring(0, 20),
            size: defaultSize,
            color: "#000000",
          });
          setShowUploadModal(true);
        }
      };
      reader.readAsDataURL(file);
    }
    if (event.target) event.target.value = "";
  };

  const handleConfirmUpload = async () => {
    if (!pendingFile || !uploadCategory) return;
    setIsUploading(true);

    try {
      await fetch("/api/csrf/");
      const csrftoken = getCookie("csrftoken");

      const formData = new FormData();
      formData.append("name", newItemMetadata.name || "Item Sem Nome");
      formData.append("category", uploadCategory);
      formData.append("size", newItemMetadata.size);
      formData.append("color", newItemMetadata.color);
      formData.append("image", pendingFile);

      const response = await fetch("/api/closet/", {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken || "" },
        body: formData,
      });

      if (response.ok) {
        await fetchClosetItems();
        setShowUploadModal(false);
        setPendingImagePreview(null);
        setPendingFile(null);
      } else {
        const err = await response.json();
        alert("Erro ao salvar: " + JSON.stringify(err));
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
    setPendingImagePreview(null);
    setPendingFile(null);
  };

  const handlePickColor = async () => {
    if (!(window as any).EyeDropper) {
      alert("Seu navegador não suporta conta-gotas.");
      return;
    }
    try {
      const eyeDropper = new (window as any).EyeDropper();
      const result = await eyeDropper.open();
      setNewItemMetadata((prev) => ({ ...prev, color: result.sRGBHex }));
    } catch (e) {}
  };

  const handleDeleteItem = async (
    category: CategoryKey,
    itemId: string | number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (!confirm("Tem certeza que deseja excluir esta peça?")) return;

    try {
      await fetch("/api/csrf/");
      const csrftoken = getCookie("csrftoken");

      const response = await fetch(`/api/closet/${itemId}/`, {
        method: "DELETE",
        headers: { "X-CSRFToken": csrftoken || "" },
      });

      if (response.ok) {
        const newItems = closetItems[category].filter(
          (item) => item.id !== itemId
        );
        setClosetItems((prev) => ({ ...prev, [category]: newItems }));

        if (closetSelection[category] === itemId) {
          setClosetSelection((prev) => ({ ...prev, [category]: null }));
        }
      } else {
        alert("Erro ao excluir item.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectItem = (category: CategoryKey, id: string | number) => {
    setClosetSelection((prev) => {
      if (
        (category === "head" || category === "feet") &&
        prev[category] === id
      ) {
        return { ...prev, [category]: null };
      }
      return { ...prev, [category]: id };
    });
  };

  const handleClearSelection = (category: CategoryKey) => {
    setClosetSelection((prev) => ({ ...prev, [category]: null }));
  };

  const filteredHistory =
    historyFilter === "all"
      ? savedOutfits
      : savedOutfits.filter((outfit) => outfit.isFavorite);

  const WeatherToggle = () => (
    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4">
      {[
        { id: "sunny", icon: Sun, label: "Sol", temp: 28 },
        { id: "rainy", icon: CloudRain, label: "Chuva", temp: 22 },
        { id: "cold", icon: Snowflake, label: "Frio", temp: 15 },
      ].map((w) => (
        <button
          key={w.id}
          onClick={() =>
            setWeather({ temp: w.temp, condition: w.id, label: w.label })
          }
          className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            weather.condition === w.id
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <w.icon size={14} /> {w.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in flex flex-col gap-8 w-full max-w-7xl mx-auto p-4 relative">
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        {/* MODAL DE UPLOAD DINÂMICO */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-slate-200">
              <div className="w-full md:w-1/2 bg-slate-50 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-white">
                  {pendingImagePreview && (
                    <img
                      src={pendingImagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
              <div className="w-full md:w-1/2 p-8 flex flex-col">
                <h2 className="text-xl font-bold text-slate-800 mb-6">
                  Cadastrar Peça
                </h2>
                <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-2">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">
                      Categoria
                    </label>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-medium">
                      {uploadCategory ? categoryLabels[uploadCategory] : ""}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={newItemMetadata.name}
                      onChange={(e) =>
                        setNewItemMetadata({
                          ...newItemMetadata,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-purple-500"
                      placeholder="Ex: Camiseta"
                    />
                  </div>
                  <div className="flex gap-4">
                    {/* SELEÇÃO DE TAMANHO DINÂMICA */}
                    <div className="w-28">
                      <label className="text-xs font-bold text-slate-400 uppercase">
                        Tamanho
                      </label>
                      {uploadCategory === "feet" ? (
                        <select
                          value={newItemMetadata.size}
                          onChange={(e) =>
                            setNewItemMetadata({
                              ...newItemMetadata,
                              size: e.target.value,
                            })
                          }
                          className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white"
                        >
                          {Array.from({ length: 18 }, (_, i) => i + 33).map(
                            (num) => (
                              <option key={num} value={num.toString()}>
                                {num}
                              </option>
                            )
                          )}
                        </select>
                      ) : uploadCategory === "head" ? (
                        <div className="w-full p-3 border-2 border-slate-100 bg-slate-50 rounded-xl text-slate-400 text-sm">
                          Único
                        </div>
                      ) : uploadCategory === "bottom" ? (
                        <select
                          value={newItemMetadata.size}
                          onChange={(e) =>
                            setNewItemMetadata({
                              ...newItemMetadata,
                              size: e.target.value,
                            })
                          }
                          className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white"
                        >
                          {[36, 38, 40, 42, 44, 46, 48, 50, 52, 54].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={newItemMetadata.size}
                          onChange={(e) =>
                            setNewItemMetadata({
                              ...newItemMetadata,
                              size: e.target.value,
                            })
                          }
                          className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white"
                        >
                          <option value="PP">PP</option>
                          <option value="P">P</option>
                          <option value="M">M</option>
                          <option value="G">G</option>
                          <option value="GG">GG</option>
                          <option value="XG">XG</option>
                        </select>
                      )}
                    </div>

                    <div className="flex-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">
                        Cor
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={newItemMetadata.color}
                          onChange={(e) =>
                            setNewItemMetadata({
                              ...newItemMetadata,
                              color: e.target.value,
                            })
                          }
                          className="h-12 w-16 p-1 border-2 border-slate-200 rounded-xl cursor-pointer"
                        />
                        <button
                          onClick={handlePickColor}
                          className="h-12 w-12 flex items-center justify-center bg-slate-100 border-2 border-slate-200 rounded-xl hover:bg-slate-200"
                        >
                          <Pipette size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={handleCancelUpload}
                    disabled={isUploading}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmUpload}
                    disabled={isUploading}
                    className="flex-[2] py-3 px-4 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Check size={18} />
                    )}
                    {isUploading ? "Enviando..." : "Confirmar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`.custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }`}</style>

        {/* --- COLUNA ESQUERDA (CLOSET) --- */}
        <div className="flex-1 space-y-6 min-w-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Seu Guarda-Roupa
              </h1>
              <div className="flex items-center gap-2 mt-2 text-slate-500 bg-white px-3 py-1.5 rounded-full shadow-sm w-fit border border-slate-100">
                {weather.condition === "sunny" ? (
                  <Sun size={18} className="text-orange-400" />
                ) : weather.condition === "rainy" ? (
                  <CloudRain size={18} className="text-blue-400" />
                ) : (
                  <Snowflake size={18} className="text-cyan-400" />
                )}
                <span className="font-medium text-sm">
                  {weather.label} • {weather.temp}°C
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleSmartSuggestion}
                className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 text-xs font-bold"
              >
                <Sparkles size={16} /> Sugerir Look
              </button>
              <button
                onClick={handleShuffle}
                className="p-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition flex items-center gap-2 text-xs font-bold"
              >
                <Shuffle size={16} /> Aleatório
              </button>
              <button
                onClick={handleClearAll}
                className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition flex items-center gap-2 text-xs font-bold"
              >
                <RefreshCw size={16} /> Limpar
              </button>
            </div>
          </div>

          {/* LOADING STATE */}
          {isLoadingItems ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center">
              <Loader2 size={32} className="animate-spin mb-2" />
              <p>Carregando seu armário...</p>
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1 flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        category === "head"
                          ? "bg-purple-400"
                          : category === "top"
                          ? "bg-blue-400"
                          : category === "bottom"
                          ? "bg-emerald-400"
                          : "bg-orange-400"
                      }`}
                    ></span>
                    {categoryLabels[category]}
                  </div>
                  {(category === "head" || category === "feet") && (
                    <button
                      onClick={() => handleClearSelection(category)}
                      className="text-[10px] text-slate-400 hover:text-red-500 hover:underline flex items-center gap-1"
                    >
                      {closetSelection[category] ? (
                        <>
                          <X size={10} /> Remover seleção
                        </>
                      ) : (
                        <span className="opacity-50 cursor-default">
                          Nenhum selecionado
                        </span>
                      )}
                    </button>
                  )}
                </h3>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleAddClick(category)}
                    className={`w-32 rounded-2xl bg-slate-50 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:bg-slate-100 transition group ${
                      category === "head"
                        ? "h-32"
                        : category === "top"
                        ? "h-40"
                        : category === "bottom"
                        ? "h-48"
                        : "h-32"
                    }`}
                  >
                    <Upload
                      className="text-slate-400 mb-1 group-hover:text-inherit"
                      size={24}
                    />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-inherit">
                      Upload
                    </span>
                  </button>

                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x px-1 custom-scrollbar flex-1">
                    {closetItems[category].length === 0 ? (
                      <div className="flex items-center justify-center w-full text-slate-400 text-xs italic">
                        Vazio
                      </div>
                    ) : (
                      closetItems[category].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectItem(category, item.id)}
                          className={`group rounded-2xl flex-shrink-0 cursor-pointer overflow-hidden border-2 transition-all duration-300 relative snap-center w-32 md:w-40 ${
                            category === "head"
                              ? "h-32"
                              : category === "top"
                              ? "h-40"
                              : category === "bottom"
                              ? "h-48"
                              : "h-32"
                          } ${
                            closetSelection[category] === item.id
                              ? "border-purple-600 ring-4 ring-purple-100 scale-105 shadow-lg"
                              : "border-transparent hover:border-slate-200"
                          }`}
                        >
                          <img
                            src={item.image}
                            className="w-full h-full object-cover"
                            alt={item.name}
                          />
                          {item.size && (
                            <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10 border border-white/20">
                              {item.size}
                            </div>
                          )}
                          <button
                            onClick={(e) =>
                              handleDeleteItem(category, item.id, e)
                            }
                            className="absolute top-1 left-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md z-20"
                          >
                            <Trash2 size={12} />
                          </button>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-2 pointer-events-none">
                            <div className="w-full">
                              <span className="text-[10px] text-white font-medium truncate block">
                                {item.name}
                              </span>
                              {item.color && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <div
                                    className="w-2 h-2 rounded-full border border-white/50"
                                    style={{ backgroundColor: item.color }}
                                  ></div>
                                  <span className="text-[8px] text-slate-200">
                                    {item.color}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          {closetSelection[category] === item.id && (
                            <div className="absolute top-1 right-1 bg-purple-600 w-5 h-5 rounded-full flex items-center justify-center shadow-sm z-10">
                              <Check size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- COLUNA DIREITA (PREVIEW) --- */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          <div className="bg-slate-900 text-white rounded-[2rem] p-6 flex flex-col min-h-[600px] sticky top-8 shadow-2xl ring-1 ring-white/10">
            <div className="mb-4">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-wider">
                Simular Clima
              </p>
              <WeatherToggle />
            </div>

            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-xl tracking-tight">Seu Look</h3>
                <p className="text-slate-400 text-xs mt-1">
                  Preview em tempo real
                </p>
              </div>
              <button
                onClick={() => handleSaveOutfit(true)}
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all backdrop-blur-sm active:scale-95"
              >
                {isLiking ? (
                  <Loader2 className="animate-spin text-pink-400" size={20} />
                ) : (
                  <Heart
                    size={20}
                    className="text-pink-400"
                    fill="currentColor"
                    fillOpacity={0.2}
                  />
                )}
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-0 items-center justify-center bg-gradient-to-b from-white/5 to-transparent rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>

              {/* Visualização de Camadas (Head, Top, Bottom, Feet) */}
              {closetSelection.head ? (
                <div className="relative z-30 transition-transform duration-500 hover:scale-105 hover:z-40">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border-[3px] border-white/20 bg-slate-800">
                    <img
                      src={getSafeImage("head", closetSelection.head) || ""}
                      className="w-full h-full object-cover"
                      alt="head"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-10"></div>
              )}
              <div
                className={`relative z-20 transition-transform duration-500 hover:scale-105 hover:z-40 ${
                  closetSelection.head ? "-mt-3" : "mt-0"
                }`}
              >
                {closetSelection.top ? (
                  <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-2xl border-[3px] border-white/20 bg-slate-800">
                    <img
                      src={getSafeImage("top", closetSelection.top) || ""}
                      className="w-full h-full object-cover"
                      alt="top"
                    />
                  </div>
                ) : (
                  <div className="w-36 h-36 rounded-2xl border-[2px] border-dashed border-white/10 flex items-center justify-center text-white/20 text-xs">
                    Sem tronco
                  </div>
                )}
              </div>
              <div className="relative z-10 -mt-5 transition-transform duration-500 hover:scale-105 hover:z-40">
                {closetSelection.bottom ? (
                  <div className="w-36 h-44 rounded-2xl overflow-hidden shadow-2xl border-[3px] border-white/20 bg-slate-800">
                    <img
                      src={getSafeImage("bottom", closetSelection.bottom) || ""}
                      className="w-full h-full object-cover"
                      alt="bottom"
                    />
                  </div>
                ) : (
                  <div className="w-36 h-44 rounded-2xl border-[2px] border-dashed border-white/10 flex items-center justify-center text-white/20 text-xs bg-slate-800/20">
                    Sem pernas
                  </div>
                )}
              </div>
              {closetSelection.feet && (
                <div className="relative z-30 -mt-6 transition-transform duration-500 hover:scale-105 hover:z-40 w-full flex justify-center">
                  <div className="w-32 h-24 flex justify-center gap-1">
                    <div className="w-28 h-24 rounded-2xl overflow-hidden shadow-2xl border-[3px] border-white/20 bg-slate-800">
                      <img
                        src={getSafeImage("feet", closetSelection.feet) || ""}
                        className="w-full h-full object-cover"
                        alt="feet"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleSaveOutfit(false)}
              disabled={isSavingOutfit || isOutfitSaved}
              className={`mt-6 w-full py-4 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-lg transform active:scale-95 ${
                isOutfitSaved
                  ? "bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-400/30"
                  : "bg-purple-600 text-white hover:bg-purple-500 shadow-purple-900/50 hover:shadow-purple-700/50"
              }`}
            >
              {isSavingOutfit ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Salvando...
                </>
              ) : isOutfitSaved ? (
                <>
                  <Check size={18} /> Look Salvo!
                </>
              ) : (
                <>
                  <Save size={18} /> SALVAR COMBINAÇÃO
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- HISTÓRICO --- */}
      {savedOutfits.length > 0 && (
        <div className="mt-8 pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <History className="text-purple-600" size={28} />
              <h2 className="text-2xl font-bold text-slate-800">
                Histórico de Combinações
              </h2>
            </div>
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setHistoryFilter("all")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  historyFilter === "all"
                    ? "bg-white shadow text-slate-800"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setHistoryFilter("favorites")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  historyFilter === "favorites"
                    ? "bg-white shadow text-pink-500"
                    : "text-slate-500 hover:text-pink-400"
                }`}
              >
                <Heart
                  size={12}
                  fill={historyFilter === "favorites" ? "currentColor" : "none"}
                />{" "}
                Favoritos
              </button>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p>Nenhum look encontrado com este filtro.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredHistory.map((outfit) => (
                <div
                  key={outfit.id}
                  className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative"
                >
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {outfit.createdAt}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleToggleFavoriteHistory(outfit.id)}
                        className={`p-1.5 rounded-full transition ${
                          outfit.isFavorite
                            ? "text-pink-500 bg-pink-50"
                            : "text-slate-300 hover:text-pink-400 hover:bg-slate-100"
                        }`}
                      >
                        <Heart
                          size={12}
                          fill={outfit.isFavorite ? "currentColor" : "none"}
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteHistoryItem(outfit.id)}
                        className="p-1.5 hover:bg-red-100 text-slate-400 hover:text-red-500 rounded-full transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col items-center gap-0">
                    {outfit.images.head && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 shadow-sm z-30 bg-white">
                        <img
                          src={outfit.images.head}
                          className="w-full h-full object-cover"
                          alt="head"
                        />
                      </div>
                    )}
                    {outfit.images.top ? (
                      <div
                        className={`w-14 h-14 rounded-lg overflow-hidden border border-slate-100 shadow-sm z-20 bg-white ${
                          outfit.images.head ? "-mt-2" : ""
                        }`}
                      >
                        <img
                          src={outfit.images.top}
                          className="w-full h-full object-cover"
                          alt="top"
                        />
                      </div>
                    ) : (
                      <div className="h-4"></div>
                    )}
                    {outfit.images.bottom && (
                      <div
                        className={`w-14 h-16 rounded-lg overflow-hidden border border-slate-100 shadow-sm z-10 bg-white ${
                          outfit.images.top ? "-mt-2" : "-mt-4"
                        }`}
                      >
                        <img
                          src={outfit.images.bottom}
                          className="w-full h-full object-cover"
                          alt="bottom"
                        />
                      </div>
                    )}
                    {outfit.images.feet && (
                      <div
                        className={`w-12 h-8 rounded-lg overflow-hidden border border-slate-100 shadow-sm z-20 bg-white ${
                          outfit.images.bottom ? "-mt-2" : "-mt-4"
                        }`}
                      >
                        <img
                          src={outfit.images.feet}
                          className="w-full h-full object-cover"
                          alt="feet"
                        />
                      </div>
                    )}
                  </div>
                  {outfit.weatherAtTime && (
                    <div className="absolute bottom-2 right-2 bg-slate-100/80 backdrop-blur-sm p-1 rounded-md text-slate-500">
                      {outfit.weatherAtTime.condition === "sunny" ? (
                        <Sun size={12} />
                      ) : outfit.weatherAtTime.condition === "rainy" ? (
                        <CloudRain size={12} />
                      ) : (
                        <Snowflake size={12} />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Closet;
