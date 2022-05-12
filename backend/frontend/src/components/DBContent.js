import React, { useState } from "react";

import "../assests/dbContent.css";
import "bootstrap/dist/css/bootstrap.min.css";
import UpdateTask from "./UpdateTask";
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

export default function DBContent(props) {
  const { data } = props;
  const { userIsUpdatingTask, setUserIsUpdatingTask } = useState(false);

  const { setData } = props;

  const [id, setId] = useState();
  const [title, setTitle] = useState();
  const [progress, setProgress] = useState(statuses[0]);
  const [grade, setGrade] = useState();

  /*
  * The following is hooks to clear the inputs
  TODO: Clear input values on submit
   */
  const [idInput, setIdInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [progressInput, setProgressInput] = useState("");
  const [gradeInput, setGradeInput] = useState("");

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
      })
      .catch(error => console.error(error));
  };

  const handleDelete = task => {
    return this.props.methods.delete(`/api/delete/${task.id}`);
  };

  if (!userIsUpdatingTask) {
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map(task => {
                return (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.title}</td>
                    <td>{task.progress}</td>
                    <td>{task.grade}</td>
                    <td className="tableButtons">
                      <Button
                        variant="warning"
                        onClick={() => handleUpdate(task)}
                      >
                        Update
                      </Button>{" "}
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(task)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}

              <tr>
                <td>
                  <input
                    onChange={evt => setId(evt.target.value)}
                    placeholder="Enter your task number"
                  />
                  {}
                </td>
                <td>
                  <input
                    onChange={evt => setTitle(evt.target.value)}
                    placeholder="Enter your task name"
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
                <td>
                  <Button type="submit" variant="success">
                    Add new task
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </form>
      </div>
    );
  } else {
    return "Hello";
  }
}

// export default DBContent;
