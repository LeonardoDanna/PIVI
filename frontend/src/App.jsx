import { useState } from "react";
import TabTryOn from "./components/TabTryOn";
import {
  FaTshirt,
  FaPalette,
  FaRulerCombined,
  FaStar,
  FaSun,
  FaSnowflake,
  FaCloudRain,
  FaBriefcase,
  FaUserFriends,
  FaUserTie
} from "react-icons/fa";

async function executarTryOn({ clothingFile, avatarFile, clothingUrl, avatarUrl, clothingPrompt, avatarPrompt }) {
  const formData = new FormData();
  if (clothingFile) formData.append("clothing_image", clothingFile);
  if (avatarFile) formData.append("avatar_image", avatarFile);
  if (!clothingFile && clothingUrl) formData.append("clothing_image_url", clothingUrl);
  if (!avatarFile && avatarUrl) formData.append("avatar_image_url", avatarUrl);
  if (clothingPrompt) formData.append("clothing_prompt", clothingPrompt);
  if (avatarPrompt) formData.append("avatar_prompt", avatarPrompt);

  const resp = await fetch("/api/try-on-diffusion/", {
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
  const [clima, setClima] = useState("");
  const [evento, setEvento] = useState("");
  const [sugestao, setSugestao] = useState("");

  const gerarSugestao = () => {
    let look = "";
    if (clima === "quente") look = "Camisa leve e bermuda em cores claras";
    if (clima === "frio") look = "Casaco de lã com calça jeans escura";
    if (clima === "chuvoso") look = "Jaqueta impermeável e botas";

    if (evento === "trabalho") look += " + Blazer slim fit";
    if (evento === "lazer") look += " + Tênis confortável";
    if (evento === "formal") look += " + Sapato social";

    setSugestao(look || "Escolha clima e evento para ver uma sugestão.");
  };

  return (
    <div>
      <Field label="Clima" icon={FaSun}>
        <div className="input-with-icon">
          <select value={clima} onChange={(e) => setClima(e.target.value)}>
            <option value="">--Selecione--</option>
            <option value="quente">Quente ☀️</option>
            <option value="frio">Frio ❄️</option>
            <option value="chuvoso">Chuvoso 🌧️</option>
          </select>
        </div>
      </Field>

      <Field label="Evento" icon={FaUserFriends}>
        <div className="input-with-icon">
          <select value={evento} onChange={(e) => setEvento(e.target.value)}>
            <option value="">--Selecione--</option>
            <option value="trabalho">Trabalho 💼</option>
            <option value="lazer">Lazer 🎉</option>
            <option value="formal">Evento Formal 🤵</option>
          </select>
        </div>
      </Field>

      <PrimaryButton onClick={gerarSugestao}>Gerar Sugestão</PrimaryButton>
      {sugestao && <p className="resultado">{sugestao}</p>}
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
    else if (c === "preto") setResultado("Preto é versátil; experimente verde musgo ou vinho.");
    else setResultado("Essa cor pode funcionar com tons neutros (preto, branco, cinza).");
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
    if (alt < 165) setResultado("Prefira calças de cintura alta e barras ajustadas para alongar.");
    else if (alt < 180) setResultado("Caimento slim fit tende a valorizar suas proporções.");
    else setResultado("Peças um pouco mais soltas (regular/oversized) equilibram bem sua estatura.");
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
    if (!estilo) return setResultado("Selecione um estilo para receber recomendações.");
    if (estilo === "casual") setResultado("Inclua jaqueta jeans e tênis brancos para elevar o casual.");
    if (estilo === "formal") setResultado("Gravatas texturizadas e alfaiataria ajustada dão modernidade.");
    if (estilo === "esportivo") setResultado("Aposte em acessórios minimalistas e jaquetas bomber.");
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

const tabs = [
  { id: "vestir", title: "Como posso me vestir hoje?", icon: FaTshirt, component: <TabVestir /> },
  { id: "combina", title: "O que combina comigo?", icon: FaPalette, component: <TabCombina /> },
  { id: "caimento", title: "Qual seria o melhor caimento?", icon: FaRulerCombined, component: <TabCaimento /> },
  { id: "melhorar", title: "Como posso melhorar?", icon: FaStar, component: <TabMelhorar /> },
  { id: "tryon", title: "Try-On Virtual", icon: FaUserTie, component: <TabTryOn /> } // 👈 nova aba
];


export default function App() {
  const [activeTab, setActiveTab] = useState("vestir");

  return (
    <>
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
        <div className="tab-content">
          {tabs.find((t) => t.id === activeTab)?.component}
        </div>
      </div>
    </>
  );
}