import React from "react";
import "./App.css";
import DBContent from "./components/DBContent.js";
import { Button } from "react-bootstrap";

/* 
* fetchTaskData fucntion
This function is a 'GET' request made to the api
It returns all the information on db.json file 
We will display that information on our website
*/
export const fetchTaskData = async () => {
  const response = await fetch("/api");
  return new Promise(async (resolve, reject) => {
    if (response.ok) {
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

/* 
* App component 
Contains all the information and state used to display information on our website
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoaded: false,
      updateTask: false,
      data: [],
    };
    this.handleUpdateTask = this.handleUpdateTask.bind(this);
    this.setData = this.setData.bind(this);
    this.deleteData = this.deleteData.bind(this);
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
        this.setState({
          isLoaded: true,
          error: error,
        });
      });
  }

  /* 
  * deleteData fucntion
  This function is a 'DELETE' request made to our api when the user clicks the delete button 
  */
  async deleteData(url) {
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

  /* 
  * setData fucntion
  This fucntion is used to update the class app state when the user adds a new task
  This will is being called in the DBContent component 
  When this function is called, it will update the sate of the app component which will trigger a re-render
  The newData will then be displayed in the table
  */
  setData(newData) {
    this.setState({
      data: newData,
    });
  }

  handleUpdateTask() {
    this.setState({
      updateTask: !this.state.updateTask,
    });
  }

  render() {
    // creating shorthand variables from the state property
    const { error, isLoaded, data, addNewTask } = this.state;

    // if there is an error, handle it
    // if the data is still loading, let the user know
    // if the content is loaded and there are no errors, display the information
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

            {/* The following line will only be display if the database is empty */}
            {data.length < 1 && (
              <>
                <h2>Your database is empty</h2>
                <h5>Add a new task</h5>
              </>
            )}

            {/* 
              DBContent will handle the creating of the table 
              This table will display information about the table, such as the task number and name 
              It will also have a row specifically for new tasks
              A few props will be passed through:
                - data: the data we received from our 'GET' api request
                - methods: Created an object that will contain multiple functions that can be used
                  - deleteData and setData 
                  - TODO: updateData
            */}

            <DBContent
              data={this.state.data}
              methods={{ deleteData: this.deleteData, setData: this.setData }}
            />
          </header>
        </div>
      );
    }
  }
}

export default App;
