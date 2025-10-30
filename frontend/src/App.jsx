import { useState } from "react";
import "./App.css";
import TabTryOn from "./components/TabTryOn";
import Armario from "./components/Armario";
import {
  FaTshirt,
  FaPalette,
  FaRulerCombined,
  FaStar,
  FaSun,
  FaUserFriends,
  FaUserTie,
  FaUser,
  FaUserCircle
} from "react-icons/fa";

// ✅ URL fixa (ambiente local)
const backendUrl = "http://127.0.0.1:8000/api/try-on-diffusion/";

async function executarTryOn({
  clothingFile,
  avatarFile,
  clothingUrl,
  avatarUrl,
  clothingPrompt,
  avatarPrompt,
}) {
  const formData = new FormData();
  if (clothingFile) formData.append("clothing_image", clothingFile);
  if (avatarFile) formData.append("avatar_image", avatarFile);
  if (!clothingFile && clothingUrl)
    formData.append("clothing_image_url", clothingUrl);
  if (!avatarFile && avatarUrl) formData.append("avatar_image_url", avatarUrl);
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

/* --- ABA 1: COMO POSSO ME VESTIR HOJE? --- */
function TabVestir() {
  const [genero, setGenero] = useState("");
  const [clima, setClima] = useState("");
  const [evento, setEvento] = useState("");
  const [sugestao, setSugestao] = useState("");
  const [imagensSugestao, setImagensSugestao] = useState([]);

  const lookImages = {
    quente: { masculino: "images/imagem_quente_m.png", feminino: "images/imagem_quente_f.png" },
    frio: { masculino: "images/imagem_frio_m.png", feminino: "images/imagem_frio_f.png" },
    chuvoso: { masculino: "images/imagem_chuvoso_m.png", feminino: "images/imagem_chuvoso_f.png" },
    trabalho: { masculino: "images/imagem_trabalho_m.png", feminino: "images/imagem_trabalho_f.png" },
    lazer: { masculino: "images/imagem_lazer_m.png", feminino: "images/imagem_lazer_f.png" },
    formal: { masculino: "images/imagem_formal_m.png", feminino: "images/imagem_formal_f.png" },
  };

  const gerarSugestao = () => {
    if (!genero || !clima || !evento) {
      setSugestao("Escolha gênero, clima e evento para ver uma sugestão.");
      setImagensSugestao([]);
      return;
    }

    let look = "";
    let imgClima = "";
    let imgEvento = "";

    // clima
    if (clima === "quente") {
      look = genero === "masculino" ? "Bermuda e camisa leve" : "Vestido leve colorido";
      imgClima = lookImages.quente[genero];
    } else if (clima === "frio") {
      look = genero === "masculino" ? "Casaco de lã com calça jeans escura" : "Casaco de lã e saia";
      imgClima = lookImages.frio[genero];
    } else if (clima === "chuvoso") {
      look = genero === "masculino" ? "Jaqueta impermeável" : "Moletom";
      imgClima = lookImages.chuvoso[genero];
    }

    // evento
    if (evento === "trabalho") {
      look += genero === "masculino" ? " + Blazer slim fit" : " + Blazer ou Camisa Social";
      imgEvento = lookImages.trabalho[genero];
    } else if (evento === "lazer") {
      look += genero === "masculino" ? " + Tênis confortável" : " + Sandália ou Tênis";
      imgEvento = lookImages.lazer[genero];
    } else if (evento === "formal") {
      look += genero === "masculino" ? " + Sapato social" : " + Scarpin ou Salto discreto";
      imgEvento = lookImages.formal[genero];
    }

    setSugestao(look);
    setImagensSugestao([imgClima, imgEvento]);
  };

  return (
    <div>
      <Field label="Gênero" icon={FaUser}>
        <select value={genero} onChange={(e) => setGenero(e.target.value)}>
          <option value="">--Selecione--</option>
          <option value="masculino">Masculino 👨</option>
          <option value="feminino">Feminino 👩</option>
        </select>
      </Field>

      <Field label="Clima" icon={FaSun}>
        <select value={clima} onChange={(e) => setClima(e.target.value)}>
          <option value="">--Selecione--</option>
          <option value="quente">Quente ☀️</option>
          <option value="frio">Frio ❄️</option>
          <option value="chuvoso">Chuvoso 🌧️</option>
        </select>
      </Field>

      <Field label="Evento" icon={FaUserFriends}>
        <select value={evento} onChange={(e) => setEvento(e.target.value)}>
          <option value="">--Selecione--</option>
          <option value="trabalho">Trabalho 💼</option>
          <option value="lazer">Lazer 🎉</option>
          <option value="formal">Evento Formal 🤵</option>
        </select>
      </Field>

      <PrimaryButton onClick={gerarSugestao}>Gerar Sugestão</PrimaryButton>

      {sugestao && (
        <div className="resultado-com-imagem">
          <p className="resultado">{sugestao}</p>
          <div className="imagens-container">
            {imagensSugestao.map((img, i) => (
              <img key={i} src={img} alt="Sugestão de look" className="look-img" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* --- ABA 2: O QUE COMBINA COMIGO? --- */
function TabCombina() {
  const [cor, setCor] = useState("");
  const [resultado, setResultado] = useState("");

  const analisar = () => {
    const c = cor.trim().toLowerCase();
    if (!c) return setResultado("Digite uma cor para analisar.");
    if (c === "bege") setResultado("Evite bege. Aposte em azul petróleo!");
    else if (c === "preto")
      setResultado("Preto é versátil; experimente verde musgo ou vinho.");
    else
      setResultado(
        "Essa cor pode funcionar com tons neutros (preto, branco, cinza)."
      );
  };

  return (
    <div>
      <Field label="Cor preferida" icon={FaPalette}>
        <input
          type="text"
          placeholder="Ex.: azul, bege, preto…"
          value={cor}
          onChange={(e) => setCor(e.target.value)}
        />
      </Field>
      <PrimaryButton onClick={analisar}>Analisar</PrimaryButton>
      {resultado && <p className="resultado">{resultado}</p>}
    </div>
  );
}

/* --- ABA 3: QUAL SERIA O MELHOR CAIMENTO? --- */
function TabCaimento() {
  const [altura, setAltura] = useState("");
  const [resultado, setResultado] = useState("");

  const analisar = () => {
    const alt = parseInt(altura, 10);
    if (!alt) {
      setResultado("Digite sua altura corretamente (em cm).");
      return;
    }
    if (alt < 165)
      setResultado("Prefira calças de cintura alta e barras ajustadas.");
    else if (alt < 180)
      setResultado("Caimento slim fit tende a valorizar suas proporções.");
    else
      setResultado(
        "Peças um pouco mais soltas (regular/oversized) equilibram bem sua estatura."
      );
  };

  return (
    <div>
      <Field label="Altura (cm)" icon={FaRulerCombined}>
        <input
          type="number"
          min="120"
          max="230"
          placeholder="Ex.: 175"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
        />
      </Field>
      <PrimaryButton onClick={analisar}>Analisar</PrimaryButton>
      {resultado && <p className="resultado">{resultado}</p>}
    </div>
  );
}

/* --- ABA 4: COMO POSSO MELHORAR? --- */
function TabMelhorar() {
  const [estilo, setEstilo] = useState("");
  const [resultado, setResultado] = useState("");

  const recomendar = () => {
    if (!estilo)
      return setResultado("Selecione um estilo para receber recomendações.");
    if (estilo === "casual")
      setResultado(
        "Inclua jaqueta jeans e tênis brancos para elevar o casual."
      );
    if (estilo === "formal")
      setResultado(
        "Gravatas texturizadas e alfaiataria ajustada dão modernidade."
      );
    if (estilo === "esportivo")
      setResultado("Aposte em acessórios minimalistas e jaquetas bomber.");
  };

  return (
    <div>
      <Field label="Estilo atual" icon={FaStar}>
        <select value={estilo} onChange={(e) => setEstilo(e.target.value)}>
          <option value="">--Selecione--</option>
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
          <option value="esportivo">Esportivo</option>
        </select>
      </Field>
      <PrimaryButton onClick={recomendar}>Recomendar</PrimaryButton>
      {resultado && <p className="resultado">{resultado}</p>}
    </div>
  );
}

/* --- ABA MEU PERFIL --- */
function MeuPerfil({ userProfile, setUserProfile }) {
  const [name, setName] = useState(userProfile.name || "");
  const [description, setDescription] = useState(userProfile.description || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [savedPhoto, setSavedPhoto] = useState(userProfile.avatarUrl || "");

  const handleSave = () => {
    let finalPhoto = savedPhoto;

    if (photoFile) {
      finalPhoto = URL.createObjectURL(photoFile);
    } else if (photoUrl.trim() !== "") {
      finalPhoto = photoUrl;
    }

    const perfilData = {
      name,
      description,
      avatarUrl: finalPhoto,
    };

    setUserProfile(perfilData);
    localStorage.setItem("userProfile", JSON.stringify(perfilData));
    setSavedPhoto(finalPhoto);
    alert("Perfil salvo com sucesso!");
  };

  return (
    <div className="perfil-container">
      <h2>Meu Perfil</h2>
      <Field label="Nome de Usuário" icon={FaUserCircle}>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Descrição do Perfil">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ resize: "none", padding: "0.7rem", borderRadius: "6px" }}
        />
      </Field>
      <Field label="Foto de Perfil">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="ou URL da foto"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
        />
      </Field>
      <button className="btn-primary" onClick={handleSave}>
        Salvar Perfil
      </button>

      {savedPhoto && (
        <div className="resultado-com-imagem" style={{ marginTop: "1rem" }}>
          <img
            src={savedPhoto}
            alt="Foto do perfil"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      )}
    </div>
  );
}

/* --- CONFIGURAÇÃO DAS ABAS --- */
const tabs = [
  {
    id: "vestir",
    title: "Como posso me vestir hoje?",
    icon: FaTshirt,
    component: <TabVestir />,
  },
  {
    id: "combina",
    title: "O que combina comigo?",
    icon: FaPalette,
    component: <TabCombina />,
  },
  {
    id: "caimento",
    title: "Qual seria o melhor caimento?",
    icon: FaRulerCombined,
    component: <TabCaimento />,
  },
  {
    id: "melhorar",
    title: "Como posso melhorar?",
    icon: FaStar,
    component: <TabMelhorar />,
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
    component: <Armario />,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("vestir");
  const [userProfile, setUserProfile] = useState(
    JSON.parse(localStorage.getItem("userProfile")) || { name: "Usuário", avatarUrl: null }
  );
  const [showWelcome, setShowWelcome] = useState(true);

  const handleClosePopup = () => {
    setShowWelcome(false);
  };

  return (
    <>
      {showWelcome && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>👗 Bem-vindo(a) ao <span className="highlight">Today's Fashion</span>!</h2>
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

          {/* Ícone de perfil */}
          <button
            className="profile-btn"
            onClick={() => setActiveTab("meuPerfil")}
            title="Meu Perfil"
          >
            {userProfile.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt="Perfil"
                className="profile-icon"
              />
            ) : (
              <FaUserCircle className="profile-icon" />
            )}
          </button>
        </nav>

        <div className="tab-content">
          {activeTab === "meuPerfil" ? (
            <MeuPerfil
              userProfile={userProfile}
              setUserProfile={setUserProfile}
            />
          ) : (
            tabs.find((t) => t.id === activeTab)?.component
          )}
        </div>
      </div>
    </>
  );
}
