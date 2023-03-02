var pokemons = ["Charmander", "Bulbasaur", "Squirtle", "Pikachu"];

function mostrarPokemons() {

    var divs = "";

    for(var i = 0; i < pokemons.length;i++){
        divs += "<div class=\"poke\">" + pokemons[i] + "</div>";
   }

   document.getElementById("demo").innerHTML = divs;
}

function buscarPokemons(valor) {

    var divs = "";

    for(var i = 0; i < pokemons.length;i++){

        if(pokemons[i].toUpperCase().includes(valor.toUpperCase())){
            divs += "<div class=\"poke\">" + pokemons[i] + "</div>";
        }
    }

   document.getElementById("demo").innerHTML = divs;
}