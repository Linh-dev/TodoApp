import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from '../share/auth.service';
import { SignupRequestPayload } from './signup-request.payload';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signupRequestPayload: SignupRequestPayload;

  signupForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService, private localStorage: LocalStorageService) {
    this.signupRequestPayload = {
      username: '',
      email: '',
      password: ''
    };
  }

  ngOnInit(): void {
    if(this.localStorage.retrieve('authenticationToken')){
      this.router.navigate(['/home']);
    }
    else{
      this.signupForm = new FormGroup({
        username: new FormControl('',Validators.required),
        email: new FormControl('',[Validators.required, Validators.email]),
        password: new FormControl('',Validators.required)
      });
    }
  }

  signup(){
    this.signupRequestPayload.username = this.signupForm.get('username').value;
    this.signupRequestPayload.email = this.signupForm.get('email').value;
    this.signupRequestPayload.password = this.signupForm.get('password').value;

    this.authService.signup(this.signupRequestPayload).subscribe(data =>{
      if(data=='email'){
        this.toastr.warning('Email đã tồn tại');
        this.toastr.remove(1);
      }else if(data=='username'){
        this.toastr.warning('Username đã tồn tại');
        this.toastr.remove(1);
      }else{
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      }
    });
  }
}
