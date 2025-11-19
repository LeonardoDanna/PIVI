import { useState } from "react";
import loginbg from "../assets/images/Register - Background.png";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      const response = await api.post("/login/", {
        username: form.email, // Django usa USERNAME, não email!
        password: form.password,
      });

      console.log("Login OK:", response.data);

      // Redirecionar para o dashboard ou home logada
      navigate("/dashboard");

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || "Erro ao fazer login.");
    }
  }

  return (
    <div className="container">

      <div
        className="side-image"
        style={{ backgroundImage: `url(${loginbg})` }}
      ></div>

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
