import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud } from "@fortawesome/free-solid-svg-icons";

import HomeComponent from "./components/Home";
import CreateBucketComponent from "./components/CreateBucket";
import BucketComponent from "./components/Bucket";

function App() {
  return (
    <>
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              <FontAwesomeIcon icon={faCloud}/> Cloudbucket
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <Router>
            <Switch>
              <Route path="/" exact component={HomeComponent}/>
              <Route path="/create" exact component={CreateBucketComponent}/>
              <Route path="/bucket/:bucketId" exact component={BucketComponent}/>
            </Switch>
          </Router>
        </main>
        <footer>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p" style={{"fontSize": ".5em"}}>
            &copy; Copyright 2021 Cloudbucket 
          </Typography>
        </footer>
      </>
    );
}

export default App;
