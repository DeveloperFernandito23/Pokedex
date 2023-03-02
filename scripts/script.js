var pokemons = ["Charmander", "Bulbasaur", "Squirtle", "Pikachu"];

function mostrarPokemons() {

    var divs = "";

    for(var i = 0; i < pokemons.length;i++){
        divs += "<div class=\"poke\">" + pokemons[i] + "</div>";
   }

   document.getElementById("demo").innerHTML = divs;
}

/*function mostrar(valor) {

    var divs = "";

    for(var i = 0; i < pokemons.length;i++){

        if(nombresPokemons[i].includes(busqueda)){
            mostrar(nombresPokemons[i]);
        }
    }

   document.getElementById("demo").innerHTML = divs;
}*/

function buscarPokemons(busqueda){

    var nombresPokemons = [];
    var cantidad = document.getElementsByClassName("poke").length;

    var divs = "";

    for(var i = 0; i < cantidad; i++){
        nombresPokemons[i] = document.getElementsByClassName("poke")[i].innerHTML;

        if(nombresPokemons[i].includes(busqueda)){
            divs += "<div class=\"poke\">" + nombresPokemons[i] + "</div>";
        }
    }

    if(busqueda == ""){
        mostrarPokemons();
    }else{
        document.getElementById("demo").innerHTML = divs;
    }
}