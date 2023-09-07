const offset = 0;
var limit = 8;
const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

const load = document.querySelector("#loadMore");

inicial(url);

load.addEventListener("click",function(){
    const offset = limit;
    limit += 8;
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    inicial(url);
})


function convertPoke(pokemonDetail) {
    const pokemonModel = {}; 
    pokemonModel.order = pokemonDetail.order;
    pokemonModel.name = pokemonDetail.name;
    pokemonModel.types = pokemonDetail.types.map((typeSlot) => typeSlot.type.name);
    const types = pokemonDetail.types.map((typeSlot) => typeSlot.type.name);
    const {type} = types;
    pokemonModel.type = type;
    pokemonModel.photo = pokemonDetail.sprites.other.dream_world.front_default;
    return pokemonModel;
}

function createPokemonItem(pokemon) {
    const firstType = pokemon.types[0]; // Obtém o primeiro tipo
    return `<li class="${firstType}">
        <div class="nomes">                
            <span class="name">${pokemon.name}</span>
            <span class="numero">#${pokemon.order}</span>
        </div>
        <div class="detail">
            <div class="types">
                ${pokemon.types.map(type => `<span class="type ${type}">${type}</span>`).join('')}
            </div>
            <div>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </div>
    </li>`;
}


var entrada = document.querySelector("#pokeSelect");
var html = "";

function inicial(url){
    fetch(url)
    .then((response) => response.json())
    .then((response) => response.results)
    .then((pokemons) => {
        const pokemonPromises = pokemons.map((pokemon) =>
            fetch(pokemon.url)
                .then((response) => response.json())
                .then((pokemonDetail) => convertPoke(pokemonDetail))
        );
        return Promise.all(pokemonPromises);
    })
    .then((pokemon) => {
        for (var i = 0; i < pokemon.length; i++) {
            var pok = pokemon[i];
            html += createPokemonItem(pok);
        }
        entrada.innerHTML = html;
    })
    .catch((error) => {
        console.error('Erro:', error);
    });

}
