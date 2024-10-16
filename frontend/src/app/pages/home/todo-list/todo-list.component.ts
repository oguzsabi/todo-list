import { Component, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ITodoParams, ITodoItem } from '../todo-item.model';
import { HomeStore } from '../home.store';
import { TodoFormDialogComponent } from '../todo-form-dialog/todo-form-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
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
    ConfirmDialogComponent,
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  public todos: ITodoItem[] = [];
  public filterStatus: string = 'all';
  public searchTerm: string = '';
  public defaultOrderBy: string = '-id';
  public orderBy: string = this.defaultOrderBy;
  public filters: ITodoParams = {
    order_by: this.orderBy,
    title: this.searchTerm,
  }

  private readonly searchDelay: number = 600;
  private searchTimeout: ReturnType<typeof setTimeout> | undefined;

  public allExpanded: boolean = false;

  constructor(
    public readonly homeStore: HomeStore,
    private readonly dialog: MatDialog
  ) {
    effect(() => {
      this.todos = this.homeStore.todos();
    });
  }

  public ngOnInit(): void {
    this.loadTodos();
  }

  public deleteTodo(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this todo item?'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.homeStore.deleteTodo(id);
      }
    });
  }

  public toggleComplete(todo: ITodoItem): void {
    const updatedTodo: ITodoItem = {
      ...todo,
      completed: !todo.completed
    };
    this.homeStore.updateTodo(updatedTodo);
  }

  public searchTodos(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.filters.title = this.searchTerm;

    this.searchTimeout = setTimeout(() => {
      this.loadTodos();
    }, this.searchDelay);
  }

  public applyStatusFilter(): void {
    if (this.filterStatus === 'completed') {
      this.filters.completed = true;
    } else if (this.filterStatus === 'active') {
      this.filters.completed = false;
    } else {
      delete this.filters.completed;
    }

    this.loadTodos();
  }

  public applyOrderBy(): void {
    this.filters.order_by = this.orderBy ?? this.defaultOrderBy;
    this.loadTodos();
  }

  public openEditDialog(todo?: ITodoItem): void {
    const dialogRef = this.dialog.open(TodoFormDialogComponent, {
      width: '600px',
      maxWidth: '600px',
      maxHeight: '80vh',
      data: { todo: todo ? { ...todo } : null },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: ITodoItem | undefined) => {
      if (result) {
        this.loadTodos();
      }
    });
  }

  public toggleExpandAll(): void {
    this.allExpanded = !this.allExpanded;
  }

  private loadTodos(): void {
    this.homeStore.loadTodos(this.filters);
  }
}
