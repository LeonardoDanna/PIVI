import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/images/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!savedUser) {
      return setError("Nenhum usuário encontrado. Faça seu cadastro!");
    }

    if (savedUser.email !== email || savedUser.password !== password) {
      return setError("Email ou senha incorretos.");
    }

    localStorage.setItem("loggedUser", JSON.stringify(savedUser));
    navigate("/");
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

          {error && <p className="auth-error">{error}</p>}

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-btn">Entrar</button>

          <p className="auth-link">
            Não tem conta? <Link to="/register">Criar conta</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
