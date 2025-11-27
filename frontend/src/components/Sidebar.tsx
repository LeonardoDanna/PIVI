// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { Sun, Package, User, Ruler, Sparkles, LogOut } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { path: "/", label: "Visão Geral", icon: <Sun size={20} /> },
    { path: "/closet", label: "Armário Virtual", icon: <Package size={20} /> },
    { path: "/matches", label: "Combinações", icon: <User size={20} /> },
    { path: "/fit", label: "Guia de Caimento", icon: <Ruler size={20} /> },
    { path: "/tryon", label: "Provador Virtual", icon: <Sparkles size={20} /> },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
      <div className="p-8">
        <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg"></div>
          TodayFashion
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 group ${
                isActive
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-900"
                  }
                >
                  {item.icon}
                </span>
                <span className="block font-bold text-sm">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => {
            localStorage.removeItem("loggedUser");
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition text-sm font-medium"
        >
          <LogOut size={18} /> Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
