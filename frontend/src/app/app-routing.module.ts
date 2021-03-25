import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path:'sign-up', component: SignUpComponent},
  {path:'login', component: LoginComponent},
  {path:'home',component:HomeComponent,canActivate:[AuthGuard]}
];

@NgModule ({
  imports : [RouterModule.forRoot(routes)],
  exports : [RouterModule]
})

export class AppRoutingModule{}
