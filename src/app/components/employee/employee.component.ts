
import { Component, ViewEncapsulation  } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,ReactiveFormsModule],
  templateUrl: './employee.component.html',

  styleUrl: './employee.component.css'

})
export class EmployeeComponent {

  employeeForm : FormGroup

  constructor(){
    this.employeeForm = new FormGroup({
      firstname : new FormControl('',[Validators.required, Validators.maxLength(12)]),
      lastname : new FormControl('',[Validators.required, Validators.maxLength(12)]),
      email : new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      department : new FormControl('',[Validators.required]),
      dob : new FormControl('',[
        Validators.required,Validators.pattern(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
      ]),
      skills : new FormControl('',Validators.required),
      shifttime : new FormControl('',Validators.required),
      useractive : new FormControl('',Validators.required)
    })
  }
  isActive : boolean=false
  handleDateChange(event: any) {
    const selectedDate = event.target.value;
    console.log('Selected date:', selectedDate);
    // Handle the selected date as needed
  }

  
}
