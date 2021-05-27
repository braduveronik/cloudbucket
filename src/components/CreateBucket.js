import { useState } from 'react';
import { Container, Button, Typography, TextField, CircularProgress} from '@material-ui/core';
import { Link, useHistory } from "react-router-dom";

import Alert from "./Alert";

const API_ENDPOINT = "https://dxwpvrd1e4.execute-api.us-east-1.amazonaws.com/cloudbucket-dev";
const API_CRATE_BUCKET = "bucket";

const CreateBucketComponent = () => {

  const history = useHistory();
  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ requestState, setRequestState ] = useState("default");
  const [ feedbackMessage, setFeedbackMessage ] = useState("");

  const updateStateWithValue = (stateCb) => {
    return (e) => {
      stateCb(e.target.value);
    }
  };

  const submitButtonOnClick = (e) => {

    const newBucket = {
      name,
      email
    };

    setRequestState("loading");

    fetch(`${API_ENDPOINT}/${API_CRATE_BUCKET}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newBucket)
    })
    .then((e) => {
      console.log(e);
      if(e.status == 200) {
        e.json().then((data) => {
          setFeedbackMessage("Bucket successfully created!")
          setRequestState("success");
          setTimeout(() => {
            history.push(`/bucket/${data.bucket_id}`);
          }, 1000);
        });
      } else {
        e.json().then((data) => {
          setFeedbackMessage(data.message);
          setRequestState("error");
        });
      }
    })
  }

  return (
    <Container component="main" maxWidth="xs">
      <div style={{padding: "4em 0"}}>
        <Typography component="h1" variant="h5">
          Create a new bucket
        </Typography>
        {(requestState === "error" || requestState === "success")
        ?
          <Alert severity={requestState}>
            {feedbackMessage}
          </Alert>
        :
            null
        }
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="name"
          label="Bucket name"
          type="text"
          id="name-input"
          value={name}
          onChange={updateStateWithValue(setName)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={updateStateWithValue(setEmail)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={submitButtonOnClick}
          disabled={requestState === "loading"}
        >
          {(requestState === "loading")
          ? 
            <>
              <CircularProgress size={15} style={{marginRight: "10px"}}/>   Loading ...
            </>
            :
              <span>
                Create
              </span>
          }
        </Button>
      </div>
    </Container>
  );
}


export default CreateBucketComponent;