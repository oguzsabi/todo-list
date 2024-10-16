import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeStore } from './home.store';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoFormComponent } from './todo-form/todo-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TodoListComponent, TodoFormComponent],
  providers: [HomeStore],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent { }
