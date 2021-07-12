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
                onClick={() => {
                  window.open(
                    "https://slack.com/oauth/v2/authorize?client_id=2098073289365.2099442449701&scope=app_mentions:read,channels:history,channels:manage,chat:write,chat:write.public,commands,im:write,channels:join,channels:read&user_scope=",
                    "_blank"
                  );
                }}
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
