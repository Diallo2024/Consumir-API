// Llamada a la API
const url_api = "http://localhost:3000/personajes"

// Mostrar Base de Datos
async function mostrar () {
    try {
        let response = await fetch(url_api, {
            method: "GET"    
        })
        let data = await response.json() // convertimos los datos en un json
        let listas = document.getElementById('list') // otuvimos la lsita de datos
        listas.innerHTML = "" // borramos los datos para que queden en blanco
        data.map((personaje) =>{ // recorrimos toda la base de datos y cada uno lo llamamos personaje
            let item = document.createElement('li') // creamos el elemento li
            item.classList.add("flex", "flex-col", "justify-center", "items-center", "mb-5") // le pusimos estilos
            // aqui creamos el contenido del li y llamamos a cada de los datos llamando a personaje. y el date que queremos
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
                listas.appendChild(item) // agregamos al elemento "li" en la lsita

                item.querySelector('.btnUpdate').addEventListener('click', async (e)=> {
                    e.preventDefault()
                    personajeId = personaje.id 
                    dataForm(personaje)
                    buttonAdd.classList.add('hidden')
                    document.getElementById("formCreateUpdate").classList.remove('hidden')
                    listas.classList.add('hidden')
                })
                item.querySelector('.btnDelete').addEventListener('click', async (e)=> {
                    e.preventDefault()
                    await eliminar(personaje.id)
                })
        })
    }catch (error){
        console.log("Error al mostrar la lista", error) // aqui para manejar los errores
    }   
}
mostrar()

//Manejador de datos
function dataForm (personaje) {
    document.getElementById("inputName").value = personaje.name
    document.getElementById("inputAlias").value = personaje.alias
    document.getElementById("inputAppearance").value = personaje.firstAppearance
    document.getElementById("inputPowers").value = personaje.powers.join(", ")
}

let personajeId = null


async function crearActualizar (e) {
    e.preventDefault()
    let name = document.getElementById("inputName").value
    let alias = document.getElementById("inputAlias").value
    let firstAppearance = document.getElementById("inputAppearance").value
    let powers = document.getElementById("inputPowers").value
    let powersArray = powers ? powers.split(",").map(power => power.trim()) : []
    let dataPersonal = {

        name: name,
        alias: alias,
        firstAppearance: firstAppearance,
        powers: powersArray

    }
    try {
        if (personajeId) {
            let response = await fetch(`${url_api}/${personajeId}`,{
                method: "PUT",
                body: JSON.stringify(dataPersonal)
            })
        } else {
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

async function eliminar (id) {
    try {
        let response = await fetch(`${url_api}/${id}`, {
            method: "DELETE"
        })
        if (response.ok) {
            await mostrar()
        } else {
            console.log('Error al eliminar el persoanje:', id)   
        }
    } catch (error) {
        console.log("Error al eliminar el personaje", error) 
    }
}

// Botones
let buttonAdd = document.getElementById('btnAdd')
buttonAdd.addEventListener('click', (e) => {
    e.preventDefault()
    let formCreateUpdate = document.getElementById('formCreateUpdate')
    let list = document.getElementById('list')
    buttonAdd.classList.add('hidden')
    formCreateUpdate.classList.remove('hidden')
    list.classList.add('hidden')
})
let btnClose = document.getElementById('btnClose')
btnClose.addEventListener('click',(e) =>{
    e.preventDefault()
    document.getElementById('formCreateUpdate').classList.add('hidden')
    document.getElementById('list').classList.remove('hidden')
    buttonAdd.classList.remove('hidden')   
})

let btnSave = document.getElementById('btnSave')
btnSave.addEventListener('click', crearActualizar)


