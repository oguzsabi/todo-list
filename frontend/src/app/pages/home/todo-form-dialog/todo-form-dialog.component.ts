import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { ITodoItem } from '../todo-item.model';
import { HomeStore } from '../home.store';

@Component({
  selector: 'app-todo-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    TodoFormComponent
  ],
  template: `
    <h2 mat-dialog-title class="mb-0">Edit To-Do</h2>
    <app-todo-form [todo]="data.todo" [isDialog]="true" (formSubmit)="onFormSubmit($event)" (formCancel)="onCancel()"></app-todo-form>
  `,
})
export class TodoFormDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TodoFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { todo: ITodoItem | null },
    private homeStore: HomeStore
  ) { }

  public onFormSubmit(todo: ITodoItem): void {
    this.data.todo = todo;
    this.onSave();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    if (!this.data.todo?.id) {
      return;
    }

    this.homeStore.updateTodo(this.data.todo);
    this.dialogRef.close(this.data.todo);
  }
}
