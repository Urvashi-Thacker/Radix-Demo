import { Routes } from '@angular/router';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AddComponent } from './components/add/add.component';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [{
  path: 'sign-up',
  component: SignUpComponent
}, {
  path: 'sign-in',
  component: SignInComponent
},

{
  path: 'employee',
  component: EmployeeComponent,
  canActivate: [authGuard]
},

{
  path: '',
  redirectTo: "/sign-up",
  pathMatch: "full"
},
{
  path: 'add',
  component: AddComponent,
  canActivate: [authGuard]
},
{
  path: '**',
  component: NotFoundComponent
}

];
