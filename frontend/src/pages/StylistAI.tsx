// src/pages/StylistAI.tsx
import { Star, User, Camera } from "lucide-react";

const StylistAI = () => {
  return (
    <div className="animate-fade-in grid grid-cols-2 gap-12 items-center h-full">
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">
            Stylist <span className="text-purple-600">AI</span>
          </h2>
          <p className="text-lg text-slate-600">
            Faça o upload do seu look atual. Nossa inteligência artificial
            analisará proporções, cores e estilo para sugerir melhorias
            instantâneas.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="bg-green-100 p-2 rounded-lg text-green-700">
              <Star size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Análise de Proporção</h4>
              <p className="text-sm text-slate-500">
                Regra dos terços e silhueta.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-700">
              <User size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Harmonia de Cores</h4>
              <p className="text-sm text-slate-500">
                Círculo cromático e contraste.
              </p>
            </div>
          </div>
        </div>
        <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition flex items-center gap-2">
          <Camera size={20} /> Analisar Foto Agora
        </button>
      </div>
      <div className="bg-slate-100 rounded-[2rem] h-[500px] flex items-center justify-center border-2 border-dashed border-slate-300 text-slate-400">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
            <Camera size={32} />
          </div>
          <p>Arraste sua foto ou clique para enviar</p>
        </div>
      </div>
    </div>
  );
};

export default StylistAI;
