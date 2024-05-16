import { JsonPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Component, Injectable } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

 
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [HttpClientModule,ReactiveFormsModule, JsonPipe, RouterLink, RouterLinkActive],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})

export class SignUpComponent {
  userForm: FormGroup
  isValid: boolean = false
  post : any
  constructor(private http: HttpClient) {
     this.userForm = new FormGroup({
      id: new FormControl(0),
      firstname: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      lastname: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
    });
  }

  SubmitEvent() {
  
    this.isValid = this.userForm.invalid;
    const obj = this.userForm.value;
    debugger
    this.http.post('https://localhost:7071/User/Add',this.userForm.value).subscribe((res: any) => {
      debugger
      alert("Login Successfully")
     
 
     })
  }
}
