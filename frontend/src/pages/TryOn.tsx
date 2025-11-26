// src/pages/TryOn.tsx
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
} from "lucide-react";

const API_URL = "http://localhost:8000/api/generate-tryon/";

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
    category: "upper_body",
    isGenerating: false,
    resultImage: null,
    error: null,
  });

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "user" | "cloth"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === "user")
        setTryOnState((prev) => ({
          ...prev,
          userImage: previewUrl,
          userFile: file,
          error: null,
        }));
      else
        setTryOnState((prev) => ({
          ...prev,
          clothImage: previewUrl,
          clothFile: file,
          error: null,
        }));
    }
  };

  const triggerUserUpload = () => userFileInputRef.current?.click();
  const triggerClothUpload = () => clothFileInputRef.current?.click();

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
      const response = await fetch(API_URL, { method: "POST", body: formData });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro no servidor");
      }

      const data = await response.json();

      // Verifica se veio URL ou Base64
      const finalUrl =
        data.url || (data.image ? `data:image/png;base64,${data.image}` : null);

      if (finalUrl) {
        setTryOnState((prev) => ({
          ...prev,
          isGenerating: false,
          resultImage: finalUrl,
        }));
      } else {
        throw new Error("Imagem inválida retornada pela IA");
      }
    } catch (error: any) {
      console.error(error);
      setTryOnState((prev) => ({
        ...prev,
        isGenerating: false,
        error: error.message || "Falha ao conectar com o servidor.",
      }));
    }
  };

  const resetTryOn = () =>
    setTryOnState({
      userImage: null,
      userFile: null,
      clothImage: null,
      clothFile: null,
      category: "upper_body",
      isGenerating: false,
      resultImage: null,
      error: null,
    });

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
              </>
            ) : (
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3">
                  <Shirt className="text-slate-400" />
                </div>
                <p className="font-bold text-slate-700">2. A Peça</p>
              </div>
            )}
          </div>

          {/* Categoria */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-sm">
              <Layers size={16} className="text-purple-600" /> O que é a peça?
            </div>
            <div className="flex gap-2">
              {["upper_body", "lower_body", "dresses"].map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setTryOnState((prev) => ({ ...prev, category: cat }))
                  }
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition border ${
                    tryOnState.category === cat
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {cat === "upper_body"
                    ? "Parte de Cima"
                    : cat === "lower_body"
                    ? "Parte de Baixo"
                    : "Vestido"}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={
              !tryOnState.userImage ||
              !tryOnState.clothImage ||
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
                <RefreshCw className="animate-spin" size={20} /> Processando...
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
                Aguardando Uploads
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TryOn;
