import { ChangePassService } from './../../../../core/auth/services/change-pass.service';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth/auth.service';
;

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  private readonly fb = inject(FormBuilder)
  private readonly changePassService = inject(ChangePassService)
  private readonly authService= inject(AuthService)
  changeErrorMessage: WritableSignal<string> = signal('')
  changeSuccessMessage: WritableSignal<string> = signal('')
  private readonly router = inject(Router)
  isLoading= signal(false)
  changePassword: FormGroup = this.fb.group({
    password:['',[Validators.required]],
    newPassword:['',[Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)]]
  },{validators: this.confirmPassword})




   confirmPassword(form:any){
    const password = form.get('password')?.value
    const newPassword = form.get('newPassword')?.value

    if(password !== newPassword && form.get('newPassword')?.touched){
      form.get("newPassword")?.setErrors({mismatch:true})
      return {mismatch:true};
    }
    else{
      return null
    }
  }

  changePa():void{
    this.changeErrorMessage.set('')
  if(this.changePassword.valid){
    console.log(this.changePassword.value);
    this.isLoading.set(true)
      this.changePassService.settings(this.changePassword.value).subscribe({
      // next:(res)=>{

      //   console.log(res);
      //   if(res.success){
      //     this.changeSuccessMessage.set(res.message)

      //   }
        
      // },
    next: (res) => {
  console.log(res);
  if (res.success) {
    this.changeSuccessMessage.set(res.message);
    this.isLoading.set(false);
    this.changePassword.reset();
    const user = JSON.parse(localStorage.getItem('socialUser') ?? '{}');
    this.authService
      .login({ email: user.email, password: this.changePassword.value.newPassword })
      .subscribe((loginRes) => {
        localStorage.setItem('socialToken', loginRes.data.token);
        localStorage.setItem('socialUser', JSON.stringify(loginRes.data.user));
      });
  }
},
      error:(err)=>{
        this.changeErrorMessage.set(err.error.message)
        console.log(this.changeErrorMessage());
        this.isLoading.set(false)
      },
    })
  }
    else{
      this.changePassword.markAllAsTouched()
    }
    
  }
}
