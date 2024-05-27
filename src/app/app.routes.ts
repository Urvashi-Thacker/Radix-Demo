import { Routes } from '@angular/router';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AddComponent } from './components/add/add.component';


export const routes: Routes = [{
  path: 'sign-up',
  component: SignUpComponent
}, {
  path: 'sign-in',
  component: SignInComponent
},

{
  path: 'employee',
  component: EmployeeComponent
},

{
  path: '',
  redirectTo:"/sign-up",
  pathMatch:"full"
},
{
  path: 'add',
  component: AddComponent
},
{
  path:'**',
  component: NotFoundComponent
}

];
