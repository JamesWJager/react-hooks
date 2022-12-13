// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

import {useLocalStorageState} from '../utils'

const defaultSquares = Array(9).fill(null)

function Board(props) {
  const {onClick, squares} = props

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [currentStep, setCurrentStep] = useLocalStorageState("tic-tac-toe:step", 0)
  const [history, setHistory] = useLocalStorageState("tic-tac-toe:history", [defaultSquares])

  const currentSquares = history[currentStep]
    const winner = calculateWinner(currentSquares)
    const nextValue = calculateNextValue(currentSquares)
    const status = calculateStatus(winner, currentSquares, nextValue)

  function selectSquare(square) {
    if (calculateWinner(currentSquares) || currentSquares[square]) return
    const newHistory = history.slice(0, currentStep + 1)
    const squaresCopy = [...currentSquares]
    const value = calculateNextValue(currentSquares)

    squaresCopy[square] = value
    setHistory([...newHistory, squaresCopy])
    setCurrentStep(newHistory.length)
  }

  function restart() {
    setHistory([defaultSquares])
    setCurrentStep(0)
  }

  const moves = history.map((_, step) => {
    const desc = step === 0 ? 'Got to game start' : `Go to move #${step}`
    const isCurrentStep = step === currentStep
    return (<li key={step}>
      <button disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
        {desc} {isCurrentStep ? '(current)' : null}
      </button>
    </li>)
  })


  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={history[currentStep]} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
