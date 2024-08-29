// Llamada a la API
const url_api = "http://localhost:3000/personajes"   // Esta es nuestra url local metida en una función para facilitar el manejo

// Mostrar Base de Datos
async function mostrar() {
    try {
        let response = await fetch(url_api, {
            method: "GET"
        })

        let data = await response.json() // Convertimos los datos en un json
        let listas = document.getElementById('list') // Otuvimos la lsita de datos
        listas.innerHTML = "" // Borramos los datos para que queden en blanco

        data.map((personaje) => { // Recorrimos toda la base de datos y cada uno lo llamamos personaje
            let item = document.createElement('li') // Creamos el elemento li
            item.classList.add("flex", "flex-col", "justify-center", "items-center", "mb-5")    // Le pusimos estilos a los Elementos HTML

            // Aqui creamos el contenido del li y llamamos a cada unode los datos llamando a personaje y el dato que queremos

            item.innerHTML = `<div 
                    class="rounded border w-full max-lg:py-4 min-h-12 flex flex-wrap justify-between p-4 m-4 shadow-md text-center">
                    <div class="flex flex-col max-lg:w-full lg:w-[25%] gap-5">
                        <h3 class="font-bold text-md text-center">Nombre</h3>
                        <p class"">${personaje.name}</p> 
                    </div>
                    <div class="flex flex-col max-lg:w-full lg:w-[25%] gap-5">
                        <h3 class="font-bold text-md text-center">Nombre de héroe</h3>
                        <p>${personaje.alias}</p>
                    </div>
                    <div class="flex flex-col max-lg:w-full lg:w-[25%] gap-5">
                        <h3 class="font-bold text-md text-center">Aparición</h3>
                        <p class"">${personaje.firstAppearance}</p>
                    </div>
                    <div class="flex flex-col max-lg:w-full lg:w-[25%] gap-5">
                        <h3 class="font-bold text-md text-center">Poderes</h3>
                        <p class"">${personaje.powers.join(" - ")}</p>
                    </div>
                    <div class="noame w-full max-lg:py-4 mt-10 justify-center items-center flex ">
                        <button
                            class="btnDelete rounded mx-2 py-4 px-6 bg-red-600 text-white font-bold w-full flex text-center justify-center my-2">Borrar</button>
                        <button
                            class="btnUpdate rounded mx-2 py-4 px-6 bg-green-600 text-white font-bold w-full flex text-center justify-center my-2">Actualizar</button>
                    </div>
                </div>`
            listas.appendChild(item) // Agregamos al elemento "li" en la lista.

            item.querySelector('.btnUpdate').addEventListener('click', async (e) => {  // Esta función le dice a cada elemento de nuestra lista cómo comportarse al escuchar un click.
                e.preventDefault()
                personajeId = personaje.id
                dataForm(personaje)
                buttonAdd.classList.add('hidden')
                document.getElementById("formCreateUpdate").classList.remove('hidden')
                listas.classList.add('hidden')
            })
            item.querySelector('.btnDelete').addEventListener('click', async (e) => {
                e.preventDefault()
                await eliminar(personaje.id)
            })
        })
    } catch (error) {
        console.log("Error al mostrar la lista", error) // Aqui un función catch para manejar los errores
    }
}
mostrar()

//Manejador de datos
function dataForm(personaje) {
    document.getElementById("inputName").value = personaje.name
    document.getElementById("inputAlias").value = personaje.alias
    document.getElementById("inputAppearance").value = personaje.firstAppearance
    document.getElementById("inputPowers").value = personaje.powers.join(", ")
}

let personajeId = null


async function crearActualizar(e) {   // En esta función Creamos y actualizamos los personajes

    e.preventDefault()     //Esto evita que la acción predeterminada del evento (como enviar nuestro formulario) se ejecute.

    /*Aqui declaramos variables que obtienen los valores de los elementos del DOM con sus IDs.
     Esto es para capturar los datos introducidos por el usuario*/
    let name = document.getElementById("inputName").value
    let alias = document.getElementById("inputAlias").value
    let firstAppearance = document.getElementById("inputAppearance").value
    let powers = document.getElementById("inputPowers").value

    /* Con esta función ternaria conviertimos "powers" en un array.
    Si "powers" no es una cadena vacía, utilizmos split(",") para separar los poderes en un array (usando la coma como delimitador) y luego "map" para eliminar los espacios en blanco alrededor de cada elemento con trim().
    Si powers es una cadena vacía, se establece powersArray como un array vacío */
    let powersArray = powers ? powers.split(",").map(power => power.trim()) : []

    /* Aqui ponemos "dataPersonal" que contiene los datos capturados del formulario (name, alias, firstAppearance, y powersArray).
    Este objeto será enviado al servidor para crear o actualizar un personaje.*/
    let dataPersonal = {
        name: name,
        alias: alias,
        firstAppearance: firstAppearance,
        powers: powersArray
    }
    /* Iniciamos un bloque "try" para capturar cualquier error que pueda ocurrir durante la ejecución de la función. */
    try {
        if (personajeId) {    /*  Para que compruebe si existe una variable "personajeId". 
            Si "personajeId" existe, indica que se va a actualizar un personaje existente. */

            let response = await fetch(`${url_api}/${personajeId}`, { /*Si se está actualizando un personaje, hace una solicitud PUT a la API usando fetch. 
                La URL de la solicitud se construye concatenando url_api (la URL base de la API) con personajeId */
                method: "PUT",
                body: JSON.stringify(dataPersonal)
            })
        } else { // Si no existe personajeId, indica que se va a crear un nuevo personaje.
            let response = await fetch(url_api, {
                method: "POST",
                body: JSON.stringify(dataPersonal)
            })

        }
        await mostrar()
        personajeId = null

    } catch (error) {
        console.log("Error al crear y actualizar el personaje", error)
    }
}

async function eliminar(id) {  // Eliminar recursos o datos 
    try { // Para capturar y manejar posibles errores durnate la ejecución
        let response = await fetch(`${url_api}/${id}`, {
            method: "DELETE"
        })
        if (response.ok) { // Si a respuesta es exitosa
            await mostrar() // llama a la función mostrar()
        } else {
            console.log('Error al eliminar el persoanje:', id) // Si no, muestra este mensjae.
        }
    } catch (error) { // Captura cualquier error que ocurra durante la ejecución del bloque try.
        console.log("Error al eliminar el personaje", error) // Y muestra este mensaje por consola.
    }
}

// Declaramos una variable buttonAdd y la asigna al elemento del DOM con el ID btnAdd.
// Este es el botón que se utilizará para agregar un nuevo recurso.
let buttonAdd = document.getElementById('btnAdd')
buttonAdd.addEventListener('click', (e) => {
    e.preventDefault() // Para evitar que la acción predeterminada del evento (como enviar un formulario) ocurra.

    let formCreateUpdate = document.getElementById('formCreateUpdate')
    let list = document.getElementById('list')
    // Modificamos las clases de algunos elementos del DOM para mostrar y ocultar partes de la interfaz:
    buttonAdd.classList.add('hidden') // Modificamos las clases de ciertos items del DOM para mostrar y ocultar partes de la interfaz
    formCreateUpdate.classList.remove('hidden')
    list.classList.add('hidden') 
})
let btnClose = document.getElementById('btnClose') // El boton de borrar
btnClose.addEventListener('click', (e) => {
    e.preventDefault() // Para evitar que la acción predeterminada del evento (como enviar un formulario) ocurra
    document.getElementById('formCreateUpdate').classList.add('hidden') // Para ocultar el fumulario
    document.getElementById('list').classList.remove('hidden') // Para mostrar de nuevo
    buttonAdd.classList.remove('hidden')
})

let btnSave = document.getElementById('btnSave')
btnSave.addEventListener('click', crearActualizar)


