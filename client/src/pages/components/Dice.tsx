interface DiceInterface {
  dice: number[];
}
const Dice: React.FC<DiceInterface> = ({ dice }) => {
  return (
    <ul style={styles.list}>
      {dice.map((d) => (
        <li style={styles.item}>{d}</li>
      ))}
    </ul>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  list: {
    display: "flex", // Use Flexbox to lay out items horizontally
    padding: 0, // Remove default padding
    margin: 0, // Remove default margin
    listStyleType: "none", // Remove default list styling
    paddingBottom: "20px",
  },
  item: {
    width: 50, // Set fixed width
    height: 50, // Set fixed height (same as width for square)
    marginRight: 10, // Space between items
    fontSize: 20, // Font size for the dice values
    textAlign: "center", // Center text horizontally
    lineHeight: "50px", // Center text vertically (same as height)
    border: "1px solid #000", // Optional: add a border for better visibility
    borderRadius: "4px", // Optional: round the corners of the border
    padding: "0", // Remove padding to keep the square shape
    boxSizing: "border-box", // Include border and padding in the element's total width and height
  },
};
export default Dice;
