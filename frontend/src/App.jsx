import { useState, useRef } from "react";
import logoImg from "./assets/imagens/todays fashion logo.png";

// componentes das abas
import TabCaimento from "./assets/components/TabCaimento.jsx";
import TabCombina from "./assets/components/TabCombina.jsx";
import TabMelhorar from "./assets/components/TabMelhorar.jsx";
import TabVestir from "./assets/components/TabVestir.jsx";

import "./index.css";

/* ------------------------------
   Componentes base para as abas
-------------------------------- */

function TFField({ label, icon: Icon, children }) {
  return (
    <div className="tf-field">
      {label && (
        <label className="tf-field-label">
          {Icon && <Icon className="tf-field-icon" />}
          <span>{label}</span>
        </label>
      )}
      <div className="tf-field-control">{children}</div>
    </div>
  );
}

function TFPrimaryButton({ children, type = "button", ...rest }) {
  return (
    <button className="tf-primary-button" type={type} {...rest}>
      {children}
    </button>
  );
}

/* --------------------------------
   Layout principal
----------------------------------- */

export default function TodaysFashionLayout() {
  const navItems = [
    "Como posso me vestir hoje?",
    "O que combina comigo?",
    "Qual seria o melhor caimento?",
    "Como posso melhorar?",
    "Try on virtual",
  ];

  const [navOpen, setNavOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [showCloset, setShowCloset] = useState(false);
  const [closetFiles, setClosetFiles] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null); // foto do usuário

  const fileInputRef = useRef(null); // input armário
  const avatarInputRef = useRef(null); // input avatar

  // Toggle das abas
  const handleNavClick = (item) => {
    setActiveTab((prev) => (prev === item ? null : item));
  };

  const handleClosetFiles = (fileList) => {
    const filesArray = Array.from(fileList || []);
    if (!filesArray.length) return;
    setClosetFiles((prev) => [...prev, ...filesArray]);
  };

  const handleAvatarFile = (fileList) => {
    const fileArray = Array.from(fileList || []);
    if (!fileArray.length) return;
    setAvatarFile(fileArray[0]); // só uma foto
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
            <svg viewBox="0 0 24 24" className="tf-icon" aria-hidden="true">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 19c1.5-3 4-4.5 7-4.5s7 1.5 9 4.5" />
            </svg>
          </button>

          <button className="tf-icon-button" type="button" title="Logout">
            <svg viewBox="0 0 24 24" className="tf-icon" aria-hidden="true">
              <path d="M10 4H5v16h5" />
              <path d="M14 8l4 4-4 4" />
              <path d="M18 12h-8" />
            </svg>
          </button>
        </div>

        <button
          className={`tf-nav-toggle ${navOpen ? "tf-nav-toggle--open" : ""}`}
          type="button"
          onClick={() => setNavOpen((prev) => !prev)}
        >
          <svg className="tf-nav-toggle-arrow" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" stroke="black" strokeWidth="2" fill="none" />
          </svg>
        </button>
      </header>

      {/* NAV BAR */}
      <nav
        className={`tf-nav-bar ${
          navOpen ? "tf-nav-bar--open" : "tf-nav-bar--closed"
        }`}
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

      {/* MAIN */}
      <main className="tf-main">
        {/* -----------------------------------
            ABA: COMO POSSO ME VESTIR HOJE?
        ------------------------------------ */}
        {activeTab === "Como posso me vestir hoje?" && (
          <div className="tf-tab-content">
            <div className="tf-tab-card">
              <h1 className="tf-tab-title">Como posso me vestir hoje?</h1>

              <div className="tf-section-layout">
                <div className="tf-section-col">
                  <TabVestir Field={TFField} PrimaryButton={TFPrimaryButton} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------
            ABA: O QUE COMBINA COMIGO?
        ------------------------------------ */}
        {activeTab === "O que combina comigo?" && (
          <div className="tf-tab-content">
            <div className="tf-tab-card">
              <h1 className="tf-tab-title">O que combina comigo?</h1>

              <div className="tf-section-layout">
                <div className="tf-section-col">
                  <TabCombina Field={TFField} PrimaryButton={TFPrimaryButton} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------
            ABA: QUAL SERIA O MELHOR CAIMENTO?
        ------------------------------------ */}
        {activeTab === "Qual seria o melhor caimento?" && (
          <div className="tf-tab-content">
            <div className="tf-tab-card">
              <h1 className="tf-tab-title">Qual seria o melhor caimento?</h1>

              <div className="tf-section-layout">
                <div className="tf-section-col">
                  <TabCaimento Field={TFField} PrimaryButton={TFPrimaryButton} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------
            ABA: COMO POSSO MELHORAR?
        ------------------------------------ */}
        {activeTab === "Como posso melhorar?" && (
          <div className="tf-tab-content">
            <div className="tf-tab-card">
              <h1 className="tf-tab-title">Como posso melhorar?</h1>

              <div className="tf-section-layout">
                <div className="tf-section-col">
                  <TabMelhorar
                    Field={TFField}
                    PrimaryButton={TFPrimaryButton}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------
            ABA: TRY ON VIRTUAL
        ------------------------------------ */}
        {activeTab === "Try on virtual" && (
          <div className="tf-tab-content">
            <div className="tf-tab-card">
              <h1 className="tf-tab-title">Try on virtual</h1>

              <div className="tf-tryon-layout">
                {/* ESQUERDA – AVATAR */}
                <section className="tf-tryon-left">
                  <h2 className="tf-tryon-subtitle">Avatar</h2>

                  {!avatarFile && (
                    <div
                      className="tf-dropzone tf-dropzone--tall"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "copy";
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleAvatarFile(e.dataTransfer.files);
                      }}
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <p className="tf-dropzone-title">
                        Enviar foto do usuário
                      </p>
                      <p className="tf-dropzone-subtitle">
                        Arraste uma foto aqui ou clique para selecionar
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    ref={avatarInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => handleAvatarFile(e.target.files)}
                  />

                  {avatarFile && (
                    <div className="tf-avatar-preview">
                      <img
                        src={URL.createObjectURL(avatarFile)}
                        alt={avatarFile.name}
                      />
                    </div>
                  )}
                </section>

                {/* DIREITA – PEÇAS DO ARMÁRIO */}
                <section className="tf-tryon-right">
                  <h2 className="tf-tryon-subtitle">Peças do armário</h2>

                  {closetFiles.length === 0 ? (
                    <p className="tf-tryon-empty">
                      Nenhuma peça adicionada ao armário virtual ainda.
                    </p>
                  ) : (
                    <div className="tf-closet-gallery tf-closet-gallery--tryon">
                      {closetFiles.map((file, index) => (
                        <div key={index} className="tf-closet-thumb">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FAB */}
      <div className="tf-fab-container">
        <div className="tf-fab-inner">
          <button
            type="button"
            className="tf-fab-main"
            onClick={() => setFabOpen((prev) => !prev)}
          >
            <span className="tf-fab-plus">+</span>
          </button>

          <div
            className={`tf-fab-options ${
              fabOpen ? "tf-fab-options--open" : ""
            }`}
          >
            <button
              type="button"
              className="tf-fab-option tf-fab-option--tryon"
              onClick={() => {
                setActiveTab((prev) =>
                  prev === "Try on virtual" ? null : "Try on virtual"
                );
                setFabOpen(false);
              }}
              title="Try on virtual"
            >
              <svg viewBox="0 0 24 24" className="tf-fab-icon">
                <rect x="4" y="7" width="16" height="10" rx="2" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            </button>

            <button
              type="button"
              className="tf-fab-option tf-fab-option--closet"
              onClick={() => {
                setShowCloset(true);
                setFabOpen(false);
              }}
              title="Armário virtual"
            >
              <svg viewBox="0 0 24 24" className="tf-fab-icon">
                <path d="M12 5a2 2 0 0 1 2 2c0 .8-.5 1.3-1.2 1.7L12 9" />
                <path d="M4 18l8-6 8 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL – ARMÁRIO VIRTUAL */}
      {showCloset && (
        <div className="tf-modal">
          <div className="tf-modal-content">
            <div className="tf-modal-header">
              <h2>Armário virtual</h2>
              <button
                className="tf-modal-close"
                onClick={() => setShowCloset(false)}
              >
                ×
              </button>
            </div>

            <div className="tf-modal-body">
              <div
                className="tf-dropzone"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "copy";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleClosetFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <p className="tf-dropzone-title">Adicionar peças ao armário</p>
                <p className="tf-dropzone-subtitle">
                  Arraste fotos aqui ou clique para selecionar do dispositivo
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => handleClosetFiles(e.target.files)}
              />

              {closetFiles.length > 0 && (
                <div className="tf-closet-gallery">
                  {closetFiles.map((file, index) => (
                    <div key={index} className="tf-closet-thumb">
                      <button
                        className="tf-thumb-remove"
                        onClick={() => {
                          const ok = window.confirm(
                            "Deseja remover esta peça do armário?"
                          );
                          if (ok) {
                            setClosetFiles((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }
                        }}
                      >
                        ×
                      </button>

                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
