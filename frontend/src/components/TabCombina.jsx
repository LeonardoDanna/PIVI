import { useState, useMemo, useCallback } from "react";
import { FaPalette } from "react-icons/fa";

/* util único (evita duplicação no Swatch) */
function idealTextColor(hex) {
  const c = (hex || "").replace("#", "");
  if (c.length < 6) return "#111";
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#111" : "#fff";
}

/* normalizador com remoção de acentos */
function normalizar(txt) {
  return (txt || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export default function TabCombina({ Field, PrimaryButton }) {
  const [cor, setCor] = useState("");
  const [resultado, setResultado] = useState(null);

  const colorDB = useMemo(
    () => ({
      preto: { hex: "#000000", combos: ["vinho", "verde musgo", "azul marinho", "bege", "jeans", "cinza"], nota: "Preto é versátil; use para contraste e base minimalista." },
      branco: { hex: "#FFFFFF", combos: ["preto", "jeans", "caqui", "azul claro", "vermelho"], nota: "Realça cores fortes e tons terrosos." },
      vermelho: { hex: "#D7263D", combos: ["preto", "branco", "jeans", "cinza", "bege"], nota: "Use como ponto focal; evite excesso de saturação no resto." },
      azul: { hex: "#1E73BE", combos: ["bege", "marrom", "cinza", "branco", "verde oliva"], nota: "Azul vai bem com neutros e terrosos." },
      "azul marinho": { hex: "#0B2B5B", combos: ["branco", "bege", "caramelo", "cinza", "vinho"], nota: "Elegante como o preto, porém mais leve." },
      "azul petróleo": { hex: "#0F4C5C", combos: ["bege", "off-white", "caramelo", "cinza claro", "terracota"], nota: "Alternativa ao azul marinho, menos óbvia." },
      verde: { hex: "#2E7D32", combos: ["bege", "branco", "marrom", "jeans", "preto"], nota: "Aposte em texturas naturais (algodão/linho)." },
      "verde musgo": { hex: "#3D4D3A", combos: ["preto", "cinza", "bege", "terracota", "mostarda"], nota: "Funciona bem em looks utilitários." },
      bege: { hex: "#D9C3A7", combos: ["azul petróleo", "preto", "branco", "vinho", "verde musgo"], nota: "Evite apagar contraste; traga uma cor de apoio." },
      marrom: { hex: "#6B4F3B", combos: ["azul", "azul marinho", "creme", "off-white", "verde"], nota: "Cria paletas terrosas sofisticadas." },
      cinza: { hex: "#7A7A7A", combos: ["preto", "branco", "azul marinho", "vinho", "verde"], nota: "Neutro coringa; atenção à temperatura." },
      vinho: { hex: "#611427", combos: ["cinza", "preto", "bege", "azul marinho", "off-white"], nota: "Elegante; bom em sobreposições e acessórios." },
      jeans: { hex: "#3A5A7A", combos: ["branco", "preto", "bege", "cinza", "vermelho"], nota: "Base para quase tudo." },
      mostarda: { hex: "#D4A017", combos: ["azul marinho", "cinza", "jeans", "verde musgo"], nota: "Ótimo ponto de cor em looks neutros." },
      terracota: { hex: "#A0492B", combos: ["bege", "off-white", "verde musgo", "azul petróleo"], nota: "Terroso quente que traz profundidade." },
      "off-white": { hex: "#F7F4EE", combos: ["marrom", "bege", "azul marinho", "vinho"], nota: "Mais suave que o branco puro; bom para contraste leve." },
    }),
    []
  );

  const sugestoesRapidas = [
    "preto","branco","azul","azul marinho","azul petróleo","verde","verde musgo",
    "vermelho","bege","marrom","cinza","vinho","jeans"
  ];

  /* mapa de busca: keys normalizadas + aliases */
  const mapaCores = useMemo(() => {
    const map = new Map();
    Object.keys(colorDB).forEach((k) => map.set(normalizar(k), k));
    const aliases = {
      marinho: "azul marinho",
      "azul marinio": "azul marinho",
      "azul petroleo": "azul petróleo",
      "off white": "off-white",
      creme: "off-white",
      caqui: "bege",
    };
    Object.entries(aliases).forEach(([a, real]) => map.set(normalizar(a), real));
    return map;
  }, [colorDB]);

  const resolverCorBase = useCallback(
    (entrada) => {
      const n = normalizar(entrada);
      return mapaCores.get(n) || null;
    },
    [mapaCores]
  );

  const analisar = useCallback(
    (entradaOpcional) => {
      const entrada = (entradaOpcional ?? cor).trim();
      if (!entrada) {
        setResultado({
          titulo: "Digite uma cor",
          nota: "",
          base: null,
          combos: ["preto", "branco", "cinza"],
        });
        return;
      }
      const key = resolverCorBase(entrada);
      if (!key) {
        setResultado({
          titulo: `Não encontrei "${entrada}" na base`,
          nota: "Use neutros + uma peça de destaque.",
          base: null,
          combos: ["preto", "branco", "cinza", "jeans"],
        });
        return;
      }
      const item = colorDB[key];
      setResultado({
        titulo: `Combinações para ${key}`,
        nota: item.nota,
        base: { nome: key, hex: item.hex },
        combos: item.combos,
      });
    },
    [cor, colorDB, resolverCorBase]
  );

  const onSugestaoClick = useCallback(
    (nome) => {
      setCor(nome);
      analisar(nome); // analisa imediatamente com o valor clicado
    },
    [analisar]
  );

  return (
    <div className="tab-combina">
      <Field label="Cor preferida" icon={FaPalette}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Ex.: azul petróleo, verde musgo, preto…"
            value={cor}
            onChange={(e) => setCor(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analisar()}
            list="cores-populares"
            aria-label="Digite a cor base"
          />
          <PrimaryButton onClick={() => analisar()}>Analisar</PrimaryButton>
        </div>
        <datalist id="cores-populares">
          {sugestoesRapidas.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </Field>

      {/* Sugestões rápidas (usa classes do CSS) */}
      <div className="chips">
        {sugestoesRapidas.map((s) => {
          const item = colorDB[s];
          const bg = item?.hex || "#eee";
          const tc = idealTextColor(bg);
          const ativo = normalizar(cor) === normalizar(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => onSugestaoClick(s)}
              className={`chip${ativo ? " active" : ""}`}
              style={{ background: bg, color: tc }}
              title={`Usar ${s}`}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* Resultado */}
      {resultado && (
        <div className="combina-resultado">
          <p className="titulo">{resultado.titulo}</p>
          {resultado.nota && <p className="nota">{resultado.nota}</p>}

          <div className="swatch-wrap">
            <div className="swatch-list">
              {resultado.base && (
                <Swatch
                  nome={resultado.base.nome}
                  hex={resultado.base.hex}
                  destaque
                />
              )}
              {resultado.combos?.map((nome) => {
                const key = resolverCorBase(nome) || nome;
                const item = colorDB[key];
                const hex = item?.hex || "#E5E7EB";
                return <Swatch key={nome} nome={nome} hex={hex} />;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Swatch({ nome, hex, destaque = false }) {
  const text = idealTextColor(hex);
  return (
    <div
      className={`swatch ${destaque ? "swatch-bar" : "swatch-chip"}`}
      style={{
        background: hex,
        color: text,
        borderColor: "var(--border, #e5e7eb)",
      }}
      aria-label={`${nome} (${hex})`}
      title={`${nome} (${hex})`}
    >
      {nome}
    </div>
  );
}
