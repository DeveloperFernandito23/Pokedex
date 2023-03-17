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