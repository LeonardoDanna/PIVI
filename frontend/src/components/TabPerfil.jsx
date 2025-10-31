import { useState, useEffect } from "react";
import { FaUserCircle, FaUpload } from "react-icons/fa";

export default function TabPerfil({ userProfile, setUserProfile }) {
  // estado local espelhando o que o App usa
  const [name, setName] = useState(userProfile?.name || "");
  const [description, setDescription] = useState(userProfile?.description || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [savedPhoto, setSavedPhoto] = useState(userProfile?.avatarUrl || "");

  // se o App mudar (ex.: hidratação), sincroniza
  useEffect(() => {
    setName(userProfile?.name || "");
    setDescription(userProfile?.description || "");
    setSavedPhoto(userProfile?.avatarUrl || "");
  }, [userProfile]);

  // fallback: hidrata do localStorage só se o App vier vazio
  useEffect(() => {
    if (!userProfile?.name && !userProfile?.avatarUrl) {
      const stored = JSON.parse(localStorage.getItem("userProfile") || "{}");
      if (stored.name || stored.avatarUrl || stored.description) {
        setName(stored.name || "");
        setDescription(stored.description || "");
        setSavedPhoto(stored.avatarUrl || "");
        setUserProfile({
          name: stored.name || "",
          description: stored.description || "",
          avatarUrl: stored.avatarUrl || "",
        });
      }
    }
  }, []); // intencional, roda uma vez

  const handleSave = () => {
    let finalPhoto = savedPhoto;
    if (photoFile) {
      finalPhoto = URL.createObjectURL(photoFile);
    } else if (photoUrl.trim() !== "") {
      finalPhoto = photoUrl;
    }

    const perfilData = {
      name,
      description,
      avatarUrl: finalPhoto,
    };

    setUserProfile(perfilData); // atualiza header imediatamente
    localStorage.setItem("userProfile", JSON.stringify(perfilData));
    setSavedPhoto(finalPhoto);
    alert("Perfil salvo com sucesso!");
  };

  return (
    <div className="perfil-container">
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <FaUserCircle style={{ marginRight: "8px" }} />
        Meu Perfil
      </h2>

      <div className="field">
        <label>Nome de Usuário</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite seu nome de usuário"
        />
      </div>

      <div className="field">
        <label>Descrição do Perfil</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Escreva uma descrição sobre você"
          rows={3}
          style={{ resize: "none", padding: "0.7rem", borderRadius: "6px" }}
        />
      </div>

      <div className="field">
        <label>
          <FaUpload style={{ marginRight: "6px" }} /> Foto do Perfil
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="ou URL da foto"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
        />
      </div>

      <button className="btn-primary" onClick={handleSave}>
        Salvar Perfil
      </button>

      {savedPhoto && (
        <div className="resultado-com-imagem" style={{ marginTop: "1.5rem" }}>
          <h4 style={{ color: "#fff" }}>Foto Salva</h4>
          <img
            src={savedPhoto}
            alt="Foto do perfil"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              marginTop: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      )}
    </div>
  );
}
