import { h } from "preact";
import { Container, makeStyles, Typography } from "@material-ui/core";

const useClasses = makeStyles({
  root: {
    marginTop: "30vh",
    textAlign: "center",
  },
});

const NotFound = () => {
  const classes = useClasses();

  return (
    <div>
      <Container classes={{ root: classes.root }}>
        <Typography variant="h3" component="h1">
          Not Found
        </Typography>
      </Container>
    </div>
  );
};

export default NotFound;
