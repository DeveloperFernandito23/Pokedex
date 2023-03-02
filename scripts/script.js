function mostrarPokemons() {

    var divs = "";

    for(var i = 0; i < 10;i++){

    if(i % 2 == 0){
        divs += "<div class=\"poke\">Hola</div>";
    }else{
        divs += "<div class=\"poke\">Adios</div>";
    }

   }

   document.getElementById("demo").innerHTML = divs;
}