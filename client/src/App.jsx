import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [message, setMessage] = useState("Checking backend...");

  const checkBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();

      setMessage(data.message);
    } catch (error) {
      setMessage("Backend connection failed");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial"
    }}>
      <h1>DevFlow</h1>

      <p>Team Project & Issue Management Platform</p>

      <button onClick={checkBackend}>
        Check Backend
      </button>

      <p>{message}</p>
    </div>
  );
}

export default App;