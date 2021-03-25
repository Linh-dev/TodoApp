import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  title = 'todo-mvc';

  constructor(private localStorage: LocalStorageService,private router: Router){}

  ngOnInit(): void {
    if(this.localStorage.retrieve('authenticationToken')){
      this.router.navigate(['/home']);
    }
  }
}
