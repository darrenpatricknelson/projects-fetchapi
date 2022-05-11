import React, { useState } from "react";
import "../assests/addNewTask.css";
import { Table, Button } from "react-bootstrap";

const postData = (url, data) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .catch(error => console.error(error));
};

const statuses = ["Not started", "In progress", "Submitted", "Reviewed"];

export default function AddNewTask(props) {
  const { handleNewTask, setData } = props;

  const [id, setId] = useState();
  const [title, setTitle] = useState();
  const [progress, setProgress] = useState(statuses[0]);
  const [grade, setGrade] = useState();

  const [error, setError] = useState();

  const handleSubmit = () => {
    //   create a data object
    const data = {
      id: Number(id),
      title,
      progress,
      grade: Number(grade),
    };

    postData("api/create", data)
      .then(data => {
        if (!data.success) {
          setError(data.message);
          return;
        }

        setError(null);
        setData(data.content);
        handleNewTask();
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="dbContentOutput">
      <form
        onSubmit={evt => {
          evt.preventDefault();
          handleSubmit();
        }}
      >
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
                <input
                  onChange={evt => setId(evt.target.value)}
                  placeholder="Enter your task number"
                />
              </td>
              <td>
                <input
                  onChange={evt => setTitle(evt.target.value)}
                  placeholder="Enter the name of your task"
                />
              </td>
              <td>
                <select
                  name="progress"
                  onChange={evt => setProgress(evt.target.value)}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  onChange={evt => setGrade(evt.target.value)}
                  placeholder="If graded, enter the grade"
                />
              </td>
            </tr>
          </tbody>
        </Table>
        <div id="errorOutput">{error}</div>
        <Button type="submit" variant="success">
          Submit
        </Button>
      </form>
    </div>
  );
}
