import { h } from "preact";
import { Router } from "preact-router";
import Helmet from "preact-helmet";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import NotFound from "../routes/not-found";
import Theme from "./theme";
import { CssBaseline } from "@material-ui/core";
import AppBar from "./app-bar";
import Install from "../routes/install";
import SnackBar from "./snackbar";

const App = () => (
  <div id="app">
    <CssBaseline />
    <Helmet title="Offtopic slack app" />
    <Theme>
      <AppBar />
      <Router>
        <Home path="/" />
        <Install path="/install/:remaining_path*" />
        <NotFound default />
      </Router>
      <SnackBar />
    </Theme>
  </div>
);

export default App;
