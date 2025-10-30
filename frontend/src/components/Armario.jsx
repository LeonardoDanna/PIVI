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
    <div
      className="armario"
      style={{ color: "#fff", paddingBottom: "2rem" }}
    >
      <h2 style={{ color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
        <FaTshirt /> Guarda-Roupa Virtual
      </h2>

      <form onSubmit={handleUpload} className="armario-form" style={{ marginTop: "1.5rem" }}>
        <label style={{ color: "#fff", fontWeight: "600" }}>
          Envie a foto da sua roupa:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ display: "block", marginTop: "0.5rem", marginBottom: "1rem" }}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Processando..." : "Adicionar ao Guarda-Roupa"}
        </button>
      </form>

      {error && (
        <p style={{ color: "#ff8080", marginTop: "1rem" }}>
          ⚠️ {error}
        </p>
      )}

      {resultImage && (
        <div className="resultado" style={{ marginTop: "2rem" }}>
          <h4 style={{ color: "#fff" }}>Roupa sem fundo:</h4>
          <img
            src={resultImage}
            alt="Roupa processada"
            style={{
              maxWidth: "200px",
              borderRadius: "8px",
              border: "1px solid #555",
              marginTop: "0.5rem",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      )}

      <hr style={{ margin: "2rem 0", borderColor: "#444" }} />

      <h3 style={{ color: "#fff" }}>Suas roupas salvas</h3>
      <div
        className="armario-grid"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "1rem",
        }}
      >
        {wardrobe.length === 0 && (
          <p style={{ color: "#ccc" }}>Nenhuma roupa adicionada ainda 👕</p>
        )}
        {wardrobe.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`Roupa ${i + 1}`}
            style={{
              width: "100px",
              height: "auto",
              borderRadius: "8px",
              border: "1px solid #666",
              boxShadow: "0 1px 6px rgba(0,0,0,0.4)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
