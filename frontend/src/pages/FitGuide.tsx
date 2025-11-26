// src/pages/FitGuide.tsx
import { useState, useEffect, useMemo } from "react";
import { Calculator, Check, Info } from "lucide-react";
// IMPORTAÇÃO CORRIGIDA:
import type { FitMetrics } from "../data/constants";

const FitGuide = () => {
  // Persistência
  const [fitMetrics, setFitMetrics] = useState<FitMetrics>(() => {
    const saved = localStorage.getItem("userFitMetrics");
    return saved
      ? JSON.parse(saved)
      : { height: 175, weight: 75, preference: "regular" };
  });

  useEffect(() => {
    localStorage.setItem("userFitMetrics", JSON.stringify(fitMetrics));
  }, [fitMetrics]);

  const calculatedSize = useMemo(() => {
    const { height, weight, preference } = fitMetrics;
    const ratio = weight / height;
    let baseSize = "M";
    let confidence = 92;
    if (ratio < 0.35) baseSize = "PP";
    else if (ratio < 0.4) baseSize = "P";
    else if (ratio < 0.48) baseSize = "M";
    else if (ratio < 0.55) baseSize = "G";
    else baseSize = "GG";
    if (preference === "loose") {
      if (baseSize === "P") baseSize = "M";
      if (baseSize === "M") baseSize = "G";
      if (baseSize === "G") baseSize = "GG";
    }
    return { size: baseSize, confidence };
  }, [fitMetrics]);

  const loadPreset = (type: "small" | "medium" | "large") => {
    if (type === "small")
      setFitMetrics({ ...fitMetrics, height: 165, weight: 58 });
    if (type === "medium")
      setFitMetrics({ ...fitMetrics, height: 178, weight: 76 });
    if (type === "large")
      setFitMetrics({ ...fitMetrics, height: 185, weight: 105 });
  };

  return (
    <div className="animate-fade-in grid grid-cols-12 gap-8">
      <div className="col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl text-blue-700">
            <Calculator size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            Calculadora de Medidas
          </h3>
        </div>
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-slate-700">
                Sua Altura
              </label>
              <span className="text-sm font-bold text-blue-600">
                {fitMetrics.height} cm
              </span>
            </div>
            <input
              type="range"
              min="150"
              max="210"
              value={fitMetrics.height}
              onChange={(e) =>
                setFitMetrics({ ...fitMetrics, height: Number(e.target.value) })
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-slate-700">
                Seu Peso
              </label>
              <span className="text-sm font-bold text-blue-600">
                {fitMetrics.weight} kg
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="150"
              value={fitMetrics.weight}
              onChange={(e) =>
                setFitMetrics({ ...fitMetrics, weight: Number(e.target.value) })
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 mb-3 block">
              Preferência de Ajuste
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["tight", "regular", "loose"] as const).map((pref) => (
                <button
                  key={pref}
                  onClick={() =>
                    setFitMetrics({ ...fitMetrics, preference: pref })
                  }
                  className={`py-2 rounded-lg text-sm font-medium transition ${
                    fitMetrics.preference === pref
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {pref === "tight"
                    ? "Justo"
                    : pref === "regular"
                    ? "Regular"
                    : "Largo"}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">
              Teste Rápido (Pré-seleção)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => loadPreset("small")}
                className="px-3 py-1 text-xs border border-slate-200 rounded-full hover:bg-slate-50"
              >
                Perfil P
              </button>
              <button
                onClick={() => loadPreset("medium")}
                className="px-3 py-1 text-xs border border-slate-200 rounded-full hover:bg-slate-50"
              >
                Perfil M
              </button>
              <button
                onClick={() => loadPreset("large")}
                className="px-3 py-1 text-xs border border-slate-200 rounded-full hover:bg-slate-50"
              >
                Perfil GG
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-7 flex flex-col gap-6">
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex-1 flex flex-col justify-center items-center text-center shadow-xl">
          <div className="absolute top-0 right-0 p-12 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 p-16 bg-purple-500 rounded-full blur-3xl opacity-20 -ml-10 -mb-10"></div>
          <div className="relative z-10">
            <p className="text-slate-400 font-medium mb-2">
              Tamanho Recomendado
            </p>
            <div className="text-[8rem] font-black leading-none tracking-tighter mb-4 bg-gradient-to-b from-white to-slate-400 text-transparent bg-clip-text">
              {calculatedSize.size}
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Check size={16} className="text-green-400" />
              <span className="text-sm font-medium">
                {calculatedSize.confidence}% de compatibilidade
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
              <Info size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">
                Por que este tamanho?
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                Baseado em seus <strong>{fitMetrics.weight}kg</strong> e altura
                de <strong>{fitMetrics.height}cm</strong>, o tamanho{" "}
                {calculatedSize.size} oferece o melhor equilíbrio para a
                preferência{" "}
                <strong>
                  {" "}
                  {fitMetrics.preference === "tight"
                    ? "Justa"
                    : fitMetrics.preference === "regular"
                    ? "Regular"
                    : "Larga"}
                </strong>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitGuide;
