let pokemonRepository = (function() {
  let pokemonList = [
      {name:'Bulbasaur', height:'0.7', weight: '6.9', type:['Grass', 'Poison']},
      {name:'Ivysaur', height:'1', weight: 13, type: ['Grass', 'Poison']},
      {name:'Venusaur', height:'2', weight:'100', type: ['Grass', 'Poison']},
    ]})

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


pokemonRepository.getAll().forEach(function(pokemon){ 
  document.write('<p>' + pokemon.name + " Height:" + pokemon.height + "m Weight:" + pokemon.weight + " Types:" + pokemon.types)
})