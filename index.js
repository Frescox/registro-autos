document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('.mi-text').addEventListener('animationend', (event) => {
        if (event.animationName === 'typing') {
            event.target.style.borderRight = 'none';
        }
    });

    // Valida los formularios al hacer submit
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach((form) => {
        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
});

const panel1 = document.getElementById("panel-1");
const panel2 = document.getElementById("panel-2");
const panel3 = document.getElementById("panel-3");

function irRegistro() {
    const panel = document.getElementById('panel-3');
    const cartas = panel.querySelectorAll('.auto-card');
    cartas.forEach(carta => carta.remove());
    
    panel3.classList.remove("active", "panel-entering");
    panel3.classList.add("panel-exiting");

  // Espera el tiempo de la animación para mostrar panel-1
  setTimeout(() => {
    panel3.classList.remove("panel-exiting");
    panel1.classList.add("active", "panel-entering");
    panel2.classList.add("active", "panel-entering");
    panel3.classList.remove("active");
  }, 500);
}

function irAlmacen() {
  // Animación de salida para el panel de registro
  panel1.classList.remove("active", "panel-entering");
  panel1.classList.add("panel-exiting");
  panel2.classList.remove("active", "panel-entering");
  panel2.classList.add("panel-exiting");

  setTimeout(() => {
    panel1.classList.remove("panel-exiting");
    panel2.classList.remove("panel-exiting");
    panel1.classList.remove("active");
    panel2.classList.remove("active");
    panel3.classList.add("active", "panel-entering");
    panel3.style.display = 'block';
  }, 500);
}

function actualizarAlturaPanel(panelId) {
    const panel = document.getElementById(panelId);
    const alturaContenido = panel.scrollHeight;
    panel.style.height = `${1000}px`;
}

const API_KEY_PIXABAY = '47047669-748a52a0e987fcc5ada30a247'; 

function cargarAutos() {
    fetch('getAutos.php', {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Autos recibidos:', data);

            if (data.success) {
                const panel = document.getElementById('panel-3');
                panel.innerHTML = '';

                data.autos.forEach(auto => {
                    const autoCard = document.createElement('div');
                    autoCard.classList.add('auto-card');

                    buscarImagenDeAuto(auto.marca)
                        .then(imageUrl => {
                            const img = new Image();
                            img.src = imageUrl;
                            img.alt = `Imagen de ${auto.marca}`;
                            img.classList.add('auto-image'); 

                            autoCard.innerHTML += `
                                <h3>${auto.marca} - ${auto.modelo}</h3>
                                <p>Placa: ${auto.placa}</p>
                                <p>Serie: ${auto.serie}</p>
                                <p>Propietario: ${auto.nombre}</p>
                                <p>Email: ${auto.email}</p>
                                <button class="btn btn-danger" onclick="eliminarAuto(${auto.id_auto})">Eliminar</button>
                                <button class="btn btn-primary" onclick="mostrarFormularioEdicion(${auto.id_auto})">Editar</button>
                                <form id="formulario-edicion-${auto.id_auto}" class="form-edicion" style="display: none;" onsubmit="actualizarAuto(event, ${auto.id_auto})">
                                    <div class="mb-3">
                                        <label for="placa-${auto.id_auto}" class="form-label">Placa:</label>
                                        <input type="text" class="form-control" id="placa-${auto.id_auto}" name="placa" value="${auto.placa}" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="serie-${auto.id_auto}" class="form-label">Serie:</label>
                                        <input type="text" class="form-control" id="serie-${auto.id_auto}" name="serie" value="${auto.serie}" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="marca-${auto.id_auto}" class="form-label">Marca:</label>
                                        <input type="text" class="form-control" id="marca-${auto.id_auto}" name="marca" value="${auto.marca}" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="modelo-${auto.id_auto}" class="form-label">Modelo:</label>
                                        <input type="text" class="form-control" id="modelo-${auto.id_auto}" name="modelo" value="${auto.modelo}" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="nombre-${auto.id_auto}" class="form-label">Propietario:</label>
                                        <input type="text" class="form-control" id="nombre-${auto.id_auto}" name="nombre" value="${auto.nombre}" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="email-${auto.id_auto}" class="form-label">Email:</label>
                                        <input type="email" class="form-control" id="email-${auto.id_auto}" name="email" value="${auto.email}" required>
                                    </div>
                                    <input type="hidden" id="id_auto-${auto.id_auto}" name="id_auto" value="${auto.id_auto}">
                                    <button type="submit" class="btn btn-success">Guardar</button>
                                    <button type="button" class="btn btn-secondary" onclick="cancelarEdicion(${auto.id_auto})">Cancelar</button>
                                </form>
                            `;

                            autoCard.insertBefore(img, autoCard.firstChild);
                            panel.appendChild(autoCard);

                            actualizarAlturaPanel('panel-3');
                        })
                        .catch(error => {
                            console.error('Error al obtener la imagen:', error);
                        });
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar los autos:', error);
        });
}

// Función para buscar la imagen del auto usando la API de Pixabay
function buscarImagenDeAuto(marca) {
    const url = `https://pixabay.com/api/?key=${API_KEY_PIXABAY}&q=${encodeURIComponent(marca)}&image_type=photo&per_page=3`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la API de Pixabay: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.hits.length > 0) {
                return data.hits[0].webformatURL;
            } else {
                return 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
            }
        })
        .catch(error => {
            console.error('Error al obtener la imagen:', error);
            return 'https://via.placeholder.com/300x200?text=Error+al+obtener+imagen';
        });
}

// Función para enviar los formularios con la validación
function submitForm(event) {
    event.preventDefault();

    const formAuto = document.getElementById('formAuto');
    const formPropietario = document.getElementById('formPropietario');

    formAuto.classList.add('was-validated');
    formPropietario.classList.add('was-validated');

    if (formAuto.checkValidity() && formPropietario.checkValidity()) {
        const formDataAuto = new FormData(formAuto);
        const formDataPropietario = new FormData(formPropietario);

        const combinedData = new FormData();
        formDataAuto.forEach((value, key) => {
            combinedData.append(key, value);
        });
        formDataPropietario.forEach((value, key) => {
            combinedData.append(key, value);
        });

        // Envia los datos al servidor
        fetch('enviarRespuesta.php', {
            method: 'POST',
            body: combinedData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            if (data.success) {
                formAuto.reset();
                formPropietario.reset();
                formAuto.classList.remove('was-validated');
                formPropietario.classList.remove('was-validated');
            }
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });
    }
}

function eliminarAuto(id_auto) {
    if (confirm('¿Estás seguro de que deseas eliminar este auto?')) {
        fetch(`eliminarAuto.php?id_auto=${id_auto}`, {
            method: 'GET'
        })
        .then(response => response.text()) 
        .then(responseText => {
            try {
                const data = JSON.parse(responseText);
                if (data.success) {
                    cargarAutos();
                } else {
                    alert(`Error al eliminar el auto: ${data.error}`);
                }
            } catch (e) {
                console.error('Error al parsear JSON:', e);
                console.error('Respuesta del servidor:', responseText);
            }
        })
        .catch(error => {
            console.error('Error al eliminar el auto:', error);
        });
    }
}


function mostrarFormularioEdicion(id_auto) {
    fetch(`getAuto.php?id_auto=${id_auto}`)
        .then(response => response.text())
        .then(responseText => {
            try {
                const data = JSON.parse(responseText); 
                if (data.success) {
                    llenarFormularioEdicion(id_auto, data.auto);
                    
                    const formularioEdicion = document.getElementById(`formulario-edicion-${id_auto}`);
                    formularioEdicion.style.display = 'block';
                } else {
                    alert('No se pudo obtener los datos del auto');
                }
            } catch (e) {
                console.error('Error al parsear JSON:', e);
                console.error('Respuesta del servidor:', responseText);
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos del auto:', error);
        });
}

function llenarFormularioEdicion(id_auto, auto) {
    document.getElementById(`marca-${id_auto}`).value = auto.marca;
    document.getElementById(`modelo-${id_auto}`).value = auto.modelo;
    document.getElementById(`placa-${id_auto}`).value = auto.placa;
    document.getElementById(`serie-${id_auto}`).value = auto.serie;
    document.getElementById(`nombre-${id_auto}`).value = auto.nombre;
    document.getElementById(`email-${id_auto}`).value = auto.email;
}

function cancelarEdicion(id_auto) {
    const formularioEdicion = document.getElementById(`formulario-edicion-${id_auto}`);
    formularioEdicion.style.display = 'none';
}

function actualizarAuto(event, id_auto) {
    event.preventDefault();

    const formulario = document.getElementById(`formulario-edicion-${id_auto}`);
    if (formulario.checkValidity()) {
        const formData = new FormData(formulario);
        
        fetch('editarAuto.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(responseText => {
            try {
                const data = JSON.parse(responseText); 
                if (data.success) {
                    cargarAutos();
                } else {
                    alert('Error al actualizar el auto: ' + data.error);
                }
            } catch (e) {
                console.error('Error al parsear JSON:', e);
                console.error('Respuesta del servidor:', responseText);
            }
        })
        .catch(error => {
            console.error('Error al enviar la actualización:', error);
        });
    }
}

