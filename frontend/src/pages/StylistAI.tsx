import { useState, useRef } from "react";
import {
  Star,
  Camera,
  Upload,
  X,
  CheckCircle,
  Palette,
  Ruler,
  Sparkles,
  AlertCircle,
  Share2,
  Clock,
  TrendingUp,
} from "lucide-react";

// --- Interfaces para TypeScript ---
interface PaletteColor {
  hex: string;
  name: string;
}

interface AnalysisResult {
  score: number;
  styleClass: string;
  palette: PaletteColor[];
  strengths: string[];
  improvements: string[];
}

const StylistAI = () => {
  const [activeTab, setActiveTab] = useState("stylist");
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const [resultData, setResultData] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setAnalysisComplete(false);
      setResultData(null);
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = () => {
    if (!image) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setResultData({
        score: 8.7,
        styleClass: "Smart Casual Moderno",
        palette: [
          { hex: "#2C3E50", name: "Navy" },
          { hex: "#E74C3C", name: "Coral" },
          { hex: "#ECF0F1", name: "Ice" },
        ],
        strengths: [
          "Ótimo uso da regra de contraste (60-30-10)",
          "Silhueta bem equilibrada para o tipo físico",
          "Escolha de calçado adequada à ocasião",
        ],
        improvements: [
          "Adicione um cinto de couro para marcar melhor a cintura.",
          "Experimente dobrar as mangas para um visual mais despojado.",
          "Um colar minimalista ajudaria a valorizar o decote.",
        ],
      });
    }, 2500);
  };

  const resetImage = () => {
    setImage(null);
    setAnalysisComplete(false);
    setIsAnalyzing(false);
    setResultData(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-6 md:p-12 min-h-[700px] flex flex-col">
        <nav className="flex justify-between items-center mb-8 md:mb-12 shrink-0">
          <div
            className="text-xl font-bold tracking-tighter text-slate-900 flex items-center gap-2 cursor-pointer"
            onClick={() => setActiveTab("stylist")}
          >
            <Sparkles className="text-purple-600" size={24} />
            <span>
              FASHION<span className="text-purple-600">AI</span>
            </span>
          </div>
          <div className="hidden md:flex gap-2 text-sm font-medium text-slate-500">
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === "history"
                  ? "bg-slate-900 text-white"
                  : "hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              Histórico
            </button>
            <button
              onClick={() => setActiveTab("trends")}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === "trends"
                  ? "bg-slate-900 text-white"
                  : "hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              Tendências
            </button>
            <button
              onClick={() => setActiveTab("stylist")}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === "stylist"
                  ? "bg-slate-900 text-white shadow-lg shadow-purple-200/50"
                  : "hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              AI Stylist
            </button>
          </div>
        </nav>

        <div className="flex-grow">
          {activeTab === "stylist" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start h-full animate-fade-in">
              <div className="space-y-8 pt-4">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                    Seu Estilista <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      Pessoal & Digital
                    </span>
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Faça o upload do seu look atual. Nossa IA analisa
                    proporções, detecta sua paleta e sugere{" "}
                    <span className="font-bold text-slate-800">
                      melhorias reais
                    </span>{" "}
                    para elevar sua imagem.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="group hover:bg-slate-50 transition-all duration-300 flex items-start gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm cursor-default">
                    <div className="bg-green-100 p-3 rounded-xl text-green-700 group-hover:bg-green-500 group-hover:text-white transition-colors">
                      <Ruler size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">
                        Análise Biométrica
                      </h4>
                      <p className="text-slate-500 text-sm">
                        Mapeamento de silhueta e proporção áurea do look.
                      </p>
                    </div>
                  </div>
                  <div className="group hover:bg-slate-50 transition-all duration-300 flex items-start gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm cursor-default">
                    <div className="bg-purple-100 p-3 rounded-xl text-purple-700 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                      <Palette size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">
                        Psicologia das Cores
                      </h4>
                      <p className="text-slate-500 text-sm">
                        Impacto emocional e harmonia do círculo cromático.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={startAnalysis}
                    disabled={!image || isAnalyzing}
                    className={`w-full md:w-auto px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-purple-100 ${
                      !image
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        : isAnalyzing
                        ? "bg-purple-600 text-white cursor-wait"
                        : "bg-slate-900 text-white hover:bg-purple-600 hover:-translate-y-1 hover:shadow-purple-200"
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processando Look...
                      </>
                    ) : (
                      <>
                        <Camera size={22} />{" "}
                        {analysisComplete
                          ? "Analisar Novo Look"
                          : "Iniciar Análise Completa"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="relative h-[650px] w-full group">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 via-pink-100 to-white rounded-[2.5rem] transform rotate-2 scale-[0.98] group-hover:rotate-1 transition-all duration-500 opacity-60 z-0" />
                <div
                  className={`relative z-10 h-full bg-white rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed transition-all duration-500 overflow-hidden shadow-sm ${
                    image
                      ? "border-solid border-white p-0 shadow-2xl ring-4 ring-purple-50/50"
                      : "border-slate-300 hover:border-purple-400 hover:bg-purple-50/30"
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {!image ? (
                    <div
                      className="text-center p-10 cursor-pointer w-full h-full flex flex-col items-center justify-center"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-purple-400 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                        <div className="relative mx-auto w-24 h-24 bg-white border border-slate-100 shadow-lg rounded-3xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                          <Upload size={32} className="text-purple-600" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">
                        Upload do Look
                      </h3>
                      <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                        Arraste sua foto de corpo inteiro para cá ou clique para
                        explorar seus arquivos.
                      </p>
                      <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-full uppercase tracking-wider">
                        <Camera size={12} /> Suporta JPG, PNG
                      </span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="relative w-full h-full bg-slate-100">
                        <img
                          src={image}
                          alt="User upload"
                          className="w-full h-full object-cover"
                        />
                        {analysisComplete && (
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent transition-opacity duration-700" />
                        )}
                      </div>
                      <button
                        onClick={resetImage}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full backdrop-blur-md transition-all shadow-lg z-30 hover:rotate-90"
                      >
                        <X size={20} />
                      </button>
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-slate-900/40 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                          <div className="absolute inset-x-0 h-0.5 bg-purple-400 shadow-[0_0_20px_rgba(192,132,252,1)] animate-scan opacity-80" />
                          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                            <p className="font-bold text-white text-lg tracking-wide">
                              Mapeando Pontos...
                            </p>
                          </div>
                        </div>
                      )}
                      {analysisComplete && resultData && !isAnalyzing && (
                        <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-20 animate-slide-up max-h-[85%] overflow-y-auto custom-scrollbar">
                          <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
                          </div>
                          <div className="p-6 md:p-8 space-y-6">
                            <div className="flex items-start justify-between border-b border-slate-100 pb-6">
                              <div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                  Veredito da IA
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-1">
                                  {resultData.styleClass}
                                </h3>
                                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                                  <CheckCircle size={16} /> Look Aprovado
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="text-4xl font-black text-purple-600 tracking-tighter">
                                  {resultData.score}
                                </div>
                                <div className="flex text-yellow-400 gap-0.5 text-[10px]">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={12}
                                      fill={i < 4 ? "currentColor" : "none"}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                                <Palette
                                  size={16}
                                  className="text-purple-500"
                                />{" "}
                                Paleta Detectada
                              </h4>
                              <div className="flex gap-3">
                                {resultData.palette.map((color, idx) => (
                                  <div
                                    key={idx}
                                    className="flex flex-col items-center gap-1 group cursor-pointer"
                                  >
                                    <div
                                      className="w-12 h-12 rounded-full border-2 border-slate-100 shadow-sm transition-transform hover:scale-110"
                                      style={{ backgroundColor: color.hex }}
                                    />
                                    <span className="text-[10px] font-medium text-slate-500 group-hover:text-purple-600">
                                      {color.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                                <h4 className="font-bold text-green-800 mb-3 text-sm flex items-center gap-2">
                                  <CheckCircle size={16} /> Pontos Fortes
                                </h4>
                                <ul className="space-y-2">
                                  {resultData.strengths.map((item, i) => (
                                    <li
                                      key={i}
                                      className="text-sm text-green-700 leading-snug flex items-start gap-2"
                                    >
                                      <span className="mt-1.5 w-1 h-1 bg-green-400 rounded-full shrink-0" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                                <h4 className="font-bold text-orange-800 mb-3 text-sm flex items-center gap-2">
                                  <AlertCircle size={16} /> Sugestões de
                                  Melhoria
                                </h4>
                                <ul className="space-y-2">
                                  {resultData.improvements.map((item, i) => (
                                    <li
                                      key={i}
                                      className="text-sm text-orange-700 leading-snug flex items-start gap-2"
                                    >
                                      <span className="mt-1.5 w-1 h-1 bg-orange-400 rounded-full shrink-0" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="pt-2 flex gap-3">
                              <button className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                                Salvar no Lookbook
                              </button>
                              <button className="px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition font-bold text-sm flex items-center gap-2">
                                <Share2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === "history" && (
            <div className="h-full flex flex-col items-center justify-center animate-fade-in text-slate-500 py-20">
              <div className="bg-slate-100 p-6 rounded-full mb-4">
                <Clock size={48} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Seu Histórico
              </h3>
              <p className="max-w-md text-center mb-8">
                Aqui você encontrará todas as suas análises anteriores. Faça sua
                primeira análise na aba "AI Stylist" para começar.
              </p>
              <button
                onClick={() => setActiveTab("stylist")}
                className="text-purple-600 font-bold hover:underline"
              >
                Voltar para Análise
              </button>
            </div>
          )}
          {activeTab === "trends" && (
            <div className="h-full flex flex-col items-center justify-center animate-fade-in text-slate-500 py-20">
              <div className="bg-slate-100 p-6 rounded-full mb-4">
                <TrendingUp size={48} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Tendências Globais
              </h3>
              <p className="max-w-md text-center mb-8">
                Nossa IA está escaneando as redes sociais e desfiles. As
                tendências da estação aparecerão aqui em breve.
              </p>
              <button
                onClick={() => setActiveTab("stylist")}
                className="text-purple-600 font-bold hover:underline"
              >
                Voltar para Análise
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes scan{0%{top:0%}50%{top:100%}100%{top:0%}}.animate-scan{animation:scan 2s linear infinite}@keyframes slide-up{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}.animate-slide-up{animation:slide-up .6s cubic-bezier(.16,1,.3,1) forwards}.custom-scrollbar::-webkit-scrollbar{width:4px}.custom-scrollbar::-webkit-scrollbar-track{background:#f1f1f1}.custom-scrollbar::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}.animate-fade-in{animation:fadeIn .5s ease-out}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default StylistAI;
