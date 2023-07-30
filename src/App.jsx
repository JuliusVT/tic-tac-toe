import { useEffect, useState } from "react"
import confetti from "canvas-confetti"
import { Square } from "./components/Square.jsx"
import { TURNS } from "./constants.js"
import { checkWinnerFrom, checkEndGame } from "./logic/board.js"
import { WinnerModal } from "./components/WinnerModal.jsx"
import { resetGameStorage, saveGameToStorage } from "./logic/storage.js"
import { Turn } from "./components/Turn.jsx"
import { Board } from "./components/Board.jsx"

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })

  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    resetGameStorage()
  }

  const updateBoard = (index) => {
    if(board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
  }

  const checkBoardCondition = () => {
    const newWinner = checkWinnerFrom(board)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if(checkEndGame(board)){
      setWinner(false)
    }
  }

  useEffect(() => {
    saveGameToStorage({
      board: board,
      turn: turn
    })
    checkBoardCondition()
  },[turn, board])

  return (
    <main className='board'>
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reset del juego</button>

      <Board 
        board={board}
        updateBoard={updateBoard}
      />

      <Turn 
        turn={turn}
      />

      <WinnerModal
        resetGame={resetGame}
        winner={winner}
      />
    </main>
  )
}

export default App
