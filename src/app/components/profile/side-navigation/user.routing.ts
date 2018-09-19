import { Routes }  from '@angular/router';
import { UserTaskComponent } from './user-task/user-task.component';
import { ConsolidatedTasksComponent } from './consolidated-tasks/consolidated-tasks.component';
import { AfterLoginService } from '../../../services/after-login.service';
import { NotFoundComponent } from '../../not-found/not-found.component';

export const userRoutes: Routes = [
    { path:'', component: UserTaskComponent, canActivate: [AfterLoginService]},
    { path:'task', component: UserTaskComponent, canActivate: [AfterLoginService]},  
    { path:'listTasks', component: ConsolidatedTasksComponent, canActivate: [AfterLoginService] },
    { path:'**', component: NotFoundComponent},  
  ];
