
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ViewEncapsulation  } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,ReactiveFormsModule, HttpClientModule],
  templateUrl: './employee.component.html',

  styleUrl: './employee.component.css'

})
export class EmployeeComponent {

  employeeForm : FormGroup

  constructor(private http: HttpClient){
    this.employeeForm = new FormGroup({
      
      avatarUrl : new FormControl('',[Validators.required]),
      firstName : new FormControl('',[Validators.required, Validators.maxLength(12)]),
      lastName : new FormControl('',[Validators.required, Validators.maxLength(12)]),
      email : new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      departmentId : new FormControl(parseInt,[Validators.required]),
      dob : new FormControl('',[
        Validators.required,Validators.pattern(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/
      )
      ]),
      skillIds : new FormControl('',Validators.required),
      shiftIds : new FormControl('',Validators.required,),
      isActive : new FormControl('',Validators.required)
      
    })
    
  }
  isActive : boolean=false
  handleDateChange(event: any) {
    const selectedDate = event.target.value;
    console.log('Selected date:', selectedDate);
    
    // Handle the selected date as needed
  }
  SaveChanges(){
   
   // this.isValid = this.siginForm.invalid;
    //debugger;
    const obj = this.employeeForm.value;
    console.log(obj)
    debugger;
   /* if (this.isValid == false) {
      this.route.navigate(['dashboard']);
    }*/
    this.http.post('https://localhost:7071/User/Add',this.employeeForm.value).subscribe((res: any) => {
      alert("Added Successfully")
     
 
     })
    
    }
  }
