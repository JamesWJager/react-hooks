// useState: greeting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
import PropTypes from 'prop-types'

function Greeting(props) {
  const { initialName = '' } = props
  // 💣 delete this variable declaration and replace it with a React.useState call
  const [name, setName] = React.useState(initialName)
  const nameInputId = 'name'

  function handleChange({ target }) {
    const { value } = target
    // 🐨 update the name here based on event.target.value
    setName(value)
  }

  return (
    <div>
      <form>
        <label htmlFor={nameInputId}>Name: </label>
        <input onChange={handleChange} defaultValue={initialName} id={nameInputId} />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="James Jager" />
}

Greeting.propTypes = {
  initialName: PropTypes.string
}

export default App
