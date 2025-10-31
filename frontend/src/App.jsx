import { useState } from "react";
import "./App.css";
import TabTryOn from "./components/TabTryOn";
import TabGuardaRoupa from "./components/TabGuardaRoupa";
import TabCaimentoPro from "./components/TabCaimentoPro";
import TabVestir from "./components/TabVestir";
import TabPerfil from "./components/TabPerfil";
import TabMelhorar from "./components/TabMelhorar";
import TabCombina from "./components/TabCombina";

import {FaTshirt,  FaPalette,  FaRulerCombined,  FaStar,  FaUserTie,  FaUserCircle,} from "react-icons/fa";

// ✅ URL fixa (ambiente local)
const backendUrl = import.meta.env.VITE_BACKEND_URL;

async function executarTryOn({clothingFile, avatarFile, clothingUrl, avatarUrl, clothingPrompt, avatarPrompt}) {
  const formData = new FormData();
  if (clothingFile) formData.append("clothing_image", clothingFile);
  if (avatarFile) formData.append("avatar_image", avatarFile);
  if (!clothingFile && clothingUrl)
    formData.append("clothing_image_url", clothingUrl);
  if (!avatarFile && avatarUrl)
    formData.append("avatar_image_url", avatarUrl);
  if (clothingPrompt) formData.append("clothing_prompt", clothingPrompt);
  if (avatarPrompt) formData.append("avatar_prompt", avatarPrompt);

  const resp = await fetch(backendUrl, {
    method: "POST",
    body: formData,
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.error || "Erro no Try-On");
  }

  const blob = await resp.blob();
  const url = URL.createObjectURL(blob);
  return url;
}

// 🧩 COMPONENTES GERAIS --------------------------
function Field({ label, children, icon: Icon }) {
  return (
    <div className="field">
      <label>
        {Icon && <Icon aria-hidden="true" />} <span>{label}</span>
      </label>
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick }) {
  return (
    <button className="btn-primary" onClick={onClick} type="button">
      {children}
    </button>
  );
}

// ✅ APP PRINCIPAL ---------------------------------
export default function App() {
  const [activeTab, setActiveTab] = useState("vestir");
  const [userProfile, setUserProfile] = useState(
    JSON.parse(localStorage.getItem("userProfile")) || {
      name: "Usuário",
      avatarUrl: null,
    }
  );
  const [showWelcome, setShowWelcome] = useState(true);

  // ✅ TABS DENTRO DO APP (tem acesso ao userProfile)
  const tabs = [
    {
      id: "vestir",
      title: "Como posso me vestir hoje?",
      icon: FaTshirt,
      component: <TabVestir Field={Field} PrimaryButton={PrimaryButton} />,
    },
    {
      id: "combina",
      title: "O que combina comigo?",
      icon: FaPalette,
      component: <TabCombina Field={Field} PrimaryButton={PrimaryButton} />,
    },
    {
      id: "caimento",
      title: "Qual seria o melhor caimento?",
      icon: FaRulerCombined,
      component: <TabCaimentoPro Field={Field} PrimaryButton={PrimaryButton} />,
    },
    {
      id: "melhorar",
      title: "Como posso melhorar?",
      icon: FaStar,
      component: <TabMelhorar Field={Field} PrimaryButton={PrimaryButton} />,
    },
    {
      id: "tryon",
      title: "Try-On Virtual",
      icon: FaUserTie,
      component: <TabTryOn backendUrl={backendUrl} />,
    },
    {
      id: "armario",
      title: "Guarda-Roupa Virtual",
      icon: FaTshirt,
      component: <TabGuardaRoupa Field={Field} PrimaryButton={PrimaryButton} />,
    },
    {
      id: "perfil",
      title: "Meu Perfil",
      icon: FaUserCircle,
      component: (
        <TabPerfil
          userProfile={userProfile}
          setUserProfile={setUserProfile}
        />
      ),
    },
  ];

  const handleClosePopup = () => setShowWelcome(false);

  return (
    <>
      {showWelcome && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>
              👗 Bem-vindo(a) ao <span className="highlight">Today's Fashion</span>!
            </h2>
            <p>
              A IA que vai te ajudar a descobrir o que vestir, combinar cores,
              testar looks e organizar seu guarda-roupa de forma inteligente 💫
            </p>
            <button className="btn-primary" onClick={handleClosePopup}>
              Começar
            </button>
          </div>
        </div>
      )}

      <header>Today's Fashion</header>
      <div className="container">
        <nav className="tabs">
          {tabs.map(({ id, title, icon: Icon }) => (
            <button
              key={id}
              className={activeTab === id ? "active" : ""}
              onClick={() => setActiveTab(id)}
            >
              <Icon className="tab-icon" />
              <span className="tab-text">{title}</span>
            </button>
          ))}
        </nav>

        {/* ✅ Render centralizado via tabs */}
        <div className="tab-content">
          {tabs.find((t) => t.id === activeTab)?.component}
        </div>
      </div>
    </>
  );
}
