import { useState } from "react";
import { API_URL } from "./api";

function AuthForm({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const body =
        mode === "login" ? { email, password } : { name, email, password };

      const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      localStorage.setItem("token", data.token);
      onAuthenticated();
    } catch {
      setError("Could not reach the server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <h1>{mode === "login" ? "Log in to DevFlow" : "Create your DevFlow account"}</h1>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Please wait..." : mode === "login" ? "Log in" : "Register"}
        </button>
      </form>

      <p className="switch-link">
        {mode === "login" ? (
          <>
            No account?{" "}
            <button type="button" className="link-btn" onClick={() => setMode("register")}>
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button type="button" className="link-btn" onClick={() => setMode("login")}>
              Log in
            </button>
          </>
        )}
      </p>
    </div>
  );
}

export default AuthForm;
