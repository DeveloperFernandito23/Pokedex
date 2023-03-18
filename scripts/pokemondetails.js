async function traerUno(id) {
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

async function datosPokemon() {
    var parametros = window.location.search;

    var newUrl = new URLSearchParams(parametros);

    var numero = newUrl.get('numero');

    var pokemon = await traerUno(numero);

    var evolution = await evolutionChain(pokemon.species.url);
    
    crearDatos(pokemon);

    makeChain(pokemon, evolution);

    document.title = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
}

function makeChain(pokemon, evolution) {
    var chain = evolution.chain;
    var hasElement = true;

    while(hasElement) {
        if(pokemon.name == chain.species.name){
            console.log(chain.species.name + "Es");
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

    console.log(`Peso => ${pokemon.height}`);
    
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