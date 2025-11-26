import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, Check, Heart, Loader2, Save, Upload, Trash2, X, Info, 
  Palette, Ruler, Pipette, History, Clock, Shuffle, RefreshCw, 
  Filter, CloudSun, Thermometer, CloudRain, Snowflake, Sun, Sparkles 
} from "lucide-react";

// --- Mock Data ---
const initialClosetData = {
  head: [
    { id: "h1", name: "Boné Azul Marinho", size: "U", color: "#1a196eff", image: "https://www.hm.com.br/_next/image?url=https%3A%2F%2Fhmbrasil.vtexassets.com%2Farquivos%2Fids%2F2041869%2F1249899003-1.jpg%3Fv%3D638926411963070000&w=1440&q=80" },
    { id: "h2", name: "Boné Amarelo-Claro", size: "U", color: "#d1d17bff", image: "https://www.hm.com.br/_next/image?url=https%3A%2F%2Fhmbrasil.vtexassets.com%2Farquivos%2Fids%2F3586567%2F1236944005-1.jpg%3Fv%3D638941084984270000&w=1440&q=80" },
    { id: "h3", name: "Boné Branco", size: "U", color: "#eeeeeeff", image: "https://www.hm.com.br/_next/image?url=https%3A%2F%2Fhmbrasil.vtexassets.com%2Farquivos%2Fids%2F6117048%2F1285208001-1.jpg%3Fv%3D638984062160100000&w=1440&q=80" },
    { id: "h4", name: "Boné Verde", size: "U", color: "#129423ff", image: "https://www.hm.com.br/_next/image?url=https%3A%2F%2Fhmbrasil.vtexassets.com%2Farquivos%2Fids%2F3322191%2F1272463001-1.jpg%3Fv%3D638937662938200000&w=1440&q=80" },
  ],
  top: [
    { id: "t1", name: "Camiseta Preta", size: "M", color: "#000000ff", image: "https://acdn-us.mitiendanube.com/stores/001/115/376/products/02-50-0015-preto-costas-7fca515945ca665e0617301422228749-1024-1024.jpg" },
    { id: "t2", name: "Camiseta Branca", size: "G", color: "#ffffffff", image: "https://acdn-us.mitiendanube.com/stores/001/115/376/products/plano-c-shield1-df4b9862af9308f16c17255639552326-1024-1024.png" },
    { id: "t3", name: "Moletom Preto", size: "GG", color: "#000000", image: "https://consuladodorock.com.br/cdn/shop/files/LISAS-Moletom-Fechado-preto.webp?v=1740445169" },
    { id: "t4", name: "Camiseta Verde", size: "M", color: "#135f00ff", image: "https://images.tcdn.com.br/img/img_prod/1268754/camiseta_stone_plano_c_verde_musgo_173_1_aa9af70253357faf9a13942251aa422d.jpeg" },
  ],
  bottom: [
    { id: "b1", name: "Calça Marrom", size: "40", color: "#c47744ff", image: "https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/hipskateshop/media/uploads/produtos/foto/bnsawint/file.jpg" },
    { id: "b2", name: "Calça Jeans", size: "42", color: "#647b7eff", image: "https://acdn-us.mitiendanube.com/stores/001/115/376/products/plano-c1-7f3d00105b82f57e5c17268667880302-480-0.webp" },
    { id: "b3", name: "Shorts Azul", size: "38", color: "#4ff9ffff", image: "https://static.rockcity.com.br/public/rockcity/imagens/produtos/bermuda-plano-c-shorts-cargo-ripstop-logo-azul-66e48e9f48e4a.jpg" },
    { id: "b4", name: "Bermuda Preta", size: "40", color: "#000000", image: "https://cdn.awsli.com.br/300x300/2550/2550456/produto/308435479/02-50-0024-1-2ros36apwr.jpg" },
  ],
  feet: [
    { id: "f1", name: "Tênis Branco", size: "40", color: "#FFFFFF", image: "https://artwalk.vtexassets.com/arquivos/ids/260733/Tenis-Nike-Air-Force-1-PLTAFORM-Feminino-Branco-1.jpg?v=637922217232400000" },
    { id: "f2", name: "Tênis Preto", size: "41", color: "#000000ff", image: "https://authenticfeet.vtexassets.com/arquivos/ids/240037-800-800?v=637469217012700000&width=800&height=800&aspect=true" },
    { id: "f3", name: "Tenis Preto", size: "40", color: "#000000ff", image: "https://imgnike-a.akamaihd.net/360x360/017075IDA10.jpg" },
    { id: "f4", name: "Tênis Preto", size: "39", color: "#000000", image: "https://images.tcdn.com.br/img/img_prod/770541/tenis_nike_air_max_nuaxis_masculino_66296_1_5103fe3332db0f49eb202595449c2965.jpg" },
  ],
};

const categoryLabels = {
  head: "Cabeça / Acessórios",
  top: "Tronco",
  bottom: "Pernas",
  feet: "Pés"
};

// --- Funções Auxiliares de Cor e Clima ---

// Converte HEX para luminosidade (0 a 255) para saber se é claro ou escuro
const getLuminance = (hex) => {
  const c = hex.substring(1);      // remove #
  const rgb = parseInt(c, 16);   // converte decimal
  const r = (rgb >> 24) & 0xff;  // extrai red (assumindo formato RRGGBBAA do input color)
  const g = (rgb >> 16) & 0xff;  // extrai green
  const b = (rgb >> 8) & 0xff;   // extrai blue
  
  // Fórmula de luminosidade percebida
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Verifica se é neutro (preto, branco, cinza)
const isNeutral = (hex) => {
    const lum = getLuminance(hex);
    // Logica simplificada: muito claro ou muito escuro tende a ser neutro em guarda-roupas básicos
    return lum < 40 || lum > 200; 
};

const Closet = () => {
  const [closetItems, setClosetItems] = useState(initialClosetData);
  
  // --- Estado do Clima (Simulado) ---
  const [weather, setWeather] = useState({
    temp: 28,
    condition: 'sunny', // sunny, rainy, cold
    label: 'Ensolarado'
  });

  const [closetSelection, setClosetSelection] = useState(() => {
    const saved = localStorage.getItem("userClosetSelection");
    return saved
      ? JSON.parse(saved)
      : { head: "h1", top: "t1", bottom: "b1", feet: "f1" };
  });

  const [savedOutfits, setSavedOutfits] = useState(() => {
    const saved = localStorage.getItem("userSavedOutfits");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [historyFilter, setHistoryFilter] = useState('all');
  const [isOutfitSaved, setIsOutfitSaved] = useState(false);
  const [isSavingOutfit, setIsSavingOutfit] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Estados de Upload
  const fileInputRef = useRef(null);
  const [uploadCategory, setUploadCategory] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [newItemMetadata, setNewItemMetadata] = useState({
    name: "", size: "", color: "#000000"
  });

  useEffect(() => {
    localStorage.setItem("userClosetSelection", JSON.stringify(closetSelection));
  }, [closetSelection]);

  useEffect(() => {
    localStorage.setItem("userSavedOutfits", JSON.stringify(savedOutfits));
  }, [savedOutfits]);

  const getSafeImage = (category, id) => {
    if (!id) return null;
    const item = closetItems[category].find((i) => i.id === id);
    return item ? item.image : null;
  };

  // --- Lógica de Sugestão Inteligente ---
  const handleSmartSuggestion = () => {
    let suggestedHead = null;
    let suggestedTop = null;
    let suggestedBottom = null;
    let suggestedFeet = null;

    // 1. Filtragem por Clima (Tipo de Roupa)
    const isHot = weather.temp >= 25;
    const isCold = weather.temp <= 18;
    const isRainy = weather.condition === 'rainy';

    // Selecionar Parte de Baixo (Prioridade: Conforto Térmico)
    const bottoms = closetItems.bottom;
    const suitableBottoms = bottoms.filter(item => {
        const lowerName = item.name.toLowerCase();
        if (isHot) return lowerName.includes('shorts') || lowerName.includes('bermuda');
        if (isCold || isRainy) return lowerName.includes('calça') || lowerName.includes('jeans');
        return true; 
    });
    // Se não achar filtro, usa todos
    const poolBottom = suitableBottoms.length > 0 ? suitableBottoms : bottoms;
    suggestedBottom = poolBottom[Math.floor(Math.random() * poolBottom.length)];

    // Selecionar Parte de Cima (Baseado na Cor da parte de baixo)
    const tops = closetItems.top;
    const suitableTops = tops.filter(item => {
        const lowerName = item.name.toLowerCase();
        if (isHot) return !lowerName.includes('moletom') && !lowerName.includes('casaco');
        if (isCold) return lowerName.includes('moletom') || lowerName.includes('manga longa');
        return true;
    });
    const poolTops = suitableTops.length > 0 ? suitableTops : tops;

    // Tentar combinar cor: Se bottom for escuro, tenta top claro (contraste) ou neutro
    const bottomLum = getLuminance(suggestedBottom.color);
    const isBottomDark = bottomLum < 100;

    // Filtra tops que tenham bom contraste se não forem neutros
    const harmonizedTops = poolTops.filter(top => {
        const topLum = getLuminance(top.color);
        const isTopDark = topLum < 100;
        // Se a calça é colorida (não neutra), prefira top neutro
        if (!isNeutral(suggestedBottom.color)) return isNeutral(top.color);
        // Contraste simples: Escuro com Claro
        return isBottomDark !== isTopDark || isNeutral(top.color);
    });

    suggestedTop = harmonizedTops.length > 0 
        ? harmonizedTops[Math.floor(Math.random() * harmonizedTops.length)] 
        : poolTops[Math.floor(Math.random() * poolTops.length)];

    // Selecionar Cabeça
    if ((isHot && weather.condition === 'sunny') || isRainy) {
        const heads = closetItems.head;
        suggestedHead = heads[Math.floor(Math.random() * heads.length)];
    }

    // Selecionar Pés
    const feet = closetItems.feet;
    // Se chover, preferir cores escuras (sujeira)
    const suitableFeet = isRainy 
        ? feet.filter(f => getLuminance(f.color) < 150) 
        : feet;
    const poolFeet = suitableFeet.length > 0 ? suitableFeet : feet;
    suggestedFeet = poolFeet[Math.floor(Math.random() * poolFeet.length)];

    setClosetSelection({
        head: suggestedHead ? suggestedHead.id : null,
        top: suggestedTop.id,
        bottom: suggestedBottom.id,
        feet: suggestedFeet.id
    });
  };

  const handleSaveOutfit = (asFavorite = false) => {
    if (isOutfitSaved || isLiking) return;
    if (asFavorite) setIsLiking(true);
    else setIsSavingOutfit(true);
    
    const newOutfit = {
        id: Date.now(),
        createdAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
        isFavorite: asFavorite,
        weatherAtTime: weather, // Salvando o clima do momento
        images: {
            head: getSafeImage('head', closetSelection.head),
            top: getSafeImage('top', closetSelection.top),
            bottom: getSafeImage('bottom', closetSelection.bottom),
            feet: getSafeImage('feet', closetSelection.feet),
        }
    };

    setTimeout(() => {
      setSavedOutfits(prev => [newOutfit, ...prev]);
      if (asFavorite) {
          setIsLiking(false);
      } else {
          setIsSavingOutfit(false);
          setIsOutfitSaved(true);
          setTimeout(() => setIsOutfitSaved(false), 2000);
      }
    }, 800);
  };

  const handleShuffle = () => {
    const randomSelection = {
        head: Math.random() > 0.3 ? closetItems.head[Math.floor(Math.random() * closetItems.head.length)].id : null,
        top: closetItems.top[Math.floor(Math.random() * closetItems.top.length)].id,
        bottom: closetItems.bottom[Math.floor(Math.random() * closetItems.bottom.length)].id,
        feet: Math.random() > 0.1 ? closetItems.feet[Math.floor(Math.random() * closetItems.feet.length)].id : null,
    };
    setClosetSelection(randomSelection);
  };

  const handleClearAll = () => setClosetSelection({ head: null, top: null, bottom: null, feet: null });
  const handleDeleteHistoryItem = (id) => setSavedOutfits(prev => prev.filter(outfit => outfit.id !== id));
  
  const handleToggleFavoriteHistory = (id) => {
      setSavedOutfits(prev => prev.map(outfit => 
          outfit.id === id ? { ...outfit, isFavorite: !outfit.isFavorite } : outfit
      ));
  };

  // Funções de Upload e Modais (mesmas do original, resumidas para foco)
  const handleAddClick = (category) => { setUploadCategory(category); fileInputRef.current?.click(); };
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && uploadCategory) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPendingImage(e.target.result);
        setNewItemMetadata({ name: file.name.split('.')[0].substring(0, 20), size: "M", color: "#000000" });
        setShowUploadModal(true);
      };
      reader.readAsDataURL(file);
    }
    if (event.target) event.target.value = '';
  };
  const handleConfirmUpload = () => {
    if (!pendingImage || !uploadCategory) return;
    const newId = `${uploadCategory}_custom_${Date.now()}`;
    const newItem = { id: newId, name: newItemMetadata.name || "Item Personalizado", image: pendingImage, size: newItemMetadata.size, color: newItemMetadata.color };
    setClosetItems((prev) => ({ ...prev, [uploadCategory]: [newItem, ...prev[uploadCategory]] }));
    setClosetSelection((prev) => ({ ...prev, [uploadCategory]: newId }));
    setShowUploadModal(false); setPendingImage(null);
  };
  const handleCancelUpload = () => { setShowUploadModal(false); setPendingImage(null); };
  const handlePickColor = async () => {
    if (!window.EyeDropper) { alert("Seu navegador não suporta a ferramenta de conta-gotas."); return; }
    try { const eyeDropper = new window.EyeDropper(); const result = await eyeDropper.open(); setNewItemMetadata(prev => ({ ...prev, color: result.sRGBHex })); } catch (e) { }
  };
  const handleDeleteItem = (category, itemId, e) => {
    e.stopPropagation();
    if (closetItems[category].length <= 1) { alert("Mantenha ao menos um item."); return; }
    const newItems = closetItems[category].filter(item => item.id !== itemId);
    setClosetItems(prev => ({ ...prev, [category]: newItems }));
    if (closetSelection[category] === itemId) setClosetSelection(prev => ({ ...prev, [category]: (category === 'head' || category === 'feet') ? null : newItems[0].id }));
  };
  const handleSelectItem = (category, id) => {
    setClosetSelection((prev) => {
        if ((category === 'head' || category === 'feet') && prev[category] === id) return { ...prev, [category]: null };
        return { ...prev, [category]: id };
    });
  };
  const handleClearSelection = (category) => setClosetSelection((prev) => ({ ...prev, [category]: null }));

  const filteredHistory = historyFilter === 'all' ? savedOutfits : savedOutfits.filter(outfit => outfit.isFavorite);

  // Componente de Troca de Clima (Para demo)
  const WeatherToggle = () => (
    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4">
        {[
            { id: 'sunny', icon: Sun, label: 'Sol', temp: 28 },
            { id: 'rainy', icon: CloudRain, label: 'Chuva', temp: 22 },
            { id: 'cold', icon: Snowflake, label: 'Frio', temp: 15 }
        ].map(w => (
            <button
                key={w.id}
                onClick={() => setWeather({ temp: w.temp, condition: w.id, label: w.id === 'sunny' ? 'Ensolarado' : w.id === 'rainy' ? 'Chuvoso' : 'Frio' })}
                className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    weather.condition === w.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                <w.icon size={14} /> {w.label}
            </button>
        ))}
    </div>
  );

  return (
    <div className="animate-fade-in flex flex-col gap-8 w-full max-w-7xl mx-auto p-4 relative">
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Input Oculto e Modais */}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        {showUploadModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
             <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-slate-200">
               <div className="w-full md:w-1/2 bg-slate-50 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
                   <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-white">
                       {pendingImage && <img src={pendingImage} alt="Preview" className="w-full h-full object-contain" />}
                   </div>
               </div>
               <div className="w-full md:w-1/2 p-8 flex flex-col">
                   <h2 className="text-xl font-bold text-slate-800 mb-6">Cadastrar Peça</h2>
                   <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-2">
                       <div><label className="text-xs font-bold text-slate-400 uppercase">Categoria</label><div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-medium">{categoryLabels[uploadCategory]}</div></div>
                       <div><label className="text-xs font-bold text-slate-400 uppercase">Nome</label><input type="text" value={newItemMetadata.name} onChange={(e) => setNewItemMetadata({...newItemMetadata, name: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-purple-500" placeholder="Ex: Camiseta" /></div>
                       <div className="flex gap-4">
                           <div className="w-24"><label className="text-xs font-bold text-slate-400 uppercase">Tamanho</label><select value={newItemMetadata.size} onChange={(e) => setNewItemMetadata({...newItemMetadata, size: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl"><option value="M">M</option><option value="G">G</option><option value="40">40</option></select></div>
                           <div className="flex-1">
                               <label className="text-xs font-bold text-slate-400 uppercase">Cor</label>
                               <div className="flex gap-2">
                                   <input type="color" value={newItemMetadata.color} onChange={(e) => setNewItemMetadata({...newItemMetadata, color: e.target.value})} className="h-12 w-16 p-1 border-2 border-slate-200 rounded-xl cursor-pointer" />
                                   <button onClick={handlePickColor} className="h-12 w-12 flex items-center justify-center bg-slate-100 border-2 border-slate-200 rounded-xl hover:bg-slate-200"><Pipette size={20} /></button>
                               </div>
                           </div>
                       </div>
                   </div>
                   <div className="mt-8 flex gap-3">
                       <button onClick={handleCancelUpload} className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200">Cancelar</button>
                       <button onClick={handleConfirmUpload} className="flex-[2] py-3 px-4 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 flex items-center justify-center gap-2"><Check size={18} /> Confirmar</button>
                   </div>
               </div>
             </div>
           </div>
        )}

        <style>{`.custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }`}</style>

        {/* --- COLUNA ESQUERDA --- */}
        <div className="flex-1 space-y-6 min-w-0">
            {/* Header com Widget de Clima */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Seu Guarda-Roupa</h1>
                    <div className="flex items-center gap-2 mt-2 text-slate-500 bg-white px-3 py-1.5 rounded-full shadow-sm w-fit border border-slate-100">
                        {weather.condition === 'sunny' ? <Sun size={18} className="text-orange-400" /> : weather.condition === 'rainy' ? <CloudRain size={18} className="text-blue-400" /> : <Snowflake size={18} className="text-cyan-400" />}
                        <span className="font-medium text-sm">{weather.label} • {weather.temp}°C</span>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {/* Botão SUGESTÃO INTELIGENTE */}
                    <button 
                        onClick={handleSmartSuggestion}
                        className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 text-xs font-bold"
                        title="Sugestão baseada em Clima e Cor"
                    >
                        <Sparkles size={16} /> Sugerir Look
                    </button>

                    <button onClick={handleShuffle} className="p-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition flex items-center gap-2 text-xs font-bold">
                        <Shuffle size={16} /> Aleatório
                    </button>
                    <button onClick={handleClearAll} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition flex items-center gap-2 text-xs font-bold">
                        <RefreshCw size={16} /> Limpar
                    </button>
                </div>
            </div>

            {/* Listas de Roupas */}
            {['head', 'top', 'bottom', 'feet'].map((category) => (
                <div key={category} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1 flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${category === 'head' ? 'bg-purple-400' : category === 'top' ? 'bg-blue-400' : category === 'bottom' ? 'bg-emerald-400' : 'bg-orange-400'}`}></span>
                            {categoryLabels[category]}
                        </div>
                        {(category === 'head' || category === 'feet') && (
                            <button onClick={() => handleClearSelection(category)} className="text-[10px] text-slate-400 hover:text-red-500 hover:underline flex items-center gap-1">
                            {closetSelection[category] ? <><X size={10} /> Remover seleção</> : <span className="opacity-50 cursor-default">Nenhum selecionado</span>}
                            </button>
                        )}
                    </h3>
                    
                    <div className="flex gap-4">
                        <button onClick={() => handleAddClick(category)} className={`w-32 rounded-2xl bg-slate-50 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:bg-slate-100 transition group ${category === 'head' ? 'h-32' : category === 'top' ? 'h-40' : category === 'bottom' ? 'h-48' : 'h-32'}`}>
                            <Upload className="text-slate-400 mb-1 group-hover:text-inherit" size={24} /><span className="text-xs font-bold text-slate-400 group-hover:text-inherit">Upload</span>
                        </button>

                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x px-1 custom-scrollbar flex-1">
                            {closetItems[category].map((item) => (
                                <div key={item.id} onClick={() => handleSelectItem(category, item.id)} className={`group rounded-2xl flex-shrink-0 cursor-pointer overflow-hidden border-2 transition-all duration-300 relative snap-center w-32 md:w-40 ${category === 'head' ? 'h-32' : category === 'top' ? 'h-40' : category === 'bottom' ? 'h-48' : 'h-32'} ${closetSelection[category] === item.id ? "border-purple-600 ring-4 ring-purple-100 scale-105 shadow-lg" : "border-transparent hover:border-slate-200"}`}>
                                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                    {item.size && <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10 border border-white/20">{item.size}</div>}
                                    <button onClick={(e) => handleDeleteItem(category, item.id, e)} className="absolute top-1 left-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md z-20"><Trash2 size={12} /></button>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-2 pointer-events-none">
                                        <div className="w-full"><span className="text-[10px] text-white font-medium truncate block">{item.name}</span>{item.color && <div className="flex items-center gap-1 mt-0.5"><div className="w-2 h-2 rounded-full border border-white/50" style={{backgroundColor: item.color}}></div><span className="text-[8px] text-slate-200">{item.color}</span></div>}</div>
                                    </div>
                                    {closetSelection[category] === item.id && <div className="absolute top-1 right-1 bg-purple-600 w-5 h-5 rounded-full flex items-center justify-center shadow-sm z-10"><Check size={12} className="text-white" /></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* --- COLUNA DIREITA (PREVIEW) --- */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
            <div className="bg-slate-900 text-white rounded-[2rem] p-6 flex flex-col min-h-[600px] sticky top-8 shadow-2xl ring-1 ring-white/10">
            
            {/* Controle de Clima para Teste */}
            <div className="mb-4">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-wider">Simular Clima</p>
                <WeatherToggle />
            </div>

            <div className="flex justify-between items-center mb-4">
                <div><h3 className="font-bold text-xl tracking-tight">Seu Look</h3><p className="text-slate-400 text-xs mt-1">Preview em tempo real</p></div>
                <button onClick={() => handleSaveOutfit(true)} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all backdrop-blur-sm active:scale-95">
                    {isLiking ? <Loader2 className="animate-spin text-pink-400" size={20} /> : <Heart size={20} className="text-pink-400" fill="currentColor" fillOpacity={0.2} />}
                </button>
            </div>

            <div className="flex-1 flex flex-col gap-0 items-center justify-center bg-gradient-to-b from-white/5 to-transparent rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
                
                {/* Visualização de Camadas (Head, Top, Bottom, Feet) */}
                {closetSelection.head ? <div className="relative z-30 transition-transform duration-500 hover:scale-105 hover:z-40"><div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border-[3px] border-white/20 bg-slate-800"><img src={getSafeImage('head', closetSelection.head)} className="w-full h-full object-cover" alt="head" /></div></div> : <div className="h-10"></div>}
                <div className={`relative z-20 transition-transform duration-500 hover:scale-105 hover:z-40 ${closetSelection.head ? '-mt-3' : 'mt-0'}`}>{closetSelection.top ? <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-2xl border-[3px] border-white/20 bg-slate-800"><img src={getSafeImage('top', closetSelection.top)} className="w-full h-full object-cover" alt="top" /></div> : <div className="w-36 h-36 rounded-2xl border-[2px] border-dashed border-white/10 flex items-center justify-center text-white/20 text-xs">Sem tronco</div>}</div>
                <div className="relative z-10 -mt-5 transition-transform duration-500 hover:scale-105 hover:z-40">{closetSelection.bottom ? <div className="w-36 h-44 rounded-2xl overflow-hidden shadow-2xl border-[3px] border-white/20 bg-slate-800"><img src={getSafeImage('bottom', closetSelection.bottom)} className="w-full h-full object-cover" alt="bottom" /></div> : <div className="w-36 h-44 rounded-2xl border-[2px] border-dashed border-white/10 flex items-center justify-center text-white/20 text-xs bg-slate-800/20">Sem pernas</div>}</div>
                {closetSelection.feet && <div className="relative z-30 -mt-6 transition-transform duration-500 hover:scale-105 hover:z-40 w-full flex justify-center"><div className="w-32 h-24 flex justify-center gap-1"><div className="w-28 h-24 rounded-2xl overflow-hidden shadow-2xl border-[3px] border-white/20 bg-slate-800"><img src={getSafeImage('feet', closetSelection.feet)} className="w-full h-full object-cover" alt="feet" /></div></div></div>}
            </div>

            <button onClick={() => handleSaveOutfit(false)} disabled={isSavingOutfit || isOutfitSaved} className={`mt-6 w-full py-4 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-lg transform active:scale-95 ${isOutfitSaved ? "bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-400/30" : "bg-purple-600 text-white hover:bg-purple-500 shadow-purple-900/50 hover:shadow-purple-700/50"}`}>
                {isSavingOutfit ? <><Loader2 className="animate-spin" size={18} /> Salvando...</> : isOutfitSaved ? <><Check size={18} /> Look Salvo!</> : <><Save size={18} /> SALVAR COMBINAÇÃO</>}
            </button>
            </div>
        </div>
      </div>
      
      {/* --- HISTÓRICO --- */}
      {savedOutfits.length > 0 && (
        <div className="mt-8 pt-8 border-t border-slate-200">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                 <div className="flex items-center gap-3"><History className="text-purple-600" size={28} /><h2 className="text-2xl font-bold text-slate-800">Histórico de Combinações</h2></div>
                 <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                     <button onClick={() => setHistoryFilter('all')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${historyFilter === 'all' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Todos</button>
                     <button onClick={() => setHistoryFilter('favorites')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${historyFilter === 'favorites' ? 'bg-white shadow text-pink-500' : 'text-slate-500 hover:text-pink-400'}`}><Heart size={12} fill={historyFilter === 'favorites' ? "currentColor" : "none"} /> Favoritos</button>
                 </div>
             </div>
             
             {filteredHistory.length === 0 ? (
                 <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200"><p>Nenhum look encontrado com este filtro.</p></div>
             ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredHistory.map((outfit) => (
                        <div key={outfit.id} className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative">
                            <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-xs text-slate-400">
                                <div className="flex items-center gap-1"><Clock size={12} />{outfit.createdAt}</div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleToggleFavoriteHistory(outfit.id)} className={`p-1.5 rounded-full transition ${outfit.isFavorite ? 'text-pink-500 bg-pink-50' : 'text-slate-300 hover:text-pink-400 hover:bg-slate-100'}`}><Heart size={12} fill={outfit.isFavorite ? "currentColor" : "none"} /></button>
                                    <button onClick={() => handleDeleteHistoryItem(outfit.id)} className="p-1.5 hover:bg-red-100 text-slate-400 hover:text-red-500 rounded-full transition"><Trash2 size={12} /></button>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col items-center gap-0">
                                {outfit.images.head && <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 shadow-sm z-30 bg-white"><img src={outfit.images.head} className="w-full h-full object-cover" alt="head" /></div>}
                                {outfit.images.top ? <div className={`w-14 h-14 rounded-lg overflow-hidden border border-slate-100 shadow-sm z-20 bg-white ${outfit.images.head ? '-mt-2' : ''}`}><img src={outfit.images.top} className="w-full h-full object-cover" alt="top" /></div> : <div className="h-4"></div>}
                                {outfit.images.bottom && <div className={`w-14 h-16 rounded-lg overflow-hidden border border-slate-100 shadow-sm z-10 bg-white ${outfit.images.top ? '-mt-2' : '-mt-4'}`}><img src={outfit.images.bottom} className="w-full h-full object-cover" alt="bottom" /></div>}
                                {outfit.images.feet && <div className={`w-12 h-8 rounded-lg overflow-hidden border border-slate-100 shadow-sm z-20 bg-white ${outfit.images.bottom ? '-mt-2' : '-mt-4'}`}><img src={outfit.images.feet} className="w-full h-full object-cover" alt="feet" /></div>}
                            </div>
                            {/* Mostra ícone do clima salvo */}
                            {outfit.weatherAtTime && (
                                <div className="absolute bottom-2 right-2 bg-slate-100/80 backdrop-blur-sm p-1 rounded-md text-slate-500">
                                    {outfit.weatherAtTime.condition === 'sunny' ? <Sun size={12} /> : outfit.weatherAtTime.condition === 'rainy' ? <CloudRain size={12} /> : <Snowflake size={12} />}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
             )}
        </div>
      )}
    </div>
  );
};

const App = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex justify-center items-start pt-8 pb-16">
            <Closet />
        </div>
    )
}

export default App;