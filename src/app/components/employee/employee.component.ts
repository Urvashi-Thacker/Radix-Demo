
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit  } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { SignInComponent } from '../sign-in/sign-in.component';
import { AddComponent } from '../add/add.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [MatTableModule, MatPaginator, MatPaginatorModule, MatButtonModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatIconModule, MatDatepickerModule,
    MatSelectModule, RouterLink, RouterLinkActive, ReactiveFormsModule, HttpClientModule, CommonModule, FileUploadModule],
  templateUrl: './employee.component.html',

  styleUrl: './employee.component.css'

})
export class EmployeeComponent implements OnInit {
  departmentData: { [key: string]: string } = {};
  displayedColumns: string[] = ['firstName', 'lastName', 'gender', 'dob', 'email', 'departmentId', 'skill', 'shift', 'image', 'activityStatus', 'action'];
  userArray: any[] = [];
  department: any[] = [];
  
  

  ngOnInit() {

    this.GetAll()
    
  }

  openDialog(event: Event) {
    debugger
    event.preventDefault();

    const dialogRef = this.dialog.open(AddComponent, {

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  GetAll() {
    this.http.get("https://localhost:7071/User/GetAll").subscribe((res: any) => {
      debugger
      this.userArray = res

    })
  }

  onDelete(userId: number) {
    debugger
    this.toastr.warning('Are you sure you want to delete?Tap to confirm', 'Confirmation').onTap.subscribe(() => {
      this.http.delete(`https://localhost:7071/User/Delete/${userId}`).subscribe(
        (res: any) => {
          //this.GetAll(); // Assuming GetAll() is a method to refresh user data
          this.toastr.success('Deleted Successfully', 'Success');
          this.GetAll()
        },
        (error) => {
          console.error('Delete request failed:', error);
          this.toastr.error('Failed to delete user', 'Error');
        }
      );
    });
  }
  updateUser(userId: number) {
    debugger
    const dialogRef = this.dialog.open(AddComponent, {
      data: {
        userId: userId,
      }
    });
  }

  onUpdate(userId: any) {
   
  }


  userActive(value: boolean): string {
    return value ? 'ACTIVE' : 'INACTIVE'
  }
  getGenderLabel(value: boolean): string {
    return value ? 'Male' : 'Female'
  }

  constructor(public dialog: MatDialog, private http: HttpClient, private toastr: ToastrService, private router: Router) {


  }

}