"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  // --- CHANGE 1: Switched from 'email' to 'username' state ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // --- CHANGE 2: Sending 'username' to the API ---
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`Welcome back!`);
        localStorage.setItem("authToken", data.token);
        router.push("/dashboard");
      } else {
        setError(data.detail || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card-wrapper">
        <h1 className="login-heading">Login</h1>
        <p className="login-subheading">to get started</p>

        <form onSubmit={handleLogin} className="login-form">
          {/* --- CHANGE 3: Updated the input field for username --- */}
          <div className="form-group-custom">
            <input
              type="text"
              id="username"
              className="login-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group-custom">
            <input
              type="password"
              id="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="continue-button" disabled={loading}>
            {loading ? "Continuing..." : "Continue"}
          </button>
        </form>

      </div>
    </div>
  );
}