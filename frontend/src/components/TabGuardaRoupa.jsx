import React, { useState } from "react";
import { FaTshirt } from "react-icons/fa";

export default function Armario() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [wardrobe, setWardrobe] = useState(
    JSON.parse(localStorage.getItem("wardrobe") || "[]")
  );

  const backendUrl = "http://127.0.0.1:8000/api/remove-background/";

  async function handleUpload(e) {
    e.preventDefault();
    if (!image) return setError("Escolha uma imagem primeiro!");
    setLoading(true);
    setError("");
    setResultImage(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const resp = await fetch(backendUrl, {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) throw new Error("Falha ao remover fundo.");

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      setResultImage(url);

      const updated = [...wardrobe, url];
      setWardrobe(updated);
      localStorage.setItem("wardrobe", JSON.stringify(updated));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="armario">
      <form onSubmit={handleUpload} className="armario-form">
        <label className="armario-label">Envie a foto da sua roupa:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Processando..." : "Adicionar ao Guarda-Roupa"}
        </button>
      </form>

      {error && <p className="armario-erro">⚠️ {error}</p>}

      {resultImage && (
        <div className="armario-resultado">
          <h4>Roupa sem fundo:</h4>
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
            <img key={i} src={url} alt={`Roupa ${i + 1}`} />
          ))
        )}
      </div>
    </div>
  );
}
