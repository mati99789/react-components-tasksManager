import React from "react";
import Api from "./ApiHandler";

class TasksManager extends React.Component {
  api = new Api("http://localhost:3005/data");

  state = {
    tasks: [],
    task: "",
  };


  componentDidMount() {
      console.log('Component did mount');
      this.loadData();
  }

  loadData = () => {
      this.api.loadData()
        .then((data) => {
            this.setState({ tasks: data});
        })
        .catch((error) => {
            console.log(error)
        })
  }

//Handlers
  onClick = () => {
    const { tasks, task } = this.state;
    console.log(tasks, task);
  };

  handleTaskName = (e) => {
    this.setState({
      task: e.target.value,
    });
  };

  submitHandleAddTask = (e) => {
    e.preventDefault();

    const newTask = {
      taskName: this.state.task,
      time: 0,
      isRunning: false,
      isDone: false,
      isRemoved: false,
    };

    this.api.addData(newTask)
        .then(() => {
            this.api.loadData()
                .then(data => {
                    this.setState({
                        tasks: [...data],
                        task: ''
                    })
                })
        })
  };

  btnStartStop = (e) => {
      const parentElement = e.target.parentElement.parentElement;

      const currId = parentElement.dataset.id;
      
  }

  //   REACT DOM RENDER
  render() {
    return (
      <>
        <h1 onClick={this.onClick}>TasksManager</h1>
        <this.DisplayTasks />
        <h2>Add new Task</h2>
        <this.AddTask />
      </>
    );
  }

  // USER INTERFACE
  DisplayTasks = () => {
      const taskItem = this.state.tasks.map(task => {
          return (
            <section data-id={task.id}>
              <header >{task.taskName} {task.time}sec</header>
              <footer>
                <button onClick={this.btnStartStop} disabled={task.isDone}>Start / Stop</button>
                <button onClick={this.btnEnded} disabled={task.isRunning}>Zakonczone</button>
                <button onClick={this.btnDelete} disabled={task.isRemoved}>Usun</button>
              </footer>
            </section>
          );
      });

      return <>{taskItem}</>;
  };

  AddTask = () => {
    return (
      <form onSubmit={this.submitHandleAddTask}>
        <label>
          Add new task:
          <input
            type="text"
            value={this.state.task}
            onChange={this.handleTaskName}
          />
        </label>
        <input type="submit" value="Send" />
      </form>
    );
  };
}

export default TasksManager;
