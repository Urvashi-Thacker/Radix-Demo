
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation, numberAttribute } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastrService } from 'ngx-toastr';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { SignInComponent } from '../sign-in/sign-in.component';
import { AddComponent } from '../add/add.component';
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [MatButtonModule,MatDialogModule,MatInputModule,MatFormFieldModule,MatRadioModule,MatIconModule,MatDatepickerModule,
    MatSelectModule,  RouterLink, RouterLinkActive, ReactiveFormsModule, HttpClientModule, CommonModule, FileUploadModule],
    templateUrl: './employee.component.html',
    providers: [provideNativeDateAdapter()],
    styleUrl: './employee.component.css'
    
})
export class EmployeeComponent   {
  
 
  openDialog() {
    const dialogRef = this.dialog.open(AddComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
 
 
  constructor(public dialog:MatDialog, private http: HttpClient, private toastr: ToastrService, private router: Router) {

   
} 
}

