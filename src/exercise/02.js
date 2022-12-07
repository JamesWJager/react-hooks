// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// const useLocalStorage = key => {
//   const [value, setValue] = React.useState()
//   const getLocalStorage = React.useCallback(key => {
//     console.log('get from local')
//     return window.localStorage.getItem(key)
//   }, [])

//   const setLocalStorage = React.useCallback((key, value) => {
//     window.localStorage.setItem(key, value)
//   }, [])

//   React.useEffect(() => {
//     setValue(getLocalStorage(key))
//   }, [key, getLocalStorage])

//   return [getLocalStorage, setLocalStorage]
// }

const useLocalStorageState = (
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  console.log('render')
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName
  // const [getFromLocal, setToLocal] = useLocalStorage('name')
  // const [name, setName] = React.useState(
  //   () => getFromLocal('name') ?? initialName,
  // )
  const [name, setName] = useLocalStorageState('name', initialName)

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)

  // React.useEffect(() => {
  //   console.log('calling useEffect');
  //   setToLocal('name', name)
  // }, [name, setToLocal])

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  const [count, setCount] = React.useState(0)
  return (
    <>
      <button onClick={() => setCount(current => current + 1)}>{count}</button>
      <Greeting />
    </>
  )
}

export default App
