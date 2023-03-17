var pokemons = [];

//JS no tiene tipo enumerado, pero se puede usar esta sintaxis para dejarlo más claro
var TiposPokemon = {
    water: "Agua",
    bug: "Bicho",
    dragon: "Dragón",
    electric: "Eléctrico",
    ghost: "Fantasma",
    fire: "Fuego",
    ice: "Hielo",
    fighting: "Lucha",
    normal: "Normal",
    grass: "Planta",
    psychic: "Psíquico",
    rock: "Roca",
    ground: "Tierra",
    poison: "Veneno",
    flying: "Volador",
    fairy: "Hada",
    steel: "Acero"
};

/* function comparar ( a, b ){ return a - b; }
arr.sort( comparar );  // [ 1, 5, 40, 200 ]

NO BORRAR, ES PARA ORDENAR (PARA ACORDARME PARA HACERLO)

*/


function reversa(){
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

async function traerUno(id) {
    var response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    var objeto = await response.json();

    return objeto;
}

async function datosPokemon() {
    var parametros = window.location.search;

    var newUrl = new URLSearchParams(parametros);

    var numero = newUrl.get('numero');

    var pokemon = await traerUno(numero);

    crearDatos(pokemon);

    document.title = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

}

function crearDatos(pokemon) {
    var image = document.getElementsByClassName("image")[0];
    var contentImage = document.getElementById("pokemonimage");

    contentImage.src = pokemon.sprites.other["official-artwork"].front_default;

    image.addEventListener("click", function() { changeShiny(pokemon) } );

    document.getElementById("pokemon").innerHTML = pokemon.id;

}

var shiny = false;

function changeShiny(pokemon){
    var contentImage = document.getElementById("pokemonimage");

    if(shiny){
        contentImage.setAttribute("src", pokemon.sprites.other["official-artwork"].front_default);
        shiny = false;
    }else{
        contentImage.setAttribute("src", pokemon.sprites.other["official-artwork"].front_shiny);
        shiny = true;
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

function comprobarTipos(pokemon) {
    var tipos = document.getElementsByClassName("types");

    for(var i = 0; i < pokemon.types.length;i++){
        var tipo = document.createElement("div");
        tipo.classList.add("type");

        var style = pokemon.types[i].type.name;
        tipo.innerHTML = TiposPokemon[style];
        tipo.style.backgroundColor = `var(--${pokemon.types[i].type.name})`;

        tipos[tipos.length - 1].appendChild(tipo);
    }
}