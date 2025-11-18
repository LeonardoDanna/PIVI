import { useState } from "react";
import loginbg from "../assets/images/Register - Background.png";
import { Link } from "react-router-dom";
import "../styles/login.css"

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Validação simples
    if (!form.email || !form.password) {
      setError("Preencha todos os campos.");
      return;
    }

    setError("");
    console.log("Login enviado:", form);
  }

  return (
    <div className="container">
      {/* Imagem lateral */}
      <div
        className="side-image"
        style={{ backgroundImage: `url(${loginbg})` }}
      ></div>

      {/* Formulário */}
      <div className="login">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
          />

          {error && <p className="error">{error}</p>}

          <input type="submit" value="Login" />

          <p className="swap-link">
            Não tem conta? <Link to="/register">Registrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
