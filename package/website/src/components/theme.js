import { h } from "preact";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({});

const Theme = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
