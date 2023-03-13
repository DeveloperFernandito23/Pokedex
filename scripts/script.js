//var pokemons = ["Charmander", "Bulbasaur", "Squirtle", "Pikachu"];
var pokemons = [];


/* function comparar ( a, b ){ return a - b; }
arr.sort( comparar );  // [ 1, 5, 40, 200 ]

NO BORRAR, ES PARA ORDENAR (PARA ACORDARME PARA HACERLO)

*/


function reversa (){
    var lista = pokemons.reverse();
    document.getElementById("demo").innerHTML = "";
    lista.forEach(element => {
        crearPokemon(element);
    });
}

// ORDENA ALFABETICAMENTE
function orden(){
    var lista = pokemons.sort((a, b) =>{
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        }
        return 0;
    });
    document.getElementById("demo").innerHTML = "";
    lista.forEach(element => {
        crearPokemon(element);
    });
}

async function traerPokemon() { //NEVER TOUCH
    for(var i = 0; i < 151;i++){
        var response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}/`);
        var objeto = await response.json();
        await pokemons.push(objeto);
        await crearPokemon(objeto);
    }
}

function buscarPokemons(valor) {
    document.getElementById("demo").innerHTML = "";


    for(var i = 0; i < pokemons.length;i++){
        if(pokemons[i].name.toUpperCase().includes(valor.toUpperCase())){
            crearPokemon(pokemons[i]);
         }
    }

    if (document.getElementById("demo").innerHTML === "") {
        document.getElementById("demo").innerHTML = "<div class='alert'>¡No se encontraron pokémons!</div>";     
    }
}

function datosPokemon() {
    var parametros = window.location.search;

    var newUrl = new URLSearchParams(parametros);

    var numero = newUrl.get('numero');

    document.getElementById("pokemon").innerHTML = numero;
}


function crearPokemon(pokemon){
    var bicho = document.createElement("div");
    bicho.classList.add("poke");

    var enlace = document.createElement("a");
    enlace.href = `html/pokemon.html?numero=${pokemon.id}`

    var divImagen = document.createElement("div");
    divImagen.classList.add("image");

    var imagen = document.createElement("img");
    imagen.src = pokemon.sprites.front_default;
    imagen.alt = "Lo siento, el pokemon no ha sido encontrado :(";

    var nombre = document.createElement("div");
    nombre.classList.add("name");
    nombre.innerHTML = pokemon.name;

    var numero = document.createElement("div");
    numero.classList.add("number");
    numero.innerHTML = '#' + pokemon.id.toString().padStart(3, 0);

    var tipos = document.createElement("div");

    document.getElementById("demo").appendChild(bicho);
    bicho.appendChild(enlace);
    enlace.appendChild(divImagen);
    enlace.appendChild(nombre);
    enlace.appendChild(numero);
    enlace.appendChild(tipos);
    divImagen.appendChild(imagen);
}