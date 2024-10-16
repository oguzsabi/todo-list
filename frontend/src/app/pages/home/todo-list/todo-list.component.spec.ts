import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { HomeStore } from '../home.store';
import { of } from 'rxjs';
import { ITodoItem } from '../todo-item.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: ''
})
class MockConfirmDialogComponent { }

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let homeStoreMock: jasmine.SpyObj<HomeStore>;

  const mockTodos: ITodoItem[] = [
    { id: 1, title: 'Test Todo 1', completed: false },
    { id: 2, title: 'Test Todo 2', completed: true },
  ];

  beforeEach(async () => {
    homeStoreMock = jasmine.createSpyObj('HomeStore', ['loadTodos', 'deleteTodo', 'updateTodo', 'isLoading'], {
      todos: signal(mockTodos)
    });

    homeStoreMock.isLoading.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [
        TodoListComponent,
        NoopAnimationsModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatListModule,
        MatCheckboxModule,
        MatIconModule,
        MatProgressBarModule,
        MatDialogModule,
      ],
      providers: [
        { provide: HomeStore, useValue: homeStoreMock },
      ],
      declarations: [MockConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on init', () => {
    expect(homeStoreMock.loadTodos).toHaveBeenCalled();
  });

  it('should update todos when homeStore.todos() changes', () => {
    expect(component.todos).toEqual(mockTodos);
  });

  it('should call searchTodos when searchTerm changes', fakeAsync(() => {
    spyOn(component, 'searchTodos').and.callThrough();

    component.searchTerm = 'test';
    component.searchTodos();

    tick(600);

    expect(component.searchTodos).toHaveBeenCalled();
    expect(homeStoreMock.loadTodos).toHaveBeenCalled();
  }));

  it('should apply status filter', () => {
    component.filterStatus = 'completed';

    component.applyStatusFilter();

    expect(component.filters.completed).toBeTrue();
    expect(homeStoreMock.loadTodos).toHaveBeenCalled();
  });

  it('should apply order by', () => {
    component.orderBy = 'title';

    component.applyOrderBy();

    expect(component.filters.order_by).toBe('title');
    expect(homeStoreMock.loadTodos).toHaveBeenCalled();
  });

  it('should toggle expand all', () => {
    component.allExpanded = false;

    component.toggleExpandAll();

    expect(component.allExpanded).toBeTrue();
  });

  it('should call homeStore.deleteTodo when deleteTodo is called', () => {
    spyOn(component['dialog'], 'open').and.returnValue({
      afterClosed: () => of(true)
    } as any);

    component.deleteTodo(1);

    expect(homeStoreMock.deleteTodo).toHaveBeenCalledWith(1);
  });

  it('should not call homeStore.deleteTodo when deleteTodo is called and not confirmed', () => {
    spyOn(component['dialog'], 'open').and.returnValue({
      afterClosed: () => of(false)
    } as any);

    component.deleteTodo(1);

    expect(homeStoreMock.deleteTodo).not.toHaveBeenCalled();
  });

  it('should toggle todo completion', () => {
    const todo: ITodoItem = { id: 1, title: 'Test', completed: false };

    component.toggleComplete(todo);

    expect(homeStoreMock.updateTodo).toHaveBeenCalledWith({ ...todo, completed: true });
  });
});
