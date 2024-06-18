import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, Output, ViewChild, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';


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
 
  wasFormChanged = false
  isActive: boolean = false
  formIsValid: boolean = false
  isEdit: boolean = true
  isValid: boolean = false;
  skills: any[] = []
  workingShifts: any[] = []
  skillIdsControl = new FormControl([]);
  skillsIds: string[] = []
  obj: any;
  http = inject(HttpClient);
  allSelected = false;
  updatedSkills: any[]=[]
  selectAll = false;

  ngOnInit() {
    this.GetDepartment()
    this.GetAll()
    this.GetWorkingShifts()
    this.GetSkills()
    if (this.data && this.data.userId) {
      this.LoadUser(this.data.userId)
    }
  }



  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService, private router: Router ) {

  
    this.employeeForm = new FormGroup({
      id: new FormControl(),
      firstName: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      gender: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$')]),
      departmentId: new FormControl(parseInt, [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      skillIds: new FormControl([], Validators.required),
      shiftIds: new FormControl([], Validators.required,),
      isActive: new FormControl('', Validators.required),
      departmentName: new FormControl('', Validators.required)
    })

  }
  handleDepartmentChange(value: number) {
    this.GetSkillByDepartmentId(value);
  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.employeeForm.value.shiftIds = [];
      this.allSelected = false;
    } else {
      this
      var data = this.workingShifts.map(x => x.id);
      this.employeeForm.value.shiftIds = data;
      this.allSelected = true;
    }
    console.log(this.employeeForm.value.shiftIds)
  }

  errorImageHandler(event: any) {
    event.target.src = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  }

  LoadUser(id: any) {
    debugger
    this.toastr.warning('Are you sure you want to Update? Tap to confirm', 'Confirmation').onTap.subscribe(() => {
      debugger
      this.http.get(`https://localhost:7071/User/GetByID/${id}`).subscribe(add => {
        debugger
        this.obj = add
        console.log(add)
        if (add) {
          debugger
        
          debugger
          const dob = new Date(this.obj.dob).toISOString()
          const shiftIdsArray = this.obj.userWorkingShifts?.split(',').map(Number);
          const skillIdsArray = this.obj.userSkills?.split(',').map(Number);
         
          this.employeeForm.patchValue
            ({
              id: this.obj.id,
              firstName: this.obj.firstName,
              lastName: this.obj.lastName,
              gender: this.obj.gender,
              email: this.obj.email,
              password: this.obj.password,
              dob:dob,
              departmentId: this.obj.departmentId,
              skillIds: skillIdsArray, shiftIds: shiftIdsArray,
              isActive: this.obj.isActive,
              avatarUrl: this.obj.avatarUrl,
            })
            //this.skills = skillIdsArray
                    this.url = this.imageShow(this.obj.avatarUrl);
          console.log(this.employeeForm.value)
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

  handleDateChange(selectedDate: any) {
    debugger
  
    const d = new Date(selectedDate);
    return (new Date(d).toISOString())
  }

  SaveChanges() {
    debugger
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

      // Preserve the existing avatar URL if it exists
      obj.avatarUrl = this.url.replace('https://localhost:7071/', '').replace(/\//g, '\\');
      this.addOrAlterUser(obj)
    }
  }
  
  addOrAlterUser(obj: any) {
    debugger
  

    if (obj.id != null) {
      this.http.put(`https://localhost:7071/User/Update/${obj.id}`, obj).subscribe(
        (res: any) => {
          debugger
          console.log(obj)
          this.showToastrAndReload('Updated Successfully', 'Success');
         
        },
        (error) => {
          console.error('Update request failed:', error);
          this.toastr.error('Failed to update user', 'Error');
        }
      );
    } else {
      debugger
      this.http.post('https://localhost:7071/User/Add', obj).subscribe((res: any) => {
        debugger
        this.showToastrAndReload('Added Successfully', 'Success');
      },
        (error) => {
          console.error('Adding request failed:', error);
          this.toastr.error('Failed to add user', 'Error');
        }
      );
    }
    this.GetAll()
  }
  
  showToastrAndReload(message: string, title: string) {
    const toastrConfig: Partial<IndividualConfig> = {
      timeOut: 1000 // Timeout for Toastr
    };
  
    // Show the Toastr notification and subscribe to the onHidden event
    const toastrRef = this.toastr.success(message, title, toastrConfig);
    toastrRef.onHidden.subscribe(() => window.location.reload()); // Reload window after Toastr is hidden
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
      this.department = res
    })
  }
  GetSkillByDepartmentId(deptId: number) {
    debugger
    this.http.get(`https://localhost:7071/Skills/GetSkillByDepartmentId/${deptId}`).subscribe((res: any) => {
      debugger
      this.skills = res
    })
  }
  GetSkills() {
    this.http.get("https://localhost:7071/Skills/GetSkills").subscribe((res: any) => {
     // debugger
     debugger
      console.log(res)
      this.skills = res

    })
  }
  GetWorkingShifts() {
    this.http.get("https://localhost:7071/WorkingShift/GetWorkingShiftList").subscribe((res: any) => {
      this.workingShifts = res
    })
  }

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }


  toggleSelectAll() {
    const allSkillIds = this.skills.map(skill => skill.id);
    if (!this.selectAll) {

      this.employeeForm.get('skillIds')?.patchValue(allSkillIds);
    } else {

      this.employeeForm.get('skillIds')?.patchValue([]);
    }
    this.selectAll = !this.selectAll; 
  }
  toggleSelectAllForShift() {
    const allShiftIds = this.workingShifts.map(shift => shift.id);
    if (!this.selectAll) {

      this.employeeForm.get('shiftIds')?.patchValue(allShiftIds);
    } else {

      this.employeeForm.get('shiftIds')?.patchValue([]);
    }
    this.selectAll = !this.selectAll; 
  }
}


