
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [MatButtonModule,MatIconModule,MatInputModule,MatFormFieldModule,HttpClientModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  siginForm: FormGroup
  isValid: boolean = false
  hide = true

  constructor(private route: Router, private http: HttpClient, private toastr : ToastrService) {
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
      debugger
      if(res == true){
        debugger
        this.toastr.success("Login Successfully",'Success')
        this.route.navigate(['employee']);
      }else if(res == false){
        this.toastr.error("Enter valid email & password",'Error')
      }
   
    })
    
    if (this.isValid == true) {
     debugger
 this.toastr.error("Enter  email & password",'Error')
   
  } 
}

clickEvent(event: MouseEvent) {
  this.hide = !this.hide;
  event.stopPropagation();
}
}
