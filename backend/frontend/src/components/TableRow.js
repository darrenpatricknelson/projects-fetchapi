import { useState } from "react";
import { Button } from "react-bootstrap";
import { STATUSES } from "../utils/constants";

export default function TableRow(props) {
  const { handleDelete, task } = props;
  const { setData, setError, setSuccess } = props.methods;

  const [isReadOnly, setIsReadOnly] = useState(true);

  const [id, setId] = useState(task.id);
  const [title, setTitle] = useState(task.title);
  const [progress, setProgress] = useState(task.progress);
  const [grade, setGrade] = useState(task.grade);

  // const [error, setError] = useState();

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
          <Button variant="warning" onClick={() => setIsReadOnly(false)}>
            Update
          </Button>
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
