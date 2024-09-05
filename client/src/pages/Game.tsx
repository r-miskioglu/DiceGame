import GameTable from "./components/GameTable";
import Dice from "./components/Dice";
import InputMove from "./components/InputMove";
import { GameState, Player } from "./Interfaces";
import { useState } from "react";
import { useEffect } from "react";

function Game() {
  const [game_state, setGame] = useState<GameState | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/api/get_game", {
          credentials: "include",
        });
        const data: GameState = await response.json(); // Ensure the data matches the Lobby type
        setGame(data);
        if (data.players.length == 1) {
          setMessage("Congratulations, you Won");
        }
      } catch (error) {
        console.error("Error fetching game:", error);
      }
    };

    fetchGame();

    const intervalId = setInterval(fetchGame, 2000);

    return () => clearInterval(intervalId);
  }, []);

  if (!game_state) {
    return <div>Loading...</div>;
  }

  const findPlayerByID = (id: string, items: Player[]): Player | undefined => {
    return items.find((item) => item.id === id);
  };

  const local_player = findPlayerByID(game_state.local_id, game_state.players);

  if (!local_player) {
    return <div>Couldnt Find Player...</div>;
  }
  let turn = false;

  if (local_player.id == game_state.players[game_state.state].id) {
    turn = true;
  } else {
    turn = false;
  }

  const renderMessage = () => {
    if (!message) return null;
    return (
      <div style={{ color: "green" }}>
        <p>{message}</p>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.table}>
        <h1 style={styles.heading}>Player {game_state.state}'s turn</h1>
        <GameTable players={game_state.players} />
      </div>
      <div style={styles.divDiceAndInputs}>
        <Dice dice={local_player.dice} />
        <InputMove turn={turn} />
      </div>
      {renderMessage()}
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
    justifyContent: "space-between",
    maxWidth: "80%", // Max width of half the page size
    maxHeight: "75%", // Max height of half the page size
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
  },
  table: {
    width: "80%",
  },
  divDiceAndInputs: {
    width: "80%",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
};
export default Game;
