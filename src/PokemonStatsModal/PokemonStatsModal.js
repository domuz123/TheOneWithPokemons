import React from "react";
import "./PokemonStatsModal.css";
import PokemonStats from "../PokemonStats/PokemonStats";

const PokemonStatsModal = props => (
  <div>
    <div
      className="Modal"
      style={{
        transform: props.showedStats ? "translateY(0)" : "translateY(-100vh)",
        opacity: props.showedStats ? "1" : "0"
      }}
    >
      <PokemonStats pokemonId={props.pokemonId} />
      <div onClick={props.clicked} className='Xbutton'>  </div>
    </div>
  </div>
);

export default PokemonStatsModal;
