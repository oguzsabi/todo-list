import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TodoFormComponent } from './todo-form.component';
import { HomeStore } from '../home.store';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ITodoItem } from '../todo-item.model';

describe('TodoFormComponent', () => {
  let component: TodoFormComponent;
  let fixture: ComponentFixture<TodoFormComponent>;
  let homeStoreMock: jasmine.SpyObj<HomeStore>;

  beforeEach(async () => {
    homeStoreMock = jasmine.createSpyObj('HomeStore', ['addTodo']);

    await TestBed.configureTestingModule({
      imports: [
        TodoFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCardModule,
        MatIconModule,
      ],
      providers: [
        { provide: HomeStore, useValue: homeStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.todoForm.value).toEqual({
      title: '',
      description: '',
      due_date: null
    });
  });

  it('should initialize form with todo values when todo input is provided', () => {
    const mockTodo: ITodoItem = {
      id: 1,
      title: 'Test Todo',
      description: 'Test Description',
      due_date: new Date(),
      completed: false
    };
    component.todo = mockTodo;

    component.ngOnInit();

    expect(component.todoForm.value).toEqual({
      title: mockTodo.title,
      description: mockTodo.description,
      due_date: mockTodo.due_date
    });
  });

  it('should expand form when expandForm is called', () => {
    component.isExpanded = false;

    component.expandForm();

    expect(component.isExpanded).toBeTrue();
  });

  it('should clear start date when clearStartDate is called', () => {
    component.todoForm.patchValue({ due_date: new Date() });

    component.clearStartDate();

    expect(component.todoForm.get('due_date')?.value).toBeNull();
  });

  it('should not submit form when it is invalid', () => {
    spyOn(component.formSubmit, 'emit');

    component.onSubmit();

    expect(component.formSubmit.emit).not.toHaveBeenCalled();
    expect(homeStoreMock.addTodo).not.toHaveBeenCalled();
  });

  it('should emit formSubmit event when form is valid and in dialog mode', () => {
    spyOn(component.formSubmit, 'emit');
    component.isDialog = true;
    component.todoForm.patchValue({ title: 'Test Todo' });

    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalled();
    expect(homeStoreMock.addTodo).not.toHaveBeenCalled();
  });

  it('should call homeStore.addTodo when form is valid and not in dialog mode', () => {
    component.todoForm.patchValue({ title: 'Test Todo' });

    component.onSubmit();

    expect(homeStoreMock.addTodo).toHaveBeenCalled();
  });

  it('should emit formCancel event when onCancel is called', () => {
    spyOn(component.formCancel, 'emit');

    component.onCancel();

    expect(component.formCancel.emit).toHaveBeenCalled();
  });

  it('should collapse form and reset values after submission', () => {
    component.isExpanded = true;
    component.todoForm.patchValue({
      title: 'Test Todo',
      description: 'Test Description',
      due_date: new Date()
    });

    component.onSubmit();

    expect(component.isExpanded).toBeFalse();
    expect(component.todoForm.value).toEqual({
      title: '',
      description: '',
      due_date: null
    });
  });

  it('should not collapse form when clicking inside the form', () => {
    component.isExpanded = true;
    const event = new MouseEvent('click');

    spyOn(component.todoCard.nativeElement, 'contains').and.returnValue(true);

    component.clickOutside(event);

    expect(component.isExpanded).toBeTrue();
  });

  it('should collapse form when clicking outside the form', () => {
    component.isExpanded = true;
    component.isDialog = false;
    const mockEvent = { target: {} } as Event;

    spyOn(component.todoCard.nativeElement, 'contains').and.returnValue(false);
    spyOn(component, 'isDatePickerClicked').and.returnValue(false);

    component.clickOutside(mockEvent);

    expect(component.isExpanded).toBeFalse();
  });

  it('should not collapse form when clicking on datepicker', () => {
    component.isExpanded = true;
    component.isDialog = false;
    const mockEvent = { target: {} } as Event;

    spyOn(component.todoCard.nativeElement, 'contains').and.returnValue(false);
    spyOn(component, 'isDatePickerClicked').and.returnValue(true);

    component.clickOutside(mockEvent);

    expect(component.isExpanded).toBeTrue();
  });

  it('should not collapse form when in dialog mode', () => {
    component.isExpanded = true;
    component.isDialog = true;
    const event = new MouseEvent('click');

    spyOn(component.todoCard.nativeElement, 'contains').and.returnValue(false);

    component.clickOutside(event);

    expect(component.isExpanded).toBeTrue();
  });
});
