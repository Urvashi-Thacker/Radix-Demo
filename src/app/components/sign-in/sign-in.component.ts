import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  siginForm : FormGroup
  isValid : boolean = false
  constructor(){
    this.siginForm = new FormGroup({
      email : new FormControl('',[Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)])
    })
  }

  LoginEvent(){
    this.isValid = this.siginForm.value;
    debugger;
    const val = this.siginForm.value

  }
}
