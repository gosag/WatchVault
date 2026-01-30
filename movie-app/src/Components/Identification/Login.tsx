import { useState } from "react";
import "./Login-and-register.css";
import { Link, useNavigate, useLocation} from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate(); // for programmatic navigation
  const location = useLocation();
  const isToggled = location.state?.isToggled || false;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const maySavedUser=localStorage.getItem("user")
    const savedUser = maySavedUser?JSON.parse(maySavedUser):"";
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
    <div className={`login-page ${isToggled ? "dark-theme" : ""}`}>
      <h2 className="login-title">Welcome back!</h2>
      <form onSubmit={handleSubmit} className={`login-form ${isToggled ? "dark-form" : ""}`}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          minLength={3}
          maxLength={15}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          minLength={6}
          maxLength={20}
          required
        />

        <button type="submit">Login</button>
        <Link className="register-link" to="/register"
        state={{isToggled:isToggled}}
        >
          Don't have an account? Create one
        </Link>
        <Link className="go-back" to="/">Go Back</Link>
      </form>
    </div>
  );
}
