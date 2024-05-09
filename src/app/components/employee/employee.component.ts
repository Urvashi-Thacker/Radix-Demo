
import { Component, ViewEncapsulation  } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './employee.component.html',
  encapsulation: ViewEncapsulation.None, 
  styleUrl: './employee.component.css'

})
export class EmployeeComponent {

  isActive : boolean=false
  handleDateChange(event: any) {
    const selectedDate = event.target.value;
    console.log('Selected date:', selectedDate);
    // Handle the selected date as needed
  }

  
}
