import { Player } from "../Interfaces";

interface GameTableProps {
  players: Player[];
}

const GameTable: React.FC<GameTableProps> = ({ players }) => {
  return (
    <table style={styles.table} className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Lives</th>
          <th scope="col">Amount</th>
          <th scope="col">Number</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player, index) => (
          <tr>
            <th scope="row">{index}</th>
            <td>{player.name}</td>
            <td>{player.lives}</td>
            <td>{player.moves[player.moves.length - 1].amount}</td>
            <td>{player.moves[player.moves.length - 1].number}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  table: {
    padding: "20px",
  },
};
export default GameTable;
