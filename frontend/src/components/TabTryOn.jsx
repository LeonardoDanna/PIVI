import React, { useState, useRef, useEffect } from "react";
import { FaTshirt, FaUserAlt, FaImage } from "react-icons/fa";

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
  const [clothingType, setClothingType] = useState("generic");

  const controllerRef = useRef(null);

  const PROMPTS_BY_TYPE = {
    generic: `
      apply the clothing naturally on the person in the input photo,
      keep the person's original face, body, pose, lighting and background unchanged,
      only replace the clothing region realistically, high detail and photorealism.
    `,
  shirt: `
      make the person wear the provided shirt or blouse naturally,
      preserve the original face, body shape, pose, lighting and background exactly,
      only modify the upper body clothing region, realistic fabric folds and texture.
    `,
    pants: `
      make the person wear the provided pants naturally on the lower body,
      preserve the original face, skin, pose, lighting and background without change,
      only modify the waist-to-feet region for the pants, realistic texture, shadows and folds.
    `,
    shorts: `
      make the person wear the provided shorts realistically,
      preserve the original face, pose, lighting and background exactly,
      only modify the lower body region to show shorts, photorealistic texture.
    `,
    jacket: `
      make the person wear the provided jacket over existing clothes naturally,
      preserve the original face, pose, lighting and background without change,
      only modify torso and arms, realistic jacket fabric and lighting.
    `,
    dress: `
      make the person wear the provided dress naturally,
      preserve the original face, pose, lighting and background identical,
      modify only the clothing region, realistic full-body garment fit.
    `,
    skirt: `
      make the person wear the provided skirt realistically,
      preserve the original face, pose, lighting and background,
      modify only the lower torso region, realistic skirt folds and shadows.
    `,
  };

  const NEGATIVE_PROMPT = `
    face changes, different person, distorted body, altered lighting,
    background change, unrealistic proportions, double limbs,
    blur, low quality, artifacts, bad anatomy, fake face
  `;

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
    if (!resp.ok) throw new Error("Failed to remove background.");
    const blob = await resp.blob();
    return new File([blob], file.name, { type: "image/png" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResultImage(null);
    setProgress(10);
    setStage("generating");

    try {
      const hasFiles = avatarImage || clothingImage;
      const hasUrls = avatarUrl.trim() !== "" && clothingUrl.trim() !== "";

      if (!hasFiles && !hasUrls) {
        setError("Please upload valid files or URLs for both avatar and clothing.");
        setLoading(false);
        return;
      }

      const clothingPrompt = PROMPTS_BY_TYPE[clothingType] || PROMPTS_BY_TYPE.generic;

      let options = {};
      controllerRef.current = new AbortController();
      const signal = controllerRef.current.signal;

      if (hasFiles) {
        const formData = new FormData();
        if (avatarImage) formData.append("avatar_image", avatarImage);

        let finalClothingFile = clothingImage;
        if (clothingImage) {
          finalClothingFile = await removeBackground(clothingImage);
        }
        if (finalClothingFile) formData.append("clothing_image", finalClothingFile);

        formData.append("clothing_prompt", clothingPrompt);
        formData.append("negative_prompt", NEGATIVE_PROMPT);
        formData.append("quality", quality);
        formData.append("clothing_type", clothingType);

        options = { method: "POST", body: formData, signal };
      } else {
        const payload = {
          avatar_image_url: avatarUrl,
          clothing_image_url: clothingUrl,
          clothing_prompt: clothingPrompt,
          negative_prompt: NEGATIVE_PROMPT,
          quality,
          clothing_type: clothingType,
        };
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal,
        };
      }

      setProgress(50);
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout.")), 120000)
      );
      const response = await Promise.race([fetch(backendUrl, options), timeout]);
      setProgress(80);

      if (!response.ok) {
        let errData;
        try { errData = await response.json(); } 
        catch { errData = { error: "Unexpected API error." }; }
        throw new Error(errData.error || "Image processing failed.");
      }

      const contentType = response.headers.get("Content-Type") || "";
      if (contentType.includes("image") || contentType.includes("octet-stream")) {
        const blob = await response.blob();
        setResultImage(URL.createObjectURL(blob));
      } else {
        const data = await response.json();
        setResultImage(data.output_url || data.result || null);
      }

      setProgress(100);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to generate image.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1500);
      setStage("idle");
    }
  }

  return (
    <div style={{ color: "#fff" }}>
      <h3 style={{ textAlign: "center", color: "#fff", marginBottom: "1.5rem" }}>
        <FaTshirt style={{ marginRight: 8 }} />
        Try-On Virtual
      </h3>

      {/* ===== FORM ÚNICO ===== */}
      <form onSubmit={handleSubmit} className="tryon-form">
        {/* Avatar */}
        <div className="form-group" style={{ marginBottom: "1.25rem" }}>
          <label style={{ color: "#fff", fontWeight: 600 }}>
            <FaUserAlt style={{ marginRight: 6 }} /> Avatar (sua foto)
          </label>
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
        <div className="form-group" style={{ marginBottom: "1.25rem" }}>
          <label style={{ color: "#fff", fontWeight: 600 }}>
            <FaTshirt style={{ marginRight: 6 }} /> Roupa
          </label>
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

        {/* Tipo de roupa */}
        <div className="form-group">
          <label>Tipo de Roupa</label>
          <select
            value={clothingType}
            onChange={(e) => setClothingType(e.target.value)}
            disabled={loading}
          >
            <option value="generic">Genérico</option>
            <option value="shirt">Camiseta/Blusa</option>
            <option value="pants">Calça</option>
            <option value="shorts">Shorts</option>
            <option value="jacket">Jaqueta/Coat</option>
            <option value="dress">Vestido</option>
            <option value="skirt">Saia</option>
          </select>
        </div>

        {/* Qualidade */}
        <div className="form-group">
          <label>Qualidade</label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            disabled={loading}
          >
            <option value="standard">Standard (rápido)</option>
            <option value="high">High (detalhado)</option>
            <option value="ultra">Ultra (máxima qualidade)</option>
          </select>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (stage === "removing" ? "Removendo fundo..." : "Gerando...") : "Executar Try-On"}
        </button>
      </form>

      {/* Barra de progresso */}
      {loading && (
        <div
          style={{
            width: "100%",
            height: 8,
            background: "#eee",
            borderRadius: 4,
            marginTop: 10,
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#007bff",
              borderRadius: 4,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      )}

      {/* Erro */}
      {error && <p className="error">{error}</p>}

      {/* Resultado */}
      {resultImage && (
        <div className="resultado" style={{ marginTop: "1.5rem" }}>
          <h4 style={{ color: "#fff" }}>
            <FaImage style={{ marginRight: 6 }} /> Resultado
          </h4>
          <img
            src={resultImage}
            alt="Try-On Result"
            className="tryon-result"
            style={{
              maxWidth: "100%",
              borderRadius: 12,
              marginTop: 15,
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      )}
    </div>
  );
}
