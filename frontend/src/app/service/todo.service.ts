import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { TodoRequest } from '../home/todo-request.payload';
import { TodoResponse } from '../home/todo-response.payload';

@Injectable({
  providedIn: 'root'
})
export class TodoService{

  todoList: Array<TodoResponse>;

  todoResponse : TodoResponse;


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json',
    'Authorization': 'Bearer '+''})
  }

  constructor(private httpClinet: HttpClient, private localStorage: LocalStorageService){
    this.httpOptions;
  }

  getAllTodo(): Observable<Array<TodoResponse>>{
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.localStorage.retrieve('authenticationToken')})
    }
    console.log(this.httpOptions);
    return this.httpClinet.get<Array<TodoResponse>>('http://localhost:8080/api/todo/all',this.httpOptions);
  }

  getComplete(isCheck:boolean):Observable<Array<TodoResponse>>{
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.localStorage.retrieve('authenticationToken')})
    }
    return this.httpClinet.post<Array<TodoResponse>>('http://localhost:8080/api/todo/allComplete',isCheck,this.httpOptions)
  }

  addTodo(todoRequest: TodoRequest): Observable<any>{
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.localStorage.retrieve('authenticationToken')})
    }
    return this.httpClinet.post('http://localhost:8080/api/todo/create',todoRequest,this.httpOptions);
  }

  delete(id:number): Observable<any>{
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.localStorage.retrieve('authenticationToken')})
    }
    return this.httpClinet.delete('http://localhost:8080/api/todo/delete/'+id,this.httpOptions);
  }

  deleteCompleted(): Observable<any>{
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.localStorage.retrieve('authenticationToken')})
    }
    return this.httpClinet.delete('http://localhost:8080/api/todo/deleteCompleted',this.httpOptions);
  }

  update(todoResponse: TodoResponse): Observable<any>{

    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.localStorage.retrieve('authenticationToken')})
    }
    return this.httpClinet.put('http://localhost:8080/api/todo/update',todoResponse,this.httpOptions)
  }

  changeStatus(id: number){
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.localStorage.retrieve('authenticationToken')})
    }
    return this.httpClinet.put('http://localhost:8080/api/todo/change',id,this.httpOptions)
  }

  allChoose(){
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.localStorage.retrieve('authenticationToken')})
    }
    return this.httpClinet.get('http://localhost:8080/api/todo/changeAllComplete',this.httpOptions);
  }
}
