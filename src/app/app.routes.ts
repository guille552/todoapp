import {Routes} from '@angular/router';
import {TodoComponent} from './components/todo/controller/todo.component';
import {WeatherComponent} from "./components/weather/weather.component";

// Configuración de las rutas de la aplicación
export const routes: Routes = [
    // Ruta para acceder al componente TodoComponent cuando la URL es '/todo'
    {path: 'todo', component: TodoComponent},
    {path: 'weather', component: WeatherComponent},
    {path: '**', pathMatch: 'full', redirectTo: 'todo'},

];
