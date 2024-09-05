import { useState } from "react";
import { useNavigate } from "react-router-dom";
interface inputprops {
  turn: boolean;
}
const InputMove: React.FC<inputprops> = ({ turn }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [number, setNumber] = useState("");
  const [error, setError] = useState(null);

  const handleRedirect = (page: string) => {
    navigate(page); // Redirects to the desired page
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  // Function to handle number change
  const handleChangeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(e.target.value);
  };

  const increase = async () => {
    if (!amount && !number) {
      alert("Please Enter Move");
      return;
    }
    var a = Number(amount);
    var n = Number(number);

    try {
      const response = await fetch("http://127.0.0.1:8080/api/submitmove", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          amount: a,
          number: n,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Submit move successful:", data);
      } else {
        console.error("Submit move failed:", response.statusText);
        const data = await response.json();
        setError(data.error);
        // Handle failure response
      }
    } catch (error) {
      console.error("Error making submit request:", error);
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

  const doubt = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/submit_doubt", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ move: "doubt" }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Doubt request successful:", data);
      } else {
        console.error("Doubt request failed:", response.statusText);
        // Handle failure response
      }
    } catch (error) {
      console.error("Error making doubt request:", error);
      // Handle network errors
    }
  };

  const leave = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/leave_game", {
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
  return (
    <div style={styles.container}>
      <div style={styles.inputAN} className="input-group">
        <span className="input-group-text">Amount and Number</span>
        <input
          type="text"
          aria-label="Amount"
          className="form-control"
          value={amount}
          onChange={handleChangeAmount}
        />
        <input
          type="text"
          aria-label="Number"
          className="form-control"
          value={number}
          onChange={handleChangeNumber}
        />
        <button
          type="button"
          onClick={increase}
          style={{
            ...styles.button,
            ...styles.increase,
            ...(turn ? {} : styles.disabledButton),
          }}
          disabled={!turn}
        >
          Increase
        </button>
      </div>
      <div style={styles.buttonContainer}>
        <button
          type="button"
          style={{
            ...styles.button,
            ...styles.doubtButton,
            ...(turn ? {} : styles.disabledButton),
          }}
          onClick={doubt}
          disabled={!turn}
        >
          Doubt
        </button>
        <button
          type="button"
          style={{ ...styles.button, ...styles.leaveButton }}
          onClick={leave}
        >
          Leave Game
        </button>
      </div>
      {renderError()}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  inputAN: {
    paddingBottom: "20px",
  },
  container: {
    padding: "0px",
  },
  increase: {
    backgroundColor: "#28a745",
    width: "22%",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    width: "50%",
    padding: "10px",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    color: "#fff",
  },
  doubtButton: {
    backgroundColor: "#e6e600",
    color: "000",
  },
  leaveButton: {
    backgroundColor: "#f44336",
  },
  disabledButton: {
    backgroundColor: "#cccccc", // Disabled button background
    color: "#666666", // Disabled button text color
    cursor: "not-allowed", // Disabled button cursor style
  },
};
export default InputMove;
