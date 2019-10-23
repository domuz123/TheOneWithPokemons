import React, { Component } from "react";
import axios from "axios";
import Modal from "../Modal/Modal";
import Backdrop from "../Backdrop/Backdrop";
import "./Homepage.css";
import ProgressBar from "react-bootstrap/ProgressBar";
import PokemonStatsModal from "../PokemonStatsModal/PokemonStatsModal";
import { connect } from "react-redux";
import Swal from 'sweetalert2' 


class Homepage extends Component {
  state = {
    guessInputName: "",
    pokemonDeck: [],
    newPokemonName: "",
    guessedPokemons: 0,
    newPokemonImage: "",
    error: false
  };

  componentDidMount() {
    this.fillPokeDeck();
  }

  fillPokeDeck = () => {
    axios
      .get(this.props.apiUrl + this.props.pokeDeckApi)
      .then(res => {
        // get pokemon id
        res.data.results.map((pokemon, index) => {
          pokemon.id = index + 1;
          pokemon.isGuessed = false;
          pokemon.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${index +
            1}.png`;
        });

        this.setState({
          pokemonDeck: res.data.results
        });

        this.generateNewPokemon();
      })
      .catch(error => {
        this.setState({
          error: true
        });
      });
  };

  guessInputChange = event => {
    this.setState({
      guessInputName: event.target.value
    });
  };

  guessPokemon = () => {
    let guessText = this.state.guessInputName.toLowerCase();
    let pokemonDeck = [...this.state.pokemonDeck];
    let findPokomenName = pokemonDeck.find(pokemon => {
      return (
        pokemon.name.toLowerCase() === this.state.newPokemonName &&
        pokemon.name.toLowerCase() === guessText
      );
    });

    this.handlePokemonInput(findPokomenName, pokemonDeck);
  };

  handlePokemonInput = (pokemon, pokemonDeck) => {
    if (pokemon) {
      if (pokemon.isGuessed) {
        return false;
      } else {
        let guessedPokemons = this.state.guessedPokemons;
        pokemonDeck.find(newPokemon => {
          if (newPokemon.id === pokemon.id) {
            newPokemon.isGuessed = true;
            guessedPokemons = guessedPokemons + 1;
            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Right! Good Job!',
              showConfirmButton: false,
              timer: 1500
            })
          }
        });
        this.setState(
          {
            pokemonDeck: pokemonDeck,
            guessedPokemons
          },
          () => {
            this.generateNewPokemon();
          }
        );

        return false;
      }
    }

    Swal.fire({
      position: 'center',
      type: 'error',
      title: 'Wrong! Try again!',
      showConfirmButton: false,
      timer: 1500
    });
    return false;
  };

  generateNewPokemon = () => {
    let areAllPokemonsGuessed = this.state.pokemonDeck.some(
      pokemen => !pokemen.isGuessed
    );

    if (areAllPokemonsGuessed) {
      let randomPokemonNumber = Math.floor(
        Math.random() * this.state.pokemonDeck.length + 1
      );
      let randomPokemon = this.state.pokemonDeck[randomPokemonNumber - 1];
      if (randomPokemon) {
        if (randomPokemon.isGuessed) {
          this.generateNewPokemon();
          return;
        }
      }

      axios.get(this.props.getPokemon + randomPokemonNumber).then(res => {
        this.setState({
          newPokemonName: res.data.name,
          newPokemonImage: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${
            res.data.id
          }.png`,
          guessInputName: ""
        });
      })
    }
  };

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {

    const error = <h1 style={{color:'white'}}> <strong> Something went wrong! </strong> </h1>
    
    return (
      <React.Fragment>
        {!this.state.error ? (
          <div className="container ">
          <div className='row justify-content-center'> 
       
              <div className="Title">
                {this.state.newPokemonName}
                <h2>Guess That Pokemon!</h2>
                <div className="justify-content-center Pokeimg">
                  <img
                    src={this.state.newPokemonImage}
                    alt={this.state.newPokemonImage}
                  />
                </div>
                <div className="Center">
                  <form onSubmit={this.handleSubmit} className="">
                  <div className='Input-Guess'> 
                    <input
                      className="InputPokemon"
                      name="text"
                      value={this.state.guessInputName}
                      onChange={this.guessInputChange}
                    />
                    <div>
                
                      <button
                        className="GuessButton"
                        onClick={() => this.guessPokemon()}
                      >
                        Guess
                      </button>
                      </div>
                    </div>
                  </form>
                  <div>
                    <button
                      className="ShowMyDeck"
                      onClick={() => this.props.handleDeckShow()} >
                      Show my Deck
                    </button>
                  </div>
                  </div>
               
                  <div className="Guessed ">
                  
                      <ProgressBar
                        variant="secondary"
                        className="ProgressBar"
                        now={this.state.guessedPokemons}
                      />
                      <div className="ProgressText">
                        {this.state.guessedPokemons} /
                        {this.props.pokemonsLength}
                      </div>
               
                  </div>
                </div>

                <Modal
                  showed={this.props.deckShowed}
                  clicked={this.props.handleDeckShow}
                >
              
                  <h3> Your Deck! Click on them to see the stats! </h3>
                  <div className="Deck row justifiy-items-between">
                    {this.state.pokemonDeck.map(item => (
                      <div key={item.id} className="p-3">
                        <React.Fragment>
                          {item.isGuessed ? (
                            <div className="d-flex card p-3">
                              <h6>
                                {item.name
                                  .toLowerCase()
                                  .split(" ")
                                  .map(
                                    s =>
                                      s.charAt(0).toUpperCase() + s.substring(1)
                                  )
                                  .join(" ")}
                              </h6>
                              <img
                                className="ShowedImg"
                                onClick={() => this.props.pokStatsHandler(item.id)}
                                src={item.image}
                                alt={item.name}
                              />
                            </div>
                          ) : (
                            <div className="PokeHidden card p-3 align-text-center">
                             <span className='QuestionMark'> &#63; </span>
                            </div>
                          )}
                        </React.Fragment>
                      </div>
                    ))}
                  </div>
                </Modal>

                <Backdrop
                  showed={this.props.deckShowed}
                  clicked={this.props.handleDeckShow}
                />

                <React.Fragment>
                  {this.props.statsShowed ? (
                    <PokemonStatsModal
                      showedStats={this.props.statsShowed}
                      pokemonId={this.props.pokemonId}
                      clicked={() => this.props.pokStatsHandler()}
                    />
                  ) : null}
                </React.Fragment>
              </div>
            </div>
         
        ) : (
          
    error
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    deckShowed: state.deckShowed,
    statsShowed: state.statsShowed,
    pokemonId: state.pokemonId,
    apiUrl: state.apiUrl,
    getPokemon: state.getPokemon,
    pokeDeckApi: state.pokeDeckApi,
    pokemonsLength: state.pokemonsLength
  }; 
  }

 const mapDispatchToProps = dispatch => ({
  handleDeckShow: () => dispatch({type:'SHOWDECK'}),
  pokStatsHandler: (id) => dispatch({type:'SHOWSTATS', pokemonId: id}),
  handlePokemonInput: () => dispatch({type:'GUESSEDPOKEMONS'})
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);