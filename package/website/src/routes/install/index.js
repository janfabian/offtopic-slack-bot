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

const Install = ({ code }) => {
  const classes = useClasses();
  const { t } = useTranslation("Install");

  useLayoutEffect(() => {
    if (!code) {
      eventTarget.dispatchEvent(
        new CustomEvent(SNACKBAR_EVENT, {
          detail: {
            text: t("The installation url is missing code parameter"),
            severity: "error",
          },
        })
      );
      route("/");
    }
  });

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
