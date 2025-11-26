import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/images/logo.png";
import { getCookie } from "../utils/cookie"; // Importe a função utilitária

export default function Login() {
  const navigate = useNavigate();

  // Mudamos de email para username para bater com o padrão do Django
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Pega o Token de Segurança (CSRF)
      await fetch("/api/csrf/");
      const csrftoken = getCookie("csrftoken");

      // 2. Envia as credenciais para o Django
      const response = await fetch("/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken || "",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. SUCESSO
        // Salvamos uma "flag" ou os dados do usuário no localStorage
        // para o App.tsx saber que estamos logados e liberar as rotas.
        localStorage.setItem("loggedUser", JSON.stringify(data.user));

        // Redireciona para o Dashboard (Home)
        navigate("/");
      } else {
        // 4. ERRO (Senha errada, usuário não existe, etc)
        setError(data.error || "Usuário ou senha incorretos.");
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
      {/* LADO ESQUERDO COM IMAGEM */}
      <div className="auth-image-side"></div>

      {/* FORMULÁRIO */}
      <div className="auth-form-side">
        <form className="auth-card" onSubmit={handleLogin}>
          <img src={logo} alt="logo" className="auth-logo" />
          <h1 className="auth-title">Entrar</h1>

          {/* Exibe erros do Backend */}
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <label>Nome de Usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Digite seu usuário"
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
            {isLoading ? "Entrando..." : "Entrar"}
          </button>

          <p className="auth-link">
            Não tem conta? <Link to="/register">Criar conta</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
