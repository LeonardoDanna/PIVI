import React, { useState } from "react";

export default function TabTryOn() {
  const [avatarImage, setAvatarImage] = useState(null);
  const [clothingImage, setClothingImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [clothingUrl, setClothingUrl] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = "http://localhost:8000/api/try-on-diffusion/";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResultImage(null);

    try {
      let options = {};

      // 🚨 Verifica se o usuário enviou pelo menos uma opção válida
      const hasFiles = avatarImage || clothingImage;
      const hasUrls = avatarUrl.trim() !== "" && clothingUrl.trim() !== "";

      if (!hasFiles && !hasUrls) {
        setError("Envie arquivos ou URLs válidas para o avatar e a roupa.");
        setLoading(false);
        return;
      }

      if (hasFiles) {
        // 📸 Envio com FormData (upload de imagens)
        const formData = new FormData();
        if (avatarImage) formData.append("avatar_image", avatarImage);
        if (clothingImage) formData.append("clothing_image", clothingImage);

        options = {
          method: "POST",
          body: formData,
        };
      } else {
        // 🌐 Envio com JSON (URLs)
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

      // 🚀 Faz a requisição ao backend Django
      const response = await fetch(backendUrl, options);

      if (!response.ok) {
        let errData;
        try {
          errData = await response.json();
        } catch {
          errData = { error: "Erro inesperado na API." };
        }
        throw new Error(errData.error || "Erro ao processar imagem.");
      }

      // 🧠 Verifica se a resposta é imagem binária ou JSON
      const contentType = response.headers.get("Content-Type") || "";
      console.log("🔍 Tipo de resposta:", contentType);

      if (contentType.includes("image") || contentType.includes("octet-stream")) {
        // ✅ Caso 1: imagem binária
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        console.log("✅ Imagem recebida — tamanho:", blob.size, "bytes");
        setResultImage(imageUrl);
      } else {
        // ✅ Caso 2: API devolveu JSON com link
        try {
          const data = await response.json();
          console.log("🔗 Resposta JSON:", data);
          setResultImage(data.output_url || data.result || null);
        } catch (err) {
          console.error("Erro ao ler JSON:", err);
          setError("Resposta inesperada do servidor.");
        }
      }
    } catch (err) {
      console.error("Erro no Try-On:", err);
      setError(err.message || "Falha ao gerar imagem.");
    } finally {
      setLoading(false);
    }
  }

  // 👇 O return do componente deve ficar fora da função handleSubmit
  return (
    <div>
      <h3>👕 Try-On Virtual</h3>

      <form onSubmit={handleSubmit} className="tryon-form">
        <div className="form-group">
          <label>🧍 Avatar (foto da pessoa)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarImage(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="ou URL do avatar"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>👚 Roupa</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setClothingImage(e.target.files[0])}
          />
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
          <img
            src={resultImage}
            alt="Resultado Try-On"
            className="tryon-result"
            style={{
              maxWidth: "100%",
              borderRadius: "12px",
              marginTop: "15px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            }}
          />
        </div>
      )}
    </div>
  );
}
