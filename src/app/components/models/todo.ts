// Interfaz que representa el modelo de datos para una tarea individual
export interface TodoModel {
    // Identificador único de la tarea
    id: number;

    // Título o descripción de la tarea
    title: string;

    // Indica si la tarea está completada (true) o pendiente (false)
    completed: boolean;

    // (Opcional) Indica si la tarea está en modo edición
    editing?: boolean;
}

// Tipo que define las opciones de filtro para la lista de tareas
export type FilterType = 'all' | 'active' | 'completed';
// 'all': Muestra todas las tareas
// 'active': Muestra solo las tareas pendientes
// 'completed': Muestra solo las tareas completadas
