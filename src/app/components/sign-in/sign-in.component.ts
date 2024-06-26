
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../../Services/Account/account.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, HttpClientModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  siginForm: FormGroup
  isValid: boolean = false
  hide = true
  isAuthenticated: boolean = false;
 isLoggedIn : boolean =false;
  private authService = inject(AccountService);

  constructor(private route: Router, private http: HttpClient, private toastr: ToastrService) {
    if (this.authService.isLoggedIn()) {
      this.route.navigate(['employee']);
    }
    this.siginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)])
    })
  }

  LoginEvent() {
    debugger
    this.isValid = this.siginForm.invalid;

    const obj = this.siginForm.value; 
  
    this.authService.login({ email: obj.email, password: obj.password }).subscribe(
      (res) => {
        if (res) {
          this.isLoggedIn = true;
          this.toastr.success("Successfully logged in", 'Success');
          this.route.navigate(['employee']);
        } else {
          throw new Error("Login failed"); 
        }
      },
      (error) => {       
        console.error("Error during login:", error);      
        this.toastr.error("Enter valid email & password", 'Error');
      }
    ); 
  }

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }
}


