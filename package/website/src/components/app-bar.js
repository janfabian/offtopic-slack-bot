import { Fragment, h } from "preact";

import {
  AppBar as AppBarMaterial,
  Box,
  Button,
  makeStyles,
  Slide,
  Toolbar,
  useMediaQuery,
  useScrollTrigger,
} from "@material-ui/core";
import SlackIcon from "../image/slack.svg";
import { useCallback } from "preact/hooks";

const SLACK_AUTH_URL = `https://slack.com/oauth/v2/authorize?client_id=${process.env.PREACT_PUBLIC_SLACK_CLIENT_ID}&scope=app_mentions:read,channels:history,channels:manage,chat:write,chat:write.public,commands,im:write,channels:join,channels:read&user_scope=`;

const useClasses = makeStyles((theme) => ({
  appBar: {
    [theme.breakpoints.up("lg")]: {
      backgroundColor: "transparent",
    },
  },
  buttons: {
    "& button": {
      marginRight: theme.spacing(2),
      "&:last-child": {
        marginRight: 0,
      },
      "& svg": {
        fill: "white",
      },
    },
  },
}));

const AppBar = () => {
  const classes = useClasses();

  const trigger = useScrollTrigger();
  const isXs = useMediaQuery((theme) => theme.breakpoints.only("xs"), {
    noSsr: true,
  });

  const slackAuthRedirect = useCallback(() => {
    let url = SLACK_AUTH_URL;

    if (process.env.NODE_ENV === "development") {
      url += `&redirect_uri=${process.env.PREACT_PUBLIC_FRONTEND_URL}/install`;
    }
    window.open(url, "_blank");
  }, []);

  return (
    <Fragment>
      <Slide appear={false} direction="down" in={!trigger || isXs}>
        <AppBarMaterial
          classes={{ root: classes.appBar }}
          elevation={0}
          color="inherit"
        >
          <Toolbar>
            <Box flexGrow={1} />
            <Box className={classes.buttons}>
              <Button
                startIcon={<SlackIcon />}
                color="primary"
                variant="contained"
                onClick={slackAuthRedirect}
                disableElevation
              >
                Add to Slack
              </Button>
              <Button>FAQ</Button>
              <Button>Github</Button>
            </Box>
            <Box flexGrow={isXs ? 1 : 0.1} />
          </Toolbar>
        </AppBarMaterial>
      </Slide>
    </Fragment>
  );
};

export default AppBar;
