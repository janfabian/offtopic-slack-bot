import { makeStyles, Snackbar as SnackBarMaterial } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { h } from "preact";
import { useCallback, useLayoutEffect, useState } from "preact/hooks";

export const eventTarget = new EventTarget();
export const SNACKBAR_EVENT = "offline-slack-bot:event:snackbar";

const useClasses = makeStyles(() => ({
  root: {
    fontSize: 14,
  },
}));

const SnackBar = () => {
  const classes = useClasses();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState();
  const [severity, setSeverity] = useState("info");

  const listener = useCallback(({ detail = {} }) => {
    if (!detail.text) {
      return;
    }

    setOpen(true);
    setText(detail.text);
    setSeverity(detail.severity || "info");
  }, []);

  useLayoutEffect(() => {
    eventTarget.addEventListener(SNACKBAR_EVENT, listener);

    return () => eventTarget.removeEventListener(SNACKBAR_EVENT, listener);
  }, [listener]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <SnackBarMaterial
      open={open}
      autoHideDuration={60000}
      onClose={handleClose}
    >
      <Alert
        classes={{ root: classes.root }}
        variant="standard"
        onClose={handleClose}
        severity={severity}
      >
        {text}
      </Alert>
    </SnackBarMaterial>
  );
};

export default SnackBar;
