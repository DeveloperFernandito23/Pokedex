var pokemons = ["Charmander", "Bulbasaur", "Squirtle", "Pikachu"];

function mostrarPokemons() {

    var divs = "";

    for(var i = 0; i < pokemons.length;i++){
        divs += "<div class=\"poke\"> <a href='#'> <div class='image'><img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg'></div><div class='name'>" + pokemons[i] + "</div> <div class='number'>" + i + "</div> <div class='type'>Tipo</div> </a></div>";
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