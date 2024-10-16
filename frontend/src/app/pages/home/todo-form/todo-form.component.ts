import { Component, ElementRef, ViewChild, HostListener, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HomeStore } from '../home.store';
import { ITodoItem } from '../todo-item.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatError,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent implements OnInit {
  @Input() public todo: ITodoItem | null = null;
  @Input() public isDialog: boolean = false;
  @Output() public formSubmit: EventEmitter<ITodoItem> = new EventEmitter<ITodoItem>();
  @Output() public formCancel: EventEmitter<void> = new EventEmitter<void>();

  public todoForm: FormGroup;
  public isExpanded: boolean = false;

  @ViewChild('todoCard', { static: true }) todoCard!: ElementRef;
  @ViewChild('titleInput') titleInput!: ElementRef;

  constructor(private readonly formBuilder: FormBuilder, private readonly homeStore: HomeStore) {
    this.todoForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      due_date: [undefined]
    });
  }

  public ngOnInit(): void {
    this.isExpanded = this.isDialog;

    if (this.todo) {
      this.todoForm.patchValue(this.todo);
    }
  }

  @HostListener('document:click', ['$event'])
  public clickOutside(event: Event): void {
    const clickedElement = event.target as HTMLElement;

    if (!this.isExpanded || this.isDialog || this.todoCard.nativeElement.contains(clickedElement)) {
      return;
    }

    if (!this.isDatePickerClicked(clickedElement)) {
      this.collapseForm();
    }
  }

  public isDatePickerClicked(element: HTMLElement): boolean {
    return element.closest('.mat-datepicker-content') !== null;
  }

  public expandForm(): void {
    if (this.isExpanded) {
      return;
    }

    this.isExpanded = true;

    setTimeout(() => {
      this.titleInput.nativeElement.focus();
    });
  }

  public clearStartDate(): void {
    this.todoForm.patchValue({
      due_date: null
    });
  }

  public onSubmit(): void {
    if (!this.todoForm.valid) {
      return;
    }

    const formData = this.todoForm.value;
    const updatedTodo: ITodoItem = {
      ...this.todo,
      ...formData,
      due_date: this.todoForm.value.due_date ? this.todoForm.value.due_date : undefined
    };

    if (this.isDialog) {
      this.formSubmit.emit(updatedTodo);

      return;
    }

    this.homeStore.addTodo(updatedTodo);
    this.collapseForm(true);
  }

  public onCancel(): void {
    this.formCancel.emit();
  }

  private collapseForm(isSubmitted: boolean = false): void {
    this.isExpanded = false;

    if (isSubmitted) {
      this.todoForm.reset({
        title: '',
        description: '',
        due_date: undefined
      });
    }

    this.todoForm.controls['title'].setErrors(null);
  }
}
