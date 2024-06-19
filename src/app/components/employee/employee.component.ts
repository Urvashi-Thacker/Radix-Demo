import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, NgModule, OnInit, ViewChild, inject } from '@angular/core';
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
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ExportService } from '../../Services/export.service';
import { AccountService } from '../../Services/Account/account.service';
import { MatSort } from '@angular/material/sort';
import { Observable, forkJoin } from 'rxjs';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [MatSortModule, MatCardModule, MatTableModule, MatPaginator, MatPaginatorModule, MatButtonModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatIconModule, MatDatepickerModule,
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
  workingShifts: any[] = []
  dataSource!: MatTableDataSource<any>
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems!: number;
  data: any[] = [];
  sortColumn!: string;
  sortDirection!: string;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  accountService = inject(AccountService);
  searchTerm: string = "";
  totalPages: any;
  firstIndex: any;




  constructor(private route: Router, public dialog: MatDialog, private http: HttpClient, private toastr: ToastrService, private router: Router, private exportService: ExportService) {
  }
  // ngAfterViewInit() {
  //   this.dataSource.sort = this.sort;

  // }

  ngOnInit() {
    this.GetAll()
    this.GetDepartment()
    this.GetSkills()
    this.GetWorkingShifts()
    this.sortColumn = 'firstName'; 
    this.sortDirection = 'asc'; 


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
      const obj = res
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
          skillIds: user.userSkills,
          shiftIds: user.userWorkingShifts,
          userSkillNames: user.userSkillNames,
          userWorkingShiftNames: user.userWorkingShiftNames,
          avatarUrl: user.avatarUrl,
          isActive: user.isActive,
          departmentName: departmentnm ? departmentnm.name : 'unkown'
        }
        return modified

      })
      this.dataSource = new MatTableDataSource<any[]>(this.userArray)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort =this.sort
    })
  }



  imageShow(imageUrl: string) {

    const baseUrl = 'https://localhost:7071/';
    const fullImageUrl = `${baseUrl}${imageUrl}`;
    return fullImageUrl;
  }

  logout(event: Event) {
    debugger;
    event.preventDefault();
    this.accountService.logout();
    this.route.navigate(['sign-in']);
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
    //debugger
    this.http.get("https://localhost:7071/Department/GetDepartmentList").subscribe((res: any) => {
      //  debugger
      console.log(res)
      this.department = res
      this.GetAll()
    })
  }

  GetSkills() {
    this.http.get("https://localhost:7071/Skills/GetSkills").subscribe((res: any) => {
      //debugger
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
      //debugger
      console.log(res)
      this.workingShifts = res

    })
  }

  exportToCSV() {
    debugger
    const exportData = this.userArray.map(employee => {
      const dob = new Date(employee.dob).toLocaleDateString()
      return {
        firstName: employee.firstName,
        lastName: employee.lastName,
        gender: this.getGenderLabel(employee.gender),
        dob: dob,
        departmentName: this.department.find(dp => dp.id === employee.departmentId)?.name || 'unknown',
        email: employee.email,
        userSkillNames: employee.userSkillNames,
        userWorkingShiftNames: employee.userWorkingShiftNames,
        isActive: employee.isActive,
        avatarUrl: employee.avatarUrl
      };
    });
    this.exportService.exportToCSV(exportData, 'Employee.csv')
  }
  exportToExcel() {
    debugger
    this.exportService.exportToExcel(this.userArray, 'Employee.xlsx')

  }

  FilterData(data : Event){
    const value = (data.target as HTMLInputElement).value
    this.dataSource.filter = value
  }

  // fetchDataBySearchTerm(event: Event): void {
  //   const searchTerm = (event.target as HTMLInputElement).value;
  //   const apiUrl = `https://localhost:7071/User/GetUsersForFSP?searchTerm=${searchTerm}`;
  //   this.http.get<any[]>(apiUrl).subscribe((response: any[]) => {
  //     this.dataSource.data = response.map(user => this.modifyUser(user));
  //     this.updateUserArrayAndPagination(response.length);
  //   });
  // }

  // updateUserArrayAndPagination(totalItems: number): void {
  //   this.http.get("https://localhost:7071/User/GetAll").subscribe((res: any) => {
  //     const usersFromAPI = res;
  //     const modifiedUsers = usersFromAPI.map((user: any) => this.modifyUser(user));
  //     this.userArray = this.dataSource.data.map(dataSourceUser => {
  //       const matchedUser = modifiedUsers.find((modifiedUser: { id: any; }) => modifiedUser.id === dataSourceUser.id);
  //       return matchedUser ? matchedUser : dataSourceUser;
  //     });

  //     debugger
  //     this.totalItems = totalItems;
  //     this.totalPages = Math.ceil(totalItems / this.pageSize);
  //   });
  // }



  // fetchPaginatedData(page: number, pageSize: number): Observable<any[]> {
  //   const apiUrl = `https://localhost:7071/User/GetUsersForFSP?page=${page}&limit=${pageSize}`;
  //   return this.http.get<any[]>(apiUrl);

  // }


  modifyUser(user: any): any {

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      dob: user.dob,
      email: user.email,
      departmentId: user.departmentId,
      skillIds: user.userSkills,
      shiftIds: user.userWorkingShifts,
      userSkillNames: user.userSkillNames,
      userWorkingShiftNames: user.userWorkingShiftNames,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      departmentName: this.department.find(dp => dp.id === user.departmentId)?.name || 'unknown'
    };
  }


  // fetchSortedData(sortColumn: string, sortDirection: string): Observable<any[]> {
  //   let params = new HttpParams();
  //   params = params.append('sortColumn', sortColumn);
  //   params = params.append('sortDirection', sortDirection);
  //   return this.http.get<any[]>('https://localhost:7071/User/GetUsersForFSP', { params: params });
  // }
  // SortData(): void {
  //   debugger;
  //   this.fetchSortedData(this.sortColumn, this.sortDirection).subscribe(response => {
  //     debugger;

  //     this.dataSource.data = response;
  //     this.totalItems = response.length;
  //     this.http.get("https://localhost:7071/User/GetAll").subscribe((res: any) => {
  //       const usersFromAPI = res;
  //       const modifiedUsers = usersFromAPI.map((user: { departmentId: any; id: any; firstName: any; lastName: any; gender: any; dob: any; email: any; userSkills: any; userWorkingShifts: any; userSkillNames: any; userWorkingShiftNames: any; avatarUrl: any; isActive: any; }) => {
  //         const departmentnm = this.department.find(dp => dp.id === user.departmentId);
  //         debugger
  //         const modifiedUser = {
  //           id: user.id,
  //           firstName: user.firstName,
  //           lastName: user.lastName,
  //           gender: user.gender,
  //           dob: user.dob,
  //           email: user.email,
  //           departmentId: user.departmentId,
  //           skillIds: user.userSkills,
  //           shiftIds: user.userWorkingShifts,
  //           userSkillNames: user.userSkillNames,
  //           userWorkingShiftNames: user.userWorkingShiftNames,
  //           avatarUrl: user.avatarUrl,
  //           isActive: user.isActive,
  //           departmentName: departmentnm ? departmentnm.name : 'unknown'
  //         };
  //         return modifiedUser;
  //       });
  //       debugger
  //       const mappedUsers = this.dataSource.data.map(dataSourceUser => {
  //         const matchedUser = modifiedUsers.find((modifiedUser: { id: any; }) => modifiedUser.id === dataSourceUser.id);
  //         if (matchedUser) {
  //           return matchedUser;
  //         } else {
  //           return dataSourceUser;
  //         }
  //       });
  //       this.userArray = mappedUsers;
  //     });
  //   });
  // }

  // applySorting(column: string) {
  //   this.SortData()
  //   if (this.sortColumn === column) {
  //     this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  //   } else {
  //     this.sortColumn = column;
  //     this.sortDirection = 'asc';
  //   }


  //   this.userArray.sort((a, b) => {
  //     const valA = a[column];
  //     const valB = b[column];
  //     if (valA < valB) {
  //       return this.sortDirection === 'asc' ? -1 : 1;
  //     } else if (valA > valB) {
  //       return this.sortDirection === 'asc' ? 1 : -1;
  //     } else {
  //       return 0;
  //     }
  //   });

  //   this.fetchSortedData(this.sortColumn, this.sortDirection).subscribe(response => {
  //     this.dataSource.data = response;
  //     this.dataSource.sort = this.sort;
  //   });
  // }

}


