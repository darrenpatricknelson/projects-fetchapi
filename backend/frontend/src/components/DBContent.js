import React, { useState } from "react";

import "../assests/dbContent.css";
import "bootstrap/dist/css/bootstrap.min.css";
import UpdateTask from "./UpdateTask";
import { Table, Button } from "react-bootstrap";

/* 
# postData function
postData fucntion is our 'POST' api request
When the user adds a new task and clicks on the add new task button
the * handleSubmit function will run
That make will make an api 'POST' request by calling this postData function
*/
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

/* 
# statuses
statuses is just an array of progress points 
This array will be used wehn creating the table
The loop in the table will output these progress points as options
Instead of copy and pasting options, we will use a loop instead
Easier to maintain and scale up or down
 */
const statuses = ["Not started", "In progress", "Submitted", "Reviewed"];

/* 
# DBContent component
We will keep it as a function and not a class inorder to use react hooks
*/
export default function DBContent(props) {
  /* 
  ! Shorthand variables
  Creating shorthand variables from the props being passed from the app component
  */
  const { data } = props;
  const { deleteData, setData } = props.methods;
  const { userIsUpdatingTask, setUserIsUpdatingTask } = useState(false);

  /* 
  ! Hooks
  Creating functions using the useState hook
  */
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(statuses[0]);
  const [grade, setGrade] = useState("");
  const [error, setError] = useState();

  /* 
  # handleSubmit fucntion
  When the user adds a new task and clicks on the add new task button, this function will run
  This function will take the information from the form, use the useState hook to set variable values 
  and and with those values, creating a data object that we will send to the api in our 'POST' request
  */
  const handleSubmit = () => {
    //   create a data object
    const data = {
      id: Number(id),
      title,
      progress,
      grade: Number(grade),
    };

    // POST api request
    postData("api/create", data)
      .then(data => {
        /* 
        ! data.success
        In my response object from the api, there is a success key
        If there is any error, that success will be set to false
        If that success is set to false, this if statement will run its block of code
        The error message will be displayed to the user and the user can quickly correct their mistake
        */
        if (!data.success) {
          setError(data.message);
          return;
        }

        // setting the error to null since it passed our data.success check
        setError(null);
        /* 
        ! setData
        This is a function in our app component 
        This function will pass the new data/ content through to tour app component
        Which will them update it's state 
        triggering a re-render
        */
        setData(data.content);

        // setting the variables back to an empty string
        // This will also clear the input fields of the addNewTask form
        setId("");
        setTitle("");
        setProgress(statuses[0]);
        setGrade("");
      })
      .catch(error => console.error(error));
  };

  /* 
  # handleDelete
  This was the simplest function to write
  It's a simple 'DELETE' made to the api
  It takes the task in as an argument 
  And uses the tasks ID to delete it from our db.json
  */
  const handleDelete = task => {
    return deleteData(`/api/delete/${task.id}`);
  };

  /* 
  TODO: add comments 
  */
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
                        // onClick={() => handleUpdate(task)}
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
                    value={id}
                    onChange={evt => setId(evt.target.value)}
                    placeholder="Enter your task number"
                  />
                  {}
                </td>
                <td>
                  <input
                    value={title}
                    onChange={evt => setTitle(evt.target.value)}
                    placeholder="Enter your task name"
                  />
                </td>
                <td>
                  <select
                    value={statuses[0]}
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
                    value={grade}
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
          <div id="errorOutput">{error}</div>
        </form>
      </div>
    );
  } else {
    return "Hello";
  }
}
