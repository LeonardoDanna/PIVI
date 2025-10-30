import React, { useState } from "react";
import { FaUser, FaTshirt, FaMagic, FaImage } from "react-icons/fa";

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

      // ===== Se houver upload de arquivo =====
      if (avatarImage || clothingImage) {
        formData = new FormData();
        if (avatarImage) formData.append("avatar_image", avatarImage);
        if (clothingImage) formData.append("clothing_image", clothingImage);

        options = {
          method: "POST",
          body: formData,
        };
      } else {
        // ===== Caso contrário, usar URLs =====
        if (!avatarUrl || !clothingUrl) {
          throw new Error("Informe arquivos ou URLs de avatar e roupa.");
        }

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
      const contentType = response.headers.get("content-type");

      // ===== Trata erros =====
      if (!response.ok) {
        const text = await response.text();
        console.error("Erro da API:", text);
        setError(
          text.includes("<!DOCTYPE")
            ? "Erro no servidor (resposta HTML inesperada). Verifique o backend ou a API."
            : text
        );
        return;
      }

      // ===== Se vier imagem =====
      if (contentType && contentType.includes("image")) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setResultImage(imageUrl);
      }
      // ===== Se vier JSON =====
      else if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Resposta JSON:", data);

        // A API às vezes retorna link em output_url ou result
        const output =
          data.output_url || data.result || data.image_url || data.url;
        if (output) {
          setResultImage(output);
        } else {
          setError("Resposta JSON sem imagem detectada.");
        }
      }
      // ===== Qualquer outra coisa =====
      else {
        const text = await response.text();
        console.warn("Resposta inesperada:", text);
        setError("Resposta inesperada do servidor (sem imagem nem JSON).");
      }
    } catch (err) {
      console.error("Erro geral:", err);
      setError(err.message || "Erro desconhecido ao processar o Try-On.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2
        style={{
          ...styles.title,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <FaMagic style={{ color: "#4da3ff" }} /> Try-On Virtual
      </h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Avatar */}
        <h4
          style={{
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <FaUser style={{ color: "#4da3ff" }} /> Avatar (foto da pessoa)
        </h4>
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

        {/* Espaçamento entre avatar e roupa */}
        <div style={{ height: "12px" }} />

        {/* Roupa */}
        <h4
          style={{
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <FaTshirt style={{ color: "#ff8c8c" }} /> Roupa
        </h4>
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
          <h4
            style={{
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FaImage style={{ color: "#4da3ff" }} /> Resultado
          </h4>
          <img src={resultImage} alt="Resultado Try-On" style={styles.image} />
        </div>
      )}
    </div>
  );
};

// ======== Estilos simples ========
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
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
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
  error: { color: "red", marginTop: 10, whiteSpace: "pre-wrap" },
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
