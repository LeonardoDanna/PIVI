import React, { useState, useRef, useEffect } from "react";
import { FaTshirt, FaUserAlt, FaImage } from "react-icons/fa"; // 👈 novos ícones

export default function TryOnForm({ backendUrl }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [clothingImage, setClothingImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [clothingUrl, setClothingUrl] = useState("");

  // Controlador global de requisições
  const controllerRef = useRef(null);

  // Cancela requisições pendentes ao desmontar o componente
  useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResultImage(null);

    try {
      let options = {};

      const hasFiles = avatarImage || clothingImage;
      const hasUrls = avatarUrl.trim() !== "" && clothingUrl.trim() !== "";

      if (!hasFiles && !hasUrls) {
        setError("Envie arquivos ou URLs válidas para o avatar e a roupa.");
        setLoading(false);
        return;
      }

      if (hasFiles) {
        const formData = new FormData();
        if (avatarImage) formData.append("avatar_image", avatarImage);
        if (clothingImage) formData.append("clothing_image", clothingImage);

        options = {
          method: "POST",
          body: formData,
        };
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

      // 🚀 Controlador para abortar requisições antigas
      controllerRef.current = new AbortController();
      options.signal = controllerRef.current.signal;

      // ⏱ Timeout de 90s para evitar travas
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tempo limite excedido.")), 90000)
      );

      // Faz a requisição aguardando até o final
      const response = await Promise.race([
        fetch(backendUrl, options),
        timeout,
      ]);

      if (!response.ok) {
        let errData;
        try {
          errData = await response.json();
        } catch {
          errData = { error: "Erro inesperado na API." };
        }
        throw new Error(errData.error || "Erro ao processar imagem.");
      }

      const contentType = response.headers.get("Content-Type") || "";
      console.log("🔍 Tipo de resposta:", contentType);

      if (
        contentType.includes("image") ||
        contentType.includes("octet-stream")
      ) {
        const blob = await response.blob();
        await blob.arrayBuffer(); // 🔒 garante leitura completa
        const imageUrl = URL.createObjectURL(blob);
        console.log("✅ Imagem recebida — tamanho:", blob.size, "bytes");
        setResultImage(imageUrl);
      } else {
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
      if (err.name === "AbortError") {
        console.warn("🔕 Requisição cancelada.");
      } else {
        console.error("Erro no Try-On:", err);
        setError(err.message || "Falha ao gerar imagem.");
      }
    } finally {
      setLoading(false);
    }
  }

  // 👇 O return do componente deve ficar fora da função handleSubmit
  return (
    <div style={{ color: "#fff" }}>
      <h3 style={{ textAlign: "center", color: "#fff", marginBottom: "1.5rem" }}>
        <FaTshirt style={{ marginRight: "8px" }} />
        Try-On Virtual
      </h3>

      <form onSubmit={handleSubmit} className="tryon-form">
        <div className="form-group" style={{ marginBottom: "2rem" }}>
          <label style={{ color: "#fff", fontWeight: "600" }}>
            <FaUserAlt style={{ marginRight: "6px" }} /> Avatar (sua foto)
          </label>
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

        <div className="form-group" style={{ marginBottom: "2rem" }}>
          <label style={{ color: "#fff", fontWeight: "600" }}>
            <FaTshirt style={{ marginRight: "6px" }} /> Roupa
          </label>
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
        <div className="resultado" style={{ marginTop: "1.5rem" }}>
          <h4 style={{ color: "#fff" }}>
            <FaImage style={{ marginRight: "6px" }} /> Resultado
          </h4>
          <img
            src={resultImage}
            alt="Resultado Try-On"
            className="tryon-result"
            style={{
              maxWidth: "100%",
              borderRadius: "12px",
              marginTop: "15px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      )}
    </div>
  );
}
