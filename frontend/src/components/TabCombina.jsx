import { useState } from "react";
import { FaPalette } from "react-icons/fa";

/* --- ABA 2: O QUE COMBINA COMIGO? --- */
export default function TabCombina({ Field, PrimaryButton }) {
  const [cor, setCor] = useState("");
  const [resultado, setResultado] = useState("");

  const analisar = () => {
    const c = cor.trim().toLowerCase();
    if (!c) return setResultado("Digite uma cor para analisar.");

    if (c === "bege") {
      setResultado("Evite bege. Aposte em azul petróleo!");
    } else if (c === "preto") {
      setResultado("Preto é versátil; experimente verde musgo ou vinho.");
    } else if (c === "vermelho") {
      setResultado("O vermelho combina bem com branco, preto ou jeans.");
    } else if (c === "azul") {
      setResultado("Azul vai bem com tons neutros e terrosos.");
    } else if (c === "verde") {
      setResultado("Verde combina com bege, branco e tons de marrom.");
    } else {
      setResultado(
        "Essa cor pode funcionar com tons neutros (preto, branco, cinza)."
      );
    }
  };

  return (
    <div className="tab-combina">
      <Field label="Cor preferida" icon={FaPalette}>
        <input
          type="text"
          placeholder="Ex.: azul, bege, preto…"
          value={cor}
          onChange={(e) => setCor(e.target.value)}
        />
      </Field>

      <PrimaryButton onClick={analisar}>Analisar</PrimaryButton>

      {resultado && <p className="combina-resultado">{resultado}</p>}
    </div>
  );
}
