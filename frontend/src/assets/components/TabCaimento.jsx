import React, { useState } from "react";
import { FaRulerCombined, FaWeightHanging, FaTape, FaTshirt } from "react-icons/fa";

export default function TabCaimentoPro({ Field, PrimaryButton }) {
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [peito, setPeito] = useState("");
  const [cintura, setCintura] = useState("");
  const [quadril, setQuadril] = useState("");
  const [entrepernas, setEntrepernas] = useState("");
  const [categoria, setCategoria] = useState("camiseta");
  const [prefCaimento, setPrefCaimento] = useState("");

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

  const estimarTamanhoTop = (peitoCm) => {
    if (peitoCm <= 92) return "P";
    if (peitoCm <= 100) return "M";
    if (peitoCm <= 108) return "G";
    if (peitoCm <= 116) return "GG";
    return "XG";
  };

  const estimarTamanhoCalca = (cinturaCm) => {
    if (cinturaCm < 76) return "38";
    if (cinturaCm < 80) return "40";
    if (cinturaCm < 84) return "42";
    if (cinturaCm < 88) return "44";
    if (cinturaCm < 92) return "46";
    if (cinturaCm < 96) return "48";
    if (cinturaCm < 100) return "50";
    return "52+";
  };

  const easeTopByFit = (fit) => {
    switch (fit) {
      case "justo": return { torax: "0–2 cm", ombro: "0 cm", manga: "0–1 cm" };
      case "slim": return { torax: "2–4 cm", ombro: "0–0,5 cm", manga: "1–2 cm" };
      case "regular": return { torax: "4–8 cm", ombro: "0,5–1 cm", manga: "2–3 cm" };
      case "relaxado": return { torax: "8–12 cm", ombro: "1–1,5 cm", manga: "3–4 cm" };
      default: return { torax: "3–5 cm", ombro: "0–1 cm", manga: "1–2 cm" };
    }
  };

  const sugerirFitBase = ({ altura, peito, cintura, quadril, pref }) => {
    const relToraxCint = peito / cintura;
    const relQuadrilCint = quadril / cintura;

    let base = "regular";
    if (relToraxCint >= 1.1) base = "slim";
    if (relQuadrilCint >= 1.1) base = "regular";
    if (altura >= 183) base = "regular";

    if (pref) {
      const ordem = ["justo", "slim", "regular", "relaxado"];
      const clamp = (i) => Math.max(0, Math.min(ordem.length - 1, i));
      const iBase = ordem.indexOf(base);
      const iPref = ordem.indexOf(pref);
      if (iPref !== -1) base = ordem[clamp(Math.round((iBase * 2 + iPref * 3) / 5))];
    }
    return base;
  };

  const detalhesPorCategoria = ({ categoria, altura, peito, cintura, quadril, entrepernas, fit }) => {
    const out = { pontos: [], tamanhos: {} };

    if (["camiseta", "camisa", "jaqueta", "blazer"].includes(categoria)) {
      const comprimento = Math.round(altura * 0.42);
      const manga = Math.round(altura * 0.25);
      const ease = easeTopByFit(fit);

      out.pontos.push(`Comprimento total ~ ${comprimento} cm.`);
      out.pontos.push(`Comprimento de manga ~ ${manga} cm.`);
      out.pontos.push(`Folga no tórax: ${ease.torax}; ombros: ${ease.ombro}; mangas: ${ease.manga}.`);
      if (fit === "slim") out.pontos.push("Modelagem levemente acinturada.");
      if (fit === "regular") out.pontos.push("Corte reto, confortável para uso diário.");
      if (fit === "relaxado") out.pontos.push("Queda de ombro discreta e volume controlado.");
      out.tamanhos.sugerido = estimarTamanhoTop(peito);
    }

    if (categoria === "calca") {
      const inseam = entrepernas ? Math.round(entrepernas) : Math.round(altura * 0.45);
      const aberturaBarra =
        fit === "justo" || fit === "slim" ? "16–18 cm" : fit === "regular" ? "18–20 cm" : "20–22 cm";
      const stretch =
        quadril - cintura > 8 ? "2–3% elastano" : "1–2% elastano ou tecido rígido";
      const rise = cintura < quadril ? "médio/alto" : "médio";

      out.pontos.push(`Inseam (entrepernas) ~ ${inseam} cm.`);
      out.pontos.push(`Abertura de barra: ${aberturaBarra}.`);
      out.pontos.push(`Altura de gancho: ${rise}.`);
      out.pontos.push(`Tecido: ${stretch}.`);
      if (fit === "slim") out.pontos.push("Perna levemente afunilada (taper).");
      if (fit === "regular") out.pontos.push("Perna reta do joelho à barra.");
      if (fit === "relaxado") out.pontos.push("Volume extra na coxa.");
      out.tamanhos.sugerido = estimarTamanhoCalca(cintura);
    }

    return out;
  };

  const gerarAlertas = ({ categoria, peito, cintura, quadril }) => {
    const alerts = [];
    if (categoria !== "calca" && peito / cintura > 1.15)
      alerts.push("Possível repuxo no peito — considere um número acima.");
    if (categoria === "calca" && quadril / cintura > 1.12)
      alerts.push("Quadril proeminente — priorize tecidos com elastano.");
    if (categoria === "calca" && cintura / quadril > 0.98)
      alerts.push("Cintura reta — ajuste de barra pode melhorar o caimento.");
    return alerts;
  };

  const calcular = () => {
    if (!validar()) {
      setResultado(null);
      return;
    }

    const a = parseNum(altura);
    const pt = parseNum(peito);
    const ct = parseNum(cintura);
    const qd = parseNum(quadril);
    const ep = entrepernas ? parseNum(entrepernas) : null;

    const fit = sugerirFitBase({ altura: a, peito: pt, cintura: ct, quadril: qd, pref: prefCaimento });
    const det = detalhesPorCategoria({ categoria, altura: a, peito: pt, cintura: ct, quadril: qd, entrepernas: ep, fit });

    let confianca = 0.6;
    if (categoria === "calca" && ep) confianca += 0.15;
    if (prefCaimento) confianca += 0.1;
    confianca = Math.min(0.95, confianca);

    setResultado({
      categoria,
      fitRecomendado: fit,
      folgasPrincipais: categoria === "calca" ? "Ajuste por perna" : easeTopByFit(fit).torax,
      detalhes: det.pontos,
      tamanhoSugerido: det.tamanhos.sugerido,
      confianca,
      alertas: gerarAlertas({ categoria, peito: pt, cintura: ct, quadril: qd }),
    });
  };

  return (
    <div className="tab-caimento">
      <div className="caimento-grid">
        <Field label="Altura (cm)" icon={FaRulerCombined}>
          <input type="number" placeholder="Ex.: 175" value={altura} onChange={(e) => setAltura(e.target.value)} />
        </Field>

        <Field label="Peso (kg)" icon={FaWeightHanging}>
          <input type="number" placeholder="Ex.: 72" value={peso} onChange={(e) => setPeso(e.target.value)} />
        </Field>

        <Field label="Peito/Tórax (cm)" icon={FaTape}>
          <input type="number" placeholder="Ex.: 98" value={peito} onChange={(e) => setPeito(e.target.value)} />
        </Field>

        <Field label="Cintura (cm)" icon={FaTape}>
          <input type="number" placeholder="Ex.: 82" value={cintura} onChange={(e) => setCintura(e.target.value)} />
        </Field>

        <Field label="Quadril (cm)" icon={FaTape}>
          <input type="number" placeholder="Ex.: 98" value={quadril} onChange={(e) => setQuadril(e.target.value)} />
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
          <Field label="Entrepernas (cm)" icon={FaTape}>
            <input type="number" placeholder="Ex.: 80" value={entrepernas} onChange={(e) => setEntrepernas(e.target.value)} />
          </Field>
        )}

        <Field label="Preferência de caimento" icon={FaRulerCombined}>
          <select
            value={prefCaimento}
            onChange={(e) => setPrefCaimento(e.target.value)}
          >
            <option value="">—</option>
            <option value="justo">Justo</option>
            <option value="slim">Slim</option>
            <option value="regular">Regular</option>
            <option value="relaxado">Relaxado</option>
          </select>
        </Field>
      </div>

      <div className="caimento-actions">
        <PrimaryButton onClick={calcular}>Analisar caimento</PrimaryButton>
      </div>

      {erros.length > 0 && (
        <ul className="caimento-erros">
          {erros.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}

      {resultado && (
        <div className="caimento-resultado">
          <p><strong>Caimento recomendado:</strong> {resultado.fitRecomendado}</p>
          <p><strong>Tamanho sugerido:</strong> {resultado.tamanhoSugerido}</p>
          <p><strong>Folga principal:</strong> {resultado.folgasPrincipais}</p>
          <p><strong>Confiança:</strong> {(resultado.confianca * 100).toFixed(0)}%</p>

          {resultado.alertas?.length > 0 && (
            <div className="caimento-alertas">
              <strong>Alertas:</strong>
              <ul>{resultado.alertas.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </div>
          )}

          {resultado.detalhes?.length > 0 && (
            <div className="caimento-detalhes">
              <strong>Detalhes:</strong>
              <ul>{resultado.detalhes.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
