import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastrService } from 'ngx-toastr';
import { debug } from 'console';
import { resolve } from 'path';
import { rejects } from 'assert';
import { EmployeeComponent } from '../employee/employee.component';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [MatDialogModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatIconModule, MatDatepickerModule
    , MatButtonModule, MatSelectModule, CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive
    , FileUploadModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})

export class AddComponent {
  
 
}
