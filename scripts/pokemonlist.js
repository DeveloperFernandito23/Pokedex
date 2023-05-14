var pokemons = [];

var pokemonList = document.getElementById("pokemonList");

var content;

const GenerationsParameters = {
    1: "0, 151",
    2: "151, 251",
    3: "251, 386",
    4: "386, 494",
    5: "494, 649",
    6: "649, 721",
    7: "721, 809",
    8: "809, 905",
    9: "905, 1010"
};

function createButtonsOfTypes() {
    Object.keys(PokemonTypes).forEach(type => {
        const types = document.getElementById("myBtnContainer");
        var btn = document.createElement("button");

        btn.addEventListener("mouseover", () => {
            btn.style.backgroundColor = `var(--${type})`;
            btn.style.transition = "none";
        })
        btn.addEventListener("mouseout", () => {
            btn.style.backgroundColor = "";
            btn.style.transition = "all 1s ease-in-out";
        })

        btn.classList.add("btn");
        btn.setAttribute("onclick", `filterSelection("${type}")`)
        btn.innerHTML = PokemonTypes[type];
        types.appendChild(btn);
    });
}
function createButtonsOfGenerations() {
    Object.keys(Generations).forEach(gen => {
        const gene = document.getElementById("myBtnContainerGen");
        var btn = document.createElement("button");
        var image = document.createElement("img");
        image.src = `img/pokeSiluetes/${gen}.png`;
        image.classList.add("icons");

        btn.classList.add("btn-gen");
        btn.setAttribute("onclick", `filterSelectionGen("${gen}")`);
        btn.innerHTML = Generations[gen];

        gene.appendChild(btn);
        btn.appendChild(image);
    });
}
async function filterSelection(x) {
    var genereationSelected = sessionStorage.getItem("select");
    var split;
    if (genereationSelected != null) {
        split = GenerationsParameters[parseInt(genereationSelected)].split(',');
    } else {
        split = GenerationsParameters[1].split(',');
    }

    showAlert();
    pokemonList.innerHTML = "";
    sessionStorage.setItem("typeSelected", x);


    for (let i = 0; i < pokemons.length; i++) {
        var stop = false;
        for (let j = parseInt(split[0]); stop == false && j < parseInt(split[1]); j++) {
            var choose = pokemons[i].id == j + 1 ? pokemons[i] : null;

            if (choose != null) {
                stop = true;

                var repeat = false;
                for (var k = 0; k < pokemons[i].types.length && repeat == false; k++) {

                    if (x != "all") {
                        if (pokemons[i].types[k].type.name.includes(x)) {
                            createPokemon(pokemons[i]);
                        }
                    } else {
                        createPokemon(pokemons[i]);
                        repeat = true;
                    }
                }
            }
        }
    }

    var element = document.getElementsByClassName("btn");
    for (let i = 0; i < element.length; i++) {
        element[i].innerHTML.includes(PokemonTypes[x]) ? element[i].classList.add("active") : element[i].classList.remove("active");
    }

    document.getElementById("typeFilter").innerHTML = PokemonTypes[x];
}
function removeClass(classname) {
    var element = document.getElementsByClassName(classname);

    for (let i = 0; i < element.length; i++) {
        element[i].classList.remove(classname);
    }
}
async function filterSelectionGen(x) {
    document.getElementById("options").value = "opt1";
    sessionStorage.setItem("select", x);

    if (sessionStorage.getItem("select") != null) {
        showAlert();
    }
    pokemonList.innerHTML = "";
    var element = document.getElementsByClassName("btn-gen");

    for (let i = 0; i < element.length; i++) {
        element[i].innerHTML.includes(Generations[x]) ? element[i].classList.add("active") : element[i].classList.remove("active");
    }

    document.getElementById("generation").innerHTML = `${Generations[x]} Generación`;

    var split = GenerationsParameters[x].split(',');
    await givePokemons(parseInt(split[0]), parseInt(split[1]));

    if (sessionStorage.getItem("typeSelected") != null) {

        await filterSelection(sessionStorage.getItem("typeSelected"));

    }

    if (pokemonList.innerHTML.length == 0) {
        await filterSelectionGen(1);
        shadowTypes();
    }

}

async function givePokemonGeneration(pokemon) {
    var pokemonSpecie = await givePokemonSpecie(pokemon);
    var generationUrl = pokemonSpecie.generation.url;
    var generations = generationUrl.split('/');

    return generations[generations.length - 2];
}
function selectGenerationActive(start, end) {
    var result = [];
    for (let i = 0; i < pokemons.length; i++) {
        for (let j = start; j < end; j++) {
            var choose = pokemons[i].id == j + 1 ? pokemons[i] : null;
            if (choose != null) result.push(choose);
        }
    }
    return result;
}
async function orderBy(value) {
    var select = sessionStorage.getItem("select");
    var split, generation;
    if (select != null) {
        generation = GenerationsParameters[select];
        split = generation.split(',')
    }
    showAlert();
    filterSelection("all");
    switch (value) {
        case "opt1":
            pokemonList.innerHTML = "";

            await selectGenerationActive(parseInt(split[0]), parseInt(split[1])).forEach(element => {
                createPokemon(element);
            });

            break;
        case "opt2":
            pokemonList.innerHTML = "";

            await selectGenerationActive(parseInt(split[0]), parseInt(split[1])).reverse().forEach(element => {
                createPokemon(element);
            });
            break;
        case "opt3":
            var listPokemons = [];

            await selectGenerationActive(parseInt(split[0]), parseInt(split[1])).forEach(element => {
                listPokemons.push(element);
            });
            alphabeticalOrder(false, listPokemons);
            break;
        case "opt4":
            var listPokemons = [];

            await selectGenerationActive(parseInt(split[0]), parseInt(split[1])).forEach(element => {
                listPokemons.push(element);
            });
            alphabeticalOrder(true, listPokemons);
            break;
    }
}

// ORDENA ALFABETICAMENTE
function alphabeticalOrder(bool, list) {
    var listPoke = list.slice();

    var orderList = listPoke.sort((a, b, result = 0) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            result = 1;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            result = -1;
        }
        return result;
    });

    pokemonList.innerHTML = "";
    if (bool) {
        orderList.reverse();
    }

    orderList.forEach(element => {
        createPokemon(element);
    });
}
function changeStyleLoader(pokemonsDisplay, height, loaderDisplay) {
    document.getElementById("pokemonList").style.display = pokemonsDisplay;
    document.getElementsByClassName("font-type")[0].style.height = height;
    document.getElementsByClassName("loader")[0].style.display = loaderDisplay;
}

function startLoader() {
    changeStyleLoader("none", "35vh", "flex");
}
function finishLoader() {
    changeStyleLoader("", "20vh", "none");
    restorePosition();
}
async function givePokemons(start, end) { //NEVER TOUCH
    startLoader();

    setTimeout(finishLoader, 2500);

    pokemonList.innerHTML = "";

    for (var i = start; i < end; i++) {
        var response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}/`);
        var object = await response.json();
        await pokemons.push(object);
        await createPokemon(object);
    }

    content = pokemonList.innerHTML;
}

async function searchPokemons(valor) {
    var document = pokemonList;

    document.innerHTML = "";
    var select = sessionStorage.getItem("select");
    var split, generation;
    if (select != null) {
        generation = GenerationsParameters[select];
        split = generation.split(',')
    }

    var listPokemons = [];

    await selectGenerationActive(parseInt(split[0]), parseInt(split[1])).forEach(element => {
        listPokemons.push(element);
    });
    for (var i = 0; i < listPokemons.length; i++) {
        if (listPokemons[i].name.toUpperCase().includes(valor.toUpperCase())) {
            await createPokemon(listPokemons[i]);
        }
    }

    if (document.innerHTML.length == 0) {
        document.innerHTML = "<div class='alert'>¡No se encontraron pokémons!</div>";
    }
}

function createPokemon(pokemon) {
    var enlace = document.createElement("a");
    enlace.classList.add(`link-${pokemon.id}`);
    enlace.href = `html/pokemon.html?id=${pokemon.id}`;

    enlace.addEventListener("click", () => {
        sessionStorage.setItem("position", pokemon.id);
    })

    var bicho = document.createElement("div");
    bicho.classList.add("poke");

    var divImagen = document.createElement("div");
    divImagen.classList.add("image");

    var imagen = document.createElement("img");
    imagen.src = pokemon.sprites.other["official-artwork"].front_default;
    imagen.alt = "Lo siento, el pokemon no ha sido encontrado :(";
    imagen.classList.add("pokemon-image");

    shadowPokemon(imagen, pokemon);

    var nombre = document.createElement("div");
    nombre.classList.add("name");
    nombre.innerHTML = pokemon.species.name;

    var numero = document.createElement("div");
    numero.classList.add("number");
    numero.innerHTML = '#' + pokemon.id.toString().padStart(3, 0);

    var tipos = document.createElement("div");
    tipos.classList.add("types");

    document.getElementById("pokemonList").appendChild(enlace);
    enlace.appendChild(bicho);
    bicho.appendChild(divImagen);
    bicho.appendChild(nombre);
    bicho.appendChild(numero);
    bicho.appendChild(tipos);
    checkTypes(pokemon);
    divImagen.appendChild(imagen);
}
function showFilters() {
    const filterContainer = document.querySelector("#filter-container");
    const filterOptions = document.querySelector(".filter-options");
    filterOptions.classList.toggle('show');
    filterContainer.classList.toggle('show');

    if (document.getElementById("myBtnContainer").style.display == "flex" || document.getElementById("myBtnContainerGen").style.display == "flex") {
        document.getElementById("myBtnContainer").style.display = "";
        document.getElementById("myBtnContainer").style.opacity = "0";
        document.getElementById("myBtnContainerGen").style.display = "";
        document.getElementById("myBtnContainerGen").style.opacity = "0";
        show = false;
        show2 = false;
    }
    else {
        show = true;
        show2 = true;
    }
}

var show = true;
const element = document.getElementById("type");
element.addEventListener("click", () => {
    if (document.getElementById("myBtnContainer").style.display != "" || document.getElementById("myBtnContainerGen").style.display != "") {
        resetFilters();
    }

    if (show) {
        document.getElementById("myBtnContainer").style.display = "flex";
        document.getElementById("myBtnContainer").style.opacity = "1";
        document.getElementById("btn-container").style.opacity = "1";
        document.getElementById("myBtnContainerGen").style.display = "";
        document.getElementById("myBtnContainerGen").style.opacity = "0";
        show2 = true;
        show = false;
    } else {
        document.getElementById("myBtnContainer").style.display = "";
        document.getElementById("myBtnContainer").style.opacity = "0";
        document.getElementById("btn-container").style.opacity = "0";
        show = true;
    }
});
var show2 = true;
const element1 = document.getElementById("gen");
element1.addEventListener("click", () => {

    if (show2) {
        document.getElementById("myBtnContainerGen").style.display = "flex";
        document.getElementById("myBtnContainerGen").style.opacity = "1";
        document.getElementById("btn-container").style.opacity = "1";
        document.getElementById("myBtnContainer").style.display = "";
        document.getElementById("myBtnContainer").style.opacity = "0";
        show = true;
        show2 = false;
    } else {
        document.getElementById("myBtnContainerGen").style.display = "";
        document.getElementById("myBtnContainerGen").style.opacity = "0";
        document.getElementById("btn-container").style.opacity = "0";
        show2 = true;
    }
});
function resetFilters() {
    document.getElementById("options").value = "opt1";
    filterSelection("all");
    shadowTypes();
    showAlert();
}

function showAlert() {
    var alertBox = document.getElementById("myAlert");
    alertBox.classList.add("show");
    setTimeout(function () {
        alertBox.classList.remove("show");
    }, 3000); // Oculta la alerta después de 3 segundos
}

function restorePosition() {
    var position = sessionStorage.getItem("position");
    var poke = document.getElementsByClassName(`link-${position}`)[0];

    if (poke != undefined) {
        poke.scrollIntoView({
            behavior: 'smooth'
        });
    }
}
function createButtonsFilters() {
    createButtonsOfTypes();
    createButtonsOfGenerations();
}

async function startPokedex() {
    createButtonsFilters();

    if (sessionStorage.getItem("select") == null) {
        await filterSelectionGen(1);
    } else {
        await filterSelectionGen(parseInt(sessionStorage.getItem("select")));
    }
}

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("scrollToTopBtn").style.display = "block";
    } else {
        document.getElementById("scrollToTopBtn").style.display = "none";
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}

function shadowTypes() {
    var types = document.getElementsByClassName("types");
    var images = document.getElementsByClassName("pokemon-image");

    for (var i = 0; i < types.length; i++) {
        var type = types[i].getElementsByClassName("type")[0].style.backgroundColor;
        var image = images[i];

        shadowPokemon(image, type);
    }
}