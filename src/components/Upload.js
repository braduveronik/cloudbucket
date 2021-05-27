import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { Button, Container } from "@material-ui/core";

const API_ENDPOINT = "https://dxwpvrd1e4.execute-api.us-east-1.amazonaws.com/cloudbucket-dev/bucket";

const UploadComponent = (props) => {

  const {match: {params: {bucketId}}} = props;
  
  const [selectedFile, setSelectedFile] = useState();

  const submitOnClick = (e) => {
    if(selectedFile === undefined) {
      return;
    }
    const formData = new FormData();
    formData.append("File", selectedFile);
    fetch(`${API_ENDPOINT}/${bucketId}/${selectedFile.name}`, {
      method: "POST",
      body: formData
    }).then((e) => {
      console.log(e);
      if(e.status == 200) {
        e.json().then((data) => {
          console.log(data);
        })
      }
    });
  };

  const fileSelectionOnChange = (e) => {
    setSelectedFile((_) => {
      return e.target.files[0];
    });
  };

  return (
    <Container component="main" maxWidth="lg">
      <div style={{padding: "4em 0"}}>
        <Button variant="contained" component="label">
          <FontAwesomeIcon style={{marginRight: "5px"}} icon={faFileUpload}/>
          {selectedFile?.name ?? "No file selected"}
          <input type="file" hidden onClick={fileSelectionOnChange} />
        </Button>
        
        <br/>
        <Button variant="contained" color="primary" onClick={submitOnClick}>
          <FontAwesomeIcon style={{marginRight: "5px"}} icon={faUpload}/>Upload
        </Button>
      </div>
    </Container>
  );
};

export default UploadComponent;
