const settings = {
  text: "#1b1708",
  background: "#3ac692",
  primary: "#3ac692",
  secondary: "#df91d4",
  accent: "#d46868",
  paddingSmall: "20px",
  borderRadius: "8px",
};

export const styles: { [key: string]: React.CSSProperties } = {
  div: {
    background: settings.background,
    padding: settings.paddingSmall,
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    borderRadius: settings.borderRadius,
  },
  buttonBox: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: settings.borderRadius,
    border: "none",
  },
  inputs: {
    padding: "20px",
  },
};
