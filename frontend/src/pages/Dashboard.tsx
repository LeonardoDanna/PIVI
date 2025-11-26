// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { Sun, CloudRain, Cloudy, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("loggedUser") || "{}");
  const firstName = user?.name?.split(" ")[0] || "Usuário";

  const [weather, setWeather] = useState({
    temp: 0,
    condition: "",
    icon: <Sun size={16} className="text-yellow-500" />,
  });

  // 📅 Dia da semana dinâmico
  const weekdays = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];
  const today = weekdays[new Date().getDay()];

  // 🌤️ Clima em Campinas usando Open-Meteo
useEffect(() => {
  const fetchWeather = async () => {
    try {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=-22.9056&longitude=-47.0608&current_weather=true"
      );
      const data = await res.json();
      const w = data.current_weather;

      // 💡 Map de weather codes → condição + ícone
      const weatherMap: Record<number, { condition: string; icon: JSX.Element }> = {
        0: { condition: "Ensolarado", icon: <Sun size={16} className="text-yellow-500" /> },
        1: { condition: "Majoritariamente limpo", icon: <Sun size={16} className="text-yellow-500" /> },
        2: { condition: "Parcialmente nublado", icon: <Cloudy size={16} className="text-slate-500" /> },
        3: { condition: "Nublado", icon: <Cloudy size={16} className="text-slate-500" /> },
        45: { condition: "Neblina", icon: <Cloudy size={16} className="text-slate-500" /> },
        48: { condition: "Neblina", icon: <Cloudy size={16} className="text-slate-500" /> },
        51: { condition: "Garoa", icon: <CloudRain size={16} /> },
        53: { condition: "Garoa", icon: <CloudRain size={16} /> },
        55: { condition: "Garoa forte", icon: <CloudRain size={16} /> },
        61: { condition: "Chuva leve", icon: <CloudRain size={16} /> },
        63: { condition: "Chuva", icon: <CloudRain size={16} /> },
        65: { condition: "Chuva forte", icon: <CloudRain size={16} /> },
        80: { condition: "Pancadas isoladas", icon: <CloudRain size={16} /> },
        81: { condition: "Pancadas", icon: <CloudRain size={16} /> },
        82: { condition: "Pancadas fortes", icon: <CloudRain size={16} /> },
      };

      const code: number = Number(w.weathercode);

      const selected =
        weatherMap[code] ??
        { condition: "Desconhecido", icon: <Cloudy size={16} /> };

      setWeather({
        temp: w.temperature,
        condition: selected.condition,
        icon: selected.icon,
      });
    } catch (err) {
      console.error("Erro ao buscar clima", err);
    }
  };

  fetchWeather();
}, []);


  // 💡 Dica automática baseada no clima real
  const generateTip = () => {
    if (weather.condition === "Chuva") {
      return "Leve uma jaqueta impermeável e evite tecidos sensíveis à água.";
    }
    if (weather.temp >= 30) {
      return "Muito calor! Prefira roupas leves como linho e algodão.";
    }
    if (weather.temp >= 24) {
      return "Dia quente, roupas frescas e tons claros são ideais.";
    }
    if (weather.temp >= 18) {
      return "Clima ameno, combinações confortáveis funcionam bem.";
    }
    if (weather.temp >= 12) {
      return "Dia frio, uma jaqueta leve resolve!";
    }
    return "Frio intenso! Use camadas, malha ou casaco pesado.";
  };

  return (
    <div className="animate-fade-in space-y-8">

      {/* 🔹 Cabeçalho */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Bom dia, {firstName}!
          </h2>
          <p className="text-slate-500 mt-1">
            Aqui estão as recomendações para sua {today}.
          </p>
        </div>

        {/* 🔹 Clima */}
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800">
            {weather.temp}°C
          </div>
          <div className="text-sm text-slate-500 flex items-center gap-2 justify-end">
            {weather.icon} Campinas, SP — {weather.condition}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">

        {/* 🔹 Dica do dia */}
        <div className="col-span-4 bg-blue-50 rounded-3xl p-8 flex flex-col justify-between h-[450px]">
          <div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Dica do Dia
            </span>

            {/* 🌤️ Cabeçalho único — corrigido */}
            <h3 className="text-2xl font-bold text-slate-800 mt-4 leading-tight">
              {weather.condition} hoje em Campinas
            </h3>

            {/* 💡 Dica sem duplicação */}
            <p className="text-slate-600 mt-4">
              {generateTip()}
            </p>
          </div>

          <button
            onClick={() =>
              (window.location.href =
                "https://weather.com/pt-BR/clima/10dias/l/Campinas+São+Paulo+13076?canonicalCityId=7bc24f77d37fe4e95ab902b7f76767be")
            }
            className="bg-blue-600 text-white w-full py-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Ver Detalhes do Clima
          </button>
        </div>

        {/* 🔹 Cards de looks */}
        <div className="col-span-8 grid grid-cols-2 gap-6 h-[450px]">

          {/* CARD 1 */}
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

          {/* CARD 2 */}
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
