import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";
import logo from "../assets/images/logo.png";
import { getCookie } from "../utils/cookie"; // Importe a função do passo 1

export default function Register() {
  const navigate = useNavigate();

  // Estados do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados de feedback visual
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Garante que o cookie CSRF existe chamando a rota auxiliar (opcional se já tiver visitado o site)
      await fetch("/api/csrf/");

      const csrftoken = getCookie("csrftoken");

      // 2. Monta os dados para o Django (RegisterSerializer espera esses campos exatos)
      const payload = {
        username: name, // Mapeando 'nome' para 'username'
        email: email,
        password: password,
        confirm_password: password, // Backend exige confirmação, enviamos a mesma
      };

      // 3. Envia para o Back-end
      const response = await fetch("/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken || "", // Token de segurança
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Sucesso!
        alert("Conta criada com sucesso!");
        navigate("/login");
      } else {
        // Erro do Django (ex: "Usuário já existe", "Senhas não conferem")
        // Transforma o objeto de erro em string legível
        const errorMsg = Object.values(data).flat().join(" ");
        setError(errorMsg || "Erro ao criar conta.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-image-side"></div>

      <div className="auth-form-side">
        <form className="auth-card" onSubmit={handleRegister}>
          <img src={logo} alt="logo" className="auth-logo" />
          <h1 className="auth-title">Cadastrar</h1>

          {/* Exibe erros se houver */}
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <label>Nome de Usuário</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Ex: felipe_proenca"
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <button
            type="submit"
            className={`auth-btn ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar"}
          </button>

          <p className="auth-link">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
