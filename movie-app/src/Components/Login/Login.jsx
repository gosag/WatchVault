import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate(); // for programmatic navigation

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!form.username || !form.password) {
      alert("Please fill all fields");
      return;
    }

    if (savedUser?.username === form.username && savedUser?.password === form.password) {
      alert("Login successful!");
      navigate("/"); // go to home page
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <h2 className="login-title">Login Page</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          minLength="3"
          maxLength="15"
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          minLength="6"
          maxLength="20"
          required
        />

        <button type="submit">Login</button>
        <Link className="register-link" to="/register">
          Don't have an account? Register
        </Link>
      </form>
    </div>
  );
}
