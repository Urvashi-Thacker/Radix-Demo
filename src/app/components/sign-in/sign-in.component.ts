
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  siginForm: FormGroup
  isValid: boolean = false
 
  constructor(private route: Router, private http: HttpClient) {
    this.siginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)])
    })
  }

  LoginEvent() {
   
    this.isValid = this.siginForm.invalid;
    //debugger;
    const obj = this.siginForm.value;
    debugger;
   
    this.http.post('https://localhost:7071/Account/Login',this.siginForm.value).subscribe((res: any) => {
     alert("Login Successfully")
     if (this.isValid == false) {
      this.route.navigate(['dashboard']);
    }
    

    })
   
  }
}
