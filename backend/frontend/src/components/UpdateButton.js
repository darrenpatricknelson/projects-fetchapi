import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UpdateButton(props) {
  const task = props.task;

  const updateClick = () => {
    console.log('Update button clicked');
  };

  return (
    <Button variant="warning" onClick={updateClick}>
      Update
    </Button>
  );
}
