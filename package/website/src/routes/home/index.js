import { h } from "preact";
import { Container, makeStyles, Typography } from "@material-ui/core";

const useClasses = makeStyles({
  root: {
    marginTop: "30vh",
    textAlign: "center",
  },
});

const Home = () => {
  const classes = useClasses();

  return (
    <div>
      <Container classes={{ root: classes.root }}>
        <Typography variant="h3" component="h1">
          Offtopic slack bot
        </Typography>
      </Container>
    </div>
  );
};

export default Home;
