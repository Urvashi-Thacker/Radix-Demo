import { Routes } from '@angular/router';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeeComponent } from './components/employee/employee.component';

export const routes: Routes = [{
  path: 'sign-up',
  component: SignUpComponent
}, {
  path: 'sign-in',
  component: SignInComponent
},
 {
  path: 'dashboard',
  component: DashboardComponent
},
{
  path: 'employee',
  component: EmployeeComponent
}];
