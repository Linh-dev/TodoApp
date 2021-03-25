import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { LoginRequest } from './login-request.payload';
import { throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from '../share/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginRequest: LoginRequest;
  registerSuccessMessage: string;
  loginErrorMessage = 'Tài khoản hoặc mật khẩu không đúng';
  isLoginError: boolean;
  isRegisterError: boolean;

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router,
    private toastr: ToastrService, private localStorage: LocalStorageService) {
    this.loginRequest = {
      username:'',
      password:''
    }
   }

  ngOnInit(): void {
    if(this.localStorage.retrieve('authenticationToken')!==null){
      this.router.navigate(['/home']);
    }else{
      this.loginForm = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });

      this.activatedRoute.queryParams.subscribe(params =>{
        console.log(params.registered);
        if(params.registered !== undefined && params.registered == 'true'){
          this.isRegisterError = true
          this.toastr.success('Đăng ký thành công!');
          this.toastr.remove(1);
          this.registerSuccessMessage = 'Vui lòng kiểm tra email để kích hoạt tài khoản trước khi đăng nhập!'
        };
      });
    }

  }
  login(){
    this.loginRequest.username = this.loginForm.get('username').value;
    this.loginRequest.password = this.loginForm.get('password').value;

    this.authService.login(this.loginRequest).subscribe(data =>{
      this.isLoginError = false;
      this.router.navigateByUrl('/home');
      this.toastr.success('Đã đăng nhập');
      this.toastr.clear();
    }, error => {
      this.isLoginError = true;
      throwError(error);
    });
  }

}
