import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ImgRegisterComponent } from './components/img-register/img-register.component';

function notFutureDate(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selected = new Date(control.value);
  const today = new Date();
  return selected > today ? { max: true } : null;
}
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  isLoading = signal(false);
  private readonly router = inject(Router);
  registerErrorMessage:WritableSignal<string> = signal('')
  registerSuccessMessage:WritableSignal<string> = signal('')

today = new Date().toISOString().split('T')[0];
  registerForm:FormGroup = this.fb.group({
    name: ['',[Validators.required, Validators.minLength(2)] ],
    username: ['',[ Validators.minLength(2), Validators.pattern(/^[a-z0-9_]{3,30}$/)]],
    email: ['',[Validators.required, Validators.email]],
    gender: ['',[Validators.required]],
    dateOfBirth:['',[Validators.required, notFutureDate]],
    password:['',[Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")]],
    rePassword:['',[Validators.required]],
  },{updateOn:'submit' ,validators: this.confirmPassword})

  submitRegister(){
    this.registerErrorMessage.set('')
    if(this.registerForm.valid){
      console.log(this.registerForm.value);
      this.isLoading.set(true);
      // call api
      this.authService.register(this.registerForm.value).subscribe({
        next:(res) => {
          console.log(res);
          if(res.success){
            

            this.registerSuccessMessage.set(res.message)
                setTimeout( ()=>{
                        this.router.navigate(['/login'])
                },1000)

                

          }
        },
        error: (err)=>{
            
            this.registerErrorMessage.set(err.error.message);
            
            this.isLoading.set(false);
        },
        complete: ()=>{
          this.isLoading.set(true);
        }
      })
    }
    else{
      this.registerForm.markAllAsTouched()
    }
  }

  confirmPassword(form:AbstractControl){
    const password = form.get('password')?.value
    const rePassword = form.get('rePassword')?.value

    if(password !== rePassword && form.get('rePassword')?.touched){
      form.get("rePassword")?.setErrors({mismatch:true})
      return {mismatch:true};
    }
    else{
      return null
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
