var seeMoreCount = 0;
var varietyDefault;
var varietyCount;
var shiny;

async function givePokemonDetails(id) {
    var response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    var data = await response.json();

    return data;
}

async function evolutionChain(specie) {
    var response = await fetch(specie.evolution_chain.url);
    var data = await response.json();

    return data;
}

async function giveItem(urlItem) {
    var response = await fetch(urlItem);
    var data = await response.json();
    var itemName = translateItem(data);

    return itemName;
}

async function giveLocation(urlLocation) {
    var response = await fetch(urlLocation);
    var data = await response.json();
    var locationName = translateItem(data);

    return locationName;
}

async function pokemonDetails() {
    var parameters = window.location.search;

    var newUrl = new URLSearchParams(parameters);

    var number = newUrl.get('numero');

    var pokemon = await givePokemonDetails(number);

    var specie = await givePokemonSpecie(pokemon);

    var evolution = await evolutionChain(specie);

    changeInfo();

    chooseFavicon(pokemon);

    detailsPokemon(pokemon);

    makeData(pokemon);

    varietyDefault = pokemon;

    pokemonVarieties(pokemon);

    makeRegion(specie);

    makeChain(pokemon, evolution);

    document.title = `${pokemon.species.name[0].toUpperCase() + pokemon.species.name.slice(1)} | Pokédex`;
}

async function detailsPokemon(pokemon) {
    var species = await givePokemonSpecie(pokemon);

    var details = document.getElementById("details");
    var elements = species.flavor_text_entries.length;
    var spanish = false;

    for (var i = 0; !spanish && i < elements; i++) {
        if (species.flavor_text_entries[i].language.name == "es") {
            spanish = true;
            details.innerHTML = species.flavor_text_entries[i].flavor_text;
        }
    }
}

function makeData(pokemon) {
    if (typeof pokemon === "string") {
        pokemon = JSON.parse(pokemon);
    }

    var pokemonName = document.getElementsByClassName("font-type")[0];
    var number = document.getElementById("number");
    var weight = document.getElementById("kilos");
    var height = document.getElementById("meters");

    changeImage(pokemon);

    pokemonName.innerHTML = pokemon.species.name[0].toUpperCase() + pokemon.species.name.slice(1);

    if (number.innerHTML == "") {
        number.innerHTML = '#' + pokemon.id.toString().padStart(3, 0);
    }

    weight.innerHTML = `${pokemon.weight / 10}kg`;
    height.innerHTML = pokemon.name == "vaporeon" ? `${pokemon.height / 10}m` : `${pokemon.height / 10}`;

    checkTypes(pokemon);

    pokemonValues(pokemon);
}

async function pokemonValues(pokemon) {
    var listStats = document.getElementById("stats");
    listStats.style.backgroundColor = `var(--${pokemon.types[0].type.name})`;

    var statsProgress = document.getElementsByClassName("stats-progress");
    var statsNumber = document.getElementsByClassName("stats-number");

    for (var i = 0; i < pokemon.stats.length; i++) {
        statsProgress[i].value = await pokemon.stats[i].base_stat;
        statsNumber[i].innerHTML = await pokemon.stats[i].base_stat;
    }
}

function removeImage() {
    var image = document.getElementsByClassName("image")[0];
    var imageClon = image.cloneNode(true);

    image.replaceWith(imageClon);
}

function changeImage(pokemon) {
    removeImage();

    var image = document.getElementsByClassName("image")[0];
    var contentImage = document.getElementById("pokemonimage");
    var color = () => { contentImage.style.filter = `drop-shadow(0 0 15px var(--${pokemon.types[0].type.name}))` };
    var addShiny = () => { changeShiny(pokemon) }
    shiny = false;

    image.addEventListener("click", addShiny);
    image.addEventListener("mouseover", color);
    image.addEventListener("mouseout", () => {
        contentImage.style.filter = `none`;
    })

    if (pokemon.name == "vaporeon") {
        whatAreUDoing(image);
    }

    contentImage.src = pokemon.sprites.other["official-artwork"].front_default;
    contentImage.alt = "Lo siento, el pokemon no ha sido encontrado :(";
}

async function pokemonVarieties(pokemon) {
    var species = await givePokemonSpecie(pokemon);

    var seeMoreCount = species.varieties.length;
    var varieties = [];

    for (var i = 0; i < seeMoreCount; i++) {
        varieties.push(species.varieties[i].pokemon.url);
    }

    if (varieties.length > 1) {
        var mainPage = document.getElementsByClassName("menu")[0];
        var button = document.createElement("select");

        button.setAttribute("id", "options");
        button.addEventListener("change", () => makeData(button.value));

        mainPage.appendChild(button);

        for (var i = 0; i < varieties.length; i++) {
            var variety = varieties[i].split("/")[6];
            var data = await givePokemonDetails(variety);
            varietyCount = i;

            makeVariety(data);
        }
    }
}

function makeVariety(pokemon) {
    var button = document.getElementById("options");

    var option = document.createElement("option");
    option.value = JSON.stringify(pokemon);
    option.innerHTML = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);

    button.appendChild(option);
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

function makeRegion(specie) {
    const PokemonRegion = {
        i: "kanto",
        ii: "johto",
        iii: "hoenn",
        iv: "sinnoh",
        v: "teselia",
        vi: "kalos",
        vii: "alola",
        viii: "galar",
        ix: "paldea"
    }

    var nameRegion = document.getElementById("name-region");
    var imageRegion = document.getElementById("image-region");

    var numberRegion = specie.generation.name.split("-")[1];
    var region = PokemonRegion[numberRegion];

    nameRegion.innerHTML = region[0].toUpperCase() + region.slice(1);
    imageRegion.src = `../img/regions/${PokemonRegion[numberRegion]}.jpg`;
}

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

async function makeChainData(thisPokemon, chain) {
    var id = chain.species.url.split("/")[6];

    var pokemon = await givePokemonDetails(id);

    var chainSpace = document.getElementById("evolution-pokemons");

    var link = document.createElement("a");
    link.href = `pokemon.html?numero=${id}`;

    var element = document.createElement("div");
    element.classList.add("poke");

    var imageContainer = document.createElement("div");
    imageContainer.classList.add("image");

    var image = document.createElement("img");
    image.src = pokemon.sprites.other["official-artwork"].front_default;
    image.alt = "Lo siento, el pokemon no ha sido encontrado :(";

    shadowPokemon(image, pokemon);

    var pokemonName = document.createElement("div");
    pokemonName.classList.add("name");

    if (chain.species.name == thisPokemon.species.name) {
        link.style.color = "var(--text-color)";
        pokemonName.innerHTML = chain.species.name.italics();
    } else {
        link.style.color = `var(--${pokemon.types[0].type.name})`;
        pokemonName.innerHTML = chain.species.name;
        pokemonName.style.webkitTextStroke = "0.8px var(--text-color)";
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
            var check = await checkTrigger(pokemon, chain.evolution_details[0]);

            trigger.innerHTML = check;

        } else {
            seeMoreCount++;
            seeMore(pokemon, chain);
        }
    }
}

function seeMore(pokemon, chain) {
    var evolutions = document.getElementsByClassName("evolution-trigger");
    var evolutionTrigger = evolutions[evolutions.length - 1];

    var see = document.getElementsByClassName("click-here");

    if (see.length < seeMoreCount) {
        var button = document.createElement("a");

        button.classList.add("click-here");
        button.setAttribute("href", "#evolution-trigger");
        button.innerHTML = "VER MÁS";

        hoverSeeMore(evolutionTrigger);

        evolutionTrigger.appendChild(button);

        button.addEventListener("click", () => clickScreen(pokemon, chain));
    }
}

function hoverSeeMore(evolutionTrigger) {
    evolutionTrigger.addEventListener("mouseover", () => {
        evolutionTrigger.style.backgroundColor = "var(--text-color)";
        evolutionTrigger.style.color = "var(--background-color)";
    });
    evolutionTrigger.addEventListener("mouseout", () => {
        evolutionTrigger.style.backgroundColor = "transparent";
        evolutionTrigger.style.color = "var(--text-color)";
    });
}

async function clickScreen(pokemon, chain) {
    var seeMore = document.getElementById("see-more");
    seeMore.style.display = "flex";

    var screen = document.getElementById("screen");
    screen.innerHTML = "";

    var length = chain.evolution_details.length;

    for (var i = 0; i < length; i++) {
        var detail = document.createElement("div");
        var line = document.createElement("hr");

        detail.innerHTML = await checkTrigger(pokemon, chain.evolution_details[i]);

        screen.appendChild(detail);

        if (i != length - 1) {
            screen.appendChild(line);
        }
    }

    var close = document.createElement("div");

    var image = document.createElement("img");
    close.setAttribute("id", "close");

    screen.appendChild(close);
    close.appendChild(image);

    closeScreen();
}

function closeScreen() {
    var screen = document.getElementById("see-more");
    var close = document.getElementById("close");

    close.addEventListener("click", () => {
        screen.style.display = "none";
    });
}

async function checkTrigger(pokemon, details) {
    const TipeTrigger = {
        other: other(pokemon),
        trade: trade(details),
        "use-item": await useItem(details),
        spin: "Dar Confite Y Girar Personaje",
        "tower-of-waters": "Ganar Torre De Agua",
        "level-up": await levelUp(pokemon, details),
        "tower-of-darkness": "Ganar Torre De Oscuridad",
        "three-critical-hits": "Realizar 3 Ataques Críticos",
        "take-damage": "Recibir Mínimo 49 De Daño De Un Golpe",
        "recoil-damage": "Recibir 294 De Daño De El Mismo Sin Ser Debilitado",
        shed: "Al Evolucionar A Ninjask Aparecerá Si Hay Espacio Libre En El Equipo",
        "agile-style-move": `Utilizar ${details.known_move?.name[0].toUpperCase() + details.known_move?.name.slice(1)} 20 Veces En Estilo Rápido`,
        "strong-style-move": `Utilizar ${details.known_move?.name[0].toUpperCase() + details.known_move?.name.slice(1)} 20 Veces En Estilo Fuerte`
    }

    var trigger = details.trigger.name;

    return TipeTrigger[trigger];
}
function other(pokemon) {
    var trigger;

    const Names = {
        maushold: "Nivel => 25 En Combate",
        kingambit: "Subir Nivel \n Derrotar 3 Bisharp Líderes",
        gholdengo: "Subir Nivel \n Tener 999 Monedas de Gimmighoul",
        rabsa: "Subir Nivel Al Dar 1000 Pasos En Modo Enviar Pokemon",
        pawmot: "Subir Nivel Al Dar 1000 Pasos En Modo Enviar Pokemon",
        annihilape: "Subir Nivel \n Usar 20 Veces Puño Furia En Combate",
        brambleghast: "Subir Nivel Al Dar 1000 Pasos En Modo Enviar Pokemon",
        palafin: "Nivel => 38+ Mientras Está Conectado Con Otro/s Jugador/es Mediante Círculo Unión"
    }

    trigger = pokemon.species.name;

    return Names[trigger];
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

async function levelUp(pokemon, details) {
    var trigger;

    var name = pokemon.species.name;

    const StatsNumbers = {
        "-1": "Ataque < Defensa",
        0: "Ataque == Defensa",
        1: "Ataque > Defensa"
    }

    const TimeOfDay = {
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

        details.party_type ? trigger += `Debe Haber Un Pokemon Tipo ${PokemonTypes[details.party_type.name]} En El Equipo\n` : trigger;

        details.relative_physical_stats || details.relative_physical_stats == 0 ? trigger += `${StatsNumbers[details.relative_physical_stats]}\n` : trigger;
    } else {
        trigger = "Subir Nivel\n"

        details.min_beauty ? trigger += `Belleza => ${details.min_beauty}\n` : trigger;

        details.min_affection ? trigger += `Amistad => ${details.min_affection}\n` : trigger;

        details.min_happiness ? trigger += `Felicidad => ${details.min_happiness}\n` : trigger;

        details.time_of_day.length != 0 ? trigger += `${TimeOfDay[details.time_of_day]}\n` : trigger;

        details.known_move_type ? trigger += `Conocer Movimiento Tipo ${PokemonTypes[details.known_move_type.name]}\n` : trigger;

        details.held_item ? trigger += `Con ${details.held_item.name[0].toUpperCase() + details.held_item.name.slice(1)} Equipado\n` : trigger;

        details.known_move ? trigger += `Conocer => ${details.known_move.name[0].toUpperCase() + details.known_move.name.slice(1)}\n` : trigger;

        details.party_species ? trigger += `Debe Estar ${details.party_species.name[0].toUpperCase() + details.party_species.name.slice(1)} En El Equipo` : trigger;

        if (details.location == null) {
            if (name == "probopass" || name == "magnezone" || name == "vikavolt") {
                trigger += "En Campo Magnético Enemigo";
            }

            if (name == "leafeon") {
                trigger += "Cerca De Roca Musgo";
            }

            if (name == "glaceon") {
                trigger += "Cerca De Roca Hielo";
            }
        } else {
            trigger += `En ${await giveLocation(details.location.url)}\n`;
        }
    }

    return trigger;
}

async function useItem(details) {
    if (details.item != null) {
        var itemName = await giveItem(details.item?.url);

        var trigger = `Usar => ${itemName}\n` + (details.gender ? details.gender == 1 ? `Debe Ser Hembra` : `Debe Ser Macho` : "");
    }

    return trigger;
}

function translateItem(item) {
    var length = item.names.length;
    var spanish = false;
    var english;
    var itemName;

    if (length != 0) {
        for (var i = 0; !spanish && i < length; i++) {
            var name = item.names[i].language.name;

            if (name == "es") {
                spanish = true;
                itemName = item.names[i].name;
            }

            if (name == "en") {
                english = item.names[i].name;
            }
        }

        if (!spanish) {
            itemName = english;
        }
    } else {
        itemName = item.name[0].toUpperCase() + item.name.slice(1);
    }

    return itemName;
}

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

function whatAreUDoing(image) {
    var vaporeon = document.createElement("div");
    vaporeon.innerHTML = `"Hola chicos, ¿sabían que, en términos de reproducción de Pokémon masculinos y femeninos, Vaporeon es el Pokémon más compatible para humanos? No solo están en el grupo de huevos de campo, que en su mayoría está compuesto por mamíferos, los Vaporeon tienen un promedio de 3 "03 'de alto y 63.9 libras. Esto significa que son lo suficientemente grandes como para poder manejar penes humanos, y con su impresionante Estadísticas base para HP y acceso a Acid Armor, puedes ser rudo con uno. Debido a su biología principalmente basada en agua, no tengo ninguna duda de que un Vaporeon excitado sería increíblemente húmedo, tan húmedo que fácilmente podrías tener sexo con uno. durante horas sin dolor. También pueden aprender los movimientos Attract, Baby-Doll Eyes, Captivate, Charm y Tail Whip, además de no tener pelaje para ocultar los pezones, por lo que sería increíblemente fácil para uno atraparte en el estado de ánimo. Con sus habilidades de absorción de agua e hidratación, pueden recuperarse fácilmente de la fatiga con suficiente agua. Ningún otro Pokémon se acerca a este nivel de compatibilidad. Además, como dato curioso, si sacas lo suficiente, puedes hacer que tu Vaporeon se vuelva blanco".`

    image.addEventListener("click", () => {
        navigator.clipboard.writeText(vaporeon.innerHTML);
    });
}