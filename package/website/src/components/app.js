import { h } from "preact";
import { Router } from "preact-router";
import Helmet from "preact-helmet";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import Theme from "./theme";

const App = () => (
  <div id="app">
    <Helmet title="Offtopic slack app" />
    <Theme>
      <Router>
        <Home path="/" />
      </Router>
    </Theme>
  </div>
);

export default App;
