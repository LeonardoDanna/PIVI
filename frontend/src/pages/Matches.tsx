// src/pages/Matches.tsx
import { useState } from "react";
import { User, Check, Sparkles, ArrowRight } from "lucide-react";
// IMPORTAÇÃO CORRIGIDA:
import { colorPalettes, styleImagesData } from "../data/constants";
import type { SkinToneKey } from "../data/constants"; // Importando o Tipo separadamente (boa prática)

const Matches = () => {
  const [selectedSkinTone, setSelectedSkinTone] =
    useState<SkinToneKey>("medium");
  const currentPalette = colorPalettes[selectedSkinTone];

  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-140px)]">
      {/* COLUNA DA ESQUERDA: ANÁLISE DE COR */}
      <div className="w-full lg:w-1/3 space-y-8">
        {/* Seletor de Pele */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
          <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
            <User className="text-purple-600" size={20} />
            Seu Tom de Pele
          </h3>

          <div className="flex flex-wrap gap-4 justify-center">
            {(Object.keys(colorPalettes) as SkinToneKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedSkinTone(key)}
                className={`group relative w-16 h-16 rounded-full transition-all duration-300 flex items-center justify-center ${
                  selectedSkinTone === key
                    ? "ring-4 ring-offset-4 ring-slate-900 scale-110 shadow-lg"
                    : "hover:scale-105 hover:shadow-md ring-1 ring-slate-100"
                }`}
                style={{ backgroundColor: colorPalettes[key].hex }}
                title={colorPalettes[key].label}
              >
                {selectedSkinTone === key && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
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
          <div className="mt-8 text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Diagnóstico
            </p>
            <p className="text-slate-800 font-medium">
              Pele {colorPalettes[selectedSkinTone].label}
            </p>
          </div>
        </div>

        {/* Cartela de Cores */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          {/* Fundo Decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              Sua Cartela Ideal
            </h3>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
              {currentPalette.season}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 border-l-4 border-purple-200 pl-4">
              {currentPalette.description}
            </p>

            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Paleta Principal
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {currentPalette.colors.map((color, i) => (
                <div key={i} className="group flex flex-col items-center gap-2">
                  <div
                    className={`w-16 h-16 rounded-full shadow-md ${
                      color === "bg-white"
                        ? "border border-slate-200 bg-white"
                        : color
                    } transform transition duration-500 group-hover:scale-110 group-hover:rotate-6 ring-2 ring-white ring-offset-2 ring-offset-slate-50`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* COLUNA DA DIREITA: ESTILOS VISUAIS (EDITORIAL) */}
      <div className="w-full lg:w-2/3">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 text-xl">
            Estilos Recomendados
          </h3>
          <span className="text-xs font-bold bg-slate-900 text-white px-3 py-1 rounded-full">
            {currentPalette.styles.length} Looks
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {currentPalette.styles.map((style) => (
            <div
              key={style}
              className="group relative h-96 rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 bg-white"
            >
              <div className="absolute inset-0 bg-slate-200">
                <img
                  src={
                    styleImagesData[style] ||
                    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop"
                  }
                  alt={style}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Sparkles size={12} className="text-yellow-400" />
                  Match 98%
                </div>
                <h4 className="text-white font-bold text-2xl leading-none mb-2 shadow-sm">
                  {style}
                </h4>
                <div className="h-0 group-hover:h-auto overflow-hidden transition-all">
                  <p className="text-slate-300 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-medium">
                    Ver inspirações
                  </p>
                </div>
              </div>

              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 border border-white/30">
                <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;
