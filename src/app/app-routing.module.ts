import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes }  from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/signup/signup.component';
import { RequestResetComponent } from './components/password/request-reset/request-reset.component';
import { ResponseResetComponent } from './components/password/response-reset/response-reset.component';
import { BeforeLoginService } from './services/before-login.service';
import { AfterLoginService } from './services/after-login.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { userRoutes } from './components/profile/user.routing';

const appRoutes: Routes = [
  { path:'', redirectTo: '/login', pathMatch:'full'},
  { path:'login', component: LoginComponent, canActivate: [BeforeLoginService]},
  { path:'profile', component: ProfileComponent, children: userRoutes ,canActivate: [AfterLoginService]},
  { path:'signup', component: SignupComponent, canActivate: [BeforeLoginService]},
  { path:'request-password-reset', component: RequestResetComponent, canActivate: [BeforeLoginService]},
  { path:'response-password-reset', component: ResponseResetComponent, canActivate: [BeforeLoginService]},
  { path:'**', component: NotFoundComponent},
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports:[RouterModule],
  declarations: []
})
export class AppRoutingModule { }
