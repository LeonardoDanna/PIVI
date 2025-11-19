import React, { useRef, useState } from "react";
import { FaTshirt, FaImage } from "react-icons/fa";

export default function Armario() {
  // carrega com segurança
  const initialWardrobe = (() => {
    try {
      const v = JSON.parse(localStorage.getItem("wardrobe") || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  })();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [wardrobe, setWardrobe] = useState(initialWardrobe);

  const fileRef = useRef(null);
  const backendUrl = "http://127.0.0.1:8000/api/remove-background/";

  const blobToDataURL = (blob) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result); // "data:image/png;base64,...."
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });

  async function handleUpload(e) {
    e.preventDefault();
    if (!image) {
      setError("Escolha uma imagem primeiro!");
      return;
    }

    setLoading(true);
    setError("");
    setResultImage(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const resp = await fetch(backendUrl, { method: "POST", body: formData });
      if (!resp.ok) throw new Error("Falha ao remover fundo.");

      const blob = await resp.blob();
      const dataUrl = await blobToDataURL(blob); // persistente

      setResultImage(dataUrl);

      const updated = [...wardrobe, dataUrl];
      setWardrobe(updated);
      localStorage.setItem("wardrobe", JSON.stringify(updated));

      // limpa input e estado do arquivo
      if (fileRef.current) fileRef.current.value = "";
      setImage(null);
    } catch (err) {
      setError(err.message || "Erro ao processar imagem.");
    } finally {
      setLoading(false);
    }
  }

  // remove item quebrado ou quando desejar ampliar depois
  function removeAt(index) {
    const next = wardrobe.filter((_, i) => i !== index);
    setWardrobe(next);
    localStorage.setItem("wardrobe", JSON.stringify(next));
  }

  return (
    <div className="armario">
      <form onSubmit={handleUpload} className="armario-form">
        <label className="armario-label">
          <FaImage style={{ marginRight: "8px" }} /> Envie a foto da sua roupa:
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Processando..." : "Adicionar ao Guarda-Roupa"}
        </button>
      </form>

      {error && <p className="armario-erro">⚠️ {error}</p>}

      {resultImage && (
        <div className="armario-resultado">
          <h4>Roupa:</h4>
          <img src={resultImage} alt="Roupa processada" />
        </div>
      )}

      <hr className="armario-divisor" />

      <h3 className="armario-titulo">
        <FaTshirt /> Suas roupas salvas
      </h3>

      <div className="armario-grid">
        {wardrobe.length === 0 ? (
          <p className="armario-vazio">Nenhuma roupa adicionada ainda 👕</p>
        ) : (
          wardrobe.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Roupa ${i + 1}`}
              loading="lazy"
              onError={() => removeAt(i)} // limpa entradas inválidas
            />
          ))
        )}
      </div>
    </div>
  );
}
