import { useState } from "react";
import { Button } from "react-bootstrap";
import { STATUSES } from "../utils/constants";

export default function TableRow(props) {
  // shorthand variables taken from props and props.methods
  const { handleDelete, task } = props;
  const { setData, setError, setSuccess } = props.methods;

  // will use this state when the user is busy editing
  // when this state is false, the table fields will change to inpuit fields and the user will be able to update their tasks
  const [isReadOnly, setIsReadOnly] = useState(true);

  // using hooks to update state
  // these hook functions will be used in the inputs onChange
  const [id, setId] = useState(task.id);
  const [title, setTitle] = useState(task.title);
  const [progress, setProgress] = useState(task.progress);
  const [grade, setGrade] = useState(task.grade);

  /* 
  * handleUpdate fucntion
  Once the updates his/her information, this function will run
  it will send a "PUT" request to the api
  the api will update our file and reload a new payload
  that payload will update the state of our app.js
  Once that state changes, the app will re-render will the fresh content
  */
  const handleUpdate = () => {
    fetch(`/api/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        title,
        progress,
        grade,
      }),
    })
      .then(response => response.json())
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
        // this will clear the erro message
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
        setIsReadOnly(true);
      })
      .catch(err => {
        setError(err);
        console.error(err);
      });
  };

  return (
    <tr>
      <td>
        <span>{id}</span>
      </td>
      <td>
        {/* 
        if isReadOnly is set to true, only readOnly information will display
        if isReadOnly is set to false, the information will be put into inputs and the user will be able to update their information
       */}
        {isReadOnly ? (
          <span>{title}</span>
        ) : (
          <input
            type="text"
            value={title}
            onChange={evt => setTitle(evt.target.value)}
          ></input>
        )}
      </td>
      <td>
        {isReadOnly ? (
          <span>{progress}</span>
        ) : (
          <select
            value={progress}
            onChange={evt => setProgress(evt.target.value)}
          >
            {STATUSES.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        )}
      </td>
      <td>
        {isReadOnly ? (
          <span>{grade}</span>
        ) : (
          <input
            type="text"
            value={grade}
            onChange={evt => setGrade(evt.target.value)}
          ></input>
        )}
      </td>
      <td className="tableButtons">
        {isReadOnly ? (
          <>
            {/* 
            This button changes the state of isReadOnly
           */}
            <Button variant="warning" onClick={() => setIsReadOnly(false)}>
              Update
            </Button>
          </>
        ) : (
          <Button onClick={handleUpdate} variant="success">
            Save
          </Button>
        )}
        <Button variant="danger" onClick={() => handleDelete(task)}>
          Delete
        </Button>
      </td>
    </tr>
  );
}
