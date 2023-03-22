var pokemons = [];

/* function comparar ( a, b ){ return a - b; }
arr.sort( comparar );  // [ 1, 5, 40, 200 ]

NO BORRAR, ES PARA ORDENAR (PARA ACORDARME PARA HACERLO)

*/
// function pruebaTipos(){
//     let elemento = document.getElementsByClassName("poke");
//     let estilo = window.getComputedStyle(elemento[1], "::before");
//     console.log(estilo.getPropertyValue('background'));
// }

function orderBy(value){
    var lista = pokemons.slice();

    switch(value){
        case "opt1":
            document.getElementById("demo").innerHTML = "";

            pokemons.forEach(element => {
                crearPokemon(element);
            });
            break;
        case "opt2":
            document.getElementById("demo").innerHTML = "";

            console.log(lista);
            lista.reverse().forEach(element => {
                crearPokemon(element);
            });
            break;
        case "opt3":
           orden(false);
            break;
        case "opt4":
           orden(true);
            break;
    }
    compruebaTema();
}

// ORDENA ALFABETICAMENTE
function orden(bool){
    var lista = pokemons.slice();

    var listaOrder = lista.sort((a, b, result = 0) =>{
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            result = 1;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            result = -1;
        }
        return result;
    });

    document.getElementById("demo").innerHTML = "";
    if(bool){
        listaOrder.reverse();
    }
    
    listaOrder.forEach(element => {
        crearPokemon(element);
    });
}



function changeTheme() {
    const collection = document.getElementsByClassName("poke");
    const collection2 = document.getElementsByClassName("name");
    const collection3 = document.getElementsByClassName("number");
    const slider = document.getElementById("slide");
    
   if(collection[0].classList.contains('oscuro')){ //cuando un elemento tenga la clase oscuro
        localStorage.setItem('oscuro', 'disabled');  // pasara a desctivarlo
        slider.checked = false;
    }else{
        localStorage.setItem('oscuro', 'enabled');  // o activarlo
        slider.checked = true;
    }
    // Y aquí cambia de uno a otro
    bucleToChange(collection);
    bucleToChange(collection2);
    bucleToChange(collection3);
}

function bucleToChange(collection){
    for (let i = 0; i < collection.length; i++) {
        collection[i].classList.toggle('oscuro');
      }
}

async function givePokemons() { //NEVER TOUCH
    for(var i = 0; i < 151;i++){
        var response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}/`);
        var objeto = await response.json();
        await pokemons.push(objeto);
        await crearPokemon(objeto);
    }

    compruebaTema(); // para que nada más cree los pokemons revise que tema aplicar no se puede poner antes debido que se quedaría null
}

function compruebaTema(){
    if(localStorage.getItem('oscuro') == true){ // cuando está enabled me llama a cambiar el tema
        changeTheme();
    } 
}

function buscarPokemons(valor) {
    var documento = document.getElementById("demo");

    documento.innerHTML = "";

    for(var i = 0; i < pokemons.length;i++) {
        if(pokemons[i].name.toUpperCase().includes(valor.toUpperCase())) {
            crearPokemon(pokemons[i]);
        }
    }

    if (documento.innerHTML === "") {
        documento.innerHTML = "<div class='alert'>¡No se encontraron pokémons!</div>";     
    }
}

function crearPokemon(pokemon){
    var bicho = document.createElement("div");
    bicho.classList.add("poke");

    var enlace = document.createElement("a");
    enlace.href = `html/pokemon.html?numero=${pokemon.id}`

    var divImagen = document.createElement("div");
    divImagen.classList.add("image");

    var imagen = document.createElement("img");
    imagen.src = pokemon.sprites.other["official-artwork"].front_default;
    imagen.alt = "Lo siento, el pokemon no ha sido encontrado :(";
    imagen.addEventListener("mouseover", () => {
        imagen.style.filter = `drop-shadow(0 0 15px var(--${pokemon.types[0].type.name}))`;
    })
    imagen.addEventListener("mouseout", () => {
        imagen.style.filter = `none`;
    })

    var nombre = document.createElement("div");
    nombre.classList.add("name");
    nombre.innerHTML = pokemon.name;

    var numero = document.createElement("div");
    numero.classList.add("number");
    numero.innerHTML = '#' + pokemon.id.toString().padStart(3, 0);

    var tipos = document.createElement("div");
    tipos.classList.add("types");

    document.getElementById("demo").appendChild(bicho);
    bicho.appendChild(enlace);
    enlace.appendChild(divImagen);
    enlace.appendChild(nombre);
    enlace.appendChild(numero);
    enlace.appendChild(tipos);
    comprobarTipos(pokemon);
    divImagen.appendChild(imagen);
}