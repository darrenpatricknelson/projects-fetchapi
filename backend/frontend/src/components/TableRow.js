import { useState } from "react";
import { Button } from "react-bootstrap";
import { STATUSES } from "../utils/constants";

export default function TableRow(props) {
  const { handleDelete, task, setData } = props;

  const [isReadOnly, setIsReadOnly] = useState(true);

  const [id, setId] = useState(task.id);
  const [title, setTitle] = useState(task.title);
  const [progress, setProgress] = useState(task.progress);
  const [grade, setGrade] = useState(task.grade);

  const [error, setError] = useState();

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
        setData(data.content);
        setIsReadOnly(true)
      })
      .catch(err => {
        setError(err);
        console.error(err);
      });
  };

  return (
    <tr>
      <td>
        {isReadOnly ? (
          <span>{id}</span>
        ) : (
          <input
            type="text"
            value={id}
            onChange={evt => setId(evt.target.value)}
          ></input>
        )}
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
          <Button
            variant="warning"
            onClick={() => setIsReadOnly(false)}
          >
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
