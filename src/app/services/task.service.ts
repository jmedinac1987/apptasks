import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { Task } from '../models/task' ;
//import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private server: string;
  private _httpHeaders: HttpHeaders;
  private headers;

  constructor(private _http:HttpClient, private tokenService: TokenService)
  {
    this.server = 'https://tasksapplication.herokuapp.com/api';        
  }

  getHeaders(){
    this._httpHeaders = new HttpHeaders().set('Authorization', `Bearer ${this.tokenService.getToken()}`);
    this.headers = { headers: this._httpHeaders};
    return this.headers;
  }

  getTasks(){  	  	
    return this._http.get<Task[]>(`${this.server}/tasks`, this.getHeaders());
  }

  getTasksPending(){  	  	
    return this._http.get<Task[]>(`${this.server}/tasks/pending`, this.getHeaders());
  }

  putTask(task){    
    return this._http.put(`${this.server}/tasks/${task._id}`, task ,this.getHeaders());
  }

  deleteTask(id_task){
    return this._http.delete(`${this.server}/tasks/${id_task}`,this.getHeaders());
  }
  
  postTask(task)
  {
    return this._http.post(`${this.server}/tasks`, task, this.getHeaders());
  }

}
