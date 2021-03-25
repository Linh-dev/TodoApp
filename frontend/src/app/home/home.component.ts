import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { FilterButton, Filter } from 'src/app/models/filtering.model';
import { TodoService } from '../service/todo.service';
import { TodoRequest } from './todo-request.payload';
import { TodoResponse } from './todo-response.payload';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('dashComplete',[
      state('active',style({
        fontSize: '18px',
        color: 'black'
      })),
      state('completed',style({
        fontSize:'17px',
        color: 'lightgrey',
        textDecoration: 'line-through'
      })),
      transition('active <=> completed',[animate(250)])
    ])
  ]
})
export class HomeComponent implements OnInit {
  filterButtons: FilterButton[] = [
    { type: Filter.All, label: 'All', isActive: true },
    { type: Filter.Active, label: 'Active', isActive: false },
    { type: Filter.Completed, label: 'Completed', isActive: false },
  ];

  isAll: boolean;
  isActive: boolean;
  isCompleted: boolean;

  addTitle = " ";

  idTodo : number;
  titleTodo: string;

  length = 0;

  isHovered :boolean;
  isEditing :boolean;

  newTodoForm: FormGroup;
  updateTodoForm: FormGroup;

  todoResponses: Array<TodoResponse>;
  todoRequest: TodoRequest;
  todoResponse: TodoResponse;

  constructor(private todoService: TodoService, private router: Router, private toastr: ToastrService) {
    this.isHovered = false;
    this.isEditing = false;
    this.isAll = true;
    this.isCompleted = false;
    this.isActive = false;
    this.idTodo = 0;
    this.titleTodo = '';
    this.length = 0;
    this.todoRequest = {
      title: ''
    };
    this.todoResponse = {
      id: 0,
      title: '',
      completed: false
    };
    this.todoResponses;
   }

  ngOnInit(): void {
    this.todoService.getAllTodo().subscribe(data => {
      this.todoResponses = data;
      console.log(data);
      this.length = this.todoResponses.length;
    }, error => {
      throwError(error);
    });
    this.newTodoForm = new FormGroup({
      newTodo: new FormControl('')
    });
    this.updateTodoForm = new FormGroup({
      updateTodo: new FormControl('')
    });
    this.isEditing = false;
  }

  getAll(){
    if(this.isAll){
      this.getAll1();
    }else if(this.isActive){
      this.getActive();
    }else{
      this.getCompleted();
    }
  }

  private checkTemplate(check1:boolean, check2:boolean, check3:boolean):number{
    if(check1){
      return 1;
    }else if(check2){
      return 2;
    }else{
      return 3;
    }
  }

  getAll1(){
    this.todoService.getAllTodo().subscribe(data =>{
      this.todoResponses = data;
      console.log(data);
      this.length = this.todoResponses.length;
      this.isActive = false;
      this.isAll = true;
      this.isCompleted = false;
    }, error => {
      throwError(error);
    });
  }

  getActive(){
    this.todoService.getComplete(false).subscribe(data =>{
      this.todoResponses = data;
      this.length = this.todoResponses.length;
      this.isActive = true;
      this.isAll = false;
      this.isCompleted = false;
    }), error => {
      throwError(error);
    };
  }
  getCompleted(){
      this.todoService.getComplete(true).subscribe(data =>{
        this.todoResponses = data;
        this.length = this.todoResponses.length;
        this.isActive = false;
        this.isAll = false;
        this.isCompleted = true;
      }), error => {
        throwError(error);
      };
  }

  addTodo(){
    this.todoRequest.title = this.newTodoForm.get('newTodo').value;
    var check = this.checkadd(this.todoRequest.title)
    if(check || this.todoRequest.title==undefined){
      this.toastr.warning("Xin mời Công việc Cần thực hiện!")
    }else{
      this.newTodoForm.reset();
      console.log(this.todoRequest.title);
      this.todoService.addTodo(this.todoRequest).subscribe(() => {
        this.getAll();
      }, error => {
        throwError(error);
      });
    }
  }

  private checkadd(text: string):boolean {
    for(var i = 0; i < text.length; i++ ){
      if(text[i]!==" "){
        return false;
      }
    }
    return true;
  }

  editForm(id,title){
    this.idTodo = id;
    this.titleTodo = title;
    this.isEditing = true;
  }

  updateTodo(){
    this.todoResponse.id = this.idTodo;
    this.todoResponse.title = this.updateTodoForm.get('updateTodo').value;
    if(this.updateTodoForm.get('updateTodo').value!==''){
      this.todoService.update(this.todoResponse).subscribe(()=>{
        this.getAll();
      }, error => {
        throwError(error);
    })
    }
    this.isEditing = false;
  }

  deleteTodo(id){
    this.todoService.delete(id).subscribe(()=>{
      this.getAll();
    }, error => {
      throwError(error);
  })
  }

  deleteCompleted(){
    this.todoService.deleteCompleted().subscribe(()=>{
      this.getAll1();
    }),error =>{
      throwError(error);
    }
  }

  changeStatus(id){
    this.todoService.changeStatus(id).subscribe(()=>{
      this.getAll();
    }, error => {
      throwError(error);
  })
  }

  allChoose(){
    this.todoService.allChoose().subscribe(()=>{
      this.getAll();
    }), error =>{
      throwError(error);
    }
  }
}
