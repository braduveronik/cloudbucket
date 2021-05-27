
import { Grid, Container, Button, Typography, Box} from '@material-ui/core';
import { Link, useHistory } from "react-router-dom";

const HomeComponent = () => {
  
  const history = useHistory();

  const createBucketOnClick = (e) => {
    history.push("/create");
  };

  return (
    <div>
      <Container maxWidth="m" style={{padding: "15vh 0"}}>
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Freely share your files
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Cloudbucket is the simplest way to send your files around the world.
        </Typography>
        <div style={{padding: "20px 0"}}>
          <Grid container spacing={2} justify="center">
            <Grid item>
              <Button variant="contained" color="primary" onClick={createBucketOnClick}>
                Create a new bucket
              </Button>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
}


export default HomeComponent;