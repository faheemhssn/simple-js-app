const pokemonRepository = (function () {
	let pokemonList = [];
	let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=300';

	function getAll() {
		return pokemonList;
	}

	function addNewPokemon(newPokemon) {
		if (typeof newPokemon !== 'object') {
			return console.log('Error: data was not of type object');
		}
		// Check if new Pokemon object has all the required keys.
		if (JSON.stringify(Object.keys(newPokemon)) !== JSON.stringify(['name', 'detailsUrl'])) {
			return console.log('Error: data was not in the correct format');
		}

		pokemonList.push(newPokemon);
	}

	function clearPokemonList() {
		const pokemonUl = document.querySelector('.pokemon-list');
		pokemonUl.innerHTML = '';
	}

	// Create a button for Pokemon and function when clicked then append it to the Pokemon list.
	function addListItem(pokemon) {
		const pokemonUl = document.querySelector('.pokemon-list');

		const listItem = document.createElement('li');
		const button = document.createElement('button');
		$(button).text(pokemon.name);
		$(button).addClass('button__primary list-group-item btn btn-dark');
		$(button).on('click', () => showDetails(pokemon));
		$(button).attr('data-toggle', 'modal');
		$(button).attr('data-target', '#pokedex-modal-container');

		$(listItem).append(button);
		$(pokemonUl).append(listItem);
	}

	// Open Pokemon Modal on click
	function showDetails(pokemon) {
		loadDetails(pokemon).then(() => {
			pokemonModal.showModal(pokemon);
		});
	}

	// Pull details about clicked Pokemon from API and add them to the clicked Pokemon object
	function loadDetails(pokemon) {
		showLoadingMessage();
		let url = pokemon.detailsUrl;
		return fetch(url)
			.then((response) => response.json())
			.then((details) => {
				pokemon.imageUrl = details.sprites.front_default;
				pokemon.height = details.height;
				pokemon.weight = details.weight;
				pokemon.types = details.types;
				hideLoadingMessage();
			})
			.catch((e) => {
				hideLoadingMessage();
				console.error(e);
			});
	}

	// Get a list of Pokemon from the Pokemon API and then add the data to Pokemon array.
	function loadList() {
		showLoadingMessage();
		return fetch(apiUrl)
			.then((response) => response.json())
			.then((json) => {
				json.results.forEach((item) => {
					let pokemon = {
						name: item.name,
						detailsUrl: item.url,
					};
					addNewPokemon(pokemon);
				});
				hideLoadingMessage();
			})
			.catch((e) => {
				hideLoadingMessage();
				console.error(e);
			});
	}

	// Search for a Pokemon by it's name.
	function search(searchInput) {
		clearPokemonList();
		const pokemonList = getAll();
		let filteredPokemonList = pokemonList.filter((pokemon) => pokemon.name.includes(searchInput.toLowerCase()));
		filteredPokemonList.forEach((pokemon) => {
			addListItem(pokemon);
		});
	}

	function showLoadingMessage() {
		const messageContainer = document.getElementById('loading-message').classList;
		messageContainer.remove('hide-loading-message');
		messageContainer.add('show-loading-message');
	}

	function hideLoadingMessage() {
		const messageContainer = document.getElementById('loading-message').classList;
		messageContainer.remove('show-loading-message');
		messageContainer.add('hide-loading-message');
	}

	return {
		getAll: getAll,
		addNewPokemon: addNewPokemon,
		search: search,
		addListItem: addListItem,
		loadList: loadList,
		loadDetails: loadDetails,
	};
})();

// Start of the Pokemon Modal.
const pokemonModal = (function () {
	function makePokemonImg({ imageUrl }) {
		const imgContainer = document.querySelector('.pokemon-img-container');
		let pokemonImg = document.createElement('img');
		$(pokemonImg).attr('src', imageUrl).addClass('pokemon-img');
		$(imgContainer).append(pokemonImg);

		return imgContainer;
	}

	function makePokemonHeightAndWeight({ height, weight }) {
		const physicalTraitContainer = document.querySelector('#about-screen');
		let pysicalTraits = `Height: ${height}` + '<br>' + `Weight: ${weight}`;
		physicalTraitContainer.innerHTML = pysicalTraits;

		return physicalTraitContainer;
	}

	function makePokemonType({ types }) {
		const typeContainer = document.querySelector('#type-screen');
		$(typeContainer).text(types[0].type.name);

		return typeContainer;
	}

	function makeModalCloseButton() {
		let buttonContainer = document.querySelector('.modal-body');

		const closeButtonElement = document.createElement('button');
		$(closeButtonElement).addClass('pokedex-modal-close button__primary btn btn-dark');
		$(closeButtonElement).text('Close');
		$(closeButtonElement).attr('data-dismiss', 'modal');
		$(buttonContainer).append(closeButtonElement);
	}

	function showModal(props) {
		// Clear previous pokemon before adding new one to modal
		hideModal();

		// Make and edit all details in modal.
		makePokemonImg(props);
		makePokemonHeightAndWeight(props);
		makePokemonType(props);
		makeModalCloseButton();
	}

	// Clear the previous modal content
	function hideModal() {
		if (document.querySelector('.pokedex-modal-close')) {
			document.querySelector('.pokedex-modal-close').remove();
		}

		if (document.querySelector('.pokemon-img')) {
			document.querySelector('.pokemon-img').remove();
		}

		if (document.querySelector('#about-screen').innerHTML) {
			document.querySelector('#about-screen').innerHTML = '';
		}

		if (document.querySelector('#type-screen').innerHTML) {
			document.querySelector('#type-screen').innerHTML = '';
		}
	}

	return {
		showModal: showModal,
		hideModal: hideModal,
	};
})();

// Get Pokemon from API add to local storage and then display them into a list onto page.
pokemonRepository.loadList().then(() => {
	pokemonRepository.getAll().forEach((pokemon) => {
		pokemonRepository.addListItem(pokemon);
	});
});

// Add input event to search input
const searchInput = document.getElementById('name-input');
searchInput.addEventListener('input', (event) => {
	pokemonRepository.search(event.target.value);
});
