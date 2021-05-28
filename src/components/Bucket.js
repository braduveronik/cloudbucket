import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faFileAlt,
  faCrown,
  faWeightHanging,
  faHistory,
  faDownload,
  faUpload,
  faEnvelopeOpenText,
  faInbox
} from "@fortawesome/free-solid-svg-icons";
import {
  Container,
  Button,
  Box,
  Divider,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import Moment from "moment";

import Alert from "./Alert";

const API_ENDPOINT =
  "https://dxwpvrd1e4.execute-api.us-east-1.amazonaws.com/cloudbucket-dev/bucket";

const formatFileSize = (fs) => {
  let i = 0;
  const suffix = ["B", "KB", "MB", "GB", "TB"];
  for (; i < suffix.length && fs > 1024; ++i) {
    fs /= 1024;
  }
  return `${fs.toFixed(1)} ${suffix[i]}`;
};

const BucketComponent = (props) => {
  const {
    match: {
      params: { bucketId },
    },
  } = props;

  const [bucketData, setBucketData] = useState(null);
  const [requestState, setRequestState] = useState("default");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [triggerReload, setTriggerReload] = useState(false);
  const [didUpload, setDidUpload] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!didUpload) {
      setRequestState("loading");
      setFeedbackMessage("Loading bucket contents...");
    }

    fetch(`${API_ENDPOINT}/${bucketId}`)
      .then((e) => {
        if (e.status == 200) {
          e.json().then((data) => {
            console.log(data);
            if (!didUpload) {
              setRequestState("default");
            }
            setBucketData((old) => {
              return data;
            });
          });
        } else {
          e.json().then((data) => {
            setRequestState("error");
            setFeedbackMessage(data.message);
          });
        }
      })
      .catch((e) => {
        setRequestState("error");
        setFeedbackMessage(e);
      });
  }, [triggerReload]);

  const uploadFile = (file) => {
    if (file === undefined) {
      return;
    }

    setRequestState("loading");
    setFeedbackMessage("Uploading file...");

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64File = reader.result.split(",")[1];

      fetch(`${API_ENDPOINT}/${bucketId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: file.name,
          data: base64File,
        }),
      }).then((e) => {
        console.log(e);
        if (e.status == 200) {
          e.json().then((data) => {
            setFeedbackMessage(data.message);
            setRequestState("success");
            setDidUpload(true);
            setTriggerReload(!triggerReload);
          });
        } else if (e.status == 400 || e.status == 404) {
          e.json().then((data) => {
            setFeedbackMessage(data.message);
            setRequestState("error");
          });
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const fileSelectionOnChange = (e) => {
    console.log(e.target.files[0]);
    uploadFile(e.target.files[0]);
  };

  const triggerDownload = (file) => {
    return (e) => {
      fetch(`${API_ENDPOINT}/${bucketId}/${file}`)
        .then((e) => {
          if (e.status == 200) {
            e.json().then((data) => {
              if (data?.url || null) {
                console.log(data.url);
                window.open(data.url, "_blank");
              }
            });
          } else {
            e.json().then((data) => {
              setFeedbackMessage(data.message ?? "No error specified");
              setRequestState("error");
            });
          }
        })
        .catch((e) => {
          console.log(e);
          setFeedbackMessage("Error getting download!");
          setRequestState("error");
        });
    };
  };

  const subscribeShowOnClick = (e) => {
    setModalShow(true);
  };

  const handleModalClose = (e) => {
    setModalShow(false);
  };

  const subscribeOnClick = (e) => {
    console.log(email);
    const subscribePayload = {
      email: email,
    };

    fetch(`${API_ENDPOINT}/${bucketId}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscribePayload),
    })
      .then((e) => {
        if (e.status == 200) {
          setFeedbackMessage(
            "Subscribed successfully! Please check your mail and validate your subscription. :-)"
          );
          setRequestState("success");
          handleModalClose();
        } else {
          e.json().then((data) => {
            setFeedbackMessage(data.message);
            setRequestState("error");
            handleModalClose();
          });
        }
      })
      .catch((e) => {
        setModalShow("Failed subscribing");
        setRequestState("error");
      });
  };

  return (
    <Container component="main" maxWidth="lg">
      <Dialog open={modalShow} onClose={handleModalClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this bucket, please enter your email address here.
            We will send updates for every file upload.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={subscribeOnClick} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
      <div style={{ padding: "4em 0" }}>
        {requestState === "loading" ||
        requestState === "error" ||
        requestState == "success" ? (
          <Alert severity={requestState}>{feedbackMessage}</Alert>
        ) : null}
        {bucketData !== null ? (
          <Box>
            <div id="bucket-header">
              <div id="bucket-title">
                <span style={{ marginRight: ".5em" }}>{bucketData.name}</span>
                <span style={{ fontSize: ".5em", color: "rgba(0, 0, 0, .5)" }}>
                  #{bucketData.bucket_id}
                </span>
                <span style={{ float: "right" }}>
                  <Button
                    color="secondary"
                    component="label"
                    onClick={subscribeShowOnClick}
                  >
                    <FontAwesomeIcon
                      style={{ marginRight: "4px" }}
                      icon={faEnvelopeOpenText}
                    />
                    Subscribe
                  </Button>
                  <Button color="primary" component="label">
                    <FontAwesomeIcon
                      style={{ marginRight: "4px" }}
                      icon={faUpload}
                    />
                    Upload
                    <input
                      type="file"
                      hidden
                      onChange={fileSelectionOnChange}
                    />
                  </Button>
                </span>
              </div>
              <Divider />
              <div id="bucket-info">
                <span className="info-item">
                  <FontAwesomeIcon icon={faEye} /> {bucketData.views}
                </span>
                <span className="info-item">
                  <FontAwesomeIcon icon={faFileAlt} /> {bucketData.files.length}
                </span>
                <span className="info-item">
                  <FontAwesomeIcon icon={faCrown} /> {bucketData.owner_email}
                </span>
              </div>
            </div>
            <div id="bucket-listing">
              {bucketData.files.length == 0 ? (
                <div class="empty-bucket">
                  <FontAwesomeIcon icon={faInbox} style={{marginRight: "5px"}}/>
                  No files in the bucket</div>
              ) : null}
              {bucketData.files.map((item) => {
                const { name, lastModified, size } = item;
                return (
                  <div className="file-item-container">
                    <div className="left-icon">
                      <FontAwesomeIcon icon={faFileAlt} />
                    </div>
                    <div className="content">
                      <div>{decodeURIComponent(name)}</div>
                      <div className="file-info">
                        <span>
                          <FontAwesomeIcon icon={faWeightHanging} />{" "}
                          {formatFileSize(size)}
                        </span>
                        <span>
                          <FontAwesomeIcon icon={faHistory} />{" "}
                          {Moment(lastModified).format("DD/MM/YYYY HH:mm")}
                        </span>
                      </div>
                    </div>
                    <div className="right-controls">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={triggerDownload(name)}
                      >
                        <FontAwesomeIcon size={"xs"} icon={faDownload} />
                      </IconButton>
                    </div>
                  </div>
                );
              })}
            </div>
          </Box>
        ) : null}
      </div>
    </Container>
  );
};

export default BucketComponent;
