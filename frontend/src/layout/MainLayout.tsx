import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Sun,
  Package,
  User,
  Ruler,
  Sparkles,
  LogOut,
  Bell,
  TrendingUp,
} from "lucide-react";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("Visitante");

  // --- 1. CARREGA O NOME CORRETAMENTE ---
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Se o backend retornou um objeto { username: "..." }, pega o username
        // Se retornou apenas a string "Felipe", pega a string direto
        const name =
          typeof parsed === "object"
            ? parsed.username || parsed.name || "Usuário"
            : parsed;
        setUserName(name);
      } catch (e) {
        setUserName(storedUser); // Fallback para texto puro
      }
    }
  }, []);

  // --- 2. GERA AS INICIAIS (Ex: Felipe Proença -> FP) ---
  const getInitials = (name: string) => {
    return name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  // Menu de navegação
  const tabs = [
    { id: "", label: "Visão Geral", icon: <Sun size={20} /> },
    { id: "closet", label: "Armário Virtual", icon: <Package size={20} /> },
    { id: "matches", label: "Combinações", icon: <User size={20} /> },
    { id: "fit", label: "Guia de Caimento", icon: <Ruler size={20} /> },
    { id: "stylist", label: "Stylist AI", icon: <TrendingUp size={20} /> },
    { id: "tryon", label: "Provador Virtual", icon: <Sparkles size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {/* --- SIDEBAR (Menu Lateral) --- */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
        <div className="p-8">
          <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg"></div>
            TodayFashion
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Menu Principal
          </p>
          {tabs.map((tab) => {
            // Lógica para destacar a aba atual
            const isActive =
              location.pathname === (tab.id === "" ? "/" : `/${tab.id}`);

            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span
                  className={`${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-900"
                  }`}
                >
                  {tab.icon}
                </span>
                <div>
                  <span className="block font-bold text-sm">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Botão de Sair */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition text-sm font-medium"
          >
            <LogOut size={18} /> Sair da conta
          </button>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL (Lado Direito) --- */}
      <main className="flex-1 ml-72 p-8 lg:p-12">
        {/* Header Superior */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Painel</h2>
            <p className="text-slate-500 text-sm">Bem-vindo ao seu estilo</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-600 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                {/* Nome do Usuário Dinâmico */}
                <p className="text-sm font-bold text-slate-700">{userName}</p>
                <p className="text-xs text-slate-400">Premium Member</p>
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs">
                {/* Iniciais Dinâmicas */}
                {getInitials(userName)}
              </div>
            </div>
          </div>
        </header>

        {/* Renderiza as páginas (TryOn, Closet, etc) */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
