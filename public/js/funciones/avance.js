export const actualizarAvance = () => {
    //seleccionar las tareas existentes
    const tareas = document.querySelectorAll('li.tarea');

    if( tareas.length ){
        //seleccionar las tareas completadas
        const tareaCompletas = document.querySelectorAll('i.completo');

       //calcular el avance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);

       //mostrar el avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+'%';

    }
    

}