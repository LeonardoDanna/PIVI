import React, { useState } from "react";

const TryOn = () => {
  const [avatarImage, setAvatarImage] = useState(null);
  const [clothingImage, setClothingImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [clothingUrl, setClothingUrl] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = "http://127.0.0.1:8000/api/try-on-diffusion/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResultImage(null);

    try {
      let formData;
      let options = {};

      // Se tiver upload de arquivo, usar multipart/form-data
      if (avatarImage || clothingImage) {
        formData = new FormData();
        if (avatarImage) formData.append("avatar_image", avatarImage);
        if (clothingImage) formData.append("clothing_image", clothingImage);
        options = {
          method: "POST",
          body: formData,
        };
      } else {
        // Caso contrário, enviar URLs no formato JSON
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

      // Se o retorno for uma imagem binária (blob)
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("image")) {
        const blob = await response.blob();
        const imageObjectURL = URL.createObjectURL(blob);
        setResultImage(imageObjectURL);
      } else {
        // Caso a API retorne JSON com link
        const data = await response.json();
        setResultImage(data.output_url || data.result || null);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👕 Try-On Diffusion</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h4>🧍 Avatar</h4>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarImage(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="ou URL da imagem do avatar"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          style={styles.input}
        />

        <h4>👚 Roupa</h4>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setClothingImage(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="ou URL da imagem da roupa"
          value={clothingUrl}
          onChange={(e) => setClothingUrl(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Gerando imagem..." : "Testar Try-On"}
        </button>
      </form>

      {error && <p style={styles.error}>⚠️ {error}</p>}

      {resultImage && (
        <div style={styles.result}>
          <h4>🖼️ Resultado</h4>
          <img src={resultImage} alt="Resultado Try-On" style={styles.image} />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 20,
    background: "#f9f9f9",
    borderRadius: 12,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  input: {
    padding: 8,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  button: {
    marginTop: 10,
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  error: { color: "red", marginTop: 10 },
  result: { marginTop: 20 },
  image: {
    maxWidth: "100%",
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
  },
  title: {
    marginBottom: 20,
  },
};

export default TryOn;
