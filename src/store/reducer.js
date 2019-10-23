const analytics = { 
    pokemons: 151
  };
  
  
  const initialState = {
    deckShowed: false,
    statsShowed: false,
    pokemonId: '',
    apiUrl: "https://pokeapi.co/api/v2/",
    getPokemon: "https://pokeapi.co/api/v2/pokemon/",
    pokeDeckApi: `pokemon?offset=0&limit=${analytics.pokemons}`,
    pokemonsLength: analytics.pokemons
  };
  
  const reducer = (state = initialState, action) => {

  switch (action.type)
  {
  case 'SHOWDECK':
  return {
      ...state,
      deckShowed: !state.deckShowed
      };

    case 'SHOWSTATS':
    return {
      ...state,
      statsShowed: !state.statsShowed,
      pokemonId: action.pokemonId
    }
  case 'GUESSEDPOKEMONS':
  return {
    ...state, 
    guessedPokemons: state.guessedPokemons + 1
  }
       default: 
    return state;
    
    }
    
  };
  
  
  export default reducer;
  