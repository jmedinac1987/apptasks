import { Component, OnInit, OnDestroy } from "@angular/core";
import { TaskService } from "../../../services/task.service";
import { Task } from "../../../models/task";
import { SnotifyService } from "ng-snotify";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { TokenService } from "../../../services/token.service";
import { Subscription } from "rxjs";

export class SearchTask {
  search: string;
  argument: string;
  constructor() {}
}

@Component({
  selector: "app-consolidated-tasks",
  templateUrl: "./consolidated-tasks.component.html",
  styleUrls: ["./consolidated-tasks.component.css"]
})
export class ConsolidatedTasksComponent implements OnInit, OnDestroy {
  public subscription: Subscription;
  public subscriptionDelete: Subscription;
  public subscriptionUpdate: Subscription;
  public showSpinner: boolean = true;
  public tasks: Task[];
  public task_update: Task = new Task();
  public length_tasks: boolean = true;
  public number_tasks: number;
  public number_search: number;
  public currentPage: number = 1;
  public pageSearch: number = 1;
  public filter: Task[];
  public show: boolean = false;
  public searchTask: SearchTask = new SearchTask();

  constructor(
    private taskService: TaskService,
    private notify: SnotifyService,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.subscription = this.taskService.getTasks().subscribe(
      data => {
        this.handdleResponse(data);
      },
      error => this.handdleError(error)
    );
  }
  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.subscriptionDelete) this.subscriptionDelete.unsubscribe();
    if (this.subscriptionUpdate) this.subscriptionUpdate.unsubscribe();
  }

  deleteTask(task: Task) {
    this.showSpinner = true;
    if (confirm("Esta seguro de eliminar la tarea?")) {
      const id = task._id;
      this.subscriptionDelete = this.taskService.deleteTask(task).subscribe(
        data => {
          this.serverResponse(data);
          this.tasks = this.deleteItemTasks(this.tasks, id);
          this.number_tasks = this.tasks.length;
          this.filter = this.deleteItemTasks(this.filter, id);
          this.number_search = this.filter.length;
        },
        error => this.handdleError(error)
      );
    } else {
      this.showSpinner = false;
    }
  }

  deleteItemTasks(array, elem) {
    return array.filter(e => e._id !== elem);
  }

  filterTask() {
    let searchTask = this.searchTask;
    if (this.searchTask.argument === "title") {
      this.filter = this.tasks.filter(function(task) {
        return (
          task.title.toLowerCase().indexOf(searchTask.search.toLowerCase()) > -1
        );
      });
      this.searchTask = new SearchTask();
      this.show = true;
      this.number_search = this.filter.length;
      return this.filter;
    }

    if (this.searchTask.argument === "state") {
      this.filter = this.tasks.filter(function(task) {
        return (
          task.state.toLowerCase().indexOf(searchTask.search.toLowerCase()) > -1
        );
      });
      this.searchTask = new SearchTask();
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

  onSubmitUpdate() {
    let closeModal = document.getElementById("closeModalEdit");
    closeModal.click();
    this.showSpinner = true;

    if (this.task_update.endDate && this.task_update.state === "pendiente")
      this.task_update.endDate = null;

    if (this.task_update.state === "realizado")
      this.task_update.endDate = Date.now();

    this.subscriptionUpdate = this.taskService.putTask(this.task_update).subscribe(
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
