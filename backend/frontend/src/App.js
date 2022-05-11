import React from "react";
import "./App.css";
import DBContent from "./components/DBContent.js";
import AddNewTask from "./components/AddNewTask.js";
import { Button } from "react-bootstrap";

export const fetchTaskData = async () => {
  const response = await fetch("/api");
  return new Promise(async (resolve, reject) => {
    if (response.ok) {
      console.log({ response });
      try {
        const data = await response.json();
        resolve(data);
      } catch (err) {
        console.log({ err });
      }
    }

    reject(response.statusText);
  });
};

export const addNewTaskData = async () => {
  const response = await fetch("/api/create");
  // create function to fetch data
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoaded: false,
      addNewTask: false,
      updateTask: false,
      data: [],
    };
    this.handleNewTask = this.handleNewTask.bind(this);
    this.handleUpdateTask = this.handleUpdateTask.bind(this);
    this.setData = this.setData.bind(this);
    this.delete = this.delete.bind(this);
  }

  async delete(url) {
    return fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data =>
        this.setState({
          data: data.content,
        }),
      );
  }

  componentDidMount() {
    fetchTaskData()
      .then(data =>
        this.setState({
          isLoaded: true,
          data: data,
          error: false,
        }),
      )
      .catch(error => {
        console.log(error);
        this.setState({
          isLoaded: true,
          error: error,
        });
      });
  }

  setData(data) {
    this.setState({ data });
  }

  handleNewTask() {
    this.setState({
      addNewTask: !this.state.addNewTask,
    });
    // this.componentDidMount();
  }

  handleUpdateTask() {
    this.setState({
      updateTask: !this.state.updateTask,
    });
  }

  render() {
    const { error, isLoaded, data, addNewTask } = this.state;
    if (error) {
      return (
        <div className="App">
          <header className="App-header">
            <p>Error: {error}</p>
          </header>
        </div>
      );
    } else if (!isLoaded) {
      return (
        <div className="App">
          <header className="App-header">
            <h1>HyperionDev dashboard replica</h1>
            <p>Loading dashboard...</p>
          </header>
        </div>
      );
    } else {
      return (
        <div className="App">
          <header className="App-header">
            <h1>HyperionDev dashboard replica</h1>
            {data.length < 1 ? (
              <h2>Your database is empty</h2>
            ) : addNewTask ? (
              <AddNewTask
                handleNewTask={this.handleNewTask}
                setData={this.setData}
              />
            ) : (
              <>
                <DBContent
                  data={this.state.data}
                  methods={{ delete: this.delete }}
                />
                <Button variant="success" onClick={this.handleNewTask}>
                  Add new task
                </Button>
              </>
            )}
          </header>
        </div>
      );
    }
  }
}

export default App;
