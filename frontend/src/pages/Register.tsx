import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";
import logo from "../assets/images/logo.png";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const newUser = { name, email, password };

    localStorage.setItem("user", JSON.stringify(newUser));
    navigate("/login");
  }

  return (
    <div className="auth-wrapper">
    <div className="auth-image-side"></div>

      <div className="auth-form-side">
        <form className="auth-card" onSubmit={handleRegister}>
        <img src={logo} alt="logo" className="auth-logo" />
          <h1 className="auth-title">Cadastrar</h1>

          <label>Nome completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <button type="submit" className="auth-btn">Criar</button>

          <p className="auth-link">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
