// src/layout/MainLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Bell } from "lucide-react";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50/50 font-sans text-slate-900">
      <Sidebar />

      {/* Área da Direita (Dinâmica) */}
      <main className="flex-1 ml-72 p-8 lg:p-12">
        {/* Header Comum */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Painel</h2>
            <p className="text-slate-500 text-sm">Bem-vindo ao seu estilo</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-700">
                  Leonardo Danna
                </p>
                <p className="text-xs text-slate-400">Premium Member</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img
                  src="https://placehold.co/100x100/1e293b/FFF?text=LD"
                  alt="Leonardo Danna"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* AQUI É ONDE AS PÁGINAS MUDAM */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
