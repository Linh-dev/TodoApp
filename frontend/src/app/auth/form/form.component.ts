import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from '../share/auth.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  isCheck: boolean;

  constructor (private authService: AuthService, private router: Router, private localStorage: LocalStorageService) {

  }

  ngOnInit(): void {
    this.authService.loggedIn.subscribe((data: boolean) => this.isCheck = data);
    this.isCheck = this.authService.isLoggedIn();
  }
  logout() {
    this.authService.logout();
    this.isCheck = false;
    this.router.navigateByUrl('/login');
  }
}
