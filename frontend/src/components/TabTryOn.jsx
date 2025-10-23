import React, { useState, useRef, useEffect } from "react";

export default function TryOnForm({ backendUrl }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [clothingImage, setClothingImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [clothingUrl, setClothingUrl] = useState("");
  const [quality, setQuality] = useState("standard");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("idle");
  const [clothingType, setClothingType] = useState("generic"); // 👕 novo estado

  const controllerRef = useRef(null);

  // 🔤 Prompts específicos por tipo de roupa
  const PROMPTS_BY_TYPE = {
    generic:
      "ultra realistic fashion photo, detailed fabric texture, studio lighting, soft realistic wrinkles",
    shirt:
      "realistic photo of a t-shirt or blouse, upper body clothing only, visible sleeves and collar, fits naturally on torso, professional fashion photo",
    pants:
      "realistic photo of pants or jeans, bottom clothing only, fitted at waist and legs, clear separation from torso, realistic fabric folds",
    shorts:
      "realistic photo of shorts, bottom clothing only, above knees, clear waistline, realistic shadows and texture",
    jacket:
      "realistic photo of a jacket, worn over shirt, visible sleeves and zipper/buttons, fabric thickness visible",
    dress:
      "realistic photo of a dress, full body garment, smooth fabric transition from top to bottom, professional studio lighting",
    skirt:
      "realistic photo of a skirt, worn at waist, fabric ending around thighs, clear separation from upper body, soft natural folds",
  };

  useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);

  async function removeBackground(file) {
    setStage("removing");
    setProgress(20);

    const formData = new FormData();
    formData.append("image", file);

    const resp = await fetch(
      backendUrl.replace("try-on-diffusion", "remove-background"),
      { method: "POST", body: formData }
    );

    if (!resp.ok) throw new Error("Falha ao remover fundo da roupa.");
    const blob = await resp.blob();
    const cleanedFile = new File([blob], file.name, { type: "image/png" });
    console.log("✅ Fundo removido:", cleanedFile);
    return cleanedFile;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResultImage(null);
    setProgress(10);
    setStage("generating");

    try {
      let options = {};
      const hasFiles = avatarImage || clothingImage;
      const hasUrls = avatarUrl.trim() !== "" && clothingUrl.trim() !== "";

      if (!hasFiles && !hasUrls) {
        setError("Envie arquivos ou URLs válidas para o avatar e a roupa.");
        setLoading(false);
        return;
      }

      // 🧠 Seleciona prompt com base no tipo escolhido
      const clothingPrompt =
        PROMPTS_BY_TYPE[clothingType] || PROMPTS_BY_TYPE.generic;

      if (hasFiles) {
        const formData = new FormData();

        if (avatarImage) formData.append("avatar_image", avatarImage);

        let finalClothingFile = clothingImage;
        if (clothingImage) {
          setStage("removing");
          finalClothingFile = await removeBackground(clothingImage);
        }

        if (finalClothingFile)
          formData.append("clothing_image", finalClothingFile);

        // 🪄 inclui o prompt no FormData
        formData.append("clothing_prompt", clothingPrompt);
        formData.append("quality", quality);

        options = { method: "POST", body: formData };
      } else {
        const payload = {
          avatar_image_url: avatarUrl,
          clothing_image_url: clothingUrl,
          clothing_prompt: clothingPrompt, // 🪄 inclui prompt no JSON
          quality,
        };
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        };
      }

      controllerRef.current = new AbortController();
      options.signal = controllerRef.current.signal;
      setProgress(50);

      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tempo limite excedido.")), 120000)
      );

      const response = await Promise.race([
        fetch(backendUrl, options),
        timeout,
      ]);

      setStage("generating");
      setProgress(80);

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
        const imageUrl = URL.createObjectURL(blob);
        console.log("✅ Imagem recebida — tamanho:", blob.size, "bytes");
        setResultImage(imageUrl);
      } else {
        const data = await response.json();
        console.log("🔗 Resposta JSON:", data);
        setResultImage(data.output_url || data.result || null);
      }

      setProgress(100);
    } catch (err) {
      if (err.name === "AbortError") {
        console.warn("🔕 Requisição cancelada.");
      } else {
        console.error("Erro no Try-On:", err);
        setError(err.message || "Falha ao gerar imagem.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1500);
      setStage("idle");
    }
  }

  return (
    <div>
      <h3>👕 Try-On Virtual</h3>

      <form onSubmit={handleSubmit} className="tryon-form">
        {/* Avatar */}
        <div className="form-group">
          <label>🧍 Avatar (foto da pessoa)</label>
          <input
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={(e) => setAvatarImage(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="ou URL do avatar"
            value={avatarUrl}
            disabled={loading}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </div>

        {/* Roupa */}
        <div className="form-group">
          <label>👚 Roupa</label>
          <input
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={(e) => setClothingImage(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="ou URL da roupa"
            value={clothingUrl}
            disabled={loading}
            onChange={(e) => setClothingUrl(e.target.value)}
          />
        </div>

        {/* Tipo da roupa */}
        <div className="form-group">
          <label>👗 Tipo da Roupa</label>
          <select
            value={clothingType}
            onChange={(e) => setClothingType(e.target.value)}
            disabled={loading}
          >
            <option value="generic">Genérico</option>
            <option value="shirt">Camisa / Blusa</option>
            <option value="pants">Calça</option>
            <option value="shorts">Shorts</option>
            <option value="jacket">Jaqueta / Casaco</option>
            <option value="dress">Vestido</option>
            <option value="skirt">Saia</option>
          </select>
        </div>

        {/* Qualidade */}
        <div className="form-group">
          <label>⚙️ Qualidade da Geração</label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            disabled={loading}
          >
            <option value="standard">Padrão (rápido)</option>
            <option value="high">Alta (detalhada)</option>
            <option value="ultra">Ultra (máxima qualidade)</option>
          </select>
        </div>

        {/* Botão */}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading
            ? stage === "removing"
              ? "Removendo fundo da roupa..."
              : "Gerando imagem..."
            : "Testar Try-On"}
        </button>
      </form>

      {/* Barra de progresso */}
      {loading && (
        <div
          style={{
            width: "100%",
            height: "8px",
            background: "#eee",
            borderRadius: "4px",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#007bff",
              borderRadius: "4px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      )}

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
