import { useState, useEffect } from 'react' 
import styled from 'styled-components'
import Rect from '../rect/Rect'

interface IProps {
    reset: boolean
}

const Grid: React.FC<IProps> = ({reset}) => {
    const [rows, setRows] = useState([...Array(15)]) 
    const [cols, setCols] = useState([...Array(15)])
    const [gameStarted, setGameStarted] = useState(false)
    const [bombs, setBombs] = useState<Number>(50)
    const [placedBombs, setPlacedBombs] = useState<Number[]>()
    const [clickedRow, setClickedRow] = useState<Number>()
    const [clickedCol, setClickedCol] = useState<Number>()
    const [arrayOfInitialRects, setArrayOfInitialRects] = useState<{row: number, col: number}[]>()
    const [gameOver, setGameOver] = useState<boolean>(false)







    // DOKONCI RESET HRY 
    useEffect(() => {
        if(reset) {
            setGameStarted(false)
            setPlacedBombs(undefined)
            setClickedRow(undefined)
            setClickedCol(undefined)
        }
    },[reset])
    
  


    const handleShowInitialRowsAndCols = (row: Number, col: Number) => {
        if(row === 1 && col === 1) {
            const arr = [{row: 2, col: 1}, { row: 2, col: 2}, {row: 1, col: 2}]
            setArrayOfInitialRects(arr)
        }
    }






    const handleOnClicked = (index: {row: Number, col: Number, index: Number}) => {
        setClickedRow(index.row)
        setClickedCol(index.col)

        if(!gameStarted) {
            placeMines(index.index);
            setGameStarted(true)
        }
    }


    const placeMines = (initialIndex: Number) => {
        const rects = 225
        let availableBombIndexes: number[] = []
        const data: {row: number, col: number, index: number}[] = []

        for(let i = 1; i <= rects; i++) {
            availableBombIndexes.push(i)
        }

        // pole dostupnych indexov pre bomby
        availableBombIndexes = availableBombIndexes.filter(b => { 
            if(b > 1) {
                return !(b <= +initialIndex - 3 && b >= +initialIndex + 3)
            } else if(b === 1) {
                return !(b <= +initialIndex + 2)
            } else if( b === 225) {
                return !(b >= +initialIndex - 2 )
            }
        })



        let arrayWithBombs = []
        let random 
        for(let i = 0; i <= bombs; i++) {
            random = Math.floor(Math.random() * availableBombIndexes.length) 
            if(random !== initialIndex && arrayWithBombs.length < bombs) {
                arrayWithBombs.push(random)
            }
        }
        //remove duplicates
        let arrayWithoutDuplicatedBombs = [...new Set(arrayWithBombs)]

        // urob to kym pole nebude mat 50 prvkov bez opakovania 
        if(arrayWithBombs.length < 50) {
            arrayWithBombs = []

            while(arrayWithBombs.length < 50) {
                for(let i = 0; i <= bombs; i++) {
                    random = Math.floor(Math.random() * availableBombIndexes.length) 
                    if(random !== initialIndex && arrayWithBombs.length < bombs) {
                        arrayWithBombs.push(random)
                    }
                }
                arrayWithoutDuplicatedBombs = [...new Set(arrayWithBombs)]
            }
        }
        setPlacedBombs(arrayWithoutDuplicatedBombs)
    }



    const makeGrid = () => {
        return (
            cols.map((c:Number, colIndex: Number) => {
                return (
                    <div>
                    {
                        rows.map((r: Number, rowIndex: Number) => { 
                            return <Rect 
                                col={+colIndex + 1} 
                                row={+rowIndex + 1} 
                                clicked={(data: {row: Number, col: Number, index: Number}) => handleOnClicked(data)} 
                                bombs={placedBombs}
                                showBombs={() => setGameOver(true)}
                                gameOver={gameOver}
                                gameStarted={gameStarted}
                            />})
                    }
                </div>
            )
        })
        )
    }

    return (
        <Wrapper>
            { makeGrid() }
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex
`
export default Grid