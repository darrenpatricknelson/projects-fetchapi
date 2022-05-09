import React from 'react';
import './App.css';
import DBContent from './components/DBContent.js';
import AddNewTask from './components/AddNewTask.js';
import { Button } from 'react-bootstrap';

export const fetchTaskData = async () => {
  const response = await fetch('/api');
  return new Promise(async (resolve, reject) => {
    if (response.ok) {
      const data = await response.json();
      resolve(data);
    }

    reject(response.statusText);
  });
};

export const addNewTaskData = async () => {
  const response = await fetch('/api/create');
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
      data: []
    };
    this.handleNewTask = this.handleNewTask.bind(this);
    this.handleUpdateTask = this.handleUpdateTask.bind(this);
  }

  componentDidMount() {
    fetchTaskData()
      .then((data) =>
        this.setState({
          isLoaded: true,
          data: data,
          error: false
        })
      )
      .catch((error) => {
        this.setState({
          isLoaded: true,
          error: error
        });
      });
  }

  handleNewTask() {
    this.setState({
      addNewTask: !this.state.addNewTask
    });
    this.componentDidMount();
  }

  handleUpdateTask() {
    this.setState({
      updateTask: !this.state.updateTask
    });
  }

  render() {
    const { error, isLoaded, data, addNewTask } = this.state;
    if (error) {
      return (
        <div className="App">
          <header className="App-header">
            <p>Error: {error.message}</p>
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
              <AddNewTask handleNewTask={this.handleNewTask} />
            ) : (
              <>
                <DBContent data={data} />
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
