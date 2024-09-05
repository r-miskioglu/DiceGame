import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Lobby, Player } from "./Interfaces";

function LobbyComponent() {
  // Renamed the function to avoid confusion with the Lobby interface
  const navigate = useNavigate();

  // Initialize useState with the Lobby type, and default it to null initially
  const [lobby, setLobby] = useState<Lobby | null>(null);

  const handleRedirect = (page: string) => {
    navigate(page); // Redirects to the desired page
  };

  const start_game = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/start_lobby", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "start" }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Lobby started", data);
        // Handle successful response
        handleRedirect("/game"); // Redirect after success
      } else {
        console.error("start Lobby failed:", response.statusText);
        // Handle failure response
      }
    } catch (error) {
      console.error("Error making start request:", error);
      // Handle network errors
    }
  };
  const leave_lobby = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/leave_lobby", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "leave" }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Left Lobby", data);
        // Handle successful response
        handleRedirect("/"); // Redirect after success
      } else {
        console.error("leave Lobby failed:", response.statusText);
        // Handle failure response
      }
    } catch (error) {
      console.error("Error making leave request:", error);
      // Handle network errors
    }
  };
  const kickPlayer = async (id: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/kick_lobby", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player_id: id }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Kicked Lobby", data);
        // Handle successful response
      } else {
        console.error("kick Lobby failed:", response.statusText);
        // Handle failure response
      }
    } catch (error) {
      console.error("Error making kick request:", error);
      // Handle network errors
    }
  };
  useEffect(() => {
    const fetchLobby = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/api/getlobby", {
          credentials: "include",
        });
        const data: Lobby = await response.json(); // Ensure the data matches the Lobby type
        if (data.start == true) {
          handleRedirect("/game");
        }
        setLobby(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchLobby();

    const intervalId = setInterval(fetchLobby, 2000);

    return () => clearInterval(intervalId);
  }, []);

  if (!lobby) {
    return <div>Loading...</div>;
  }

  let admin: Player;
  const adminIndex = lobby.players.findIndex(
    (player) => player.id === lobby.admin_id
  );

  if (adminIndex !== -1) {
    admin = lobby.players[adminIndex];
    const playersWithoutAdmin = lobby.players.filter(
      (player) => player.id !== admin.id
    );

    if (admin.id === lobby.local_id) {
      return (
        <div style={styles.container}>
          <h2>Lobby ID: {lobby.id}</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nr</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr style={styles.adminRow}>
                <td style={styles.td}>1</td>
                <td style={styles.td}>{admin.name} (Admin)</td>
                <td style={styles.td}></td>
              </tr>
              {playersWithoutAdmin.map((item, index) => (
                <tr>
                  <td style={styles.td}>{index}</td>
                  <td style={styles.td}>{item.name}</td>
                  <td style={styles.kickCell}>
                    <div style={styles.kickButtonWrapper}>
                      <button
                        style={styles.kickButton}
                        onClick={() => kickPlayer(item.id)}
                      >
                        Kick
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.buttons}>
            <button style={styles.startButton} onClick={start_game}>
              Start
            </button>
            <button style={styles.leaveButton} onClick={leave_lobby}>
              Leave
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div style={styles.container}>
          <h2>Lobby ID: {lobby.id}</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nr</th>
                <th style={styles.th}>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr style={styles.adminRow}>
                <td style={styles.td}>1</td>
                <td style={styles.td}>{admin.name} (Admin)</td>
              </tr>
              {playersWithoutAdmin.map((item, index) => (
                <tr>
                  <td style={styles.td}>{index}</td>
                  <td style={styles.td}>{item.name}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.buttons}>
            <button style={styles.leaveButton} onClick={leave_lobby}>
              Leave
            </button>
          </div>
        </div>
      );
    }
  } else {
    return <div>Lobby has no admin</div>;
  }
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
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  },
  adminRow: {
    backgroundColor: "#d1e7dd", // Light green background for admin
    // border: "2px solid #4CAF50", // Green border to highlight
  },
  kickButton: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    cursor: "pointer",
    width: "100%",
    height: "100%",
    fontSize: "16px",
    textAlign: "center",
    boxSizing: "border-box", // Ensure padding and borders are included in the width/height
  },
  buttons: {
    display: "flex",
    width: "100%",
    marginTop: "10px",
  },
  button: {
    flex: 1, // Make buttons take up equal space
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    color: "white",
    margin: 0, // Remove default margin to align buttons side by side
  },
  startButton: {
    display: "flex",
    width: "100%",
    marginTop: "10px",
    flex: 1, // Make buttons take up equal space
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    color: "white",
    margin: 0, // Remove default margin to align buttons side by side
    backgroundColor: "#4CAF50",
  },
  leaveButton: {
    display: "flex",
    width: "100%",
    marginTop: "10px",
    flex: 1, // Make buttons take up equal space
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    color: "white",
    margin: 0, // Remove default margin to align buttons side by side
    backgroundColor: "#f44336",
  },
  kickCell: {
    padding: "0", // Remove padding for kick button cell
  },
  kickButtonWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
};

export default LobbyComponent;
