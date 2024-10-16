import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITodoItem } from '../../pages/home/todo-item.model';


@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'todos/';

  constructor(private http: HttpClient) { }

  public getTodos(params: HttpParams): Observable<ITodoItem[]> {
    return this.http.get<ITodoItem[]>(this.apiUrl, { params });
  }

  public addTodo(todo: ITodoItem): Observable<ITodoItem> {
    return this.http.post<ITodoItem>(this.apiUrl, todo);
  }

  public updateTodo(id: number, todo: ITodoItem): Observable<ITodoItem> {
    return this.http.put<ITodoItem>(`${this.apiUrl}${id}`, todo);
  }

  public deleteTodo(id: number): Observable<ITodoItem> {
    return this.http.delete<ITodoItem>(`${this.apiUrl}${id}`);
  }
}