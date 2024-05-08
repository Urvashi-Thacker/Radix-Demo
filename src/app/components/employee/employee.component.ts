
import { Component, ViewEncapsulation } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {  MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [MatDatepickerModule, MatNativeDateModule,MatFormFieldModule,MatInputModule],
  templateUrl: './employee.component.html',
  encapsulation: ViewEncapsulation.None, 
  styleUrl: './employee.component.css'

})
export class EmployeeComponent {

}
