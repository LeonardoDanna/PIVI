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
  // Ícones específicos para as novas categorias
  Scissors, // Para peças de baixo/vestidos
  Sun, // Para shorts
  Heart, // Para blusa feminina
  Package, // Para jaqueta/casaco
  Archive, // Para moletom
} from "lucide-react";

// --- URL CORRIGIDA ---
const API_URL = "/api/try-on-diffusion/";

const CLOTHING_TYPES = [
  { id: "t-shirt", label: "Camiseta", icon: Shirt },
  { id: "shirt", label: "Camisa Social", icon: Shirt },
  { id: "blouse", label: "Blusa Feminina", icon: Heart },
  { id: "sweatshirt", label: "Moletom/Suéter", icon: Archive },
  { id: "jacket", label: "Jaqueta/Casaco", icon: Package },
  { id: "pants", label: "Calça", icon: Layers },
  { id: "shorts", label: "Shorts", icon: Sun },
  { id: "skirt", label: "Saia", icon: Scissors },
  { id: "dress", label: "Vestido", icon: Scissors },
];

// --- INTERFACES E ESTADO ---
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

const TryOn = () => {
  const userFileInputRef = useRef<HTMLInputElement>(null);
  const clothFileInputRef = useRef<HTMLInputElement>(null);

  const [tryOnState, setTryOnState] = useState<TryOnState>({
    userImage: null,
    userFile: null,
    clothImage: null,
    clothFile: null,
    category: "t-shirt", // Novo padrão inicial
    isGenerating: false,
    resultImage: null,
    error: null,
  });

  // --- FUNÇÕES DE UPLOAD (Inalteradas) ---
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "user" | "cloth"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const newState = {
        ...tryOnState,
        error: null,
      };

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

  const triggerUserUpload = () => userFileInputRef.current?.click();
  const triggerClothUpload = () => clothFileInputRef.current?.click();

  // --- FUNÇÃO PRINCIPAL DE GERAÇÃO (Usa a URL Corrigida) ---
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
      const response = await fetch(API_URL, {
        method: "POST",
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
          throw new Error(`Resposta inesperada: ${text.substring(0, 50)}...`);
        }
      } else {
        let errorMessage = "Erro no servidor Django. Tente novamente.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (e) {
          // Ignora se não for JSON e usa a mensagem padrão
        }
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Erro no Try-On:", error);
      setTryOnState((prev) => ({
        ...prev,
        isGenerating: false,
        error: error.message || "Falha na comunicação com o servidor.",
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

  const selectedCategory = CLOTHING_TYPES.find(
    (c) => c.id === tryOnState.category
  );

  // --- RENDERIZAÇÃO JSX ---
  return (
    <div className="animate-fade-in h-[calc(100vh-140px)]">
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
          {/* Upload User */}
          <div
            onClick={triggerUserUpload}
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
                <div className="absolute bottom-3 bg-white/80 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm shadow-sm">
                  Trocar Foto
                </div>
              </>
            ) : (
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3">
                  <Upload className="text-slate-400" />
                </div>
                <p className="font-bold text-slate-700">1. Sua Foto</p>
                <p className="text-xs text-slate-400 mt-1">
                  Clique para enviar arquivo
                </p>
              </div>
            )}
          </div>

          {/* Upload Cloth */}
          <div
            onClick={triggerClothUpload}
            className={`flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${
              tryOnState.clothImage
                ? "border-purple-500 bg-purple-50"
                : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            {tryOnState.clothImage ? (
              <>
                <img
                  src={tryOnState.clothImage}
                  className="absolute inset-0 w-full h-full object-contain p-2 opacity-90 group-hover:opacity-100 transition bg-slate-50"
                  alt="Cloth Preview"
                />
                <div className="absolute top-3 right-3 bg-white p-1 rounded-full shadow-sm">
                  <Check className="text-green-600" size={16} />
                </div>
                <div className="absolute bottom-3 bg-white/80 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm shadow-sm">
                  Trocar Roupa
                </div>
              </>
            ) : (
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3">
                  <Shirt className="text-slate-400" />
                </div>
                <p className="font-bold text-slate-700">2. A Peça</p>
                <p className="text-xs text-slate-400 mt-1">
                  Clique para enviar arquivo
                </p>
              </div>
            )}
          </div>

          {/* NOVO SELETOR DE CATEGORIA DETALHADA */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-sm">
              <Layers size={16} className="text-purple-600" /> 3. Tipo de Peça:{" "}
              {selectedCategory?.label}
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

          {/* Botão Gerar */}
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

        {/* Resultado */}
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
