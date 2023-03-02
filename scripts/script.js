var pokemons = ["Charmander", "Bulbasaur", "Squirtle", "Pikachu"];

function mostrarPokemons() {

    var divs = "";

    for(var i = 0; i < pokemons.length;i++){
        divs += "<div class=\"poke\">" + pokemons[i] + "</div>";
   }

   document.getElementById("demo").innerHTML = divs;
}

function buscarPokemons(){

    var nombresPokemons = [];

    var busqueda = document.getElementById("search").innerHTML;

    for(var i = 0; i < 10; i++){
        nombresPokemons[i] = document.getElementsByClassName("poke")[i].innerHTML;

        if(nombresPokemons[i].includes(busqueda)){
            console.log(nombresPokemons[i]);
        }
    }




}