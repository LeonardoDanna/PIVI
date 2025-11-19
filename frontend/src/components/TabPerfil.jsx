import { useState, useEffect } from "react";
import { FaUpload, FaUser, FaAlignLeft } from "react-icons/fa";
import personCircle from "/src/assets/images/person-circle.svg";

const PLACEHOLDER = personCircle;

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
        <label> <FaUser /> Nome de Usuário</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite seu nome de usuário"
        />
      </div>

      <div className="field">
        <label> <FaAlignLeft /> Descrição do Perfil</label>
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
