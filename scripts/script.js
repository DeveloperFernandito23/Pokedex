var pokemons = ["Charmander", "Bulbasaur", "Squirtle", "Pikachu"];

function buscarPokemons(valor) {

    var divs = "";

    for(var i = 0; i < pokemons.length;i++){
        if(valor == undefined || pokemons[i].toUpperCase().includes(valor.toUpperCase())){
            divs += "<div class='poke'> <a href='#'> <div class='image'><img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg'></div><div class='name'>" + pokemons[i] + "</div> <div class='number'>" + (i + 1) + "</div> <div class='types'><div class='type'>Tipo</div></div> </a></div>";
        }  
    }

    if (divs === "") {
        document.getElementById("demo").innerHTML = "<div class='alert'>¡No se encontraron pokémons!</div>";
    }else{
        document.getElementById("demo").innerHTML = divs;
    }
}