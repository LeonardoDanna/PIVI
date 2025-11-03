import { useEffect, useMemo, useState } from "react";
import {
  FaStar,
  FaClipboard,
  FaBroom,
  FaTshirt,
  FaBullseye,
  FaCalendarAlt,
  FaCloudSun,
  FaMoneyBillAlt,
  FaPalette,
  FaRulerCombined
} from "react-icons/fa";

export default function TabMelhorar({ Field, PrimaryButton }) {
  const [estilo, setEstilo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [evento, setEvento] = useState("");
  const [clima, setClima] = useState("");
  const [orcamento, setOrcamento] = useState("");
  const [cores, setCores] = useState("");
  const [ajuste, setAjuste] = useState("");
  const [resultado, setResultado] = useState([]);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tabMelhorar") || "{}");
    setEstilo(saved.estilo || "");
    setObjetivo(saved.objetivo || "");
    setEvento(saved.evento || "");
    setClima(saved.clima || "");
    setOrcamento(saved.orcamento || "");
    setCores(saved.cores || "");
    setAjuste(saved.ajuste || "");
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "tabMelhorar",
      JSON.stringify({ estilo, objetivo, evento, clima, orcamento, cores, ajuste })
    );
  }, [estilo, objetivo, evento, clima, orcamento, cores, ajuste]);

  const camposValidos = useMemo(
    () => [estilo, objetivo, evento].every(Boolean),
    [estilo, objetivo, evento]
  );

  const recomendar = () => {
    if (!camposValidos) {
      setResultado([
        "Preencha ao menos Estilo, Objetivo e Evento para recomendações mais assertivas."
      ]);
      return;
    }

    const dicas = new Set();

    // Base por estilo
    if (estilo === "casual") {
      dicas.add("Jaqueta jeans, camiseta lisa e tênis branco elevam o casual sem esforço.");
      dicas.add("Troque moletom largo por sweater média gramatura para um visual mais limpo.");
    }
    if (estilo === "formal") {
      dicas.add("Alfaiataria ajustada, barra correta e sapato polido — o básico bem-feito.");
      dicas.add("Gravata texturizada (grenadine/knit) adiciona profundidade sem exagero.");
    }
    if (estilo === "esportivo") {
      dicas.add("Jaqueta bomber ou track jacket com calça reta evita ar de academia.");
      dicas.add("Acessórios minimalistas (relógio, boné low-profile) mantêm o foco no fit.");
    }
    if (estilo === "street") {
      dicas.add("Sobreposição (camiseta + overshirt) cria dimensão; controle volumes.");
      dicas.add("Tênis statement? Balance com peças neutras no restante.");
    }

    // Objetivo
    if (objetivo === "parecer-mais-alto") {
      dicas.add("Monocromia ou baixo contraste superior/inferior alonga a silhueta.");
      dicas.add("Calça de cintura média/alta e barra sem quebra visual (no-break).");
    }
    if (objetivo === "parecer-mais-forte") {
      dicas.add("Estruture ombros e use gola que abra o peitoral (crew/henley).");
      dicas.add("Prefira tecidos encorpados no topo e corte levemente afunilado na calça.");
    }
    if (objetivo === "minimalista") {
      dicas.add("Paleta cápsula: 3 cores base + 1 destaque. Evite gráficos.");
      dicas.add("Aposte em caimento e textura; menos peças, melhor qualidade.");
    }
    if (objetivo === "sofisticado") {
      dicas.add("Materiais nobres (lã fria, algodão pima) + modelagem precisa.");
      dicas.add("Cinto e sapato no mesmo tom; relógio discreto fecha o conjunto.");
    }

    // Evento
    if (evento === "entrevista") {
      dicas.add("Evite logos; priorize neutros e ajuste impecável.");
      dicas.add("Leve uma camada extra (blazer/cardigan) para controlar formalidade.");
    }
    if (evento === "encontro") {
      dicas.add("Textura tátil (suede, tricot) gera interesse sem poluir.");
      dicas.add("Um toque de cor nos acessórios mostra personalidade.");
    }
    if (evento === "trabalho-casual") {
      dicas.add("Chinos + camisa oxford/henley elevam o básico; tênis limpo resolve.");
      dicas.add("Jaqueta leve (work/coach) dá acabamento e utilidade.");
    }
    if (evento === "formatura") {
      dicas.add("Terno bem ajustado > terno caro. Atenção em barra e mangas.");
      dicas.add("Gravata simples, sapato clássico; foco no fit e postura.");
    }

    // Clima
    if (clima === "quente") {
      dicas.add("Tecidos respiráveis (linho, algodão leve); evite preto absoluto no sol.");
    }
    if (clima === "frio") {
      dicas.add("Camadas finas (thermal + malha + casaco) isolam sem volume excessivo.");
    }
    if (clima === "chuva") {
      dicas.add("Camada externa repelente à água e calçados com sola firme.");
    }

    // Orçamento
    if (orcamento === "baixo") {
      dicas.add("Priorize ajuste: barra e mangas corrigidas transformam peças simples.");
    }
    if (orcamento === "medio") {
      dicas.add("Eleve por material (suede, lã misto) em uma peça-chave.");
    }
    if (orcamento === "alto") {
      dicas.add("Monte um kit de alfaiataria sob medida e calçados de couro duráveis.");
    }

    // Cores
    if (cores === "neutras") {
      dicas.add("Brinque com textura (sarja, malha, suede) para evitar monotonia.");
    }
    if (cores === "terrosas") {
      dicas.add("Combine tons quentes (oliva, caramelo) com off-white.");
    }
    if (cores === "altocontraste") {
      dicas.add("Use contraste no topo e base neutra para não dividir silhueta.");
    }

    // Ajuste
    if (ajuste === "slim") {
      dicas.add("Ajuste não é aperto: teste conforto sentado.");
    }
    if (ajuste === "relax") {
      dicas.add("Equilibre volumes: peça ampla + parte de baixo próxima do corpo.");
    }
    if (ajuste === "regular") {
      dicas.add("Pequenas correções dão cara de sob medida sem custo alto.");
    }

    setResultado([...dicas]);
    setCopiado(false);
  };

  const limpar = () => {
    setEstilo("");
    setObjetivo("");
    setEvento("");
    setClima("");
    setOrcamento("");
    setCores("");
    setAjuste("");
    setResultado([]);
    setCopiado(false);
    localStorage.removeItem("tabMelhorar");
  };

  const copiar = async () => {
    const texto = resultado.join("\n• ");
    try {
      await navigator.clipboard.writeText("• " + texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <div className="tab-melhorar">
      <div className="grid-filtros">
        <Field label="Estilo" icon={FaTshirt}>
          <select value={estilo} onChange={(e) => setEstilo(e.target.value)}>
            <option value="">--Selecione--</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="esportivo">Esportivo</option>
            <option value="street">Street</option>
          </select>
        </Field>

        <Field label="Objetivo" icon={FaBullseye}>
          <select value={objetivo} onChange={(e) => setObjetivo(e.target.value)}>
            <option value="">--Selecione--</option>
            <option value="parecer-mais-alto">Parecer mais alto</option>
            <option value="parecer-mais-forte">Parecer mais forte</option>
            <option value="minimalista">Minimalista</option>
            <option value="sofisticado">Sofisticado</option>
          </select>
        </Field>

        <Field label="Evento" icon={FaCalendarAlt}>
          <select value={evento} onChange={(e) => setEvento(e.target.value)}>
            <option value="">--Selecione--</option>
            <option value="entrevista">Entrevista</option>
            <option value="encontro">Encontro</option>
            <option value="trabalho-casual">Trabalho (casual)</option>
            <option value="formatura">Formatura</option>
          </select>
        </Field>

        <Field label="Clima" icon={FaCloudSun}>
          <select value={clima} onChange={(e) => setClima(e.target.value)}>
            <option value="">--Selecione--</option>
            <option value="quente">Quente</option>
            <option value="frio">Frio</option>
            <option value="chuva">Chuva</option>
          </select>
        </Field>

        <Field label="Orçamento" icon={FaMoneyBillAlt}>
          <select value={orcamento} onChange={(e) => setOrcamento(e.target.value)}>
            <option value="">--Selecione--</option>
            <option value="baixo">Baixo</option>
            <option value="medio">Médio</option>
            <option value="alto">Alto</option>
          </select>
        </Field>

        <Field label="Cores" icon={FaPalette}>
          <select value={cores} onChange={(e) => setCores(e.target.value)}>
            <option value="">--Selecione--</option>
            <option value="neutras">Neutras</option>
            <option value="terrosas">Terrosas</option>
            <option value="altocontraste">Alto contraste</option>
          </select>
        </Field>

        <Field label="Ajuste (fit)" icon={FaRulerCombined}>
          <select value={ajuste} onChange={(e) => setAjuste(e.target.value)}>
            <option value="">--Selecione--</option>
            <option value="slim">Slim</option>
            <option value="regular">Regular</option>
            <option value="relax">Relax</option>
          </select>
        </Field>
      </div>

      <div className="acoes">
        <PrimaryButton onClick={recomendar}>Gerar Recomendações</PrimaryButton>
        <button className="btn-ghost" onClick={limpar} title="Limpar filtros">
          <FaBroom /> Limpar
        </button>
        <button
          className="btn-ghost"
          disabled={!resultado.length}
          onClick={copiar}
          title="Copiar dicas"
        >
          <FaClipboard /> {copiado ? "Copiado!" : "Copiar"}
        </button>
      </div>

      {!!resultado.length && (
        <div className="melhorar-resultado" role="status" aria-live="polite">
          <div className="resultado-head">
            <span className="badge">Sugestões</span>
            <div className="tags">
              {estilo && <span className="chip">{estilo}</span>}
              {objetivo && <span className="chip">{objetivo}</span>}
              {evento && <span className="chip">{evento}</span>}
              {clima && <span className="chip">{clima}</span>}
              {orcamento && <span className="chip">R$ {orcamento}</span>}
              {cores && <span className="chip">{cores}</span>}
              {ajuste && <span className="chip">{ajuste}</span>}
            </div>
          </div>

          <ul className="tips-list">
            {resultado.map((dica, i) => (
              <li key={i}>{dica}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
