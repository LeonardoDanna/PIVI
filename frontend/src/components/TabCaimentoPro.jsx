import React, { useState } from "react";
import { FaRulerCombined, FaWeightHanging, FaTape, FaTshirt } from "react-icons/fa";

/* --- ABA 3: QUAL SERIA O MELHOR CAIMENTO? (MVP) --- */
export default function TabCaimentoPro({ Field, PrimaryButton }) {
  // Inputs (MVP)
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [peito, setPeito] = useState("");
  const [cintura, setCintura] = useState("");
  const [quadril, setQuadril] = useState("");
  const [entrepernas, setEntrepernas] = useState(""); // opcional (calça)
  const [categoria, setCategoria] = useState("camiseta"); // camiseta, camisa, calca, jaqueta, blazer
  const [prefCaimento, setPrefCaimento] = useState(""); // justo, slim, regular, relaxado

  // Output
  const [resultado, setResultado] = useState(null);
  const [erros, setErros] = useState([]);

  const parseNum = (v) => {
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  };

  const validar = () => {
    const a = parseNum(altura);
    const p = parseNum(peso);
    const pt = parseNum(peito);
    const ct = parseNum(cintura);
    const qd = parseNum(quadril);
    const ep = entrepernas ? parseNum(entrepernas) : null;

    const e = [];
    if (!a || a < 140 || a > 230) e.push("Altura deve estar entre 140 e 230 cm.");
    if (!p || p < 35 || p > 250) e.push("Peso deve estar entre 35 e 250 kg.");
    if (!pt || pt < 70 || pt > 140) e.push("Peito deve estar entre 70 e 140 cm.");
    if (!ct || ct < 60 || ct > 140) e.push("Cintura deve estar entre 60 e 140 cm.");
    if (!qd || qd < 70 || qd > 150) e.push("Quadril deve estar entre 70 e 150 cm.");
    if (categoria === "calca" && ep !== null && (ep < 65 || ep > 100))
      e.push("Entrepernas (inseam) esperado entre 65 e 100 cm.");
    setErros(e);
    return e.length === 0;
  };

  // Tamanho estimado (grade genérica BR para tops)
  const estimarTamanhoTop = (peitoCm) => {
    if (peitoCm <= 92) return "P";
    if (peitoCm <= 100) return "M";
    if (peitoCm <= 108) return "G";
    if (peitoCm <= 116) return "GG";
    return "XG";
  };

  // Tamanho estimado (calça genérica BR masculina por cintura)
  const estimarTamanhoCalca = (cinturaCm) => {
    // aproximação simples para numeração: 38~72-76, 40~76-80, 42~80-84, 44~84-88, 46~88-92, 48~92-96...
    if (cinturaCm < 76) return "38";
    if (cinturaCm < 80) return "40";
    if (cinturaCm < 84) return "42";
    if (cinturaCm < 88) return "44";
    if (cinturaCm < 92) return "46";
    if (cinturaCm < 96) return "48";
    if (cinturaCm < 100) return "50";
    return "52+";
  };

  // Folga recomendada por fit (tops)
  const easeTopByFit = (fit) => {
    switch (fit) {
      case "justo":
        return { torax: "0–2 cm", ombro: "0 cm", manga: "0–1 cm" };
      case "slim":
        return { torax: "2–4 cm", ombro: "0–0,5 cm", manga: "1–2 cm" };
      case "regular":
        return { torax: "4–8 cm", ombro: "0,5–1 cm", manga: "2–3 cm" };
      case "relaxado":
        return { torax: "8–12 cm", ombro: "1–1,5 cm", manga: "3–4 cm" };
      default:
        return { torax: "3–5 cm", ombro: "0–1 cm", manga: "1–2 cm" };
    }
  };

  // Fit base sugerido a partir de proporções e preferência
  const sugerirFitBase = ({ altura, peito, cintura, quadril, pref }) => {
    // Índices simples
    const relToraxCint = peito / cintura; // >1 sugere tronco em V
    const relQuadrilCint = quadril / cintura;

    let base = "regular";
    if (relToraxCint >= 1.1) base = "slim";
    if (relQuadrilCint >= 1.1) base = "regular";
    if (altura >= 183) base = "regular"; // peças um pouco mais soltas equilibram estatura

    // Preferência do usuário sobrepõe levemente
    if (pref) {
      const ordem = ["justo", "slim", "regular", "relaxado"];
      const clamp = (i) => Math.max(0, Math.min(ordem.length - 1, i));
      const iBase = ordem.indexOf(base);
      const iPref = ordem.indexOf(pref);
      if (iPref !== -1) {
        // média ponderada simples
        base = ordem[clamp(Math.round((iBase * 2 + iPref * 3) / 5))];
      }
    }
    return base;
  };

  // Comprimentos e detalhes
  const detalhesPorCategoria = ({ categoria, altura, peito, cintura, quadril, entrepernas, fit }) => {
    const out = { pontos: [], tamanhos: {} };

    if (categoria === "camiseta" || categoria === "camisa" || categoria === "jaqueta" || categoria === "blazer") {
      // Comprimento total aproximado
      const comprimento = Math.round(altura * 0.42); // cobre metade do zíper/gancho
      // Manga aproximada
      const manga = Math.round(altura * 0.25);

      out.pontos.push(`Comprimento total ~ ${comprimento} cm.`);
      out.pontos.push(`Comprimento de manga ~ ${manga} cm.`);
      const ease = easeTopByFit(fit);
      out.pontos.push(`Folga no tórax: ${ease.torax}; ombros: ${ease.ombro}; mangas: ${ease.manga}.`);

      // Modelagem
      if (fit === "slim") out.pontos.push("Modelagem levemente acinturada.");
      if (fit === "regular") out.pontos.push("Corte reto, confortável para uso diário.");
      if (fit === "relaxado") out.pontos.push("Queda de ombro discreta e volume controlado.");

      // Tamanho estimado
      out.tamanhos.sugerido = estimarTamanhoTop(peito);
    }

    if (categoria === "calca") {
      // Inseam (entrepernas): se não fornecido, estima por altura
      const inseam = entrepernas
        ? Math.round(entrepernas)
        : Math.round(altura * 0.45); // aproximação
      // Abertura de barra por fit
      const aberturaBarra =
        fit === "justo" || fit === "slim" ? "16–18 cm" : fit === "regular" ? "18–20 cm" : "20–22 cm";

      // Stretch recomendado
      const stretch =
        (quadril - cintura) > 8 ? "2–3% elastano (melhor mobilidade no quadril)" : "1–2% elastano ou tecido rígido";

      // Rise (altura de gancho)
      const rise = cintura < quadril ? "médio/alto" : "médio";

      out.pontos.push(`Inseam (entrepernas) ~ ${inseam} cm.`);
      out.pontos.push(`Abertura de barra recomendada: ${aberturaBarra}.`);
      out.pontos.push(`Altura de gancho: ${rise}.`);
      out.pontos.push(`Tecido: ${stretch}.`);
      if (fit === "slim") out.pontos.push("Perna levemente afunilada (taper).");
      if (fit === "regular") out.pontos.push("Perna reta do joelho à barra.");
      if (fit === "relaxado") out.pontos.push("Volume extra na coxa, afunilando pouco.");

      out.tamanhos.sugerido = estimarTamanhoCalca(cintura);
    }

    return out;
  };

  const calcular = () => {
    if (!validar()) {
      setResultado(null);
      return;
    }

    const a = parseNum(altura);
    const p = parseNum(peso);
    const pt = parseNum(peito);
    const ct = parseNum(cintura);
    const qd = parseNum(quadril);
    const ep = entrepernas ? parseNum(entrepernas) : null;

    // Fit base
    const fit = sugerirFitBase({
      altura: a,
      peito: pt,
      cintura: ct,
      quadril: qd,
      pref: prefCaimento || null,
    });

    const det = detalhesPorCategoria({
      categoria,
      altura: a,
      peito: pt,
      cintura: ct,
      quadril: qd,
      entrepernas: ep,
      fit,
    });

    // Confiança simples: sobe com mais dados (entrepernas para calça, preferência definida)
    let confianca = 0.6;
    if (categoria === "calca" && ep) confianca += 0.15;
    if (prefCaimento) confianca += 0.1;
    confianca = Math.min(0.95, confianca);

    setResultado({
      categoria,
      fitRecomendado: fit,
      folgasPrincipais: categoria === "calca" ? "Ajuste por perna; foco em coxa/quadril" : easeTopByFit(fit).torax,
      detalhes: det.pontos,
      tamanhoSugerido: det.tamanhos.sugerido,
      confianca,
      alertas: gerarAlertas({ categoria, peito: pt, cintura: ct, quadril: qd }),
    });
  };

  const gerarAlertas = ({ categoria, peito, cintura, quadril }) => {
    const alerts = [];
    if (categoria !== "calca" && peito / cintura > 1.15) {
      alerts.push("Atenção a repuxo no peito: considere 1 nível acima de folga.");
    }
    if (categoria === "calca" && quadril / cintura > 1.12) {
      alerts.push("Quadril proeminente: priorize tecidos com elastano ou modelagem comfort.");
    }
    if (categoria === "calca" && cintura / quadril > 0.98) {
      alerts.push("Cintura reta: ajuste de barra pode melhorar a queda da calça.");
    }
    return alerts;
  };

  return (
    <div className="tab-caimento">
      <div className="grid" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <Field label="Altura (cm)" icon={FaRulerCombined}>
          <input
            type="number"
            min="140"
            max="230"
            placeholder="Ex.: 175"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
          />
        </Field>
        <Field label="Peso (kg)" icon={FaWeightHanging}>
          <input
            type="number"
            min="35"
            max="250"
            step="0.1"
            placeholder="Ex.: 72"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
          />
        </Field>
        <Field label="Peito/Tórax (cm)" icon={FaTape} hint="Meça na altura do mamilo, fita paralela ao chão.">
          <input
            type="number"
            min="70"
            max="140"
            placeholder="Ex.: 98"
            value={peito}
            onChange={(e) => setPeito(e.target.value)}
          />
        </Field>
        <Field label="Cintura (cm)" icon={FaTape} hint="Ponto mais estreito do tronco.">
          <input
            type="number"
            min="60"
            max="140"
            placeholder="Ex.: 82"
            value={cintura}
            onChange={(e) => setCintura(e.target.value)}
          />
        </Field>
        <Field label="Quadril (cm)" icon={FaTape} hint="Ponto mais largo dos glúteos.">
          <input
            type="number"
            min="70"
            max="150"
            placeholder="Ex.: 98"
            value={quadril}
            onChange={(e) => setQuadril(e.target.value)}
          />
        </Field>

        <Field label="Categoria" icon={FaTshirt}>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="camiseta">Camiseta</option>
            <option value="camisa">Camisa</option>
            <option value="jaqueta">Jaqueta</option>
            <option value="blazer">Blazer</option>
            <option value="calca">Calça</option>
          </select>
        </Field>

        {categoria === "calca" && (
          <Field label="Entrepernas / Inseam (cm) — opcional" icon={FaTape} hint="Do gancho até a barra.">
            <input
              type="number"
              min="65"
              max="100"
              placeholder="Ex.: 80"
              value={entrepernas}
              onChange={(e) => setEntrepernas(e.target.value)}
            />
          </Field>
        )}

        <Field label="Preferência de caimento (opcional)">
          <select value={prefCaimento} onChange={(e) => setPrefCaimento(e.target.value)}>
            <option value="">—</option>
            <option value="justo">Justo</option>
            <option value="slim">Slim</option>
            <option value="regular">Regular</option>
            <option value="relaxado">Relaxado/Oversized</option>
          </select>
        </Field>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <PrimaryButton onClick={calcular}>Analisar caimento</PrimaryButton>
      </div>

      {erros.length > 0 && (
        <ul className="erros" style={{ marginTop: 10, color: "#c0392b" }}>
          {erros.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}

      {resultado && (
        <div className="resultado" style={{ marginTop: 16 }}>
          <p>
            <strong>Caimento recomendado:</strong> {resultado.fitRecomendado}
          </p>
          <p>
            <strong>Tamanho sugerido:</strong> {resultado.tamanhoSugerido}
          </p>
          <p>
            <strong>Folga principal:</strong> {resultado.folgasPrincipais}
          </p>
          <p>
            <strong>Confiança:</strong> {(resultado.confianca * 100).toFixed(0)}%
          </p>
          {resultado.alertas?.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <strong>Alertas:</strong>
              <ul>
                {resultado.alertas.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
          {resultado.detalhes?.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <strong>Detalhes por categoria:</strong>
              <ul>
                {resultado.detalhes.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* Observações de integração:
   - Mantém o padrão de <Field> e <PrimaryButton>.
   - As regras são heurísticas (MVP) e fáceis de trocar por um serviço/algoritmo depois.
   - Campos com validação e faixas plausíveis para reduzir ruído nas medidas.
*/
