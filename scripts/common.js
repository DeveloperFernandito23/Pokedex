//JS no tiene tipo enumerado, pero se puede usar esta sintaxis para dejarlo más claro
var TiposPokemon = {
    water: "Agua",
    bug: "Bicho",
    dragon: "Dragón",
    electric: "Eléctrico",
    ghost: "Fantasma",
    fire: "Fuego",
    ice: "Hielo",
    fighting: "Lucha",
    normal: "Normal",
    grass: "Planta",
    psychic: "Psíquico",
    rock: "Roca",
    ground: "Tierra",
    poison: "Veneno",
    flying: "Volador",
    fairy: "Hada",
    steel: "Acero"
}; 

compruebaTema(); // Lo primero que hace es comprobar el tema activo y lo ajusta a cual sea el elegido

function comprobarTipos(pokemon) {
    var tipos = document.getElementsByClassName("types");

    for(var i = 0; i < pokemon.types.length;i++){
        var tipo = document.createElement("div");
        tipo.classList.add("type");

        var style = pokemon.types[i].type.name;
        tipo.innerHTML = TiposPokemon[style];
        tipo.style.backgroundColor = `var(--${style})`;

        tipos[tipos.length - 1].appendChild(tipo);
    }
}

function compruebaTema(){
    const linkedStyle = document.getElementById("theme");
    const slider = document.getElementById("slide");

    if(localStorage.getItem('oscuro') == "true"){ // cuando está enabled me llama a cambiar el tema
        linkedStyle.href = "../styles/light.css";
        slider.checked = false;
    }
    else{
        linkedStyle.href = "../styles/dark.css";
        slider.checked = true   ;
    }
}

function changeTheme() {
    // Comentario de Jose 🙄 (24/03/2023)
    // Toggle true/false setitem oscuro

    const localValue = localStorage.getItem('oscuro');

    if(localValue == "true"){
        localStorage.setItem('oscuro', false);
        
    }
    else{
        localStorage.setItem('oscuro', true);
        slider.checked = false;
    }

    compruebaTema()
}