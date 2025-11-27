import { useState, useEffect, useRef } from "react";
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

// --- DADOS MOCKADOS DAS NOTIFICAÇÕES ---
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Alerta de Clima",
    message: "Vai esfriar hoje à noite! Leve um casaco leve.",
    time: "10 min atrás",
    type: "weather",
    read: false,
  },
  {
    id: 2,
    title: "Novo Match!",
    message: "Encontramos 3 looks novos com sua calça jeans.",
    time: "2h atrás",
    type: "match",
    read: false,
  },
  {
    id: 3,
    title: "Promoção Relâmpago",
    message: "Tênis brancos com 20% off na loja parceira.",
    time: "1 dia atrás",
    type: "promo",
    read: true,
  },
];

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("Visitante");
  
  // --- ESTADOS PARA NOTIFICAÇÕES ---
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Calcula quantas não lidas existem
  const unreadCount = notifications.filter((n) => !n.read).length;

  // --- 1. CARREGA O NOME CORRETAMENTE ---
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const name =
          typeof parsed === "object"
            ? parsed.username || parsed.name || "Usuário"
            : parsed;
        setUserName(name);
      } catch (e) {
        setUserName(storedUser);
      }
    }
  }, []);

  // --- FECHAR NOTIFICAÇÕES AO CLICAR FORA ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- AÇÕES DAS NOTIFICAÇÕES ---
  const handleMarkAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // --- GERA AS INICIAIS ---
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

  // Helper para ícones da notificação
  const getNotifIcon = (type: string) => {
    switch (type) {
      case "weather": return <CloudRain size={16} className="text-blue-500" />;
      case "match": return <Shirt size={16} className="text-purple-500" />;
      case "promo": return <Tag size={16} className="text-green-500" />;
      default: return <Sparkles size={16} className="text-yellow-500" />;
    }
  };

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
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20 hidden lg:flex">
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

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition text-sm font-medium"
          >
            <LogOut size={18} /> Sair da conta
          </button>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="flex-1 lg:ml-72 p-8 lg:p-12">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Painel</h2>
            <p className="text-slate-500 text-sm">Bem-vindo ao seu estilo</p>
          </div>
          
          <div className="flex items-center gap-4">
            
            {/* --- ÁREA DE NOTIFICAÇÕES (DROPDOWN) --- */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-2 transition relative rounded-full hover:bg-slate-100 ${isNotifOpen ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white animate-pulse"></span>
                )}
              </button>

              {/* O Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animation-fade-in-down origin-top-right">
                  <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-sm text-slate-700">Notificações</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        <CheckCheck size={14} /> Ler todas
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-sm">
                        Nenhuma notificação por enquanto.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition flex gap-3 relative group ${notif.read ? 'opacity-60' : 'bg-blue-50/30'}`}
                        >
                          <div className="mt-1 bg-white p-2 rounded-full shadow-sm border border-slate-100 h-fit">
                            {getNotifIcon(notif.type)}
                          </div>
                          <div className="flex-1 pr-6">
                            <h4 className="text-sm font-bold text-slate-800 mb-0.5">{notif.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                            <span className="text-[10px] font-bold text-slate-400 mt-2 block uppercase tracking-wide">{notif.time}</span>
                          </div>
                          
                          {/* Botão de Excluir (aparece no hover) */}
                          <button 
                            onClick={(e) => handleDeleteNotification(notif.id, e)}
                            className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                            title="Remover"
                          >
                            <X size={14} />
                          </button>
                          
                          {/* Bolinha azul se não lido */}
                          {!notif.read && (
                            <span className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 bg-slate-50 text-center border-t border-slate-100">
                    <button className="text-xs font-bold text-slate-500 hover:text-slate-800 transition">Ver histórico completo</button>
                  </div>
                </div>
              )}
            </div>
            {/* --- FIM DA ÁREA DE NOTIFICAÇÕES --- */}

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-700">{userName}</p>
                <p className="text-xs text-slate-400">Premium Member</p>
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs">
                {getInitials(userName)}
              </div>
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;