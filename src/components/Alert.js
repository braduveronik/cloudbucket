import { CircularProgress } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";

const styles = {
  error: {
    backgroundColor: "rgb(253, 236, 234)",
    color: "rgb(97, 26, 21)",
  },
  success: {
    backgroundColor: "rgb(237, 247, 237)",
    color: "rgb(30, 70, 32)"
  },
  loading: {
    backgroundColor: "rgb(232, 244, 253)",
    color: "rgb(13, 60, 97)"
  }
};

const icons ={
  error: faTimes,
  success: faCheckCircle,
  loading: faSpinner
}

const Alert = (props) => {
  const severity = props.severity || "";

  return <div style={
    {
      padding: "1em",
      borderRadius: "5px",
      ...styles[severity]
    }}>
      <div className="alert-grid-container">
        <div className="left-icon">
          <FontAwesomeIcon spin={severity === "loading"} icon={icons[severity]}/>
        </div>
        <div className="content">{props.children}</div>
      </div>
    </div>;
};

export default Alert;