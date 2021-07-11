import { h } from "preact";
import { Router } from "preact-router";
import Helmet from "preact-helmet";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import NotFound from "../routes/not-found";
import Theme from "./theme";
import { CssBaseline } from "@material-ui/core";
import AppBar from "./app-bar";

const App = () => (
  <div id="app">
    <CssBaseline />
    <Helmet title="Offtopic slack app" />
    <Theme>
      <AppBar />
      {/* <a>
        <img
          alt="Add to Slack"
          src="https://platform.slack-edge.com/img/add_to_slack.png"
          width="100"
          srcset="
            https://platform.slack-edge.com/img/add_to_slack.png    1x,
            https://platform.slack-edge.com/img/add_to_slack@2x.png 2x
          "
        />
      </a> */}
      <Router>
        <Home path="/" />
        <NotFound default />
      </Router>
    </Theme>
  </div>
);

export default App;
