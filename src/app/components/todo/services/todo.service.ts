import { Injectable, computed, effect, signal } from '@angular/core';
import { FilterType, TodoModel } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todolist = signal<TodoModel[]>([]);
  private filter = signal<FilterType>('all');

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

  constructor() {
    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.todolist()));
    });
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const storage = localStorage.getItem('todos');
    if (storage) {
      this.todolist.set(JSON.parse(storage));
    }
  }

  getTodos() {
    return this.todolist;
  }

  changeFilter(filterString: FilterType) {
    this.filter.set(filterString);
  }

  addTodo(title: string) {
    const newTodoTitle = title.trim();
    if (newTodoTitle !== '') {
      this.todolist.update((prev_todos) => {
        return [
          ...prev_todos,
          {
            id: Date.now(),
            title: newTodoTitle,
            completed: false,
            editing: false
          },
        ];
      });
    }
  }

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
      return previousTodos.filter((todo) => todo.id !== todoId);
    });
  }

  setTodoAsEditing(todoId: number) {
    this.todolist.update((previousTodos) => {
      return previousTodos.map((todo) => ({
        ...todo,
        editing: todo.id === todoId ? true : todo.editing
      }));
    });
  }

  updateTodo(todoId: number, newTitle: string) {
    this.todolist.update((previousTodos) => {
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
