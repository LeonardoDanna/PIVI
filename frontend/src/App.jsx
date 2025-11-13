import { useState } from "react";
import logoImg from "./assets/imagens/todays fashion logo.png";
import "./index.css";

export default function TodaysFashionLayout() {
  const [navOpen, setNavOpen] = useState(false);;
  const [fabOpen, setFabOpen] = useState(true);

  const navItems = [
    "Como posso me vestir hoje?",
    "O que combina comigo?",
    "Qual seria o melhor caimento?",
    "Como posso melhorar?",
    "Try on virtual",
  ];

  const handleNavClick = (item) => {
    console.log("Ir para:", item);
    // aqui depois você integra com o router ou muda o estado da tela
  };

  const handleFabClick = (item) => {
    console.log("Atalho FAB:", item);
    // idem: integrar com navegação / abas
  };

  return (
    <div className="tf-page">
      {/* HEADER */}
      <header className="tf-header">
        <div className="tf-header-left">
          <img src={logoImg} alt="Today's Fashion" className="tf-logo" />
        </div>

        <div className="tf-header-right">
          <button
            className="tf-icon-button"
            type="button"
            title="Perfil do usuário"
          >
            {/* ícone de usuário (SVG simples) */}
            <svg
              viewBox="0 0 24 24"
              className="tf-icon"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19" />
            </svg>
          </button>

          <button
            className="tf-icon-button"
            type="button"
            title="Logout"
          >
            {/* ícone de logout (seta saindo de uma porta) */}
            <svg
              viewBox="0 0 24 24"
              className="tf-icon"
              aria-hidden="true"
            >
              <path d="M10 4H5v16h5" />
              <path d="M14 8l4 4-4 4" />
              <path d="M18 12H10" />
            </svg>
          </button>
        </div>

        {/* botão meia-bola com seta para abrir/fechar menu */}
        <button
          className={`tf-nav-toggle ${navOpen ? "tf-nav-toggle--open" : ""}`}
          type="button"
          onClick={() => setNavOpen((prev) => !prev)}
          aria-label="Alternar menu"
        >
          <svg
  className="tf-nav-toggle-arrow"
  viewBox="0 0 24 24"
  aria-hidden="true"
>
  <path d="M6 9l6 6 6-6" stroke="black" strokeWidth="2" fill="none" />
</svg>

        </button>
      </header>

      {/* MENU PRINCIPAL (abaixo do cabeçalho) */}
      <nav
        className={`tf-nav-bar ${navOpen ? "tf-nav-bar--open" : "tf-nav-bar--closed"}`}
      >
        <div className="tf-nav-inner">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              className="tf-nav-item"
              onClick={() => handleNavClick(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* CORPO */}
      <main className="tf-main">
        {/* aqui entra o conteúdo das abas depois */}
      </main>

      {/* FAB (botão azul com +) */}
      <div className="tf-fab-container">
  <div className="tf-fab-inner">
    <button
      type="button"
      className="tf-fab-main"
      onClick={() => setFabOpen((prev) => !prev)}
      aria-label="Abrir menu rápido"
    >
      <span className="tf-fab-plus">+</span>
    </button>

    <div className={`tf-fab-options ${fabOpen ? "tf-fab-options--open" : ""}`}>
      <button
        type="button"
        className="tf-fab-option tf-fab-option--tryon"
        onClick={() => handleFabClick("try on virtual")}
        title="Try on virtual"
      >
        <svg viewBox="0 0 24 24" className="tf-fab-icon" aria-hidden="true">
          <rect x="4" y="7" width="16" height="10" rx="2" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      </button>

      <button
        type="button"
        className="tf-fab-option tf-fab-option--closet"
        onClick={() => handleFabClick("armário virtual")}
        title="Armário virtual"
      >
        <svg viewBox="0 0 24 24" className="tf-fab-icon" aria-hidden="true">
          <path d="M12 5a2 2 0 0 1 2 2c0 .8-.5 1.3-1.2 1.7L12 9" />
          <path d="M4 18l8-6 8 6" />
        </svg>
      </button>
    </div>
  </div>
</div>

    </div>
  );
}
