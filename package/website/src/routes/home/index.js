import { h } from "preact";
import { useEffect, useState } from "preact/compat";
import {
  Box,
  Container,
  Fade,
  makeStyles,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { ChatBubble, TrackChanges } from "@material-ui/icons";
import clsx from "clsx";

const useClasses = makeStyles((theme) => ({
  middle: {
    display: "table-cell",
    verticalAlign: "middle",
    paddingBottom: "10vh",
  },
  fullHeight: {
    height: "100vh",
  },
  icon: {
    color: theme.palette.primary.main,
  },
  title: {
    textTransform: "uppercase",
  },
  strong: {
    fontWeight: 400,
  },
}));

const Home = () => {
  const classes = useClasses();

  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div>
      <Container maxWidth="md">
        <Fade in={fadeIn} timeout={500}>
          <Box
            mx="auto"
            classes={{ root: clsx(classes.middle, classes.fullHeight) }}
          >
            <Typography variant="h2" component="h1" className={classes.title}>
              Offtopic slack bot
            </Typography>
            <Typography variant="h4" component="h1">
              Keep your threads on point
            </Typography>
          </Box>
        </Fade>
        <Box my={3} classes={{ root: clsx(classes.fullHeight) }}>
          <Typography variant="h4" component="h2">
            <span className={classes.strong}>Why</span> should I install it?
          </Typography>
          <p>
            <Typography variant="body1">
              Quis tempor adipisicing ad pariatur nostrud anim elit non
              consequat mollit consectetur voluptate.
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ChatBubble className={classes.icon} />
                </ListItemIcon>
                <ListItemText
                  primary="Nisi mollit quis pariatur enim consequat excepteur esse eiusmod quis amet consequat qui."
                  secondary="Secondary text"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrackChanges className={classes.icon} />
                </ListItemIcon>
                <ListItemText
                  primary="Ad sint occaecat veniam dolore ullamco id."
                  secondary="Secondary text"
                />
              </ListItem>
            </List>
          </p>
        </Box>
        <Box pb={20}> </Box>
        <Box height="100vh" />
      </Container>
    </div>
  );
};

export default Home;
