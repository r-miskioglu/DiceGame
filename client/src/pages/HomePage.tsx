import { useNavigate } from "react-router-dom";
import { useState } from "react";
import React from "react";

function HomePage() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");

  const handleRedirect = (page: string) => {
    if (!playerName) {
      alert("Please enter a Player Name");
      return;
    }
    if (!playerName && page === "/join") {
      alert("Please enter a Player Name");
      return;
    }
    navigate(page, { state: { playerName } }); // Redirects to the page
  };
  const create_request = async () => {
    if (!playerName) {
      alert("Please enter a Player Name");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8080/api/create_lobby", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player_name: playerName }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Create request successful:", data);
        // Handle successful response
        handleRedirect("/lobby"); // Redirect after success
      } else {
        console.error("Create request failed:", response.statusText);
        // Handle failure response
      }
    } catch (error) {
      console.error("Error making create request:", error);
      // Handle network errors
    }
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Enter your Name</h1>
      <input
        type="text"
        placeholder="Your Name"
        style={styles.input}
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <div style={styles.buttonContainer}>
        <button
          style={{ ...styles.button, ...styles.joinButton }}
          type="button"
          onClick={() => handleRedirect("/join")}
        >
          Join
        </button>
        <button
          style={{ ...styles.button, ...styles.createButton }}
          type="button"
          onClick={create_request}
        >
          Create
        </button>
      </div>
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

export default HomePage;
