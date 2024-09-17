import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch("http://localhost:5000/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!data) {
          setError("Invalid email or password");
        }
        if (res.ok) {
          localStorage.setItem("token", data.token);
          navigate("/home");
        } else {
          setError(data.message || "Login failed");
        }
      } catch (error) {
        console.error("Error logging in:", error);
        setError("Login failed");
      }
};
  return (
    <div className="main_div">
      <div className="ls">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form className="ls_form" onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
          <button type="submit" className="login_btn">
            Login
          </button>
          <span>
            New User <Link to="/">Click Here</Link>{" "}
          </span>
        </form>
      </div>
      <div className="rs">
        <p>Very Good works are Waiting for you Login Now!!</p>
        <img src="https://www.lonestar.edu/Tech-Success/img/guy.png" alt="" />
      </div>
    </div>
  );
};

export default Login;
