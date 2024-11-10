import {Component, computed, effect, OnInit, signal} from '@angular/core';
import {FilterType, TodoModel} from '../models/todo';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

// Definición del componente Angular
@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {

  constructor() {
    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.todolist()));
    })
  }

  ngOnInit(): void {
    const storage = localStorage.getItem('todos');
    if (storage) {
      this.todolist.set(JSON.parse(storage));
    }
  }

  // Lista de tareas iniciales utilizando señales (signals) para manejo de estado reactivo
  todolist = signal<TodoModel[]>([]);

  // Estado de filtro actual, utilizado para mostrar diferentes tipos de tareas (ej. todas, completadas, pendientes)
  filter = signal<FilterType>('all');

  // Computed property para obtener las tareas filtradas según el filtro actual

  todoListFiltered = computed(() => {

    const filter = this.filter();
    const todos = this.todolist();

    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  });


  newTodo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });


  changeFilter(filterString: FilterType) {
    this.filter.set(filterString);
  }


  addTodo() {
    const newTodoTitle = this.newTodo.value.trim();

    // Validación de la nueva tarea

    if (this.newTodo.valid && newTodoTitle !== '') {
      this.todolist.update((prev_todos) => {
        return [
          ...prev_todos, {
            id: Date.now(),
            title: newTodoTitle,
            completed: false,
            editing: false
          },
        ];
      });
    }
    this.newTodo.reset();
  }


  // Método para cambiar el estado de completado de una tarea
  toggleTodo(todoId: number) {
    this.todolist.update((previousTodos) => {
      return previousTodos.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            completed: !todo.completed
          };
        }
        return todo;
      });
    });
  }

  removeTodo(todoId: number) {
    this.todolist.update((previousTodos) => {
      return previousTodos.filter((todo) => {
        return todo.id !== todoId;
      });
    });
  }


  setTodoAsEditing(todoId: number) {
    this.todolist.update((previousTodos) => {
      return previousTodos.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            editing: true
          };
        }

        return {
          ...todo
        };
      });
    });
  }

  updateTodo(todoId: number, event: Event) {
    const newTitle = (event.target as HTMLInputElement).value;

    return this.todolist.update((previousTodos) => {
      return previousTodos.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            title: newTitle,
            editing: false
          };
        }

        return todo;
      });
    });
  }

}
