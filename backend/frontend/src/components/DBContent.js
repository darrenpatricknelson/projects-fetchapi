import React from "react";
import "../assests/dbContent.css";
import "bootstrap/dist/css/bootstrap.min.css";
import UpdateTask from "./UpdateTask";
import { Table, Button } from "react-bootstrap";

const deleteData = async url => {
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());
};

class DBContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userUpdatingTask: false,
      updateTaskInfo: [],
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleUpdate(task) {
    this.setState({
      userUpdatingTask: !this.state.userUpdatingTask,
      updateTaskInfo: task,
    });
  }

  handleDelete(task) {
    return this.props.methods.delete(`/api/delete/${task.id}`);
  }

  render() {
    const { data } = this.props;
    return (
      <div className="dbContentOutput">
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
                      onClick={() => this.handleUpdate(task)}
                    >
                      Update
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => this.handleDelete(task)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default DBContent;
