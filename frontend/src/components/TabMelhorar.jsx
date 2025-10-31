import { useState } from "react";
import { FaStar } from "react-icons/fa"; // ✅ ícone correto

export default function TabMelhorar({ Field, PrimaryButton }) {
  const [estilo, setEstilo] = useState("");
  const [resultado, setResultado] = useState("");

  const recomendar = () => {
    if (!estilo)
      return setResultado("Selecione um estilo para receber recomendações.");
    if (estilo === "casual")
      setResultado("Inclua jaqueta jeans e tênis brancos para elevar o casual.");
    if (estilo === "formal")
      setResultado("Gravatas texturizadas e alfaiataria ajustada dão modernidade.");
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
