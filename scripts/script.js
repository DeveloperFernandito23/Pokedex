var pokemons = ["Charmander", "Bulbasaur", "Squirtle", "Pikachu"];

function mostrarPokemons() {

    var divs = "";

    for(var i = 0; i < pokemons.length;i++){
        divs += "<div class=\"poke\">" + pokemons[i] + "</div>";
   }

   document.getElementById("demo").innerHTML = divs;
}

function buscarPokemons(busqueda){

    var nombresPokemons = [];

    for(var i = 0; i < pokemons.length; i++){
        nombresPokemons[i] = document.getElementsByClassName("poke")[i].innerHTML;

        if(nombresPokemons[i].includes(busqueda)){
            document.getElementById("mostrar").innerHTML += nombresPokemons[i];
        }
    }
}