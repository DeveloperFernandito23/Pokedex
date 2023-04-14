var pokemons = [];

var demo, content;

var GenerationsParameters = {
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
        })
        btn.addEventListener("mouseout", () => {
            btn.style.backgroundColor = "";
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
        split = Generations[parseInt(genereationSelected)].split(',');
    } else {
        split = Generations[1].split(',');
    }

    showAlert();
    const demo = document.getElementById("demo");

    demo.innerHTML = "";

    for (let i = 0; i < pokemons.length; i++) {
        for (let j = parseInt(split[0]); j < parseInt(split[1]); j++) {
            var choose = pokemons[i].id == j + 1 ? pokemons[i] : null;

            if (choose != null) {
                for (var k = 0; k < pokemons[i].types.length; k++) {

                    if (pokemons[i].types[k].type.name.includes(x)) {
                        crearPokemon(pokemons[i]);
                    }
                }
            }

        }
    }
    
    // for (let index = 0; index < pokemons.length; index++) {
    //     for (var i = 0; i < pokemons[index].types.length; i++) {

    //         if (pokemons[index].types[i].type.name.includes(x)) {
    //             crearPokemon(pokemons[index]);
    //         }
    //     }
    // }
    var element = document.getElementsByClassName("btn");
    for (let i = 0; i < element.length; i++) {
        element[i].innerHTML.includes(PokemonTypes[x]) ? element[i].classList.add("active") : element[i].classList.remove("active");
    }
    if (demo.innerHTML.length == 0) {
        demo.innerHTML = content;
        shadowTypes();
    }
}
function removeClass(classname) {
    var element = document.getElementsByClassName(classname);

    for (let i = 0; i < element.length; i++) {
        element[i].classList.remove(classname);
    }
}
async function filterSelectionGen(x) {
    document.getElementById("options").value = "opt1";

    if (sessionStorage.getItem("select") != null) {
        showAlert();
    }
    const demo = document.getElementById("demo");
    demo.innerHTML = "";
    var element = document.getElementsByClassName("btn-gen");

    var split = GenerationsParameters[x].split(',');
    sessionStorage.setItem("select", x);
    await givePokemons(parseInt(split[0]), parseInt(split[1]));


    for (let i = 0; i < element.length; i++) {
        element[i].innerHTML.includes(Generations[x]) ? element[i].classList.add("active") : element[i].classList.remove("active");
    }

    // for (let index = 0; index < pokemons.length; index++) {
    //     var pg = await givePokemonGeneration(pokemons[index])
    //     if (pg == x) {
    //         await crearPokemon(pokemons[index]);
    //     }
    // }
    if (demo.innerHTML.length == 0) {
        demo.innerHTML = content;
        shadowTypes();
    }
}

async function givePokemonGeneration(pokemon) {
    var pokemonSpecie = await givePokemonSpecie(pokemon);
    var generationUrl = pokemonSpecie.generation.url;
    var generations = generationUrl.split('/');

    return generations[generations.length - 2];
}

async function orderBy(value) {
    var lista = pokemons.slice();
    var select = sessionStorage.getItem("select");
    var split, generation;
    if (select != null) {
        generation = GenerationsParameters[select];
        split = generation.split(',')
    }
    showAlert();

    switch (value) {
        case "opt1":
            document.getElementById("demo").innerHTML = "";

            for (let i = 0; i < pokemons.length; i++) {
                for (let j = parseInt(split[0]); j < parseInt(split[1]); j++) {
                    var choose = pokemons[i].id == j + 1 ? pokemons[i] : null;

                    if (choose != null) {
                        await crearPokemon(choose);
                    }

                }
            }

            // pokemons.forEach(element => {
            //     crearPokemon(element);
            // });
            break;
        case "opt2":
            document.getElementById("demo").innerHTML = "";

            for (let i = pokemons.length - 1; i > 0; i--) {
                for (let j = parseInt(split[0]); j < parseInt(split[1]); j++) {
                    var choose = pokemons[i].id == j + 1 ? pokemons[i] : null;

                    if (choose != null) {
                        await crearPokemon(choose);
                    }

                }
            }
            // console.log(lista);
            // lista.reverse().forEach(element => {
            //     crearPokemon(element);
            // });
            break;
        case "opt3":
            var listPokemons = [];
            for (let i = 0; i < pokemons.length; i++) {
                for (let j = parseInt(split[0]); j < parseInt(split[1]); j++) {
                    var choose = pokemons[i].id == j + 1 ? pokemons[i] : null;

                    if (choose != null) {
                        listPokemons.push(pokemons[i])
                    }

                }
            }
            alphabeticalOrder(false, listPokemons);
            
            break;
        case "opt4":
            var listPokemons = [];
            for (let i = 0; i < pokemons.length; i++) {
                for (let j = parseInt(split[0]); j < parseInt(split[1]); j++) {
                    var choose = pokemons[i].id == j + 1 ? pokemons[i] : null;

                    if (choose != null) {
                        listPokemons.push(pokemons[i])
                    }

                }
            }
            alphabeticalOrder(true, listPokemons);
            break;
    }
}

// ORDENA ALFABETICAMENTE
function alphabeticalOrder(bool, list) {
    var listPoke = list.slice();

    var listaOrder = listPoke.sort((a, b, result = 0) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            result = 1;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            result = -1;
        }
        return result;
    });

    document.getElementById("demo").innerHTML = "";
    if (bool) {
        listaOrder.reverse();
    }

    listaOrder.forEach(element => {
        crearPokemon(element);
    });
}
function startLoader() {
    document.getElementById("demo").style.display = "none";
    document.getElementsByClassName("font-type")[0].style.height = "35vh";
    document.getElementsByClassName("loader")[0].style.display = "flex";
}
function finishLoader() {
    document.getElementById("demo").style.display = "";
    document.getElementsByClassName("font-type")[0].style.height = "20vh";
    document.getElementsByClassName("loader")[0].style.display = "none";
}
async function givePokemons(start, end) { //NEVER TOUCH
    startLoader();

    for (var i = start; i < end; i++) {
        var response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}/`);
        var objeto = await response.json();
        await pokemons.push(objeto);
        await crearPokemon(objeto);
    }

    finishLoader();

    demo = document.getElementById("demo");
    content = demo.innerHTML;
}

function buscarPokemons(valor) {
    var documento = document.getElementById("demo");

    documento.innerHTML = "";

    for (var i = 0; i < pokemons.length; i++) {
        if (pokemons[i].name.toUpperCase().includes(valor.toUpperCase())) {
            crearPokemon(pokemons[i]);
        }
    }

    if (documento.innerHTML.length == 0) {
        documento.innerHTML = "<div class='alert'>¡No se encontraron pokémons!</div>";
    }
}

function crearPokemon(pokemon) {
    var enlace = document.createElement("a");
    enlace.classList.add(`link-${pokemon.id}`);
    enlace.href = `html/pokemon.html?numero=${pokemon.id}`;

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

    document.getElementById("demo").appendChild(enlace);
    enlace.appendChild(bicho);
    bicho.appendChild(divImagen);
    bicho.appendChild(nombre);
    bicho.appendChild(numero);
    bicho.appendChild(tipos);
    checkTypes(pokemon);
    divImagen.appendChild(imagen);
}
function mostrar() {
    const prueba1 = document.querySelector("#prueba1");
    const filterOptions = document.querySelector(".filter-options");
    filterOptions.classList.toggle('show');
    prueba1.classList.toggle('show');

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
        document.getElementById("prueba").style.opacity = "1";
        document.getElementById("myBtnContainerGen").style.display = "";
        document.getElementById("myBtnContainerGen").style.opacity = "0";
        show2 = true;
        show = false;
    } else {
        document.getElementById("myBtnContainer").style.display = "";
        document.getElementById("myBtnContainer").style.opacity = "0";
        document.getElementById("prueba").style.opacity = "0";
        show = true;
    }
});
var show2 = true;
const element1 = document.getElementById("gen");
element1.addEventListener("click", () => {
    if (document.getElementById("myBtnContainerGen").style.display != "" || document.getElementById("myBtnContainer").style.display != "") {
        resetFilters();
    }

    if (show2) {
        document.getElementById("myBtnContainerGen").style.display = "flex";
        document.getElementById("myBtnContainerGen").style.opacity = "1";
        document.getElementById("prueba").style.opacity = "1";
        document.getElementById("myBtnContainer").style.display = "";
        document.getElementById("myBtnContainer").style.opacity = "0";
        show = true;
        show2 = false;
    } else {
        document.getElementById("myBtnContainerGen").style.display = "";
        document.getElementById("myBtnContainerGen").style.opacity = "0";
        document.getElementById("prueba").style.opacity = "0";
        show2 = true;
    }
});
function resetFilters() {
    document.getElementById("options").value = "opt1";
    demo.innerHTML = content;
    removeClass("active");
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

    if (position != null) {
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
    if (sessionStorage.getItem("select") == null) {
        await filterSelectionGen(1);
    } else {
        await filterSelectionGen(parseInt(sessionStorage.getItem("select")));
    }
    // await givePokemons(0, 151);
    createButtonsFilters();
    // if(sessionStorage.getItem("enter") == null){
    //     filterSelectionGen(1);
    // }
    sessionStorage.setItem("enter", "true")
    await restorePosition();
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