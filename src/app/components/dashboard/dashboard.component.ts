import { Component } from '@angular/core';
import { EmployeeComponent } from '../employee/employee.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [EmployeeComponent, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
 userArray : any[]=[]
 
  constructor(private http : HttpClient){
   this.GetAll()
  }
  GetAll(){
   
    this.http.get("https://localhost:7071/User/GetAll").subscribe((res : any)=>{
      this.userArray = res
    })
  }
  
}
