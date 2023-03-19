var FavPokemon = {
    water: "../img/favicons/water.ico",
    bug: "../img/favicons/bug.ico",
    dragon: "../img/favicons/dragon.ico",
    electric: "../img/favicons/electric.ico",
    ghost: "../img/favicons/ghost.ico",
    fire: "../img/favicons/fire.ico",
    ice: "../img/favicons/ice.ico",
    fighting: "../img/favicons/fighting.ico",
    normal: "../img/favicons/normal.ico",
    grass: "../img/favicons/grass.ico",
    psychic: "../img/favicons/psychic.ico",
    rock: "../img/favicons/rock.ico",
    ground: "../img/favicons/ground.ico",
    poison: "../img/favicons/poison.ico",
    flying: "../img/favicons/flying.ico",
    fairy: "../img/favicons/fairy.ico",
    steel: "../img/favicons/steel.ico"
}; 

async function givePokemonDetails(id) {
    var response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    var object = await response.json();

    return object;
}

async function evolutionChain(speciePokemon) {
    var response = await fetch(speciePokemon);
    var object = await response.json();

    response = await fetch(object.evolution_chain.url);
    object = await response.json();

    return object;
}

async function pokemonDetails() {
    var parameters = window.location.search;

    var newUrl = new URLSearchParams(parameters);

    var number = newUrl.get('numero');

    var pokemon = await givePokemonDetails(number);

    var evolution = await evolutionChain(pokemon.species.url);

    chooseFavicon(pokemon);
    
    crearDatos(pokemon);

    makeChain(pokemon, evolution);

    document.title = `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} | Pokédex`;
}

function makeChain(pokemon, evolution) {
    var chain = evolution.chain;
    var hasElement = true;

    while(hasElement) {
        if(pokemon.name == chain.species.name){
            console.log(`*${chain.species.name}*`);
        }else{
            console.log(chain.species.name);
        }

        if(chain.evolution_details.length != 0){
            checkTrigger(chain.evolution_details[0]);
        }

        if(chain.evolves_to.length != 0){
            chain = chain.evolves_to[0];
        }else{
            hasElement = false;
        }     
    }
}

function checkTrigger(details) { //NO me lo creo que haya sacao los de los ?
    var TipeTrigger = {
        "level-up": `Nivel => ${details.min_level}`,
        "use-item": `Usar => ${details.item?.name}`,
        trade: "Trade",
    }

    var trigger = details.trigger.name;

    console.log(TipeTrigger[trigger]);
}

function crearDatos(pokemon) {
    var image = document.getElementsByClassName("image")[0];
    var contentImage = document.getElementById("pokemonimage");

    contentImage.src = pokemon.sprites.other["official-artwork"].front_default;

    image.addEventListener("click", () => changeShiny(pokemon) );

    document.getElementsByClassName("name")[0].innerHTML = pokemon.name;

    console.log(`Peso => ${pokemon.weight}`);

    console.log(`Altura => ${pokemon.height}`);
    
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

function changeShiny(pokemon) {
    var contentImage = document.getElementById("pokemonimage");

    if(shiny){
        contentImage.setAttribute("src", pokemon.sprites.other["official-artwork"].front_default);
        shiny = false;
    }else{
        contentImage.setAttribute("src", pokemon.sprites.other["official-artwork"].front_shiny);
        shiny = true;
    }
}

function chooseFavicon(pokemon) {
    var head = document.head;

    var href = FavPokemon[pokemon.types[0].type.name];

    var favicon = document.createElement("link");
    favicon.rel = "shortcut icon";
    favicon.href = href;

    head.appendChild(favicon);
}