import React from "react";
import Api from "./ApiHandler";

class TasksManager extends React.Component {
  api = new Api();

  state = {
    tasks: [],
    task: "",
  };

  componentDidMount() {
    this.loadDataFromAPI();
    console.log("Component did mount");
  }

  componentDidUpdate() {
    console.log("Komunikat po aktualizacji");
    const { tasks } = this.state;
    console.log(tasks);
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
  }

  //   REACT DOM RENDER
  render() {
    return (
      <>
        <h1 
          onClick={this.onClick}
          className= {'header'}
        >TasksManager</h1>
        <this.DisplayTasks />
        <h2>Add new Task</h2>
        <this.AddTask />
      </>
    );
  }

  // USER INTERFACE
  DisplayTasks = () => {
    const filteredSorteredTasks = this.isSorted(this.state.tasks);
    const taskItem = filteredSorteredTasks.map((task) => {
      if(!task.isRemoved) {
      return (
        <section data-id={task.id}>
          <header>
            {task.taskName} {task.time}sec
          </header>
          <footer>
            <button
              onClick={(e) => this.btnStartStop(task)}
              disabled={task.isDone ? true : false}
              className={'btn btn-start'}
            >
              Start / Stop
            </button>
            <button
              onClick={e => this.btnEnded(task)}
              disabled={task.isDone ? true : false}
              className={'btn btn-end'}
            >
              Zakonczone
            </button>
            <button
              onClick={(e) => this.btnDelete(task)}
              disabled={task.isRemoved}
              className={'btn btn-delete'}
              
            >
              Usun
            </button>
          </footer>
        </section>
      );
      }
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
            required
          />
        </label>
        <input type="submit" value="Send" />
      </form>
    );
  };

  loadDataFromAPI = () => {
    this.api
      .loadData()
      .then((data) => {
        this.setState({ tasks: data });
        console.log(data)
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

    this.api.addData(newTask).then(() => {
      this.api.loadData().then((data) => {
        this.setState({
          tasks: [...data],
          task: "",
        });
      });
    });
  };

  btnStartStop = (task) => {
    if (!task.isRunning) {
      this.runTimmer(task);
    } else {
      this.stopTimmer(task);
    }
  };

  btnEnded = (task) => {
    clearInterval(this.idTimer);

    const copyTask = { ...task, isRunning: false, isDone: true };
    const newTask = this.state.tasks.map((item) => {
      if (item.id === task.id) {
        return copyTask;
      } else {
        return item;
      }
    });

    this.setState({ tasks: newTask }, () =>
      this.api.updateData(task.id, copyTask)
    );
  }

  btnDelete = (task) => {
    const copyTask = { ...task, isRemoved: true };

    const newTask = this.state.tasks.filter((item) => {
      if (item.id !== task.id) {
        return copyTask;
      }
    });

    this.setState(
      {
        tasks: newTask,
      },
      () => this.api.updateData(task.id, copyTask)
    );
  };

  runTimmer(task) {
    this.idTimer = setInterval(() => {
      const copyTask = { ...task, time: (task.time += 1), isRunning: true };
      const newTask = this.state.tasks.map((item) => {
        if (item.id === task.id) {
          return copyTask;
        } else {
          return item;
        }
      });

      this.setState(
        {
          tasks: newTask,
        },
        () => {
          this.api.updateData(task.id, copyTask);
        }
      );
    }, 1000);
  }

  stopTimmer(task) {
    clearInterval(this.idTimer);

    const copyTask = { ...task, isRunning: false };
    const newTask = this.state.tasks.map((item) => {
      if (item.id === task.id) {
        return copyTask;
      } else {
        return item;
      }
    });

    this.setState({ tasks: newTask }, () =>
      this.api.updateData(task.id, copyTask)
    );
  }

  isSorted = (tasks) => {
    const sort = [...tasks].sort((a, b) => {
      return a.isDone - b.isDone;
    });

    return sort
  }
}

export default TasksManager;
