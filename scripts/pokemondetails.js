/*var TipeTrigger = {
    "level-up": 
    "trade":
    "use-item": 
    "shed":
    "spin":
    "tower-of-darkness":
    "tower-of-water":
    "three-critical-hits":
    "take-damage":
    "other":
    "agile-style-move":
    "strong-style-move":
    "recoil-damage":
}*/

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

function makeChain(evolution) {
    var chain = evolution.chain;
    var hasElement = true;

    while(hasElement) {
        console.log(chain.species.name);

        if(chain.evolves_to.length != 0){
            chain = chain.evolves_to[0];
        }else{
            hasElement = false;
        }     
    }
}

async function datosPokemon() {
    var parametros = window.location.search;

    var newUrl = new URLSearchParams(parametros);

    var numero = newUrl.get('numero');

    var pokemon = await traerUno(numero);

    var evolution = await evolutionChain(pokemon.species.url);
    
    crearDatos(pokemon);

    makeChain(evolution);

    document.title = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
}

function crearDatos(pokemon) {
    var image = document.getElementsByClassName("image")[0];
    var contentImage = document.getElementById("pokemonimage");

    contentImage.src = pokemon.sprites.other["official-artwork"].front_default;

    image.addEventListener("click", () => changeShiny(pokemon) );

    document.getElementsByClassName("name")[0].innerHTML = pokemon.name;
    
    comprobarTipos(pokemon);

    pokemonValues(pokemon);

    document.getElementById("pokemon").innerHTML = pokemon.id;
}

function pokemonValues(pokemon) {
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