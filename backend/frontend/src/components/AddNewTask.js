import React from 'react';
import '../assests/addNewTask.css';
import { Table, Button } from 'react-bootstrap';

const postData = (url, data) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

export default function AddNewTask(props) {
  const handleNewTask = props.handleNewTask;

  const getDataFromForm = () => {
    const errorOutput = document.getElementById('errorOutput');
    errorOutput.innerHTML = '';

    const taskNumber = document.getElementById('taskNumber').value;
    const taskName = document.getElementById('taskName').value;
    const taskProgress = document.getElementById('progress').value;
    const taskGrade = document.getElementById('taskGrade').value;

    //   create a data object
    const data = {
      id: Number(taskNumber),
      title: taskName,
      progress: taskProgress,
      grade: Number(taskGrade)
    };

    postData('api/create', data)
      .then((data) => {
        if (!data.success) {
          errorOutput.innerHTML = data.message;
          return;
        } else {
          errorOutput.innerHTML = '';
          handleNewTask();
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="dbContentOutput">
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Task #</th>
            <th>Task Name</th>
            <th>Progress</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input id="taskNumber" placeholder="Enter your task number" />
            </td>
            <td>
              <input id="taskName" placeholder="Enter the name of your task" />
            </td>
            <td>
              <select name="progress" id="progress">
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Submitted">Submitted</option>
                <option value="Reviewed">Reviewed</option>
              </select>
            </td>
            <td>
              <input id="taskGrade" placeholder="If graded, enter the grade" />
            </td>
          </tr>
        </tbody>
      </Table>
      <div id="errorOutput"></div>
      <Button variant="success" onClick={getDataFromForm}>
        Submit
      </Button>
    </div>
  );
}
