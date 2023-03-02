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

    var nombresPokemons = document.getElementsByClassName("poke");

    var divs = "";

    for(var i = 0; i < nombresPokemons.length; i++){

        if(nombresPokemons[i].innerHTML.includes(busqueda)){
            divs += "<div class=\"poke\">" + nombresPokemons[i].innerHTML + "</div>";
        }
    }

    if(busqueda == ""){
        mostrarPokemons();
    }else{
        document.getElementById("demo").innerHTML = divs;
    }
}