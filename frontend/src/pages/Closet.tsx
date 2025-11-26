// src/pages/Closet.tsx
import { useState, useEffect } from "react";
import { Plus, Check, Heart, Loader2, Save } from "lucide-react";
import { initialClosetData } from "../data/constants";

const Closet = () => {
  // Estado com persistência (LocalStorage)
  const [closetSelection, setClosetSelection] = useState(() => {
    const saved = localStorage.getItem("userClosetSelection");
    return saved
      ? JSON.parse(saved)
      : { head: "h1", top: "t1", bottom: "b1", feet: "f1" };
  });

  const [isOutfitSaved, setIsOutfitSaved] = useState(false);
  const [isSavingOutfit, setIsSavingOutfit] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "userClosetSelection",
      JSON.stringify(closetSelection)
    );
  }, [closetSelection]);

  const handleSaveOutfit = () => {
    if (isOutfitSaved) return;
    setIsSavingOutfit(true);
    setTimeout(() => {
      setIsSavingOutfit(false);
      setIsOutfitSaved(true);
      setTimeout(() => setIsOutfitSaved(false), 2000);
    }, 1000);
  };

  return (
    <div className="animate-fade-in flex gap-8">
      <div className="flex-1 space-y-6">
        {/* Linha 1: Cabeça */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Cabeça / Acessórios
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x px-2 custom-scrollbar">
            <button className="w-24 h-24 rounded-2xl bg-slate-100 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:bg-slate-200 transition">
              <Plus className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 mt-1">
                Add
              </span>
            </button>
            {initialClosetData.head.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  setClosetSelection((prev: any) => ({
                    ...prev,
                    head: item.id,
                  }))
                }
                className={`w-24 h-24 rounded-2xl flex-shrink-0 cursor-pointer overflow-hidden border-2 transition-all relative snap-center ${
                  closetSelection.head === item.id
                    ? "border-purple-600 ring-2 ring-purple-100 scale-105"
                    : "border-transparent"
                }`}
              >
                <img
                  src={item.image}
                  className="w-full h-full object-cover"
                  alt={item.name}
                />
                {closetSelection.head === item.id && (
                  <div className="absolute top-1 right-1 bg-purple-600 w-4 h-4 rounded-full flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Linha 2: Tronco */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Tronco
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x px-2 custom-scrollbar">
            <button className="w-32 h-32 rounded-2xl bg-slate-100 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:bg-slate-200 transition">
              <Plus className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 mt-1">
                Add
              </span>
            </button>
            {initialClosetData.top.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  setClosetSelection((prev: any) => ({ ...prev, top: item.id }))
                }
                className={`w-32 h-32 rounded-2xl flex-shrink-0 cursor-pointer overflow-hidden border-2 transition-all relative snap-center ${
                  closetSelection.top === item.id
                    ? "border-purple-600 ring-2 ring-purple-100 scale-105"
                    : "border-transparent"
                }`}
              >
                <img
                  src={item.image}
                  className="w-full h-full object-cover"
                  alt={item.name}
                />
                {closetSelection.top === item.id && (
                  <div className="absolute top-1 right-1 bg-purple-600 w-4 h-4 rounded-full flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Linha 3: Pernas */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Pernas
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x px-2 custom-scrollbar">
            <button className="w-32 h-40 rounded-2xl bg-slate-100 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:bg-slate-200 transition">
              <Plus className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 mt-1">
                Add
              </span>
            </button>
            {initialClosetData.bottom.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  setClosetSelection((prev: any) => ({
                    ...prev,
                    bottom: item.id,
                  }))
                }
                className={`w-32 h-40 rounded-2xl flex-shrink-0 cursor-pointer overflow-hidden border-2 transition-all relative snap-center ${
                  closetSelection.bottom === item.id
                    ? "border-purple-600 ring-2 ring-purple-100 scale-105"
                    : "border-transparent"
                }`}
              >
                <img
                  src={item.image}
                  className="w-full h-full object-cover"
                  alt={item.name}
                />
                {closetSelection.bottom === item.id && (
                  <div className="absolute top-1 right-1 bg-purple-600 w-4 h-4 rounded-full flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Linha 4: Pés */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Pés
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x px-2 custom-scrollbar">
            <button className="w-24 h-24 rounded-2xl bg-slate-100 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:bg-slate-200 transition">
              <Plus className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 mt-1">
                Add
              </span>
            </button>
            {initialClosetData.feet.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  setClosetSelection((prev: any) => ({
                    ...prev,
                    feet: item.id,
                  }))
                }
                className={`w-24 h-24 rounded-2xl flex-shrink-0 cursor-pointer overflow-hidden border-2 transition-all relative snap-center ${
                  closetSelection.feet === item.id
                    ? "border-purple-600 ring-2 ring-purple-100 scale-105"
                    : "border-transparent"
                }`}
              >
                <img
                  src={item.image}
                  className="w-full h-full object-cover"
                  alt={item.name}
                />
                {closetSelection.feet === item.id && (
                  <div className="absolute top-1 right-1 bg-purple-600 w-4 h-4 rounded-full flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Painel Direito: Preview do Look Completo */}
      <div className="w-80 flex flex-col gap-4">
        <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col h-[600px] sticky top-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Seu Look</h3>
            <button className="p-2 bg-white/10 rounded-full hover:bg-white/20">
              <Heart size={18} />
            </button>
          </div>

          {/* Visualização Empilhada */}
          <div className="flex-1 flex flex-col gap-2 items-center justify-center bg-white/5 rounded-2xl p-4 border border-white/10">
            {/* Head */}
            <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg border-2 border-white/20">
              <img
                src={
                  initialClosetData.head.find(
                    (i) => i.id === closetSelection.head
                  )?.image
                }
                className="w-full h-full object-cover"
                alt="head"
              />
            </div>
            {/* Top */}
            <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg border-2 border-white/20 z-10 -mt-2">
              <img
                src={
                  initialClosetData.top.find(
                    (i) => i.id === closetSelection.top
                  )?.image
                }
                className="w-full h-full object-cover"
                alt="top"
              />
            </div>
            {/* Bottom */}
            <div className="w-32 h-40 rounded-xl overflow-hidden shadow-lg border-2 border-white/20 z-20 -mt-4">
              <img
                src={
                  initialClosetData.bottom.find(
                    (i) => i.id === closetSelection.bottom
                  )?.image
                }
                className="w-full h-full object-cover"
                alt="bottom"
              />
            </div>
            {/* Feet */}
            <div className="w-32 h-20 flex justify-center gap-1 z-30 -mt-6">
              <div className="w-24 h-20 rounded-xl overflow-hidden shadow-lg border-2 border-white/20">
                <img
                  src={
                    initialClosetData.feet.find(
                      (i) => i.id === closetSelection.feet
                    )?.image
                  }
                  className="w-full h-full object-cover"
                  alt="feet"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveOutfit}
            disabled={isSavingOutfit || isOutfitSaved}
            className={`mt-6 w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
              isOutfitSaved
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-purple-600 text-white hover:bg-purple-500 shadow-purple-900/50"
            }`}
          >
            {isSavingOutfit ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Salvando...
              </>
            ) : isOutfitSaved ? (
              <>
                <Check size={18} /> Look Salvo!
              </>
            ) : (
              <>
                <Save size={18} /> Salvar Combinação
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Closet;
