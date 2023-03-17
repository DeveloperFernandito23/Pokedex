async function traerUno(id) {
    var response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    var object = await response.json();

    return object;
}

async function evolutionChain(speciePokemon) {
    var response = await fetch(speciePokemon);
    var object = await response.json();

    var responsetwo = await fetch(object.evolution_chain.url);
    var objecttwo = await responsetwo.json();

    return objecttwo;
}

async function datosPokemon() {
    var parametros = window.location.search;

    var newUrl = new URLSearchParams(parametros);

    var numero = newUrl.get('numero');

    var pokemon = await traerUno(numero);

    crearDatos(pokemon);

    var evolution = await evolutionChain(pokemon.species.url);

    

    document.title = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
}

function makeChain() {
    
}


function crearDatos(pokemon) {
    var image = document.getElementsByClassName("image")[0];
    var contentImage = document.getElementById("pokemonimage");

    contentImage.src = pokemon.sprites.other["official-artwork"].front_default;

    image.addEventListener("click", () => changeShiny(pokemon) );

    pokemonData(pokemon);

    document.getElementById("pokemon").innerHTML = pokemon.id;
}

function pokemonData(pokemon) {
    var progress = document.getElementsByClassName("progreso");

    for(var i = 0; i < pokemon.stats.length; i++){
        progress[i].value = pokemon.stats[i].base_stat;
    }
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