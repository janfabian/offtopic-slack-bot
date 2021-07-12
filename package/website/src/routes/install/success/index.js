import { h } from "preact";
import { Container, makeStyles } from "@material-ui/core";

const useClasses = makeStyles({
  root: {
    marginTop: "30vh",
    textAlign: "center",
  },
});

const Success = () => {
  const classes = useClasses();

  return (
    <div>
      <Container classes={{ root: classes.root }}>SUCCESS</Container>
    </div>
  );
};

export default Success;
