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
    const cleanedFile = new File([blob], file.name, { type: "image/png" });
    console.log("Background removed:", cleanedFile);
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
      const hasFiles = avatarImage || clothingImage;
      const hasUrls = avatarUrl.trim() !== "" && clothingUrl.trim() !== "";

      if (!hasFiles && !hasUrls) {
        setError(
          "Please upload valid files or URLs for both avatar and clothing."
        );
        setLoading(false);
        return;
      }

      const clothingPrompt =
        PROMPTS_BY_TYPE[clothingType] || PROMPTS_BY_TYPE.generic;

      let options = {};
      controllerRef.current = new AbortController();
      const signal = controllerRef.current.signal;

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

      console.groupCollapsed("TRY-ON REQUEST");
      console.log("Clothing type:", clothingType);
      console.log("Quality:", quality);
      console.log("Clothing prompt:", clothingPrompt.trim());
      console.log("Negative prompt:", NEGATIVE_PROMPT.trim());
      console.groupEnd();

      setProgress(50);
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout.")), 120000)
      );

      const response = await Promise.race([
        fetch(backendUrl, options),
        timeout,
      ]);
      setProgress(80);

      if (!response.ok) {
        let errData;
        try {
          errData = await response.json();
        } catch {
          errData = { error: "Unexpected API error." };
        }
        throw new Error(errData.error || "Image processing failed.");
      }

      const contentType = response.headers.get("Content-Type") || "";
      console.log("Response content type:", contentType);

      if (
        contentType.includes("image") ||
        contentType.includes("octet-stream")
      ) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        console.log("Image received:", blob.size, "bytes");
        setResultImage(imageUrl);
      } else {
        const data = await response.json();
        console.log("JSON response:", data);
        setResultImage(data.output_url || data.result || null);
      }

      setProgress(100);
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Request aborted.");
      } else {
        console.error("Try-On error:", err);
        setError(err.message || "Failed to generate image.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1500);
      setStage("idle");
    }
  }

  return (
    <div>
      <h3>Virtual Try-On</h3>
      <form onSubmit={handleSubmit} className="tryon-form">
        <div className="form-group">
          <label>Avatar (person photo)</label>
          <input
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={(e) => setAvatarImage(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="or avatar URL"
            value={avatarUrl}
            disabled={loading}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Clothing</label>
          <input
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={(e) => setClothingImage(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="or clothing URL"
            value={clothingUrl}
            disabled={loading}
            onChange={(e) => setClothingUrl(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Clothing Type</label>
          <select
            value={clothingType}
            onChange={(e) => setClothingType(e.target.value)}
            disabled={loading}
          >
            <option value="generic">Generic</option>
            <option value="shirt">Shirt / Blouse</option>
            <option value="pants">Pants</option>
            <option value="shorts">Shorts</option>
            <option value="jacket">Jacket / Coat</option>
            <option value="dress">Dress</option>
            <option value="skirt">Skirt</option>
          </select>
        </div>

        <div className="form-group">
          <label>Generation Quality</label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            disabled={loading}
          >
            <option value="standard">Standard (fast)</option>
            <option value="high">High (detailed)</option>
            <option value="ultra">Ultra (maximum quality)</option>
          </select>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading
            ? stage === "removing"
              ? "Removing background..."
              : "Generating..."
            : "Run Try-On"}
        </button>
      </form>

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

      {error && <p className="error">{error}</p>}

      {resultImage && (
        <div className="resultado">
          <h4>Result</h4>
          <img
            src={resultImage}
            alt="Try-On Result"
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
