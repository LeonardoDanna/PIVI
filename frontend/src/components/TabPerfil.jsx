import { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";

const PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="%23EDE7FF"/><circle cx="80" cy="62" r="28" fill="%237C4DFF"/><path d="M30 132c8-24 28-36 50-36s42 12 50 36" fill="%237C4DFF"/></svg>';

export default function TabPerfil({ userProfile, setUserProfile }) {
  const [name, setName] = useState(userProfile?.name || "");
  const [description, setDescription] = useState(userProfile?.description || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [savedPhoto, setSavedPhoto] = useState(userProfile?.avatarUrl || "");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    setName(userProfile?.name || "");
    setDescription(userProfile?.description || "");
    setSavedPhoto(userProfile?.avatarUrl || "");
  }, [userProfile]);

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
  }, []);

  useEffect(() => {
    let revoke;
    if (photoFile) {
      const objUrl = URL.createObjectURL(photoFile);
      setPreviewUrl(objUrl);
      revoke = () => URL.revokeObjectURL(objUrl);
    } else if (photoUrl.trim()) {
      setPreviewUrl(photoUrl.trim());
    } else if (savedPhoto) {
      setPreviewUrl(savedPhoto);
    } else {
      setPreviewUrl(PLACEHOLDER);
    }
    return () => revoke && revoke();
  }, [photoFile, photoUrl, savedPhoto]);

  const handleSave = () => {
    let finalPhoto = savedPhoto;
    if (photoFile) finalPhoto = previewUrl;
    else if (photoUrl.trim()) finalPhoto = photoUrl.trim();

    const perfilData = { name, description, avatarUrl: finalPhoto };
    setUserProfile(perfilData);
    localStorage.setItem("userProfile", JSON.stringify(perfilData));
    setSavedPhoto(finalPhoto);
    alert("Perfil salvo com sucesso!");
  };

  return (
    <div className="perfil-container">
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
          className="perfil-descricao"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Escreva uma descrição sobre você"
          rows={3}
        />
      </div>

      <div className="field">
        <label>
          <FaUpload className="perfil-icone-upload" /> Foto do Perfil
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
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

      <div className="perfil-preview">
        <h4>Foto do Perfil</h4>
        <img
          src={previewUrl || PLACEHOLDER}
          alt="Foto do perfil"
          className="perfil-foto"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER;
          }}
        />
      </div>
    </div>
  );
}
