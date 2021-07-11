import { h } from "preact";
import { Router } from "preact-router";
import Helmet from "preact-helmet";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import NotFound from "../routes/not-found";
import Theme from "./theme";
import { CssBaseline } from "@material-ui/core";

const App = () => (
  <div id="app">
    <CssBaseline />
    <Helmet title="Offtopic slack app" />
    <Theme>
      <Router>
        <Home path="/" />
        <NotFound default />
      </Router>
    </Theme>
  </div>
);

export default App;
