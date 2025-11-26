// src/pages/Dashboard.tsx
import { Sun, ArrowRight } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Bom dia, Leonardo!
          </h2>
          <p className="text-slate-500 mt-1">
            Aqui estão as recomendações para sua sexta-feira.
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800">28°C</div>
          <div className="text-sm text-slate-500 flex items-center gap-2 justify-end">
            <Sun size={16} className="text-yellow-500" /> Campinas, SP
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4 bg-blue-50 rounded-3xl p-8 flex flex-col justify-between h-[450px]">
          <div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Dica do Dia
            </span>
            <h3 className="text-2xl font-bold text-slate-800 mt-4 leading-tight">
              Dia quente e ensolarado em Campinas.
            </h3>
            <p className="text-slate-600 mt-4">
              Aposte em tecidos naturais como linho ou algodão. Evite sintéticos
              para maior conforto térmico.
            </p>
          </div>
          <button className="bg-blue-600 text-white w-full py-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Ver Detalhes do Clima
          </button>
        </div>
        <div className="col-span-8 grid grid-cols-2 gap-6 h-[450px]">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col">
            <div className="flex-1 rounded-2xl mb-4 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=800&auto=format&fit=crop"
                alt="Look Casual Chic"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-xs font-bold">
                  100% Linho
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <div>
                <span className="font-bold text-slate-800 block text-lg">
                  Casual Chic
                </span>
                <span className="text-xs text-slate-500">
                  Tons Terrosos & Frescor
                </span>
              </div>
              <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col">
            <div className="flex-1 rounded-2xl mb-4 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=800&auto=format&fit=crop"
                alt="Look Trabalho Leve"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-xs font-bold">
                  Alfaiataria
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <div>
                <span className="font-bold text-slate-800 block text-lg">
                  Trabalho Leve
                </span>
                <span className="text-xs text-slate-500">
                  Blazer & Conforto
                </span>
              </div>
              <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
