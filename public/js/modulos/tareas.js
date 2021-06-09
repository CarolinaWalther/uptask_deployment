import Swal from 'sweetalert2';
import axios from 'axios';


const tareas = document.querySelector('.listado-pendientes');

if(tareas) {
    tarea.addEventListener('click', e => {
        if(e.target.classList.conteins('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            
            //request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            
            axios.patch(url, { idTarea })
                .then(function(respuesta){
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');
                    }
                    
                })
        }
        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement,
                  idTarea = tareaHTML.dataset.tarea;

                  Swal.fire({
                    title: 'Deseas borrar este proyecto?',
                    text: "Un proyecto eliminado no se puede recuperar",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, Borrar',
                    cancelButtonText: 'No, Cancelar',
                  }).then((result) => {
                    if (result.value) {
                       const url = `${location.origin}/tareas/${idTarea}`;

                       //enviar el delete por medio axios
                       axios.delete(url, { params: { idTarea }})
                           .then(function(reapuesta) {
                               if(respuesta.status === 200) {
                                   //Eliminar el Nodo
                                   tareaHTML.parentElement.removeChild(tareaHTML);

                                   //Opcional una alerta
                                   Swal.fire(
                                       'Tarea Eliminada',
                                       respuesta.data,
                                       'success'
                                   )
                               }
                           });
                    }
                 })     
    
        }
    });

}

export default tareas;