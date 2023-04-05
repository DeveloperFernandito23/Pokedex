async function givePokemonDetails(id) {
    var response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    var object = await response.json();

    return object;
}

async function evolutionChain(pokemon) {
    var species = await givePokemonSpecie(pokemon)

    var response = await fetch(species.evolution_chain.url);
    var object = await response.json();

    return object;
}

async function pokemonDetails() {
    var parameters = window.location.search;

    var newUrl = new URLSearchParams(parameters);

    var number = newUrl.get('numero');

    compruebaTema();

    var pokemon = await givePokemonDetails(number);

    var evolution = await evolutionChain(pokemon);

    chooseFavicon(pokemon);

    makeData(pokemon);

    makeChain(pokemon, evolution);

    document.title = `${pokemon.species.name[0].toUpperCase() + pokemon.species.name.slice(1)} | Pokédex`;
}

changeInfo();

async function makeChain(pokemon, evolution) {
    var chain = evolution.chain;
    var numberEvolutions = chain.evolves_to.length;
    var evolutionChain = document.getElementById("evolution-chain");

    if (numberEvolutions != 0) {
        await makeChainData(pokemon, chain);
        evolutionChain.style.display = "grid";
    }

    for (var i = 0; i < numberEvolutions; i++) {
        var chainCopy = chain.evolves_to[i];

        await makeChainData(pokemon, chainCopy);

        for (var j = 0; j < chainCopy.evolves_to.length; j++) {
            var subChain = chainCopy.evolves_to[j];

            await makeChainData(pokemon, subChain);
        }
    }
}

var count = 0;

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

    if (chain.species.name == thisPokemon.species.name) {
        pokemonName.innerHTML = `*${chain.species.name}*`;
        link.style.color = "black";
    } else {
        pokemonName.innerHTML = chain.species.name;
        link.style.color = `var(--${pokemon.types[0].type.name})`;
    }

    chainSpace.appendChild(link);
    link.appendChild(element);
    element.appendChild(imageContainer);
    element.appendChild(pokemonName);
    imageContainer.appendChild(image);

    var length = chain.evolution_details.length;

    if (length != 0) {
        var trigger = document.createElement("div");
        trigger.classList.add("evolution-trigger");
        element.appendChild(trigger);

        if (length == 1) {
            var check = checkTrigger(pokemon, chain.evolution_details[0]);

            if (check == undefined) {
                trigger.innerHTML = "";
                seeMore();
            } else {
                trigger.innerHTML = check;
            }
        } else {
            count++;
            seeMore(pokemon, chain);
        }
    }
}

function seeMore(pokemon, chain) {
    var evolutions = document.getElementsByClassName("evolution-trigger");
    var evolutionTrigger = evolutions[evolutions.length - 1];

    var see = document.getElementsByClassName("click-here");

    if (see.length < count) {
        var button = document.createElement("a");

        button.classList.add("click-here");
        button.setAttribute("href", "#evolution-trigger");
        button.innerHTML = "VER MÁS";

        evolutionTrigger.appendChild(button);

        button.addEventListener("click", () => clickScreen(pokemon, chain));
    }
}

function clickScreen(pokemon, chain) {
    var seeMore = document.getElementById("see-more");
    seeMore.style.display = "flex";

    var screen = document.getElementById("screen");
    screen.innerHTML = "";

    for (var i = 0; i < chain.evolution_details.length; i++) {
        var detail = document.createElement("div");

        detail.innerHTML = checkTrigger(pokemon, chain.evolution_details[i]);

        screen.appendChild(detail);
        console.log(detail);
    }

    var close = document.createElement("img");
    close.setAttribute("id", "close");

    screen.appendChild(close);

    closeScreen();
}

function closeScreen() {
    var screen = document.getElementById("see-more");
    var close = document.getElementById("close");

    close.addEventListener("click", () => {
        screen.style.display = "none";
    });
}

function checkTrigger(pokemon, details) {
    var TipeTrigger = {
        other: other(pokemon),
        trade: trade(details),
        "level-up": levelUp(pokemon, details),
        spin: spin(details),
        "tower-of-waters": "Ganar Torre De Agua",
        "tower-of-darkness": "Ganar Torre De Oscuridad",
        "three-critical-hits": "Realizar 3 Ataques Críticos",
        "take-damage": "Recibir Mínimo 49 De Daño De Un Golpe",
        "recoil-damage": "Recibir 294 De Daño De El Mismo Sin Ser Debilitado",
        shed: "Al Evolucionar A Ninjask Aparecerá Si Hay Espacio Libre En El Equipo",
        "agile-style-move": `Utilizar ${details.known_move?.name[0].toUpperCase() + details.known_move?.name.slice(1)} 20 Veces En Estilo Rápido`,
        "strong-style-move": `Utilizar ${details.known_move?.name[0].toUpperCase() + details.known_move?.name.slice(1)} 20 Veces En Estilo Fuerte`,
        "use-item": `Usar => ${details.item?.name[0].toUpperCase() + details.item?.name.slice(1)}\n` + (details.gender ? details.gender == 1 ? `Debe Ser Hembra` : `Debe Ser Macho` : ""),
    }

    var trigger = details.trigger.name;

    return TipeTrigger[trigger];
}

function spin(details) {

    seeMore();
    /*
        var trigger = document.getElementById("screen");
    
        var imagen = document.createElement("img");
        imagen.setAttribute("src", "../img/alcremie.png");
    
        trigger.appendChild(imagen);*/

}

function trade(details) {
    var trigger = "Trade";

    if (details.held_item != null) {
        trigger = `Trade Con ${details.held_item.name[0].toUpperCase() + details.held_item.name.slice(1)} Equipado`;
    } else if (details.trade_species != null) {
        trigger = `Trade Con ${details.trade_species.name[0].toUpperCase() + details.trade_species.name.slice(1)}`;
    }

    return trigger;
}

function other(pokemon) {
    var trigger;

    var Names = {
        pawmot: "Subir Nivel Al Dar 1000 Pasos En Modo Enviar Pokemon",
        brambleghast: "Subir Nivel Al Dar 1000 Pasos En Modo Enviar Pokemon",
        rabsa: "Subir Nivel Al Dar 1000 Pasos En Modo Enviar Pokemon",
        maushold: "Nivel => 25 En Combate",
        palafin: "Nivel => 38+ Mientras Está Conectado Con Otro/s Jugador/es Mediante Círculo Unión",
        annihilape: "Subir Nivel \n Usar 20 Veces Puño Furia En Combate",
        kingambit: "Subir Nivel \n Derrotar 3 Bisharp Líderes",
        gholdengo: "Subir Nivel \n Tener 999 Monedas de Gimmighoul"
    }

    trigger = pokemon.species.name;

    return Names[trigger];
}

function levelUp(pokemon, details) {
    var trigger;

    var name = pokemon.species.name;

    var StatsNumbers = {
        "-1": "Ataque < Defensa",
        0: "Ataque == Defensa",
        1: "Ataque > Defensa"
    }

    var TimeOfDay = {
        day: "Debe Ser De Día",
        night: "Debe Ser De Noche",
        dusk: "Debe Ser Al Atardecer Debe Tener La Habilidad Ritmo Propio"
    }

    if (details.min_level != null) {
        trigger = `Nivel => ${details.min_level}\n`;

        details.turn_upside_down == true ? trigger += `Girando La Pantalla\n` : trigger;

        details.needs_overworld_rain == true ? trigger += `Necesita Que Llueva\n` : trigger;

        details.time_of_day.length != 0 ? trigger += `${TimeOfDay[details.time_of_day]}\n` : trigger;

        details.gender ? details.gender == 1 ? trigger += `Debe Ser Hembra\n` : trigger += `Debe Ser Macho\n` : trigger;

        details.party_type ? trigger += `Debe Haber Un Pokemon Tipo ${TiposPokemon[details.party_type.name]} En El Equipo` : trigger;

        details.relative_physical_stats || details.relative_physical_stats == 0 ? trigger += `${StatsNumbers[details.relative_physical_stats]}\n` : trigger;
    } else {
        trigger = "Subir Nivel\n"

        details.min_beauty ? trigger += `Belleza => ${details.min_beauty}\n` : trigger;

        details.min_happiness ? trigger += `Felicidad => ${details.min_happiness}\n` : trigger;

        details.time_of_day.length != 0 ? trigger += `${TimeOfDay[details.time_of_day]}\n` : trigger;

        details.known_move_type ? trigger += `Conocer Movimiento Tipo ${TiposPokemon[details.known_move_type.name]}` : trigger;

        details.held_item ? trigger += `Con ${details.held_item.name[0].toUpperCase() + details.held_item.name.slice(1)} Equipado\n` : trigger;

        details.known_move ? trigger += `Conocer => ${details.known_move.name[0].toUpperCase() + details.known_move.name.slice(1)}\n` : trigger;

        details.party_species ? trigger += `Debe Estar ${details.party_species.name[0].toUpperCase() + details.party_species.name.slice(1)} En El Equipo` : trigger;

        if (details.location == null) {
            if (name == "probopass" || name == "magnezone" || name == "vikavolt") {
                trigger += "En Campo Magnético Enemigo\n";
            }

            if (name == "leafeon") {
                trigger += "Cerca De Roca Musgo";
            }

            if (name == "glaceon") {
                trigger += "Cerca De Roca Hielo";
            }
        } else {
            trigger += `En ${details.location.name[0].toUpperCase() + details.location.name.slice(1)}\n`;
        }
    }

    return trigger;
}

function makeData(pokemon) {
    var image = document.getElementsByClassName("image")[0];
    var contentImage = document.getElementById("pokemonimage");
    var number = document.getElementById("number");
    var pokemonName = document.getElementById("font-type");
    var weight = document.getElementById("kilos");
    var height = document.getElementById("meters");
    var details = document.getElementById("details");

    details.innerHTML = 

    pokemonName.innerHTML = pokemon.species.name[0].toUpperCase() + pokemon.species.name.slice(1);

    number.innerHTML = '#' + pokemon.id.toString().padStart(3, 0);

    contentImage.src = pokemon.sprites.other["official-artwork"].front_default;
    contentImage.alt = "Lo siento, el pokemon no ha sido encontrado :(";

    image.addEventListener("click", () => changeShiny(pokemon));
    image.addEventListener("mouseover", () => {
        contentImage.style.filter = `drop-shadow(0 0 15px var(--${pokemon.types[0].type.name}))`;
    })
    image.addEventListener("mouseout", () => {
        contentImage.style.filter = `none`;
    })

    weight.innerHTML = `${pokemon.weight / 10}`;
    height.innerHTML = `${pokemon.height / 10}`;

    comprobarTipos(pokemon);

    pokemonValues(pokemon);

    // document.getElementById("pokemon").innerHTML = pokemon.id;
}

function changeInfo() {
    var weight = document.getElementById("kilos");
    var height = document.getElementById("meters");

    var local = localStorage.getItem('oscuro');

    if (local == "true") {
        weight.style.backgroundImage = "url(../img/wheightWhite.png)";
        height.style.backgroundImage = "url(../img/heightWhite.png)";
    }
    else {
        weight.style.backgroundImage = "url(../img/wheight.png)";
        height.style.backgroundImage = "url(../img/height.png)";
    }
}

function pokemonValues(pokemon) {
    var listStats = document.getElementById("stats");
    listStats.style.backgroundColor = `var(--${pokemon.types[0].type.name})`;

    var statsProgress = document.getElementsByClassName("stats-progress");
    var statsNumber = document.getElementsByClassName("stats-number");

    for (var i = 0; i < pokemon.stats.length; i++) {
        statsProgress[i].value = pokemon.stats[i].base_stat;
        statsNumber[i].innerHTML = pokemon.stats[i].base_stat;
    }
}

var shiny = false;

function changeShiny(pokemon) {
    var contentImage = document.getElementById("pokemonimage");

    if (shiny) {
        contentImage.setAttribute("src", pokemon.sprites.other["official-artwork"].front_default);
        shiny = false;
    } else {
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

function callFunctions() {
    changeTheme();
    changeInfo();
}