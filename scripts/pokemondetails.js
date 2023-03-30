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

    compruebaTema();

    var pokemon = await givePokemonDetails(number);

    var evolution = await evolutionChain(pokemon.species.url);

    chooseFavicon(pokemon);
    
    crearDatos(pokemon);

    makeChain(pokemon, evolution);

    document.title = `${pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1)} | Pokédex`;
}

async function makeChain(pokemon, evolution) {
    var chain = evolution.chain;
    var hasElement = true;

    await makeChainData(pokemon, chain);

    while(hasElement) {
        var numberEvolutions = chain.evolves_to.length;

        for(var i = 0; i < numberEvolutions;i++) {
            var chainCopy = chain.evolves_to[i];

            await makeChainData(pokemon, chainCopy);
        }
        
        if(numberEvolutions != 0){
            chain = chain.evolves_to[0];
        }else{
            hasElement = false;
        }
    }
}

async function makeChainData(thisPokemon, chain) {
    var id = chain.species.url.split("/")[6];
    
    var pokemon = await givePokemonDetails(id);

    var chainSpace = document.getElementById("evolution-chain");

    var link = document.createElement("a");
    link.href = `pokemon.html?numero=${id}`;

    var element = document.createElement("div");
    element.classList.add("poke");

    var imageContainer = document.createElement("div");
    imageContainer.classList.add("image");

    var image = document.createElement("img");
    image.src = pokemon.sprites.other["official-artwork"].front_default;
    image.alt = "Lo siento, el pokemon no ha sido encontrado :(";

    image.addEventListener("mouseover", () => {
        image.style.filter = `drop-shadow(0 0 15px var(--${pokemon.types[0].type.name}))`;
    })
    image.addEventListener("mouseout", () => {
        image.style.filter = `none`;
    })

    var pokemonName = document.createElement("div");
    pokemonName.classList.add("name");

    if(chain.species.name == thisPokemon.species.name){
        pokemonName.innerHTML = `*${chain.species.name}*`;
        link.style.color = "black";
    }else{
        pokemonName.innerHTML = chain.species.name;
        link.style.color = `var(--${pokemon.types[0].type.name})`;
    }

    chainSpace.appendChild(link);
    link.appendChild(element);
    element.appendChild(imageContainer);
    element.appendChild(pokemonName);
    imageContainer.appendChild(image);

    if(chain.evolution_details.length != 0){
        var trigger = document.createElement("div");
        trigger.innerHTML = checkTrigger(chain.evolution_details[chain.evolution_details.length - 1]);

        element.appendChild(trigger);
    }
}

function checkTrigger(details) { //Me niego totalmente a poner todas las formas del Spin, porque no te viene en la pokeapi y como que no pienso hacerlo a mano, sabes tmb hay que quererse un poco... :)
    var TipeTrigger = {
        "level-up": `Nivel => ${details.min_level}`,
        "use-item": `Usar => ${details.item?.name}`,
        "tower-of-darkness": "Ganar Torre De Oscuridad",
        "tower-of-waters": "Ganar Torre De Agua",
        "three-critical-hits": "Realizar 3 Ataques Críticos",
        "take-damage": "Recibir Mínimo 49 De Daño De Un Golpe",
        other: details.min_level != null ? `Nivel => ${details.min_level}` : "",
        trade: "Trade",
        shed: "Shed",
        spin: "Spin"
    }

    var trigger = details.trigger.name;

    return TipeTrigger[trigger];
}

function crearDatos(pokemon) {
    var image = document.getElementsByClassName("image")[0];
    var contentImage = document.getElementById("pokemonimage");

    contentImage.src = pokemon.sprites.other["official-artwork"].front_default;

    image.addEventListener("click", () => changeShiny(pokemon) );

    document.getElementsByClassName("name")[0].innerHTML = pokemon.species.name;

    console.log(`Peso => ${pokemon.weight}kg`);

    console.log(`Altura => ${pokemon.height}m`);
    
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