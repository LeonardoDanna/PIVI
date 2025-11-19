import { useState } from "react";
import "./App.css";
import logo from "./assets/images/todays-fashion-logo.png";
import userIcon from "./assets/images/person-circle.svg";


// 🧩 Importa todas as tabs
import TabTryOn from "./components/TabTryOn";
import TabGuardaRoupa from "./components/TabGuardaRoupa";
import TabCaimento from "./components/TabCaimento";
import TabVestir from "./components/TabVestir";
import TabPerfil from "./components/TabPerfil";
import TabMelhorar from "./components/TabMelhorar";
import TabCombina from "./components/TabCombina";

// 🧩 Importa todos os css
import "./styles/layout.css";
import "./styles/tabs.css";
import "./styles/forms.css";
import "./styles/buttons.css";
import "./styles/panels.css";
import "./styles/popup.css";
import "./styles/armario.css";
import "./styles/tryon.css";
import "./styles/caimento.css";
import "./styles/combina.css";
import "./styles/melhorar.css";
import "./styles/perfil.css";
import "./styles/vestir.css";

// Ícones
import {
  FaTshirt,
  FaPalette,
  FaRulerCombined,
  FaStar,
  FaUserTie,
  FaUserCircle,
} from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/* ============================================================== */

const Field = ({ label, children, icon: Icon }) => (
  <div className="field">
    <label>
      {Icon && <Icon aria-hidden="true" />} <span>{label}</span>
    </label>
    {children}
  </div>
);

const PrimaryButton = ({ children, onClick, type = "button", disabled }) => (
  <button className="btn-primary" onClick={onClick} type={type} disabled={disabled}>
    {children}
  </button>
);

export async function executarTryOn({
  clothingFile,
  avatarFile,
  clothingUrl,
  avatarUrl,
  clothingPrompt,
  avatarPrompt,
}) {
  const formData = new FormData();
  const appendIf = (key, value) => value && formData.append(key, value);

  appendIf("clothing_image", clothingFile);
  appendIf("avatar_image", avatarFile);
  appendIf("clothing_image_url", clothingUrl);
  appendIf("avatar_image_url", avatarUrl);
  appendIf("clothing_prompt", clothingPrompt);
  appendIf("avatar_prompt", avatarPrompt);

  const resp = await fetch(backendUrl, { method: "POST", body: formData });

  if (!resp.ok) {
    const { error } = await resp.json().catch(() => ({}));
    throw new Error(error || "Erro no Try-On");
  }

  return URL.createObjectURL(await resp.blob());
}

/* ============================================================== */

export default function App() {
  const [activeTab, setActiveTab] = useState("vestir");

  const [userProfile, setUserProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userProfile")) || {
        name: "Usuário",
        avatarUrl: null,
      };
    } catch {
      return { name: "Usuário", avatarUrl: null };
    }
  });

  // ⭐ POPUP DE BOAS-VINDAS
  const [showWelcome, setShowWelcome] = useState(true);

  const handleClosePopup = () => {
    setShowWelcome(false);
  };

  const tabs = [
    { id: "vestir", title: "Como posso me vestir hoje?", icon: FaTshirt, component: <TabVestir Field={Field} PrimaryButton={PrimaryButton} /> },
    { id: "combina", title: "O que combina comigo?", icon: FaPalette, component: <TabCombina Field={Field} PrimaryButton={PrimaryButton} /> },
    { id: "caimento", title: "Qual seria o melhor caimento?", icon: FaRulerCombined, component: <TabCaimento Field={Field} PrimaryButton={PrimaryButton} /> },
    { id: "melhorar", title: "Como posso melhorar?", icon: FaStar, component: <TabMelhorar Field={Field} PrimaryButton={PrimaryButton} /> },
    { id: "tryon", title: "Try-On Virtual", icon: FaUserTie, component: <TabTryOn backendUrl={backendUrl} Field={Field} PrimaryButton={PrimaryButton} /> },
    { id: "armario", title: "Guarda-Roupa Virtual", icon: FaTshirt, component: <TabGuardaRoupa Field={Field} PrimaryButton={PrimaryButton} /> },
    { id: "perfil", title: "Meu Perfil", icon: FaUserCircle, component: <TabPerfil userProfile={userProfile} setUserProfile={setUserProfile} /> },
  ];

  const activeComponent = tabs.find((t) => t.id === activeTab)?.component;

  return (
    <>

      {/* ⭐ POPUP AQUI — EXATAMENTE COMO VOCÊ QUERIA */}
      {showWelcome && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>
              👗 Bem-vindo(a) ao <span className="highlight">Today's Fashion</span>!
            </h2>
            <p>
              A IA que te ajuda a descobrir o que vestir, combinar cores,
              testar looks e organizar seu guarda-roupa de forma inteligente 💫
            </p>
            <PrimaryButton onClick={handleClosePopup}>Começar</PrimaryButton>
          </div>
        </div>
      )}

      {/* ================= HEADER NOVO ================= */}
      <header className="header-bar">
        <img
          src={logo} className="logo"
          alt="Today's Fashion Logo"
        />

        <img
          src={userIcon} className="profile-avatar"
          alt="Perfil"
          onClick={() => setActiveTab("perfil")}
        />
      </header>

      {/* ================= CONTEÚDO DA PÁGINA ================= */}
      <main className="container main-content">
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

        <section className="tab-content">{activeComponent}</section>
      </main>
    </>
  );
}
