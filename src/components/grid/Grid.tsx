import { useState, useEffect } from 'react' 
import styled from 'styled-components'
import Rect from '../rect/Rect'
import Smiley from '../../img/smile.png'



const Grid: React.FC = () => {
    const [rows, setRows] = useState([...Array(15)]) 
    const [cols, setCols] = useState([...Array(15)])
    const [gameStarted, setGameStarted] = useState(false)
    const [bombs, setBombs] = useState<Number>(50)
    const [flagsLeft, setFlagsLeft] = useState<Number>(50)
    const [placedBombs, setPlacedBombs] = useState<Number[]>()
    const [clickedRow, setClickedRow] = useState<Number>()
    const [clickedCol, setClickedCol] = useState<Number>()
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [adjectIndexes, setAdjecentIndexes] = useState<Number[]>()
    const [activeRestartStyle, setActiveRestartStyle] = useState<{bl: String, bt: String, br: String, bb: String, bg: String}>({bl: '2px solid #eee', bt: '2px solid #eee', br: '2px solid gray', bb: '2px solid gray', bg:'#bbb'})
    const [reset, setReset] = useState<boolean>(false)
    const [time, setTime] = useState<Number>(0)
    const [timerIntervalId, setTimerIntervalId] = useState(0)
    const [bobmsArePlaced, setBombsArePlaced] = useState<boolean>(false)
    const [compeleteArrayToCheck, setCompleteArrayToCheck] = useState<Number[]>([])
    const [flaggedBombs, setFlaggedBombs] = useState<Number[]>([])


    useEffect(() => {
        if(reset) {
            setGameStarted(false)
            setPlacedBombs(undefined)
            setClickedRow(undefined)
            setClickedCol(undefined)
            window.clearInterval(timerIntervalId)
            setTime(0)
            setFlagsLeft(bombs)
            setBombsArePlaced(false)
            setFlaggedBombs([])
        }
    },[reset])
    
    useEffect(() => {
        if(bombs) {
            setFlagsLeft(bombs)
        }
    },[])
    
    useEffect(() => {
        if(placedBombs && placedBombs.length > 0) {
            setBombsArePlaced(true)
        }
    }, [placedBombs])


    useEffect(() => {
        if(time === 999) {
            window.clearInterval(timerIntervalId)
        }
    }, [time])

    useEffect(() => {
       if(gameStarted && !gameOver) {
           setTimerIntervalId(countInterval())
        }
       if(gameOver && timerIntervalId !== undefined) {
            window.clearInterval(timerIntervalId)
       }
    }, [gameStarted, gameOver])

    const countInterval = () => {
       return window.setInterval(() => {
            setTime(state => +state + 1)
        }, 1000)
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

        let arrayWithBombs = []
        let random 
        for(let i = 0; i <= bombs; i++) {
            random = Math.floor(Math.random() * availableBombIndexes.length) 
            if(random !== initialIndex && random !== +initialIndex - 1 && random !== +initialIndex + 1 && arrayWithBombs.length < bombs) {
                if(random !== +initialIndex + 15 && random !== +initialIndex - 15 ) {
                    if(random !== +initialIndex + 14 && random !== +initialIndex - 16 ) {
                        if(random !== +initialIndex + 16 && random !== +initialIndex - 14 ) {
                            arrayWithBombs.push(random)
                        }
                    }
                }
            }
        }
        //remove duplicates
        let arrayWithoutDuplicatedBombs = [...new Set(arrayWithBombs)]

        // urob to kym pole nebude mat 50 prvkov bez opakovania 
        if(arrayWithBombs.length < bombs) {
            arrayWithBombs = []

            while(arrayWithBombs.length < bombs) {
                for(let i = 0; i <= bombs; i++) {
                    random = Math.floor(Math.random() * availableBombIndexes.length) 
                    if(random !== initialIndex && random !== +initialIndex - 1 && random !== +initialIndex + 1 && arrayWithBombs.length < bombs) {
                        if(random !== +initialIndex + 15 && random !== +initialIndex - 15 ) {
                            if(random !== +initialIndex + 14 && random !== +initialIndex - 16 ) {
                                if(random !== +initialIndex + 16 && random !== +initialIndex - 14 ) {
                                    arrayWithBombs.push(random)
                                }
                            }
                        }
                    }
                }
                arrayWithoutDuplicatedBombs = [...new Set(arrayWithBombs)]
            }
        }
        setPlacedBombs(arrayWithoutDuplicatedBombs)
    }
    

    // po kliku na prazdne policko, zisti hodnotu susediacich policok
    const handleClickedOnZero = (initialIndex: Number) => {
        let arrayOfAdjecentRects: Number[] = []
        // lavy horny roh
        if(+initialIndex === 1) {
            arrayOfAdjecentRects = [2, 16, 17]
        
        //ak nie je v rohu a ak nie je na zaciatku alebo konci riadku
        } else if(+initialIndex > 1 && +initialIndex < 225 && +initialIndex % 15 !== 0 && +initialIndex % 15 !== 1) {
            arrayOfAdjecentRects = [+initialIndex - 16, +initialIndex - 15, +initialIndex - 14, +initialIndex - 1, +initialIndex + 1, +initialIndex + 14, +initialIndex + 15, +initialIndex + 16]
            arrayOfAdjecentRects = arrayOfAdjecentRects.filter(i => i > 0)
            arrayOfAdjecentRects = arrayOfAdjecentRects.filter(i => i < 225)
        // pravy dolny riadok
        } else if(+initialIndex === 225) {
            arrayOfAdjecentRects = [+initialIndex - 16, +initialIndex - 15, +initialIndex - 1]
        // koniec riadku
        } else if(+initialIndex % 15 === 0) {
            arrayOfAdjecentRects = [+initialIndex - 16, +initialIndex - 15, +initialIndex - 1, +initialIndex + 14, +initialIndex + 15 ]
            arrayOfAdjecentRects = arrayOfAdjecentRects.filter(i => i > 0)
            arrayOfAdjecentRects = arrayOfAdjecentRects.filter(i => i < 225)
        //zaciatok riadku
        } else if(+initialIndex % 15 === 1) {
            arrayOfAdjecentRects = [+initialIndex - 15, +initialIndex - 14, +initialIndex + 1, +initialIndex + 15, +initialIndex + 16]
            arrayOfAdjecentRects = arrayOfAdjecentRects.filter(i => i > 0)
            arrayOfAdjecentRects = arrayOfAdjecentRects.filter(i => i < 225)
        }
        let sorted = arrayOfAdjecentRects.sort((a, b) => +a - +b)
        setAdjecentIndexes(sorted)
        setCompleteArrayToCheck(state => [...new Set(state.concat(sorted))].sort((a, b) => +a - +b))
    }



    const makeGrid = () => {
        return (
            <div style={{display: 'flex', borderTop: '2px solid #777', borderLeft: '2px solid #777', borderRight: '2px solid white', borderBottom: '2px solid white'}}>
                {
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
                                clickedOnZero={(index: Number) => handleClickedOnZero(index)}
                                
                                index={+rowIndex + 1 === 1 ? (15 / 15) * +colIndex + 1 : 15 * (+rowIndex + 1 - 1) + +colIndex + 1 }
                                flagsLeft={flagsLeft}
                                adjecentIndexes={adjectIndexes}
                                checkAdjecent={adjectIndexes !== undefined ? adjectIndexes.some(i => i == (+rowIndex + 1 === 1 ? (15 / 15) * +colIndex + 1 : 15 * (+rowIndex + 1 - 1) + +colIndex + 1) ? true : false) : null}
                                completeArray={compeleteArrayToCheck}
                                sendCorrectFlaggedBomb={(index: Number) => handleAddCorretFlaggedBomb(index)}
                                removeCorrectFlaggedBomb={(index: Number) => handleRemoveCorrectFlaggedBomb(index)}
                                useFlag={() => setFlagsLeft(state => +state - 1) }
                                restart={reset}
                                substractFlagCount={() => setFlagsLeft(state => +state - 1)}
                                addFlagCount={() => setFlagsLeft(state => +state + 1)}
                                bobmsArePlaced={bobmsArePlaced}
                                />})
                            }
                </div>
            )
        })
        }   
        </div>
        )
    }

    const handleRestartGame = () => {
        setActiveRestartStyle({bl: '2px solid gray', bt: '2px solid gray', br: '1px solid gray', bb: '1px solid gray', bg: '#bbb'})
        setReset(true)
        setTimeout(() => {
            setReset(false)
        },100)
        if(gameOver) {
            setGameOver(false)
        }
        setAdjecentIndexes([])
        setCompleteArrayToCheck([])
        if(gameStarted) {
            setGameStarted(false)
        }
    }   

    const handleCheckIfUserWon = () => {
        let placedBombsString;
        let flaggedBombsString;
        if(placedBombs !== undefined) {
            placedBombsString = placedBombs.sort((a, b) => +a - +b).toString()
        }

        if(flaggedBombs !== undefined) {
            flaggedBombsString = flaggedBombs.sort((a, b) => +a - +b).toString()
        }
        if(placedBombsString === flaggedBombsString) {
            alert('You won!')
            setGameOver(true)
            window.clearInterval(timerIntervalId)

        }
    }


    const handleAddCorretFlaggedBomb = (i: Number) => {
        setFlaggedBombs(state => { return [...flaggedBombs, i]})
    }
    useEffect(() => {
        if(flaggedBombs !== undefined && flaggedBombs.length > 0) {
            handleCheckIfUserWon()
        }
    }, [flaggedBombs])

    const handleRemoveCorrectFlaggedBomb = (i: Number) => {
        const withoutFlag = flaggedBombs.filter(el => el !== i)
        setFlaggedBombs(withoutFlag)
    }

    return (
        <div>
            <Header>
                <Inner>
                    <Counter>{ flagsLeft && flagsLeft }</Counter>
                    <Restart
                        onMouseDown={handleRestartGame} 
                        onMouseUp={() => setActiveRestartStyle({bl: '2px solid white', bt: '2px solid white', br: '2px solid gray', bb: '2px solid gray', bg:'#bbb'})}
                        onMouseLeave={() => setActiveRestartStyle({bl: '2px solid white', bt: '2px solid white', br: '2px solid gray', bb: '2px solid gray', bg:'#bbb'})}
                        bl={activeRestartStyle.bl}
                        bt={activeRestartStyle.bt}
                        br={activeRestartStyle.br}
                        bb={activeRestartStyle.bb}
                        bg={activeRestartStyle.bg}
                        >
                        <img src={Smiley} width="17" />
                        </Restart>
                <Counter>{time}</Counter>
                </Inner>

            </Header>
            <Wrapper>
                { makeGrid() }
            </Wrapper>
            </div>
        )
    }

    const Wrapper = styled.div`
        display: flex;
        padding: .4rem;
        padding-top: .2rem;
        background: #bbb;
        border-bottom: 2px solid grey;
        border-right: 2px solid grey;
        border-left: 2px solid #eee;
    `
        
    const Header = styled.div`
        padding: .4rem;
        background: #bbb;
        border-top: 2px solid #eee;
        border-right: 2px solid grey;
        border-left: 2px solid #eee;
        &::selection {
            user-select: none
        }
    `
    const Inner = styled.div`
        display: flex;
        padding-left: .2rem;
        padding-right: .2rem;
        justify-content: space-between;
        align-items: center;
        width: 96.9%;
        height: 2rem; 
        background: lightgray;
        border-right: 2px solid white;
        border-bottom: 2px solid white;
        border-left: 2px solid grey;
        border-top: 2px solid grey;
    `
        
    const Counter = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 1.2rem;
        color: red;
        background: #4e1717;
        width: 11%;
        height: 80%;
        &::selection {
            user-select: none
        }
    `
    interface RestartProps {
        bl: String,
        bt: String,
        br: String,
        bb: String,
        bg: String
    }

    const Restart = styled.div<RestartProps>`
        display: flex;
        justify-content: center;
        align-items: center;
        width: 7%;
        height: 80%;
        background: ${props => props.bg && `${props.bg}`};
        border-left: ${props => props.bl && `${props.bl}`};
        border-top: ${props => props.bt && `${props.bt}`};
        border-right: ${props => props.br && `${props.br}`};
        border-bottom: ${props => props.bb && `${props.bb}`};
        &::selection {
            user-select: none
        }
    `
        
export default Grid