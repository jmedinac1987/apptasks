import { Component, OnInit, Input, Output } from "@angular/core";
import { TaskService } from "../../../../services/task.service";
import { Task } from "../../../../models/task";
import { SnotifyService } from "ng-snotify";
import { AuthService } from "../../../../services/auth.service";
import { Router } from "@angular/router";
import { TokenService } from "../../../../services/token.service";

@Component({
  selector: "app-consolidated-tasks",
  templateUrl: "./consolidated-tasks.component.html",
  styleUrls: ["./consolidated-tasks.component.css"]
})
export class ConsolidatedTasksComponent implements OnInit {
  showSpinner: boolean = true;
  tasks: Task[];
  task_update: Task = new Task();
  length_tasks: boolean = true;
  number_tasks: number;
  number_search: number;
  p: number = 1;
  pageSearch: number = 1;
  filter: Task[];
  show: boolean = false;
  searchTask = {
    search: null,
    argument: null
  };

  constructor(
    private taskService: TaskService,
    private notify: SnotifyService,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe(
      data => {
        this.handdleResponse(data);
      },
      error => this.handdleError(error)
    );
  }

  deleteTask(task) {
    this.showSpinner = true;
    if (confirm("Esta seguro de eliminar la tarea?")) {
      const id = task._id;
      this.taskService.deleteTask(task._id).subscribe(
        data => {
          this.serverResponse(data);
          this.tasks = this.deleteItemTasks(this.tasks, id);
          this.number_tasks = this.tasks.length;
          this.filter = this.deleteItemTasks(this.filter, id);
          this.number_search = this.filter.length;
        },
        error => this.handdleError(error)
      );
    }else{
      this.showSpinner = false;
    }
  }

  deleteItemTasks(array, elem) {
    return array.filter(e => e._id !== elem);
  }

  filterTask(search) {
    if (search.argument === "title") {
      this.filter = this.tasks.filter(function(task) {
        return (
          task.title.toLowerCase().indexOf(search.search.toLowerCase()) > -1
        );
      });
      this.searchTask.search = null;
      this.searchTask.argument = null;
      this.show = true;
      this.number_search = this.filter.length;
      return this.filter;
    }

    if (search.argument === "state") {
      this.filter = this.tasks.filter(function(task) {
        return (
          task.state.toLowerCase().indexOf(search.search.toLowerCase()) > -1
        );
      });
      this.searchTask.search = null;
      this.searchTask.argument = null;
      this.show = true;
      this.number_search = this.filter.length;
      return this.filter;
    }
  }

  handdleResponse(data) {
    this.showSpinner = false;
    this.tasks = data.tasks;
    this.number_tasks = this.tasks.length;
    this.tasks.length <= 0
      ? (this.length_tasks = false)
      : (this.length_tasks = true);
  }

  handdleError(error) {
    this.showSpinner = false;
    if (error.status === 0) {
      this.notify.error(
        "Lo sentimos en este momento no podemos procesar su solicitud",
        { timeout: 0 }
      );
      return;
    }

    if (error.error.message === "Token invalido") {
      this.notify.error("No tienes autorización", { timeout: 5000 });
      this.tokenService.removeToken();
      this.authService.changeAuthStatus(false);
      this.router.navigate(["/login"]);
      return;
    }

    this.notify.error(`Error: ${error.error.message}`, { timeout: 5000 });
  }

  setTask(task) {
    this.task_update = task;
  }

  onSubmit() {
    this.filterTask(this.searchTask);
  }

  onSubmitUpdate() {
    let closeModal = document.getElementById("closeModalEdit");
    closeModal.click();
    this.showSpinner = true;

    if (this.task_update.state === "realizado")
      this.task_update.endDate = Date.now().toString();

    this.taskService.putTask(this.task_update).subscribe(
      data => {
        this.serverResponse(data);
        this.ngOnInit();
      },
      error => this.handdleError(error)
    );
  }

  serverResponse(response) {
    this.showSpinner = false;
    this.notify.success(response.message, { timeout: 3000 });
    this.task_update = new Task();
  }

  showAllRegisters() {
    this.show = false;
  }
}
