import { AuthService } from './../../core/auth/services/auth/auth.service';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
    private readonly fb = inject(FormBuilder)
    private readonly authService = inject(AuthService)
    private readonly router = inject(Router)
    loginrErrorMessage:WritableSignal<string> = signal('')
    loginuccessMessage:WritableSignal<string> = signal('')
    isLoading = signal(false)
 loginForm:FormGroup = this.fb.group({
  email: ['',[ Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")]]
 })

 submitLigin(){
  this.loginrErrorMessage.set('')
  if(this.loginForm.valid){
    console.log(this.loginForm.value);
    this.isLoading.set(true)
    // call api
    this.authService.login(this.loginForm.value).subscribe({
      next:(res)=>{
        console.log(res);
          if(res.success){
            localStorage.setItem('socialToken', res.data.token)
            localStorage.setItem('socialUser',JSON.stringify(res.data.user))
            this.loginrErrorMessage.set("")
            this.loginuccessMessage.set(res.message)
                setTimeout( ()=>{
                        this.router.navigate(['/feed'])
                },1000)
      }
    },
      error: (err)=>{
          console.log(err);
          this.loginrErrorMessage.set(err.error.message)
          this.isLoading.set(false)
      },
      complete: ()=>{
        this.isLoading.set(true)
      }
    })
  }
  else{
    this.loginForm.markAllAsTouched()
  }
 }


 toggleEye(passwordElement:any){
  if(passwordElement.type == "password"){
    passwordElement.type = "text"
  }
  else{
    passwordElement.type  = "password"
  }
 }
}
