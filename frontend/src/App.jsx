import { useState } from "react";

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
      <label>Clima:</label>
      <select value={clima} onChange={(e) => setClima(e.target.value)}>
        <option value="">--Selecione--</option>
        <option value="quente">Quente</option>
        <option value="frio">Frio</option>
        <option value="chuvoso">Chuvoso</option>
      </select>

      <label>Evento:</label>
      <select value={evento} onChange={(e) => setEvento(e.target.value)}>
        <option value="">--Selecione--</option>
        <option value="trabalho">Trabalho</option>
        <option value="lazer">Lazer</option>
        <option value="formal">Evento Formal</option>
      </select>

      <button onClick={gerarSugestao}>Gerar Sugestão</button>

      {sugestao && <p className="resultado">{sugestao}</p>}
    </div>
  );
}

function TabCombina() {
  const [cor, setCor] = useState("");
  const [resultado, setResultado] = useState("");

  const analisar = () => {
    if (cor.toLowerCase() === "bege") {
      setResultado("Evite bege. Aposte em azul petróleo!");
    } else if (cor.toLowerCase() === "preto") {
      setResultado("Preto é versátil, mas experimente verde musgo.");
    } else {
      setResultado("Essa cor pode ser usada com tons neutros.");
    }
  };

  return (
    <div>
      <label>Digite uma cor que você gosta:</label>
      <input
        type="text"
        value={cor}
        onChange={(e) => setCor(e.target.value)}
      />
      <button onClick={analisar}>Analisar</button>
      {resultado && <p className="resultado">{resultado}</p>}
    </div>
  );
}

function TabCaimento() {
  const [altura, setAltura] = useState("");
  const [resultado, setResultado] = useState("");

  const analisar = () => {
    const alt = parseInt(altura);
    if (!alt) {
      setResultado("Digite sua altura corretamente.");
      return;
    }
    if (alt < 165) setResultado("Use calças de cintura alta para alongar.");
    else if (alt < 180) setResultado("Caimento slim fit vai cair muito bem.");
    else setResultado("Peças oversized ficam equilibradas no seu corpo.");
  };

  return (
    <div>
      <label>Sua altura (cm):</label>
      <input
        type="number"
        value={altura}
        onChange={(e) => setAltura(e.target.value)}
      />
      <button onClick={analisar}>Analisar</button>
      {resultado && <p className="resultado">{resultado}</p>}
    </div>
  );
}

function TabMelhorar() {
  const [estilo, setEstilo] = useState("");
  const [resultado, setResultado] = useState("");

  const recomendar = () => {
    if (estilo === "casual") setResultado("Adicione uma jaqueta jeans.");
    if (estilo === "formal") setResultado("Inclua gravatas modernas.");
    if (estilo === "esportivo") setResultado("Combine com acessórios minimalistas.");
  };

  return (
    <div>
      <label>Seu estilo atual:</label>
      <select value={estilo} onChange={(e) => setEstilo(e.target.value)}>
        <option value="">--Selecione--</option>
        <option value="casual">Casual</option>
        <option value="formal">Formal</option>
        <option value="esportivo">Esportivo</option>
      </select>
      <button onClick={recomendar}>Recomendar</button>
      {resultado && <p className="resultado">{resultado}</p>}
    </div>
  );
}

const tabs = [
  { id: "vestir", title: "Como posso me vestir hoje?", component: <TabVestir /> },
  { id: "combina", title: "O que combina comigo?", component: <TabCombina /> },
  { id: "caimento", title: "Qual seria o melhor caimento?", component: <TabCaimento /> },
  { id: "melhorar", title: "Como posso melhorar?", component: <TabMelhorar /> }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("vestir");

  return (
    <>
      <header>Today's Fashion</header> 
      <div className="container">
        <nav className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </button>
          ))}
        </nav>
        <div className="tab-content">
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>
    </>
  );
}