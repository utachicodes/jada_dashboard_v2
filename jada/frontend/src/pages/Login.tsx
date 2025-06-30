import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import "../styles/Login.scss";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-root">
      <header className="login-header">
        <div className="login-logo" />
        <div className="login-help">Need help?</div>
      </header>
      <main className="login-main">
        <section className="login-card">
          <h2 className="login-title">Secure Access</h2>
          <p className="login-subtitle">Enter your credentials</p>
          {error && <div className="login-error">{error}</div>}
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-label" htmlFor="email">Email</label>
            <input 
              className="login-input" 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="login-label" htmlFor="password">Password</label>
            <input 
              className="login-input" 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="login-forgot">Forgot password?</div>
            <button 
              className="login-submit" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <div className="login-encryption">End-to-end encrypted</div>
        </section>
      </main>
      <footer className="login-footer">
        <div className="login-status">All systems operational</div>
      </footer>
    </div>
  );
};

export default Login;
