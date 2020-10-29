import React, { Component } from 'react'
// import User from '../interfaces/User.interface' //SEE FILE FOR DETAILS ON DESCRIBING PROPS
import { css } from '@emotion/core'
interface SearchState {
  //Declaring types for state Object.
  error: boolean
  pokemon: Pokemon //NESTED INTERFACE SEE BELOW
}

interface Pokemon {
  name: string
  numberOfAbilities: number
  baseExp: number
  imageUrl: string
}

const style = {
  pokeDisplay: css`
    background: #blue;
    margin-bottom: 1.45rem;
  `,
}


export class PokemonSearch extends Component<SearchState> {
  pokemonRef: React.RefObject<HTMLInputElement> //REFERENCE TYPE
  constructor(props: any) {
    super(props)
    this.state = {
      error: false,
      pokemon: null,
    }
    this.pokemonRef = React.createRef()
  }

  onSearchClick = () => {
    const inputValue = this.pokemonRef.current.value //See 'StrictNullCheck' = false to disable error.
    fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}`).then((res) => {
      if (res.status !== 200 && this.state.pokemon == null) { //added null error check
        //Error Handling
        this.setState({ error: true })
        return
      }
      res.json().then((data) => {
        this.setState({
          //populating state via API properties.
          error: false,
          pokemon: {
            name: data.name,
            numberOfAbilities: data.abilities.length,
            baseExp: data.base_experience,
            imageUrl: data.sprites.front_default,
          },
        })
      }) 
    }) //sends request to API
  }

  render() {
    //DECLARING PROPS
    // const { name: userName, numberOfPokemons } = this.props //deconstructing props. name renamed to clear conflict
    const { error, pokemon } = this.state //deconstructing state.

    //ERROR CHECKING ALGORITHM
    let resultMarkup
    if (error) {
      resultMarkup = <p>Pokemon not found. Try Again</p>
    } else if (this.state.pokemon) {
      resultMarkup = (
        <div>
          <img src={pokemon.imageUrl} alt={pokemon.name}></img>
          <p>
            {pokemon.name} has {pokemon.numberOfAbilities} and Base EXP:
            {pokemon.baseExp}
          </p>
        </div>
      )
    }
    return (
      <div>
        <input type="text" ref={this.pokemonRef} required/>
        <button onClick={this.onSearchClick} className="my-button">
          Search
        </button>
        {console.log("RESULT:" + this.state.pokemon)}
        <div css="style.pokeDisplay">
           {resultMarkup} 
      </div>
        </div>
        
    )
  }
}

export default PokemonSearch
