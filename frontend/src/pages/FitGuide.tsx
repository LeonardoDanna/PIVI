import React, { useState, useEffect, useMemo } from "react";
import { 
  Calculator, 
  Check, 
  Info, 
  AlertCircle, 
  Ruler, 
  RotateCcw, 
  Copy, 
  CheckCircle2,
  Shirt,     // Ícone para parte superior
  Scissors   // Ícone alternativo para alfaiataria/calça (ou usar texto)
} from "lucide-react";

// Ícone customizado de Calça (usando SVG simples já que Lucide pode não ter um específico perfeito em todas as versões)
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

// --- Type Definitions ---
interface FitMetrics {
  height: number;
  weight: number;
  preference: "tight" | "regular" | "loose";
}

interface CalculatedResult {
  top: string;
  bottom: string; // Numérica (38, 40...) ou Letra
  confidence: number;
}

// Dados da tabela de referência para exibição (Atualizado com Calças)
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
  // Estado para controlar a visualização (Calculadora ou Tabela)
  const [activeView, setActiveView] = useState<"calculator" | "table">("calculator");
  // Estado para controlar qual resultado mostrar no card (Top ou Bottom)
  const [resultType, setResultType] = useState<"top" | "bottom">("top");
  
  const [copied, setCopied] = useState(false);

  // Persistência com tipagem segura
  const [fitMetrics, setFitMetrics] = useState<FitMetrics>(() => {
    if (typeof window === "undefined") {
      return { height: 175, weight: 75, preference: "regular" };
    }
    
    try {
      const saved = localStorage.getItem("userFitMetrics");
      return saved
        ? JSON.parse(saved)
        : { height: 175, weight: 75, preference: "regular" };
    } catch (e) {
      console.error("Erro ao carregar preferências", e);
      return { height: 175, weight: 75, preference: "regular" };
    }
  });

  useEffect(() => {
    localStorage.setItem("userFitMetrics", JSON.stringify(fitMetrics));
  }, [fitMetrics]);

  const calculatedSize = useMemo<CalculatedResult>(() => {
    const { height, weight, preference } = fitMetrics;
    const ratio = weight / height;
    
    // --- Lógica Top (Camisetas) ---
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

    // --- Lógica Bottom (Calças - Baseado em numeração BR) ---
    // Calças dependem mais do peso absoluto e distribuição, mas o ratio ajuda
    // Estimativa baseada em IMC aproximado para cintura
    let bottomSize = "40";
    // Faixas de peso aproximadas para numeração masculina padrão BR
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

    // Ajuste de preferência para AMBOS
    if (preference === "loose") {
      // Top Upgrade
      if (topSize === "P") topSize = "M";
      else if (topSize === "M") topSize = "G";
      else if (topSize === "G") topSize = "GG";
      else if (topSize === "GG") topSize = "G1";
      else if (topSize === "G1") topSize = "G2";
      else if (topSize === "G2") topSize = "G3";
      else if (topSize === "G3") topSize = "G4";
      
      // Bottom Upgrade (pula um número par)
      const numericBottom = parseInt(bottomSize);
      if (!isNaN(numericBottom) && numericBottom < 54) {
        bottomSize = (numericBottom + 2).toString();
      }
    } else if (preference === "tight") {
        // Lógica opcional para 'tight'
    }

    let confidence = 92;
    // Simulação de variação de confiança
    if (preference !== "regular") confidence -= 5;
    // Calças são mais difíceis de prever só com peso/altura
    if (resultType === "bottom") confidence -= 4; 

    return { top: topSize, bottom: bottomSize, confidence };
  }, [fitMetrics, resultType]); // Adicionado resultType para atualizar a confiança visualmente se necessário

  const handleReset = () => {
    setFitMetrics({ height: 175, weight: 75, preference: "regular" });
  };

  const handleCopy = () => {
    // Copy formatado conforme solicitado (Removido Compatibilidade)
    const text = `Meus tamanhos recomendados são ${calculatedSize.top} (Superior) e ${calculatedSize.bottom} (Inferior).`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Coluna de Controles / Tabela */}
      <div className="col-span-1 lg:col-span-5 bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full">
        
        {/* Header com Abas */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             {/* Ícone dinâmico baseado na aba */}
            <div className={`p-3 rounded-xl transition-colors ${activeView === 'calculator' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
              {activeView === 'calculator' ? <Calculator size={24} /> : <Ruler size={24} />}
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              {activeView === 'calculator' ? 'Calculadora' : 'Tabela Oficial'}
            </h3>
          </div>
          
          {/* Toggle de Visualização */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveView("calculator")}
              className={`p-2 rounded-md transition-all ${activeView === "calculator" ? "bg-white shadow text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
              title="Calculadora Interativa"
            >
              <Calculator size={18} />
            </button>
            <button
              onClick={() => setActiveView("table")}
              className={`p-2 rounded-md transition-all ${activeView === "table" ? "bg-white shadow text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
              title="Tabela de Medidas"
            >
              <Ruler size={18} />
            </button>
          </div>
        </div>

        {/* Conteúdo Dinâmico */}
        <div className="flex-1">
          {activeView === "calculator" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
              {/* Altura Slider */}
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

              {/* Peso Slider */}
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
                  max="200"
                  value={fitMetrics.weight}
                  onChange={(e) =>
                    setFitMetrics({ ...fitMetrics, weight: Number(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Preferência Toggle */}
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
                      className={`py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        fitMetrics.preference === pref
                          ? "bg-slate-900 text-white shadow-md scale-105"
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

              {/* Botão Reset */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={handleReset}
                  className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw size={12} />
                  Resetar padrões
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs sticky top-0">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Tam / Calça</th>
                    <th className="px-4 py-3">Altura (cm)</th>
                    <th className="px-4 py-3 rounded-tr-lg">Peso (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {REFERENCE_TABLE.map((row) => {
                    const isActive = calculatedSize.top === row.size.split(' / ')[0] || calculatedSize.bottom === row.size.split(' / ')[1];
                    return (
                    <tr 
                      key={row.size} 
                      className={`hover:bg-slate-50 transition-colors ${isActive ? "bg-blue-50/60" : ""}`}
                    >
                      <td className="px-4 py-3 font-bold text-slate-800">
                        {row.size}
                        {isActive && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">SEU</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.height}</td>
                      <td className="px-4 py-3 text-slate-600">{row.weight}</td>
                    </tr>
                  )})}
                </tbody>
              </table>
              <p className="text-xs text-slate-400 mt-4 px-2">
                * Medidas aproximadas. Calças seguem padrão numérico BR (38, 40...).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Coluna de Resultado */}
      <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative flex-1 flex flex-col justify-center items-center text-center shadow-xl min-h-[300px] group/card transition-all duration-500">
          
          {/* Container isolado para os efeitos de fundo */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            {/* Efeitos mudam de cor levemente baseados na seleção */}
            <div className={`absolute top-0 right-0 p-24 rounded-full blur-[100px] opacity-30 -mr-20 -mt-20 transition-colors duration-500 ${resultType === 'top' ? 'bg-blue-500' : 'bg-indigo-500'}`}></div>
            <div className={`absolute bottom-0 left-0 p-24 rounded-full blur-[100px] opacity-30 -ml-20 -mb-20 transition-colors duration-500 ${resultType === 'top' ? 'bg-purple-500' : 'bg-teal-500'}`}></div>
          </div>
          
          {/* Botão de Copiar */}
          <button 
            onClick={handleCopy}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all opacity-0 group-hover/card:opacity-100 z-20"
            title="Copiar ambos os tamanhos"
          >
            {copied ? <CheckCircle2 size={20} className="text-green-400" /> : <Copy size={20} />}
          </button>

          {/* Toggle Superior / Inferior no Card */}
          <div className="relative z-20 bg-white/10 p-1 rounded-xl flex gap-1 mb-8 backdrop-blur-md border border-white/5">
            <button
              onClick={() => setResultType("top")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                resultType === "top"
                  ? "bg-white text-slate-900 shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Shirt size={16} />
              Superior
            </button>
            <button
              onClick={() => setResultType("bottom")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                resultType === "bottom"
                  ? "bg-white text-slate-900 shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <PantsIcon size={16} />
              Inferior
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center animate-in zoom-in-95 duration-300 key={resultType}">
            <p className="text-slate-400 font-medium mb-2 uppercase tracking-widest text-sm">
              Tamanho Recomendado ({resultType === "top" ? "Camiseta" : "Calça"})
            </p>
            
            <div className="text-[6rem] sm:text-[8rem] font-black leading-none tracking-tighter mb-6 bg-gradient-to-b from-white to-slate-400 text-transparent bg-clip-text drop-shadow-sm transition-all hover:scale-105 cursor-default">
              {resultType === "top" ? calculatedSize.top : calculatedSize.bottom}
            </div>
            
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              {calculatedSize.confidence < 92 ? (
                // Tooltip Group Wrapper
                <div className="group relative flex items-center">
                  <AlertCircle size={16} className="text-yellow-400 cursor-help" />
                  
                  {/* Tooltip Content */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-slate-800 text-left rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:-translate-y-1 z-50 pointer-events-none border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
                       <AlertCircle size={14} className="text-yellow-400" />
                       <span className="font-bold text-yellow-400 text-xs uppercase tracking-wide">Sobre a Compatibilidade</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {resultType === "bottom" 
                        ? "Calças podem variar mais dependendo da cintura e coxa. Considere provar se estiver entre números."
                        : "A pontuação é reduzida ao escolher preferências específicas, pois a percepção de ajuste varia entre tipos de corpo."}
                    </p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              ) : (
                <Check size={16} className="text-green-400" />
              )}
              <span className="text-sm font-medium">
                {calculatedSize.confidence}% de compatibilidade
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg shrink-0">
              <Info size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">
                Por que este tamanho?
              </h4>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Baseado em seus <strong className="text-slate-700">{fitMetrics.weight}kg</strong> e altura
                de <strong className="text-slate-700">{fitMetrics.height}cm</strong>, sugerimos:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Shirt size={14} className="text-blue-500"/>
                  Camiseta: <strong>{calculatedSize.top}</strong> (Ajuste {fitMetrics.preference === 'regular' ? 'Padrão' : fitMetrics.preference === 'tight' ? 'Justo' : 'Largo'})
                </li>
                <li className="flex items-center gap-2">
                  <PantsIcon size={14} className="text-indigo-500"/>
                  Calça: <strong>{calculatedSize.bottom}</strong> (Numeração BR)
                </li>
              </ul>
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl mx-auto">
        <FitGuide />
      </div>
    </div>
  );
};

export default App;