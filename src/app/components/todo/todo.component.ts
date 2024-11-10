import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { FilterType, TodoModel } from '../models/todo';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Definición del componente Angular
@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {
  
  // Lista de tareas iniciales utilizando señales (signals) para manejo de estado reactivo
  todolist = signal<TodoModel[]>([]);

  // Estado de filtro actual, utilizado para mostrar diferentes tipos de tareas (ej. todas, completadas, pendientes)
  filter = signal<FilterType>('all');

  // Computed property para obtener las tareas filtradas según el filtro actual

  todoListFiltered = computed(() => {

    // Si el filtro es 'all', se muestran todas las tareas

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

  // Controlador de formulario para la nueva tarea

  newTodo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  // Constructor del componente
  constructor() {
    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.todolist()));
    })
   }

   // Metodo para inicializar el componente
  ngOnInit(): void {
    const storage = localStorage.getItem('todos');
    if (storage) {
      this.todolist.set(JSON.parse(storage));
    }
  } 
  // Método para cambiar el filtro de visualización de tareas

  changeFilter(filterString: FilterType) {
    this.filter.set(filterString);
  }


  // Método para agregar una nueva tarea

  addTodo() {
    const newTodoTitle = this.newTodo.value.trim();

    // Validación de la nueva tarea  

    if (this.newTodo.valid && newTodoTitle !== '') {
      this.todolist.update((prev_todos) =>{
        return [
          ...prev_todos,{
            id:Date.now(),
            title:newTodoTitle,
            completed:false
          },
        ];
      });
      this.newTodo.reset();
    }
    else{
      this.newTodo.reset();
    }
  }

  // Método para cambiar el estado de completado de una tarea
  toggleTodo(todoId: number) {
    this.todolist.update((prev_todos) => prev_todos.map((todo) => {
    return todo.id === todoId ? { ...todo, completed: !todo.completed } : todo;}
    ));
  }
  removeTodo(todoId: number) {
    this.todolist.update((prev_todos) => prev_todos.filter((todo) => todo.id !== todoId));
  }

  // Metodo para editar una tarea

  updateTodo(todoId: number) {
    return this.todolist.update((prev_todos) => prev_todos.map((todo) => {
      return todo.id === todoId ? 
        { ...todo, editing: true } 
      : { ...todo, editing: false };
    }));
  }

  // Metodo para guardar el titulo de una tarea
  saveTitleTodo(todoId: number, event: Event) {
    const Title = (event.target as HTMLInputElement).value;
    return this.todolist.update((prev_todos) => prev_todos.map((todo) => {
      return todo.id === todoId ? { ...todo, title: Title, editing: false } : todo;
    }));
  }
}
