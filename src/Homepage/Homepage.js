import React, { Component } from "react";
import axios from "axios";
import Modal from "../Modal/Modal";
import Backdrop from "../Backdrop/Backdrop";
import "./Homepage.css";
import ProgressBar from "react-bootstrap/ProgressBar";
import PokemonStatsModal from "../PokemonStatsModal/PokemonStatsModal";

const analytics = {
  pokemons: 151
};

export default class Homepage extends Component {
  state = {
    guessInputName: "",
    pokemonDeck: [],
    apiUrl: "https://pokeapi.co/api/v2/",
    getPokemon: "https://pokeapi.co/api/v2/pokemon/",
    pokeDeckApi: `pokemon?offset=0&limit=${analytics.pokemons}`,
    newPokemonName: "",
    guessedPokemons: 0,
    pokemonsLength: analytics.pokemons,
    newPokemonImage: "",
    deckShowed: false,
    statsShowed: false,
    pokemonId: "",
    error: false
  };

  componentDidMount() {
    this.fillPokeDeck();
  }

  fillPokeDeck = () => {
    axios
      .get(this.state.apiUrl + this.state.pokeDeckApi)
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
        console.log(error);
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

    alert("Wrong! Try Again!");
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

      axios.get(this.state.getPokemon + randomPokemonNumber).then(res => {
        this.setState({
          newPokemonName: res.data.name,
          newPokemonImage: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${
            res.data.id
          }.png`,
          guessInputName: ""
        });
      });
    }
  };

  handleSubmit(event) {
    event.preventDefault();
  }

  handleDeckShow = () => {
    this.setState({
      deckShowed: !this.state.deckShowed
    });
  };

  pokStatsHandler = id => {
    console.log(id);
    this.setState(
      {
        statsShowed: !this.state.statsShowed,
        pokemonId: id
      },
      console.log(this.state)
    );
  };

  render() {
    let error = <p style={{ textAlign: "center" }}> Something went wrong! </p>;
    return (
      <React.Fragment>
        {!this.state.error ? (
          <div className="Container ">
            <div className="row d-flex">
              <div className="p-3 Title">
                <h2>Guess That Pokemon!</h2>
                <div className="row d-flex justify-content-center Pokeimg">
                  <img
                    src={this.state.newPokemonImage}
                    alt={this.state.newPokemonImage}
                  />
                </div>
                <div className="Center row">
                  <form onSubmit={this.handleSubmit} className="d-flex">
                    <input
                      className="InputPokemon"
                      name="text"
                      placeholder="Pokemon's Name..."
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
                  </form>
                  <div>
                    <button
                      className="ShowMyDeck"
                      onClick={() => this.handleDeckShow()}
                    >
                      {" "}
                      Show my Deck{" "}
                    </button>
                  </div>

                  <div className="Guessed ">
                    <div className="">
                      <ProgressBar
                        variant="secondary"
                        className="ProgressBar"
                        now={this.state.guessedPokemons}
                      />{" "}
                      <div className="ProgressText">
                        {this.state.guessedPokemons} /{" "}
                        {this.state.pokemonsLength}{" "}
                      </div>
                    </div>
                  </div>
                </div>

                <Modal
                  showed={this.state.deckShowed}
                  clicked={this.handleDeckShow}
                >
                
                  <h4> Your Deck! Click on them to see the stats! </h4>
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
                                onClick={() => this.pokStatsHandler(item.id)}
                                src={item.image}
                                alt={item.name}
                              />
                            </div>
                          ) : (
                            <div className="PokeHidden card p-3 align-text-center">
                              {" "}
                              ?{" "}
                            </div>
                          )}
                        </React.Fragment>
                      </div>
                    ))}
                  </div>
                </Modal>

                <Backdrop
                  showed={this.state.deckShowed}
                  clicked={this.handleDeckShow}
                />

                <React.Fragment>
                  {this.state.statsShowed ? (
                    <PokemonStatsModal
                      showedStats={this.state.statsShowed}
                      pokemonId={this.state.pokemonId}
                      clicked={() => this.pokStatsHandler()}
                    />
                  ) : null}
                </React.Fragment>
              </div>
            </div>
          </div>
        ) : (
          error
        )}
      </React.Fragment>
    );
  }
}
