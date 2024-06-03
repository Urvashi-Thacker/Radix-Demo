import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, Output, ViewChild, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastrService } from 'ngx-toastr';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [MatDialogModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatIconModule, MatDatepickerModule
    , MatButtonModule, MatSelectModule, CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive
    , FileUploadModule
  ],
  templateUrl: './add.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './add.component.css'
})

export class AddComponent {
  employeeForm: FormGroup
  selectedFile: File | null = null;
  userArray: any[] = []
  userToDelete: number = 1
  value: boolean = true
  department: any[] = []
  departmentname: string = ""
  url = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
  hide = true
  maxDate: string
  wasFormChanged = false
  isActive: boolean = false
  formIsValid: boolean = false
  isEdit: boolean = true
  isValid: boolean = false;
  skills:  any[] = []
  workingShifts: any[] = []
  

  ngOnInit() {
    this.GetDepartment()
    this.GetAll()
    this.GetSkills()
    this.GetWorkingShifts()
    debugger
    if (this.data && this.data.userId) {
      this.LoadUser(this.data.userId)
    }
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, private toastr: ToastrService, private router: Router) {

    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
    this.employeeForm = new FormGroup({
      id: new FormControl(),
      firstName: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      gender: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$')]),
      departmentId: new FormControl(parseInt, [Validators.required]),
      dob: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/)]),
      skillIds: new FormControl([], Validators.required),
      shiftIds: new FormControl([], Validators.required,),
      isActive: new FormControl('', Validators.required),
      departmentName: new FormControl('', Validators.required)
    })

  }

  errorImageHandler(event: any) {
    event.target.src = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  }

  LoadUser(id: any) {
    debugger
    this.toastr.warning('Are you sure you want to Update? Tap to confirm', 'Confirmation').onTap.subscribe(() => {

      this.http.get(`https://localhost:7071/User/GetByID/${id}`).subscribe(add => {
        debugger
        if (add != null && Array.isArray(add) && add.length > 0) {
          debugger
          const obj = add[0]
          this.employeeForm.patchValue
            ({
              id: obj.id,
              firstName: obj.firstName,
              lastName: obj.lastName,
              gender: obj.gender,
              email: obj.email,
              password: obj.password,
              dob: obj.dob,
              departmentId: obj.departmentId,
              skillIds: null, shiftIds: null,
              isActive: obj.isActive,
              avatarUrl: obj.avatarUrl,
            })
          this.url = this.imageShow(obj.avatarUrl);
          console.log(this.employeeForm);
        }
      })
    })
  }

  imageShow(imageUrl: string) {

    const baseUrl = 'https://localhost:7071/';
    const fullImageUrl = `${baseUrl}${imageUrl}`;
    return fullImageUrl;
  }


  get passwordInput() { return this.employeeForm.get('password'); }

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

  onFileSelected(event: any) {
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
    }
    this.selectedFile = event.target.files[0];
  }


  get departmentName() {
    return this.employeeForm.get("departmentId");
  }

  formChanged() {
    this.wasFormChanged = true;
  }

  handleDateChange(event: any) {
    const selectedDate = event.target.value;
  }

  SaveChanges() {
    this.isValid = this.employeeForm.invalid;
    const obj = this.employeeForm.value;
    debugger;
    if (this.selectedFile != null) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      this.http.post('https://localhost:7071/File/Upload', formData).subscribe((res: any) => {
        if (res.isSuccess == true) {
          obj.avatarUrl = res.avatarUrl;
          this.addOrAlterUser(obj)
        }
      });
    } else {
      obj.avatarUrl = null;
      this.addOrAlterUser(obj)
    }
  }
  addOrAlterUser(obj: any) {
    if (obj.id != null) {
      this.http.put(`https://localhost:7071/User/Update/${obj.id}`, obj).subscribe(
        (res: any) => {
          this.GetAll()
          this.toastr.success('Updated Successfully', 'Success');
        },
        (error) => {
          console.error('Update request failed:', error);
          this.toastr.error('Failed to update user', 'Error');
        }
      );
    } else {
      debugger
      this.http.post('https://localhost:7071/User/Add', obj).subscribe((res: any) => {
        this.GetAll()
        this.toastr.success('Added Successfully', 'Success');
      },
        (error) => {
          console.error('Adding request failed:', error);
          this.toastr.error('Failed to add user', 'Error');
        }
      );
    }

  }




  onDelete(userId: number) {
    this.toastr.warning('Are you sure you want to delete?Tap to confirm', 'Confirmation').onTap.subscribe(() => {
      this.http.delete(`https://localhost:7071/User/Delete/${userId}`).subscribe(
        (res: any) => {
          this.toastr.success('Deleted Successfully', 'Success');
          this.GetAll();
        },
        (error) => {
          console.error('Delete request failed:', error);
          this.toastr.error('Failed to delete user', 'Error');
        }
      );
    });
  }
  userActive(value: boolean): string {
    return value ? 'ACTIVE' : 'INACTIVE'
  }
  getGenderLabel(value: boolean): string {
    return value ? 'Male' : 'Female'
  }



  GetAll() {
    this.http.get("https://localhost:7071/User/GetAll").subscribe((res: any) => {
      this.userArray = res

    })
  }

  GetDepartment() {
    this.http.get("https://localhost:7071/Department/GetDepartmentList").subscribe((res: any) => {
      debugger
      console.log(res)
      this.department = res

    })
  }
  GetSkills() {
    this.http.get("https://localhost:7071/Skills/GetSkills").subscribe((res: any) => {
      debugger
      console.log(res)
      this.skills = res

    })
  }
  GetWorkingShifts() {
    this.http.get("https://localhost:7071/WorkingShift/GetWorkingShiftList").subscribe((res: any) => {
      debugger
      console.log(res)
      this.workingShifts = res

    })
  }

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }
 

}