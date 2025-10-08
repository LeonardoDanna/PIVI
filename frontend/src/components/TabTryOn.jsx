import React, { useState } from "react";

export default function TabTryOn() {
  const [avatarImage, setAvatarImage] = useState(null);
  const [clothingImage, setClothingImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [clothingUrl, setClothingUrl] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = "http://127.0.0.1:8000/api/try-on-diffusion/";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResultImage(null);

    try {
      let formData;
      let options = {};

      if (avatarImage || clothingImage) {
        formData = new FormData();
        if (avatarImage) formData.append("avatar_image", avatarImage);
        if (clothingImage) formData.append("clothing_image", clothingImage);
        options = { method: "POST", body: formData };
      } else {
        const payload = {
          avatar_image_url: avatarUrl,
          clothing_image_url: clothingUrl,
        };
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        };
      }

      const response = await fetch(backendUrl, options);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erro ao processar imagem");
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("image")) {
        const blob = await response.blob();
        setResultImage(URL.createObjectURL(blob));
      } else {
        const data = await response.json();
        setResultImage(data.output_url || data.result || null);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>👕 Try-On Virtual</h3>

      <form onSubmit={handleSubmit} className="tryon-form">
        <div className="form-group">
          <label>🧍 Avatar (foto da pessoa)</label>
          <input type="file" accept="image/*" onChange={(e) => setAvatarImage(e.target.files[0])} />
          <input
            type="text"
            placeholder="ou URL do avatar"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>👚 Roupa</label>
          <input type="file" accept="image/*" onChange={(e) => setClothingImage(e.target.files[0])} />
          <input
            type="text"
            placeholder="ou URL da roupa"
            value={clothingUrl}
            onChange={(e) => setClothingUrl(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Gerando imagem..." : "Testar Try-On"}
        </button>
      </form>

      {error && <p className="error">⚠️ {error}</p>}

      {resultImage && (
        <div className="resultado">
          <h4>🖼️ Resultado</h4>
          <img src={resultImage} alt="Resultado Try-On" className="tryon-result" />
        </div>
      )}
    </div>
  );
}
