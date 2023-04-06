let pokemonRepository = (function () {
  let pokemonList = [
    { name: 'Venusaur', height: 2, weight: 100, types: ['grass', 'poison']},
    { name: 'Charizard', height: 1.7, weight: 90.5, types: ['monster', 'dragon']},
    { name: 'Blastoise', height: 1.6, weight: 88.5, types: ['monster', 'water']},
  ];

  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  return {
    add: add,
    getAll: getAll
  };
})();


pokemonRepository.getAll().forEach(function(pokemon){ 
  document.write('<p>' + pokemon.name + " Height:" + pokemon.height + "m Weight:" + pokemon.weight + " Types:" + pokemon.types)
})