var pokemons = [];

var demo, content;

function crearBotones() {
    Object.keys(TiposPokemon).forEach(type => {
        let count = 0;
        const types = document.getElementById("myBtnContainer");
        var btn = document.createElement("button");
        btn.classList.add("btn");
        btn.setAttribute("onclick", `filterSelection("${type}")`)
        btn.innerHTML = TiposPokemon[type];
        types.appendChild(btn);
        count++;
    });
}
function crearBotonesGen() {
    Object.keys(Generaciones).forEach(gen => {
        const gene = document.getElementById("myBtnContainerGen");
        var btn = document.createElement("button");
        btn.classList.add("btn-gen");
        btn.setAttribute("onclick", `filterSelectionGen("${gen}")`)
        btn.innerHTML = Generaciones[gen];
        gene.appendChild(btn);
    });
}
function filterSelection(x) {
    const demo = document.getElementById("demo");

    demo.innerHTML = "";

    for (let index = 0; index < pokemons.length; index++) {
        for (var i = 0; i < pokemons[index].types.length; i++) {

            if (pokemons[index].types[i].type.name.includes(x)) {
                crearPokemon(pokemons[index]);
            }
        }
    }
    var element = document.getElementsByClassName("btn");
    for (let i = 0; i < element.length; i++) {
        element[i].innerHTML.includes(TiposPokemon[x]) ? element[i].classList.add("active") : element[i].classList.remove("active");
    }
    if (demo.innerHTML.length == 0) {
        demo.innerHTML = content;
    }
}
function removeClass(classname) {
    var element = document.getElementsByClassName(classname);

    for (let i = 0; i < element.length; i++) {
        element[i].classList.remove(classname);
    }
}
async function filterSelectionGen(x) {
    const demo = document.getElementById("demo");
    demo.innerHTML = "";
    var element = document.getElementsByClassName("btn-gen");

    for (let i = 0; i < element.length; i++) {
        element[i].innerHTML.includes(Generaciones[x]) ? element[i].classList.add("active") : element[i].classList.remove("active");
    }

    for (let index = 0; index < pokemons.length; index++) {
        var pg = await givePokemonGeneration(pokemons[index])
        if (pg == x) {
            await crearPokemon(pokemons[index]);
        }
    }
    if (demo.innerHTML.length == 0) {
        demo.innerHTML = content;
    }
}

async function givePokemonGeneration(pokemon) {
    var pokemonSpecie = await givePokemonSpecie(pokemon);
    var generationUrl = pokemonSpecie.generation.url;
    var generations = generationUrl.split('/');

    return generations[generations.length - 2];
}

/* function comparar ( a, b ){ return a - b; }
arr.sort( comparar );  // [ 1, 5, 40, 200 ]

NO BORRAR, ES PARA ORDENAR (PARA ACORDARME PARA HACERLO)

*/
// function pruebaTipos(){
//     let elemento = document.getElementsByClassName("poke");
//     let estilo = window.getComputedStyle(elemento[1], "::before");
//     console.log(estilo.getPropertyValue('background'));
// }

function orderBy(value) {
    var lista = pokemons.slice();

    switch (value) {
        case "opt1":
            document.getElementById("demo").innerHTML = "";

            pokemons.forEach(element => {
                crearPokemon(element);
            });
            break;
        case "opt2":
            document.getElementById("demo").innerHTML = "";

            console.log(lista);
            lista.reverse().forEach(element => {
                crearPokemon(element);
            });
            break;
        case "opt3":
            orden(false);
            break;
        case "opt4":
            orden(true);
            break;
    }
}

// ORDENA ALFABETICAMENTE
function orden(bool) {
    var lista = pokemons.slice();

    var listaOrder = lista.sort((a, b, result = 0) => {
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

async function givePokemons() { //NEVER TOUCH

    document.getElementById("demo").style.display = "none";
    document.getElementsByTagName("body")[0].style.top = "25vh";
    document.getElementsByTagName("body")[0].style.position = "relative";
    document.getElementsByClassName("loader")[0].style.display = "flex";

    for (var i = 0; i < 900; i++) {
        var response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}/`);
        var objeto = await response.json();
        await pokemons.push(objeto);
        await crearPokemon(objeto);
    }

    document.getElementById("demo").style.display = "";
    document.getElementsByTagName("body")[0].style.top = "0";
    document.getElementsByClassName("loader")[0].style.display = "none";
    document.getElementById("loading-footer").style.display = "none";

    crearBotones();
    crearBotonesGen();
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

async function crearPokemon(pokemon) {
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

    imagen.addEventListener("mouseover", () => {
        imagen.style.filter = `drop-shadow(0 0 15px var(--${pokemon.types[0].type.name}))`;
    })
    imagen.addEventListener("mouseout", () => {
        imagen.style.filter = `none`;
    })

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
    comprobarTipos(pokemon);
    divImagen.appendChild(imagen);
}
function mostrar() {
    const prueba1 = document.querySelector("#prueba1");
    const filterOptions = document.querySelector(".filter-options");
    filterOptions.classList.toggle('show');
    prueba1.classList.toggle('show');

    if (document.getElementById("myBtnContainer").style.display == "flex" || document.getElementById("myBtnContainerGen").style.display == "flex") {
        document.getElementById("myBtnContainer").style.display = "none";
        document.getElementById("myBtnContainer").style.opacity = "0";
        document.getElementById("myBtnContainerGen").style.display = "none";
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
element.addEventListener("click", function () {
    if(document.getElementById("myBtnContainer").style.display != "none" || document.getElementById("myBtnContainerGen").style.display != "none"){
        resetFilters();
    }

    if (show) {
        document.getElementById("myBtnContainer").style.display = "flex";
        document.getElementById("myBtnContainer").style.opacity = "1";
        document.getElementById("prueba").style.opacity = "1";
        document.getElementById("myBtnContainerGen").style.display = "none";
        document.getElementById("myBtnContainerGen").style.opacity = "0";
        show2 = true;
        show = false;
    } else {
        document.getElementById("myBtnContainer").style.display = "none";
        document.getElementById("myBtnContainer").style.opacity = "0";
        document.getElementById("prueba").style.opacity = "0";
        show = true;
    }
});
var show2 = true;
const element1 = document.getElementById("gen");
element1.addEventListener("click", function () {
    if(document.getElementById("myBtnContainerGen").style.display != "none" || document.getElementById("myBtnContainer").style.display != "none"){
        resetFilters();
    }

    if (show2) {
        document.getElementById("myBtnContainerGen").style.display = "flex";
        document.getElementById("myBtnContainerGen").style.opacity = "1";
        document.getElementById("prueba").style.opacity = "1";
        document.getElementById("myBtnContainer").style.display = "none";
        document.getElementById("myBtnContainer").style.opacity = "0";
        show = true;
        show2 = false;
    } else {
        document.getElementById("myBtnContainerGen").style.display = "none";
        document.getElementById("myBtnContainerGen").style.opacity = "0";
        document.getElementById("prueba").style.opacity = "0";
        show2 = true;
    }

});
function resetFilters(){
    demo.innerHTML = content;
    removeClass("active");
    showAlert();
}

function showAlert() {
    var alertBox = document.getElementById("myAlert");
    alertBox.classList.add("show");
    setTimeout(function() {
      alertBox.classList.remove("show");
    }, 3000); // Oculta la alerta después de 3 segundos
  }

function restorePosition(){
    var position = sessionStorage.getItem("position");
    var poke = document.getElementsByClassName(`link-${position}`)[0];

    if(position != null){
        poke.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

async function startPokedex(){
    await givePokemons();
    await restorePosition();
}