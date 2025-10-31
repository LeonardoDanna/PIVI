import React, { useState } from "react";
import { FaUser, FaSun, FaUserFriends } from "react-icons/fa"; // ✅ importe os ícones

/* --- ABA 1: COMO POSSO ME VESTIR HOJE? --- */
export default function TabVestir({ Field, PrimaryButton }) {  // ✅ receba por props
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
