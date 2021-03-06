import { Component, OnInit, OnDestroy } from "@angular/core";
import { TaskService } from "../../../services/task.service";
import { Task } from "../../../models/task";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { TokenService } from "../../../services/token.service";
import { SnotifyService } from "ng-snotify";
import { Subscription } from "rxjs";

@Component({
  selector: "app-user-task",
  templateUrl: "./user-task.component.html",
  styleUrls: ["./user-task.component.css"]
})
export class UserTaskComponent implements OnInit, OnDestroy {
  public subscription: Subscription;
  public subscriptionAdd: Subscription;
  public subscriptionUpdate: Subscription;
  public subscriptionDelete: Subscription;
  public showSpinner: boolean = true;
  public tasks: Task[];
  public task: Task = new Task();
  public task_update: Task = new Task();
  public length_tasks: boolean = true;
  public number_tasks: number;
  public currentPage: number = 1;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService,
    private notify: SnotifyService
  ) {}

  ngOnInit() {
    this.subscription = this.taskService
      .getTasksPending()
      .subscribe(
        data => this.handdleResponse(data),
        error => this.handdleError(error)
      );
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.subscriptionAdd) this.subscriptionAdd.unsubscribe();
    if (this.subscriptionDelete) this.subscriptionDelete.unsubscribe();
    if (this.subscriptionUpdate) this.subscriptionUpdate.unsubscribe();
  }

  deleteTask(task: Task) {
    this.showSpinner = true;
    if (confirm("Esta seguro de eliminar la tarea?")) {
      const id = task._id;
      this.subscriptionDelete = this.taskService.deleteTask(task).subscribe(
        data => {
          this.tasks = this.deleteItemTasks(this.tasks, id);
          this.number_tasks = this.tasks.length;
          this.serverResponse(data);
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

  onSubmit() {
    let closeModal = document.getElementById("closeModal");
    closeModal.click();
    this.showSpinner = true;

    if (this.task.state === "realizado") this.task.endDate = Date.now();

    this.subscriptionAdd = this.taskService.postTask(this.task).subscribe(
      data => {
        this.serverResponse(data);
        this.ngOnInit();
      },
      error => this.handdleError(error)
    );
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

  setTask(task) {
    this.task_update = task;
  }

  serverResponse(response) {
    this.showSpinner = false;
    this.notify.success(response.message, { timeout: 3000 });
    this.task_update = new Task();
    this.task = new Task();
  }
}
