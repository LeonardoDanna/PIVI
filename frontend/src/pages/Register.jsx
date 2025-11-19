import { useState } from "react";
import { Link } from "react-router-dom";

// Imagens
import registerbg from "../assets/images/Register - Background.png";
import "../styles/register.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      setError("As senhas não coincidem.");
      return;
    }

    setError("");
    console.log("Formulário enviado:", form);
  }

  return (
    <div className="container">
      
      <div
        className="side-image"
        style={{ backgroundImage: `url(${registerbg})` }}
      />

      <div className="register">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>

          <label>Username:</label>
          <input
            type="text"
            name="username"
            required
            value={form.username}
            onChange={handleChange}
          />

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

          <label>Repeat Password:</label>
          <input
            type="password"
            name="confirm_password"
            required
            value={form.confirm_password}
            onChange={handleChange}
          />

          {error && <p className="error">{error}</p>}

          <input type="submit" value="Register" />
        </form>

        {/* 🔥 -> Botão de voltar */}
        <p className="back-button">
          Já tem uma conta? <Link to="/">Voltar para o Login</Link>
        </p>

      </div>
    </div>
  );
}
