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
        var numberEvolutions = chain.evolves_to.length;

        makeChainData(pokemon, chain);

        for(var i = 0; i < numberEvolutions;i++) {
            var chainCopy = chain.evolves_to[i];

            makeChainData(pokemon, chainCopy);
    
            checkTrigger(chainCopy.evolution_details[0]);
        }
        
        hasElement = false;
    }
}

function makeChainData(pokemon, chain) {
    if(pokemon.name == chain.species.name){
        console.log(`*${chain.species.name}*`);
    }else{
        console.log(chain.species.name);
    }

    var chainSpace = document.getElementById("evolution-chain");

    var element = document.createElement("div");
    element.classList.add("evolution-elements");

    var link = document.createElement("a");

    var id = chain.species.url.split("/")[6];

    link.innerHTML = id;
    link.href = `pokemon.html?numero=${id}`;
    link.target = "_self";

    chainSpace.appendChild(element);
    element.appendChild(link);
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
    var listStats = document.getElementById("stats");
    listStats.style.backgroundColor = `var(--${pokemon.types[0].type.name})`;

    var statsProgress = document.getElementsByClassName("stats-progress");
    var statsNumber = document.getElementsByClassName("stats-number");

    for(var i = 0; i < pokemon.stats.length; i++){
        statsProgress[i].value = pokemon.stats[i].base_stat;
        statsNumber[i].innerHTML = pokemon.stats[i].base_stat;
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

    var href = pokemon.types[0].type.name;

    var favicon = document.createElement("link");
    favicon.rel = "shortcut icon";
    favicon.href = `../img/favicons/${href}.ico`;

    head.appendChild(favicon);
}