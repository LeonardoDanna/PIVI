import React, { useState, useEffect, useMemo } from "react";
import { 
  Calculator, 
  Ruler, 
  RotateCcw, 
  Copy, 
  CheckCircle2,
  Shirt, 
  AlertCircle,
  Check,
  Info
} from "lucide-react";

// Ícone customizado de Calça
const PantsIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 22V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16l-6-3-6 3z" />
    <path d="M12 4v15" />
  </svg>
);

// Dados da tabela de referência
const REFERENCE_TABLE = [
  { size: "PP / 36", height: "150-165", weight: "40-55" },
  { size: "P / 38", height: "160-170", weight: "55-65" },
  { size: "M / 40-42", height: "165-178", weight: "65-78" },
  { size: "G / 44", height: "170-185", weight: "78-88" },
  { size: "GG / 46", height: "175-190", weight: "88-98" },
  { size: "G1 / 48", height: "175-195", weight: "98-108" },
  { size: "G2 / 50", height: "180-200", weight: "108-118" },
  { size: "G3 / 52", height: "180-205", weight: "118-128" },
  { size: "G4 / 54+", height: "180-210", weight: "128+" },
];

const FitGuide = () => {
  const [activeView, setActiveView] = useState("calculator");
  const [resultType, setResultType] = useState("top");
  const [copied, setCopied] = useState(false);

  // Persistência
  const [fitMetrics, setFitMetrics] = useState(() => {
    if (typeof window === "undefined") return { height: 175, weight: 75, preference: "regular" };
    try {
      const saved = localStorage.getItem("userFitMetrics");
      return saved ? JSON.parse(saved) : { height: 175, weight: 75, preference: "regular" };
    } catch (e) {
      return { height: 175, weight: 75, preference: "regular" };
    }
  });

  useEffect(() => {
    localStorage.setItem("userFitMetrics", JSON.stringify(fitMetrics));
  }, [fitMetrics]);

  const calculatedSize = useMemo(() => {
    const { height, weight, preference } = fitMetrics;
    const ratio = weight / height;
    
    // Lógica Top
    let topSize = "M";
    if (ratio < 0.35) topSize = "PP";
    else if (ratio < 0.4) topSize = "P";
    else if (ratio < 0.48) topSize = "M";
    else if (ratio < 0.55) topSize = "G";
    else if (ratio < 0.62) topSize = "GG";
    else if (ratio < 0.69) topSize = "G1";
    else if (ratio < 0.76) topSize = "G2";
    else if (ratio < 0.83) topSize = "G3";
    else topSize = "G4";

    // Lógica Bottom
    let bottomSize = "40";
    if (weight < 55) bottomSize = "36";
    else if (weight < 62) bottomSize = "38";
    else if (weight < 72) bottomSize = "40";
    else if (weight < 80) bottomSize = "42";
    else if (weight < 90) bottomSize = "44";
    else if (weight < 100) bottomSize = "46";
    else if (weight < 110) bottomSize = "48";
    else if (weight < 120) bottomSize = "50";
    else if (weight < 130) bottomSize = "52";
    else bottomSize = "54";

    // Ajuste de preferência
    if (preference === "loose") {
      if (topSize === "P") topSize = "M";
      else if (topSize === "M") topSize = "G";
      else if (topSize === "G") topSize = "GG";
      else if (topSize === "GG") topSize = "G1";
      else if (topSize === "G1") topSize = "G2";
      else if (topSize === "G2") topSize = "G3";
      else if (topSize === "G3") topSize = "G4";
      
      const numericBottom = parseInt(bottomSize);
      if (!isNaN(numericBottom) && numericBottom < 54) {
        bottomSize = (numericBottom + 2).toString();
      }
    }

    let confidence = 92;
    if (preference !== "regular") confidence -= 5;
    if (resultType === "bottom") confidence -= 4; 

    return { top: topSize, bottom: bottomSize, confidence };
  }, [fitMetrics, resultType]);

  const handleReset = () => {
    setFitMetrics({ height: 175, weight: 75, preference: "regular" });
  };

  const handleCopy = () => {
    const text = `Meus tamanhos recomendados são ${calculatedSize.top} (Superior) e ${calculatedSize.bottom} (Inferior).`;
    document.execCommand('copy'); // Fallback mais seguro para iframes
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans text-slate-900">
      
      {/* --- COLUNA ESQUERDA: Controles --- */}
      <div className="col-span-1 lg:col-span-5 bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full">
        
        {/* Header Responsivo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl transition-colors ${activeView === 'calculator' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
              {activeView === 'calculator' ? <Calculator size={24} /> : <Ruler size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 leading-tight">
                {activeView === 'calculator' ? 'Calculadora' : 'Tabela Oficial'}
              </h3>
              <p className="text-xs text-slate-500">Descubra seu tamanho ideal</p>
            </div>
          </div>
          
          {/* Toggle View (Aba de visualização) */}
          <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setActiveView("calculator")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeView === "calculator" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Calculator size={16} />
              <span className="sm:hidden md:inline">Calc</span>
            </button>
            <button
              onClick={() => setActiveView("table")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeView === "table" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Ruler size={16} />
              <span className="sm:hidden md:inline">Tabela</span>
            </button>
          </div>
        </div>

        {/* Conteúdo Principal da Esquerda */}
        <div className="flex-1">
          {activeView === "calculator" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
              {/* Slider Altura */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700">Altura</label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{fitMetrics.height} cm</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="210"
                  value={fitMetrics.height}
                  onChange={(e) => setFitMetrics({ ...fitMetrics, height: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                  <span>1.50m</span>
                  <span>2.10m</span>
                </div>
              </div>

              {/* Slider Peso */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700">Peso</label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{fitMetrics.weight} kg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={fitMetrics.weight}
                  onChange={(e) => setFitMetrics({ ...fitMetrics, weight: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                  <span>40kg</span>
                  <span>200kg</span>
                </div>
              </div>

              {/* Preferência Toggle */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-3 block">Preferência de Ajuste</label>
                <div className="grid grid-cols-3 gap-2">
                  {["tight", "regular", "loose"].map((pref) => (
                    <button
                      key={pref}
                      onClick={() => setFitMetrics({ ...fitMetrics, preference: pref })}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                        fitMetrics.preference === pref
                          ? "bg-slate-900 border-slate-900 text-white shadow-md scale-[1.02]"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {pref === "tight" ? "Justo" : pref === "regular" ? "Padrão" : "Largo"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button onClick={handleReset} className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-50">
                  <RotateCcw size={12} /> Resetar
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg border-b border-slate-200">Tam</th>
                    <th className="px-4 py-3 border-b border-slate-200">Altura</th>
                    <th className="px-4 py-3 rounded-tr-lg border-b border-slate-200">Peso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {REFERENCE_TABLE.map((row) => {
                    const isActive = calculatedSize.top === row.size.split(' / ')[0] || calculatedSize.bottom === row.size.split(' / ')[1];
                    return (
                    <tr key={row.size} className={`hover:bg-slate-50 transition-colors ${isActive ? "bg-blue-50/60" : ""}`}>
                      <td className="px-4 py-3 font-bold text-slate-800">
                        {row.size}
                        {isActive && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full align-middle">SEU</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.height}</td>
                      <td className="px-4 py-3 text-slate-600">{row.weight}</td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- COLUNA DIREITA: Resultado --- */}
      <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative flex-1 flex flex-col items-center text-center shadow-xl min-h-[360px] group/card overflow-hidden">
          
          {/* Efeitos de Fundo */}
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-40 -mr-20 -mt-20 transition-colors duration-500 ${resultType === 'top' ? 'bg-blue-600' : 'bg-indigo-600'}`}></div>
            <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[80px] opacity-40 -ml-20 -mb-20 transition-colors duration-500 ${resultType === 'top' ? 'bg-purple-600' : 'bg-teal-600'}`}></div>
          </div>
          
          {/* Botão Copy (Absoluto) */}
          <button 
            onClick={handleCopy}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all backdrop-blur-sm z-30"
            title="Copiar resultado"
          >
            {copied ? <CheckCircle2 size={20} className="text-green-400" /> : <Copy size={20} />}
          </button>

          {/* --- ABA CORRIGIDA (Superior/Inferior) --- */}
          {/* Agora posicionada no topo do fluxo, não flutuando aleatoriamente */}
          <div className="relative z-20 w-full flex justify-center mb-6">
            <div className="bg-slate-800/50 p-1.5 rounded-2xl flex gap-1 backdrop-blur-md border border-white/10 shadow-lg">
              <button
                onClick={() => setResultType("top")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  resultType === "top"
                    ? "bg-white text-slate-900 shadow-sm scale-100"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Shirt size={18} className={resultType === "top" ? "text-blue-600" : ""} />
                Superior
              </button>
              <button
                onClick={() => setResultType("bottom")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  resultType === "bottom"
                    ? "bg-white text-slate-900 shadow-sm scale-100"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <PantsIcon size={18} className={resultType === "bottom" ? "text-indigo-600" : ""} />
                Inferior
              </button>
            </div>
          </div>

          {/* Conteúdo Central */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full animate-in zoom-in-95 duration-300 key={resultType}">
            
            <p className="text-slate-400 font-bold mb-2 uppercase tracking-widest text-xs">
              Tamanho Ideal ({resultType === "top" ? "Camiseta" : "Calça"})
            </p>
            
            <div className="text-[7rem] sm:text-[9rem] font-black leading-none tracking-tighter mb-4 bg-gradient-to-b from-white to-slate-400 text-transparent bg-clip-text drop-shadow-sm select-none">
              {resultType === "top" ? calculatedSize.top : calculatedSize.bottom}
            </div>
            
            {/* Tag de Confiança */}
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors cursor-default">
              {calculatedSize.confidence < 92 ? (
                <div className="group relative flex items-center">
                  <AlertCircle size={16} className="text-yellow-400" />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-800 text-xs text-slate-300 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none border border-slate-700">
                    Ajuste pode variar conforme estilo da peça.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              ) : (
                <Check size={16} className="text-green-400" />
              )}
              <span className="text-sm font-medium text-slate-200">
                {calculatedSize.confidence}% de precisão
              </span>
            </div>
          </div>
        </div>

        {/* Card Explicativo */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 mt-1">
              <Info size={22} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-lg">Resumo da Recomendação</h4>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Para um corpo de <strong className="text-slate-900">{fitMetrics.weight}kg</strong> e <strong className="text-slate-900">{fitMetrics.height}cm</strong> com preferência <strong className="text-slate-900">{fitMetrics.preference === 'tight' ? 'justa' : fitMetrics.preference === 'loose' ? 'larga' : 'padrão'}</strong>:
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                  <Shirt size={14} /> Superior: {calculatedSize.top}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                  <PantsIcon size={14} /> Inferior: {calculatedSize.bottom}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- App Container for Preview ---
const App = () => {
  return (
    // Alterado: items-center para items-start, e largura máxima expandida para 1600px
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 flex items-start justify-center font-sans">
      <div className="w-full max-w-[1600px] mx-auto">
        <FitGuide />
      </div>
    </div>
  );
};

export default App;