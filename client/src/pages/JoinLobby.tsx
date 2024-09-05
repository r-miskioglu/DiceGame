import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function JoinLobby() {
  const navigate = useNavigate();
  const location = useLocation();
  const [lobbyId, setLobbyId] = useState("");
  const [playerName, setPlayerName] = useState(
    location.state?.playerName || ""
  );
  const [error, setError] = useState(null);

  const handleRedirect = (page: string) => {
    navigate(page); // Redirects to the About page
  };

  const join_request = async () => {
    if (!lobbyId) {
      alert("Please enter a Lobby ID");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8080/api/join_lobby", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lobby_id: lobbyId, player_name: playerName }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Join request successful:", data);
        // Handle successful response
        handleRedirect("/lobby"); // Redirect after success
      } else {
        console.error("Join request failed:", response.statusText);
        const data = await response.json();
        console.log(data.error);
        setError(data.error);
        // Handle failure response
      }
    } catch (error) {
      console.error("Error making join request:", error);
      // Handle network errors
    }
  };

  const renderError = () => {
    if (!error) return null;
    return (
      <div style={{ color: "red" }}>
        <p>Error: {error}</p>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Enter Lobby ID</h1>
      <input
        type="text"
        placeholder="Player Name"
        style={styles.input}
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Lobby ID"
        style={styles.input}
        value={lobbyId}
        onChange={(e) => setLobbyId(e.target.value)}
      />
      <div style={styles.buttonContainer}>
        <button
          style={{ ...styles.button, ...styles.joinButton }}
          type="button"
          onClick={() => join_request()}
        >
          Join
        </button>
        <button
          style={{ ...styles.button, ...styles.createButton }}
          type="button"
          onClick={() => handleRedirect("/")}
        >
          Back
        </button>
      </div>
      {renderError()}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "50%", // Max width of half the page size
    maxHeight: "25%", // Max height of half the page size
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    width: "48%",
    padding: "10px",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    color: "#fff",
  },
  joinButton: {
    backgroundColor: "#28a745",
  },
  createButton: {
    backgroundColor: "#007bff",
  },
};

export default JoinLobby;
