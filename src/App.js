import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud } from "@fortawesome/free-solid-svg-icons";

import HomeComponent from "./components/Home";
import CreateBucketComponent from "./components/CreateBucket";
import BucketComponent from "./components/Bucket";

function App() {
  const logoOnClick = (e) => {
    window.open("/");
  };

  return (
    <Router>
      <AppBar position="relative">
        <Toolbar>
          <Typography
            id="logo"
            variant="h6"
            color="inherit"
            noWrap
            onClick={logoOnClick}
          >
            <FontAwesomeIcon icon={faCloud} /> Cloudbucket
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Switch>
          <Route path="/" exact component={HomeComponent} />
          <Route path="/create" exact component={CreateBucketComponent} />
          <Route path="/bucket/:bucketId" exact component={BucketComponent} />
        </Switch>
      </main>
      {/* <footer>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
          style={{ fontSize: ".5em" }}
        >
          &copy; Copyright 2021 Cloudbucket
        </Typography>
      </footer> */}
    </Router>
  );
}

export default App;
