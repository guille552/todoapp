import { Routes } from '@angular/router';
import { TodoComponent } from './components/todo/todo.component';

// Configuración de las rutas de la aplicación
export const routes: Routes = [
    // Ruta para acceder al componente TodoComponent cuando la URL es '/todo'
    { path: 'todo', component: TodoComponent },

    // Ruta comodín para redirigir cualquier URL no definida ('**')
    // hacia '/todo'. Esto asegura que cualquier ruta no válida
    // redirija al usuario al componente de tareas.
    { path: '**', pathMatch: 'full', redirectTo: 'todo' },
];
