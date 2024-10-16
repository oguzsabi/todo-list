import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TodoService } from './todo.service';
import { ITodoItem } from '../../pages/home/todo-item.model';

describe('TodoService', () => {
  let service: TodoService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    service = TestBed.inject(TodoService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get todos', () => {
    const mockTodos: ITodoItem[] = [
      { id: 1, title: 'Test Todo 1', completed: false },
      { id: 2, title: 'Test Todo 2', completed: true }
    ];
    const params = new HttpParams().set('completed', 'false');

    service.getTodos(params).subscribe(todos => {
      expect(todos).toEqual(mockTodos);
    });

    const req = httpTestingController.expectOne(request =>
      request.url === 'todos/' &&
      request.params.get('completed') === 'false'
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockTodos);
  });

  it('should add a todo', () => {
    const newTodo: ITodoItem = { title: 'New Todo', completed: false };
    const mockResponse: ITodoItem = { id: 3, ...newTodo };

    service.addTodo(newTodo).subscribe(todo => {
      expect(todo).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('todos/');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTodo);

    req.flush(mockResponse);
  });

  it('should update a todo', () => {
    const updatedTodo: ITodoItem = { id: 1, title: 'Updated Todo', completed: true };

    service.updateTodo(1, updatedTodo).subscribe(todo => {
      expect(todo).toEqual(updatedTodo);
    });

    const req = httpTestingController.expectOne('todos/1');

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTodo);

    req.flush(updatedTodo);
  });

  it('should delete a todo', () => {
    const deletedTodo: ITodoItem = { id: 1, title: 'Deleted Todo', completed: false };

    service.deleteTodo(1).subscribe(todo => {
      expect(todo).toEqual(deletedTodo);
    });

    const req = httpTestingController.expectOne('todos/1');

    expect(req.request.method).toBe('DELETE');

    req.flush(deletedTodo);
  });
});
