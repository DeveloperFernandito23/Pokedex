var pokemons = [];

/* function comparar ( a, b ){ return a - b; }
arr.sort( comparar );  // [ 1, 5, 40, 200 ]

NO BORRAR, ES PARA ORDENAR (PARA ACORDARME PARA HACERLO)

*/


function reversa(value){
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
    
    bucleToChange(collection); // bucle para que me ponga o quite la clase oscuro

    
   if(collection[0].classList.contains('oscuro')){ //cuando un elemento tenga la clase oscuro
        localStorage.setItem('oscuro', 'enabled'); 
    }else{
        localStorage.setItem('oscuro', 'disabled'); 
    }
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
    const collection = document.getElementsByClassName("poke");

    if(localStorage.getItem('oscuro') == 'enabled'){ // cuando está enabled me cambia de oscuro o no
        bucleToChange(collection);
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