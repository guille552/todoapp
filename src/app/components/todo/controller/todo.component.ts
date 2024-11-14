import {Component} from '@angular/core';
import {FilterType} from '../models/todo';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TodoService} from '../services/todo.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent  {
  currentFilter: string = 'all';

  constructor(private todoService: TodoService) {
  }


  newTodo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });


  changeFilter(filterString: FilterType) {
    this.currentFilter = filterString;
    this.todoService.changeFilter(filterString);
  }

  filterTodo() {
    return this.todoService.todoListFiltered();
  }

  addTodo() {
    if (this.newTodo.valid) {
      this.todoService.addTodo(this.newTodo.value);
      this.newTodo.reset();
    }
  }

  toggleTodo(todoId: number) {
    this.todoService.toggleTodo(todoId);
  }

  removeTodo(todoId: number) {
    this.todoService.removeTodo(todoId);
  }

  setTodoAsEditing(todoId: number) {
    this.todoService.setTodoAsEditing(todoId);
  }

  updateTodo(todoId: number, event: Event) {
    const newTitle = (event.target as HTMLInputElement).value;
    this.todoService.updateTodo(todoId, newTitle);
  }

}
