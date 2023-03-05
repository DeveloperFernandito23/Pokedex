//var pokemons = ["Charmander", "Bulbasaur", "Squirtle", "Pikachu"];
var pokemons = [];


/* function comparar ( a, b ){ return a - b; }
arr.sort( comparar );  // [ 1, 5, 40, 200 ]

NO BORRAR, ES PARA ORDENAR (PARA ACORDARME PARA HAZERLO)

*/

for(var i = 1; i <= 151;i++){
    fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`).then(res => res.json()).then(res => pokemons.push(res) );
}

function buscarPokemons(valor) {

    var divs = "";

    for(var i = 0; i < pokemons.length;i++){
        if(valor == undefined || pokemons[i].name.toUpperCase().includes(valor.toUpperCase())){
            divs += "<div class='poke'><a href='html/pokemon?numero=" + pokemons[i].id + "'><div class='image'><img src='" + pokemons[i].sprites.front_default + "' alt='Lo siento el pokemon: " + pokemons[i].name + " no está cargado'></div><div class='name'>" + pokemons[i].name + "</div> <div class='number'>#" + pokemons[i].id.toString().padStart(3, 0) + "</div> <div class='types'><div class='type'>Tipo</div></div> </a></div>";
        }  
    }

    /*for(var i = 0; i < pokemons.length;i++){
        if(valor == undefined || pokemons[i].name.toUpperCase().includes(valor.toUpperCase())){
           crearPokemon(pokemons[i]);
        }  
    }*/

    if (divs === "") {
        document.getElementById("demo").innerHTML = "<div class='alert'>¡No se encontraron pokémons!</div>";
    }else{
        document.getElementById("demo").innerHTML = divs;
    }
}

/* FERNANDITO ESTO DÉJALO, QUE YA ES MU TARDE Y NO SI NI PORQUE COÑO HE HECHO ESTO, MAÑANA LO MIRO XD
function datosPokemon(){
    var url = new URLSearchParams(window.location.search);

    var numero = url.get('numero');

    document.getElementById("pokemon").innerHTML = "hola" + numero;
}

function crearPokemon(pokemon){
    var listaPokemons = document.getElementById("demo");

    var bicho = document.createElement("div");
    bicho.classList.add("poke");

    var enlace = document.createElement("a");
    enlace.href = `html/pokemon?numero=${i + 1}`

    var divImagen = document.createElement("div");
    imagen.classList.add("image");

    var imagen = document.createElement("img");
    imagen.src = pokemon.sprites.front_default;
    imagen.alt = "Lo siento, el pokemon no ha sido encontrado :(";

    var nombre = document.createElement("div");
    nombre.classList.add("name");
    nombre.innerHTML = pokemon.name;

    var numero = document.createElement("div");
    numero.classList.add("number");
    numero.innerHTML = pokemon.id.toString().padStart(3, 0);

    var tipos = document.createElement("div");

    listaPokemons.appendChild(bicho);
    bicho.appendChild(enlace);
    enlace.appendChild(divImagen);
    enlace.appendChild(nombre);
    enlace.appendChild(numero);
    enlace.appendChild(tipos);
    divImagen.appendChild(imagen);
}

function traerPokemon(num){
    fetch(`https://pokeapi.co/api/v2/pokemon/${num}/`).then(res => res.json()).then(res => crearPokemon(res));
}*/