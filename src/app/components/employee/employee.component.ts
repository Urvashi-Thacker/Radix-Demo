
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation, numberAttribute } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive, ReactiveFormsModule, HttpClientModule, CommonModule, FileUploadModule],
  templateUrl: './employee.component.html',

  styleUrl: './employee.component.css'

})
export class EmployeeComponent implements OnInit {

  employeeForm: FormGroup
  selectedFile: File | null = null;
  copiedImageFile: File | null = null;
  userArray: any[] = []
  userToDelete: number = 1
  value: boolean = true
  isEdit: boolean = false
  department : any[]=[]
departmentname : string=""
url ="../../../assets/images/sign-up.svg";
  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const file: File = event.dataTransfer.files[0];

    }
  }
  onFileSelected(event:any) {
    if(event.target.files){
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
        reader.onload=(event:any)=>{
          this.url=event.target.result;
        }
        
      
    }
    this.selectedFile = event.target.files[0];
  }
  copyImage() {
    debugger
    if (!this.selectedFile) {
      return;
    }
    this.copiedFile(this.selectedFile, '../../../assets/savedImages/image.jpg')

  }
  copiedFile(file: File, destinationPath: string): void {
    console.log("Filed copy to destination", file, destinationPath)
  }
  closeDialog() {

  }
 
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) {


    this.employeeForm = new FormGroup({

      id: new FormControl(),
      avatarUrl: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      gender: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      departmentId: new FormControl(parseInt),
      dob: new FormControl('', [
        Validators.required, Validators.pattern(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/
        )
      ]),
      skillIds: new FormControl('', Validators.required),
      shiftIds: new FormControl('', Validators.required,),
      isActive: new FormControl('', Validators.required),
      //departmentName : new FormControl('',Validators.required)
    })
 
  }
  ngOnInit() {
    this.GetDepartment()
    this.GetAll()

  }

  isActive: boolean = false

  handleDateChange(event: any) {
    const selectedDate = event.target.value;
    console.log('Selected date:', selectedDate);
  }
  SaveChanges() {

    const obj = this.employeeForm.value;
    console.log(obj)

    debugger;
    if (obj != null && obj.id != null) {

      this.http.put(`https://localhost:7071/User/Update/${obj.id}`, obj).subscribe(
        (res: any) => {
          // Assuming GetAll() is a method to refresh user data
          this.toastr.success('Updated Successfully', 'Success');
        },
        (error) => {
          console.error('Update request failed:', error);
          this.toastr.error('Failed to update user', 'Error');
        }
      );
    } else {

      this.http.post('https://localhost:7071/User/Add', this.employeeForm.value).subscribe((res: any) => {

      })
    }


  }

  GetAll() {

    this.http.get("https://localhost:7071/User/GetAll").subscribe((res: any) => {
      debugger
      this.userArray = res
      
    })
  }
  getGenderLabel(value: boolean): string {
    return value ? 'Male' : 'Female'
  }
  userActive(value: boolean): string {
    return value ? 'ACTIVE' : 'INACTIVE'
  }


  onDelete(userId: number) {

    this.toastr.warning('Are you sure you want to delete?Tap to confirm', 'Confirmation').onTap.subscribe(() => {
      this.http.delete(`https://localhost:7071/User/Delete/${userId}`).subscribe(
        (res: any) => {
          this.GetAll(); // Assuming GetAll() is a method to refresh user data
          this.toastr.success('Deleted Successfully', 'Success');
        },
        (error) => {
          console.error('Delete request failed:', error);
          this.toastr.error('Failed to delete user', 'Error');
        }
      );
    });
  }


  onUpdate(data: any, userId: number) {
    this.isEdit = true
    this.toastr.warning('Are you sure you want to Update? Tap to confirm', 'Confirmation').onTap.subscribe(() => {
      const formData = this.employeeForm.setValue({ id: data.id, firstName: data.firstName, lastName: data.lastName, gender: data.gender, email: data.email, password: "sdfdfsaa", dob: data.dob, departmentId: this.department, skillIds: null, shiftIds: null, isActive: data.isActive, avatarUrl: data.avatarUrl })
    });
  }
  
  GetDepartment(){
    
    this.http.get("https://localhost:7071/Department/GetDepartmentList").subscribe((res : any)=>{
      debugger
    console.log(res) 
    this.department = res
   
    })
  }
 

}