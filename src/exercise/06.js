// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'
import { fetchPokemon } from '../pokemon'
import { ErrorBoundary } from 'react-error-boundary'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [state, setState] = React.useState({pokemon: null, error: null, status: pokemonName ? 'pending' : 'idle'})
  const { pokemon, error, status} = state
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )

  React.useEffect(() => {
    if (status === 'rejected') throw new Error('pokemon rejected')
  }, [status])

  React.useEffect(() => {
    if (!pokemonName) return
    setState(current => ({...current, status: 'pending'}))

    fetchPokemon(pokemonName)
    .then(pokemon => {
      setState(current => ({...current, pokemon, status: 'resolved'}))
    })
    .catch(error => {
      setState(current => ({...current, error, status: 'rejected'}))
    })
  }, [pokemonName])
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  const renderPokemon = (() => {
    switch (status) {
      case 'idle':
        return <div>Submit a pokemon</div>
      case 'pending':
        return <PokemonInfoFallback name={pokemonName} />
      case 'resolved':
        return <PokemonDataView pokemon={pokemon} />
      case 'rejected':
        return renderError(error)
    
      default:
        return <div>Submit a pokemon</div>
    }
  })()

  return renderPokemon
}

function renderError(error) {
  return (
    <div role="alert">
  There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
</div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  const handleErrorReset = () => {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <ErrorBoundary onReset={handleErrorReset} FallbackComponent={ErrorFallback} resetKeys={[pokemonName]}>
        <div className="pokemon-info">
          <PokemonInfo pokemonName={pokemonName} />
        </div>
      </ErrorBoundary>
    </div>
  )
}

export default App

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

class CustomErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  
  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }
  
  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }  
}