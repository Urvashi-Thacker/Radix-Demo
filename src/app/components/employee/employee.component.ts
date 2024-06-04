import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, NgModule, OnInit } from '@angular/core';
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
import { AddComponent } from '../add/add.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ExportService } from '../../Services/export.service';


@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatPaginator, MatPaginatorModule, MatButtonModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatIconModule, MatDatepickerModule,
    MatSelectModule, RouterLink, RouterLinkActive, ReactiveFormsModule, HttpClientModule, CommonModule, FileUploadModule],
  templateUrl: './employee.component.html',

  styleUrl: './employee.component.css'

})
export class EmployeeComponent implements OnInit {
  departmentData: { [key: string]: string } = {};
  displayedColumns: string[] = ['firstName', 'lastName', 'gender', 'dob', 'email', 'departmentId', 'skill', 'shift', 'image', 'activityStatus', 'action'];
  userArray: any[] = [];
  department: any[] = [];
  users: any[] = []
  skills: any[] = [];
  workingShifts : any[] =[]

  

  constructor(public dialog: MatDialog, private http: HttpClient, private toastr: ToastrService, private router: Router , private exportService : ExportService) {
  }


  ngOnInit() {

    this.GetDepartment()
    this.GetAll()
    this.GetSkills()
    this.GetWorkingShifts()
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
      this.users = res
      this.userArray = this.users.map(user => {
        const departmentnm = this.department.find(dp => dp.id === user.departmentId);
        debugger
        const modified = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          dob: user.dob,
          email: user.email,
          departmentId: user.departmentId,
          skillIds: user.skillIds,
          shiftIds: user.shiftIds,
          avatarUrl: user.avatarUrl,
          isActive: user.isActive,
          departmentName: departmentnm ? departmentnm.name : 'unkown'
        }
        return modified

      })

    })
  }



  imageShow(imageUrl: string) {

    const baseUrl = 'https://localhost:7071/';
    const fullImageUrl = `${baseUrl}${imageUrl}`;
    return fullImageUrl;
  }



  onDelete(userId: number) {
    debugger
    this.toastr.warning('Are you sure you want to delete?Tap to confirm', 'Confirmation').onTap.subscribe(() => {
      this.http.delete(`https://localhost:7071/User/Delete/${userId}`).subscribe(
        (res: any) => {
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
  errorImageHandler(event: any) {
    event.target.src = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
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
  GetDepartment() {
    debugger
    this.http.get("https://localhost:7071/Department/GetDepartmentList").subscribe((res: any) => {
      debugger
      console.log(res)
      this.department = res
      this.GetAll()
    })
  }
  GetSkills() {
    this.http.get("https://localhost:7071/Skills/GetSkills").subscribe((res: any) => {
      debugger
      console.log(res)
      this.skills = res

    })
  }


  userActive(value: boolean): string {
    return value ? 'ACTIVE' : 'INACTIVE'
  }
  getGenderLabel(value: boolean): string {
    return value ? 'Male' : 'Female'
  }

  GetWorkingShifts() {
    this.http.get("https://localhost:7071/WorkingShift/GetWorkingShiftList").subscribe((res: any) => {
      debugger
      console.log(res)
      this.workingShifts = res

    })
  }

  exportToCSV(){
    debugger
    this.exportService.exportToCSV(this.userArray,'Employee.csv')
  }
  exportToExcel(){
    debugger 
    this.exportService.exportToExcel(this.userArray,'Employee.xlsx')
  }
}