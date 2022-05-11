import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DeleteButton(props) {
  const task = props.task;

  const deleteClick = () => {
    console.log("Delete button clicked");
  };

  return (
    <Button variant="danger" onClick={deleteClick}>
      Delete
    </Button>
  );
}
