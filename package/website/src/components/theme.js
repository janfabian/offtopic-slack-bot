import { h } from "preact";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#f4511e",
    },
  },
  typography: {
    fontSize: 12,
    h4: {
      fontWeight: 300,
    },
    body1: {
      fontSize: 16,
    },
  },
});

theme = responsiveFontSizes(theme);

const Theme = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
