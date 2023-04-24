//JS no tiene tipo enumerado, pero se puede usar esta sintaxis para dejarlo más claro
const PokemonTypes = {
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
    steel: "Acero",
    dark: "Siniestro"
};
const Generations = {
    1: "Primera",
    2: "Segunda",
    3: "Tercera",
    4: "Cuarta",
    5: "Quinta",
    6: "Sexta",
    7: "Séptima",
    8: "Octava",
    9: "Novena"
};

checkTheme(); // Lo primero que hace es comprobar el tema activo y lo ajusta a cual sea el elegido

function checkTypes(pokemon) {
    var types = document.getElementsByClassName("types");

    if (types.length == 1) {
        types[0].innerHTML = "";
    }

    for (var i = 0; i < pokemon.types.length; i++) {
        var type = document.createElement("div");
        type.classList.add("type");

        var style = pokemon.types[i].type.name;
        type.innerHTML = PokemonTypes[style];
        type.style.backgroundColor = `var(--${style})`;

        types[types.length - 1].appendChild(type);
    }
}

function shadowPokemon(image, data) {
    var pokemon;

    if (typeof data === "string") {
        pokemon = data;
    } else {
        pokemon = `var(--${data.types[0].type.name})`;
    }

    image.addEventListener("mouseover", () => {
        image.style.filter = `drop-shadow(0 0 15px ${pokemon})`;
    })
    image.addEventListener("mouseout", () => {
        image.style.filter = `none`;
    })
}

async function givePokemonSpecie(pokemon) {
    var urlSpecie = pokemon.species?.url;

    var response = await fetch(urlSpecie);
    var object = await response.json();

    return object;
}

function checkTheme() {
    const bodyAttributes = document.getElementsByTagName("body")[0];
    const slider = document.getElementById("slide");

    if (localStorage.getItem('oscuro') == "true") { // cuando está enabled me llama a cambiar el tema
        bodyAttributes.attributes.theme.nodeValue = "light";
        slider.checked = false;
    }
    else {
        bodyAttributes.attributes.theme.nodeValue = "dark";
        slider.checked = true;
    }
}

function changeTheme() {
    // Comentario de Jose 🙄 (24/03/2023)
    // Toggle true/false setitem oscuro

    const localValue = localStorage.getItem('oscuro');

    if (localValue == "true") {
        localStorage.setItem('oscuro', false);
    }
    else {
        localStorage.setItem('oscuro', true);
    }

    checkTheme()
}