import React, { useState } from "react";

import "../assests/dbContent.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button } from "react-bootstrap";
import { TableRow } from "./TableRow.js";
import { STATUSES } from "../utils/constants.js";

/* 
* postData function
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
* DBContent component
We will keep it as a function and not a class inorder to use react hooks
*/
export function DBContent(props) {
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
  const [progress, setProgress] = useState(STATUSES[0]);
  const [grade, setGrade] = useState("");
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  /* 
  * handleSubmit fucntion
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
        // this will clear the error message
        // will also set a success message
        // that will clear after 2 seconds
        setError(null);
        setSuccess(data.message);
        setTimeout(() => {
          setSuccess("");
        }, 3000);

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
        setProgress(STATUSES[0]);
        setGrade("");
      })
      .catch(error => console.error(error));
  };

  /* 
  * handleDelete
  This was the simplest function to write
  It's a simple 'DELETE' made to the api
  It takes the task in as an argument 
  And uses the tasks ID to delete it from our db.json
  */
  const handleDelete = task => {
    return deleteData(`/api/delete/${task.id}`);
  };

  /* 
  * Return
  We will return a simple table with dynamic inputs and buttons
  The user will be able to add, update and delete tasks all infront of their eyes
  */
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
              <th>Task *</th>
              <th>Task Name</th>
              <th>Progress</th>
              <th>Grade</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map(task => {
              return (
                <TableRow
                  key={task.id}
                  task={task}
                  handleDelete={handleDelete}
                  methods={{
                    setData: setData,
                    setError: setError,
                    setSuccess: setSuccess,
                  }}
                />
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
                  name="progress"
                  onChange={evt => setProgress(evt.target.value)}
                >
                  {STATUSES.map(status => (
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
                  placeholder="Enter the grade"
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
        <div id="successOutput">{success}</div>
      </form>
    </div>
  );
}
