import { h } from "preact";
import { useLayoutEffect } from "preact/compat";
import { Container, makeStyles } from "@material-ui/core";
import Router, { route } from "preact-router";
import Success from "./success";
import { eventTarget, SNACKBAR_EVENT } from "../../components/snackbar";
import { useTranslation } from "react-i18next";

const useClasses = makeStyles({
  root: {
    marginTop: "30vh",
    textAlign: "center",
  },
});

const Install = ({ code, error }) => {
  const classes = useClasses();
  const { t } = useTranslation("Install");

  useLayoutEffect(() => {
    // no error or code from slack service
    // -> redirect to index
    if (!error && !code) {
      route("/");
      return;
    }

    if (error) {
      eventTarget.dispatchEvent(
        new CustomEvent(SNACKBAR_EVENT, {
          detail: {
            text: t(`Errors.Slack:${error}`),
            severity: "error",
          },
        })
      );
      return;
    }

    if (code) {
      const url = new URL("/install", process.env.PREACT_PUBLIC_BACKEND_URL);
      url.searchParams.set("code", code);
      fetch(url);
    }
  }, [code, error, t]);

  return (
    <div>
      <Container classes={{ root: classes.root }}>
        <Router>
          <Success path="/install/success" />
        </Router>
      </Container>
    </div>
  );
};

export default Install;
