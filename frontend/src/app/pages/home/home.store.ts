import { Injectable, Signal } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { TodoService } from '../../services/todo/todo.service';
import { ITodoItem } from './todo-item.model';
import { HttpParams } from '@angular/common/http';

interface HomeState {
  todos: ITodoItem[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HomeStore extends ComponentStore<HomeState> {
  constructor(private todoService: TodoService) {
    super({ todos: [], loading: false });
  }

  public readonly todos: Signal<ITodoItem[]> = this.selectSignal(state => state.todos);
  public readonly isLoading: Signal<boolean> = this.selectSignal(state => state.loading);

  private readonly setTodos = this.updater((state, todos: ITodoItem[]) => ({
    ...state,
    todos,
  }));

  private readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));

  public readonly addTodo = this.effect((todo$: Observable<ITodoItem>) => {
    return todo$.pipe(
      tap(() => this.setLoading(true)),
      switchMap((todo) =>
        this.todoService.addTodo(todo).pipe(
          tap({
            next: (newTodo) => {
              this.setTodos([newTodo, ...this.get().todos]);
            },
            error: (error: unknown) => {
              console.error('Error adding todo:', error);
            },
          })
        )
      ),
      catchError(() => {
        this.setLoading(false);
        return of([]);
      }),
      tap(() => this.setLoading(false))
    );
  });

  public readonly deleteTodo = this.effect((id$: Observable<number>) => {
    return id$.pipe(
      tap(() => this.setLoading(true)),
      switchMap((id) =>
        this.todoService.deleteTodo(id).pipe(
          tap({
            next: () => {
              const updatedTodos = this.get().todos.filter(todo => todo.id !== id);
              this.setTodos(updatedTodos);
            },
            error: (error) => console.error('Error deleting todo:', error),
          })
        )
      ),
      catchError(() => {
        this.setLoading(false);
        return of([]);
      }),
      tap(() => this.setLoading(false))
    );
  });

  public readonly updateTodo = this.effect((todo$: Observable<ITodoItem>) => {
    return todo$.pipe(
      tap(() => this.setLoading(true)),
      switchMap((updatedTodo) =>
        this.todoService.updateTodo(updatedTodo.id!, updatedTodo).pipe(
          tap({
            next: (todo) => {
              const updatedTodos = this.get().todos.map(t =>
                t.id === todo.id ? todo : t
              );
              this.setTodos(updatedTodos);
            },
            error: (error) => console.error('Error updating todo:', error),
          })
        )
      ),
      catchError(() => {
        this.setLoading(false);
        return of([]);
      }),
      tap(() => this.setLoading(false))
    );
  });

  public readonly loadTodos = this.effect((
    params$: Observable<{ order_by?: string; title?: string; completed?: boolean }>
  ) => {
    return params$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(({ order_by, title, completed }) => {
        let params = new HttpParams().set('order_by', order_by ?? '-id');

        if (title) {
          params = params.set('title', title);
        }

        if (completed !== undefined) {
          params = params.set('completed', completed.toString());
        }

        return this.todoService.getTodos(params).pipe(
          tap({
            next: (todos: ITodoItem[]) => {
              this.setTodos(todos);
            },
            error: (error: unknown) => {
              console.error('Error loading todos:', error);
            },
          })
        );
      }),
      catchError(() => of([])),
      tap(() => this.setLoading(false))
    );
  });
}
