// src/pages/Matches.tsx
import { useState } from "react";
import { User, Check, ArrowRight, ExternalLink, Palette } from "lucide-react";
import { colorPalettes, styleImagesData } from "../data/constants";
import type { SkinToneKey } from "../data/constants";

const Matches = () => {
  const [selectedSkinTone, setSelectedSkinTone] =
    useState<SkinToneKey>("medium");
  const currentPalette = colorPalettes[selectedSkinTone];

  // Função para abrir a pesquisa no Google
  const handleStyleClick = (styleName: string) => {
    const formattedStyle = styleName.replace(/_/g, " ");
    const query = `Roupas ${formattedStyle} para ter no meu armário`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      query
    )}`;
    window.open(searchUrl, "_blank", "noopener,noreferrer");
  };

  // Função auxiliar para formatar o nome do estilo
  const formatStyleName = (string: string) => {
    const withSpaces = string.replace(/_/g, " ");
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  };

  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-140px)] pb-12">
      {/* COLUNA DA ESQUERDA: ANÁLISE DE COR */}
      <div className="w-full lg:w-1/3 space-y-8">
        {/* Seletor de Pele */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-4 z-20">
          <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
            <User className="text-purple-600" size={20} />
            Seu Tom de Pele
          </h3>

          <div className="flex flex-wrap gap-3 justify-center">
            {(Object.keys(colorPalettes) as SkinToneKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedSkinTone(key)}
                aria-label={`Selecionar tom de pele ${colorPalettes[key].label}`}
                className={`group relative w-14 h-14 md:w-16 md:h-16 rounded-full transition-all duration-300 flex items-center justify-center ${
                  selectedSkinTone === key
                    ? "ring-4 ring-offset-4 ring-slate-900 scale-110 shadow-lg z-10"
                    : "hover:scale-105 hover:shadow-md ring-1 ring-slate-100 grayscale-[0.3] hover:grayscale-0"
                }`}
                style={{ backgroundColor: colorPalettes[key].hex }}
                title={colorPalettes[key].label}
              >
                {selectedSkinTone === key && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 animate-scale-in">
                    <Check
                      size={20}
                      strokeWidth={3}
                      className={
                        ["dark", "deep", "tan"].includes(key)
                          ? "text-white"
                          : "text-slate-900"
                      }
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="mt-8 text-center p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors duration-300 hover:bg-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Diagnóstico
            </p>
            <p className="text-slate-800 font-medium text-lg">
              Pele {colorPalettes[selectedSkinTone].label}
            </p>
          </div>
        </div>

        {/* Cartela de Cores */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
          {/* Fundo Decorativo Animado */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/50 to-blue-100/50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="text-purple-600" size={18} />
              <h3 className="font-bold text-slate-800 text-lg">
                Sua Cartela Ideal
              </h3>
            </div>
            
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4 tracking-tight">
              {currentPalette.season}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 border-l-4 border-purple-200 pl-4">
              {currentPalette.description}
            </p>

            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span>Paleta Principal</span>
              <span className="h-px flex-1 bg-slate-100"></span>
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {currentPalette.colors.map((color, i) => (
                <div
                  key={`${selectedSkinTone}-${i}`} // Chave composta para forçar animação na troca
                  className="flex flex-col items-center gap-2 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div
                    title="Cor sugerida para composição"
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full shadow-sm hover:shadow-md cursor-help ${
                      color === "bg-white"
                        ? "border border-slate-200 bg-white"
                        : color
                    } transform transition-all duration-300 hover:scale-110 hover:-translate-y-1 ring-2 ring-white ring-offset-2 ring-offset-slate-50`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* COLUNA DA DIREITA: ESTILOS VISUAIS (EDITORIAL) */}
      <div className="w-full lg:w-2/3">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-slate-800 text-2xl tracking-tight">
            Estilos Recomendados
          </h3>
          <span className="text-xs font-bold bg-slate-900 text-white px-4 py-1.5 rounded-full shadow-lg shadow-slate-200">
            {currentPalette.styles.length} Opções
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {currentPalette.styles.map((style, index) => (
            <div
              key={style}
              onClick={() => handleStyleClick(style)}
              // Adicionando delay na animação para efeito cascata
              style={{ animationDelay: `${index * 150}ms` }}
              className="group relative h-[28rem] rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-500 bg-white animate-fade-in-up fill-mode-both"
              role="button"
              aria-label={`Pesquisar inspirações para estilo ${formatStyleName(
                style
              )} no Google`}
            >
              {/* Imagem de Fundo */}
              <div className="absolute inset-0 bg-slate-200 overflow-hidden">
                <img
                  src={
                    styleImagesData[style] ||
                    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop"
                  }
                  alt={style}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
              </div>

              {/* Overlay Gradiente Melhorado para Legibilidade */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>

              {/* Conteúdo do Card */}
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                <div className="overflow-hidden mb-1">
                  <h4 className="text-white font-bold text-3xl leading-none shadow-sm transform transition-transform duration-300 origin-left group-hover:scale-105">
                    {formatStyleName(style)}
                  </h4>
                </div>
                
                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                  <div className="pt-4 flex items-center gap-2 text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-medium">
                    <span>Pesquisar look</span>
                    <ExternalLink size={14} />
                  </div>
                </div>
              </div>

              {/* Botão Flutuante (Icon) */}
              <div className="absolute top-5 right-5 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-lg transform transition-all duration-300 group-hover:bg-white group-hover:text-purple-600 group-hover:rotate-[-45deg] hover:!scale-110">
                <ArrowRight size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;