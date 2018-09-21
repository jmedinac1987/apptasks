import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { AfterLoginService } from './services/after-login.service';
import { BeforeLoginService } from './services/before-login.service';
import { TaskService } from './services/task.service';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';//paginación

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RequestResetComponent } from './components/password/request-reset/request-reset.component';
import { ResponseResetComponent } from './components/password/response-reset/response-reset.component';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserTaskComponent } from './components/profile/user-task/user-task.component';
import { ConsolidatedTasksComponent } from './components/profile/consolidated-tasks/consolidated-tasks.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AboutComponent } from './components/profile/about/about.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    RequestResetComponent,
    ResponseResetComponent,
    NotFoundComponent,    
    UserTaskComponent,    
    ConsolidatedTasksComponent, 
    SpinnerComponent, 
    AboutComponent
  ],
  imports: [
    BrowserModule,    
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,    
    AppRoutingModule,
    SnotifyModule
  ],
  providers: [UserService, TokenService, TaskService, AuthService, AfterLoginService, BeforeLoginService, 
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
