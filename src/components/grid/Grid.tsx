import { useState, useEffect } from 'react' 
import styled from 'styled-components'
import Rect from '../rect/Rect'
import Smiley from '../../img/smile.png'

interface IProps {
    reset: boolean
}

const Grid: React.FC<IProps> = ({reset}) => {
    const [rows, setRows] = useState([...Array(15)]) 
    const [cols, setCols] = useState([...Array(15)])
    const [gameStarted, setGameStarted] = useState(false)
    const [bombs, setBombs] = useState<Number>(50)
    const [flagsLeft, setFlagsLeft] = useState<Number>(50)
    const [placedBombs, setPlacedBombs] = useState<Number[]>()
    const [clickedRow, setClickedRow] = useState<Number>()
    const [clickedCol, setClickedCol] = useState<Number>()
    const [arrayOfInitialRects, setArrayOfInitialRects] = useState<{row: number, col: number}[]>()
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [adjectIndexes, setAdjecentIndexes] = useState<Number[]>()
    const [activeRestartStyle, setActiveRestartStyle] = useState<{bl: String, bt: String, br: String, bb: String, bg: String}>({bl: '2px solid #eee', bt: '2px solid #eee', br: '2px solid gray', bb: '2px solid gray', bg:'#bbb'})

    // DOKONCI RESET HRY 
    useEffect(() => {
        if(reset) {
            setGameStarted(false)
            setPlacedBombs(undefined)
            setClickedRow(undefined)
            setClickedCol(undefined)
        }
    },[reset])
    
    useEffect(() => {
        if(bombs) {
            setFlagsLeft(bombs)
        }
    },[])

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

    const handleClickedOnZero = (initialIndex: number) => {
        let arrayOfAdjecentRects: Number[] = []
        
        if(initialIndex === 1) {
            arrayOfAdjecentRects = [1, 16, 17]
        } else if(initialIndex > 1 && initialIndex < 225 && initialIndex % 15 !== 0 && initialIndex % 15 !== 1) {
            arrayOfAdjecentRects = [initialIndex - 16, initialIndex - 15, initialIndex - 14, initialIndex - 1, initialIndex + 1, initialIndex + 14, initialIndex + 15, initialIndex + 16]
            arrayOfAdjecentRects = arrayOfAdjecentRects.filter(i => i > 0)
            arrayOfAdjecentRects = arrayOfAdjecentRects.filter(i => i < 225)
        } else if(initialIndex === 225) {
            arrayOfAdjecentRects = [initialIndex - 16, initialIndex - 15, initialIndex - 1]
        } else if(initialIndex % 15 === 0) {
            arrayOfAdjecentRects = [initialIndex - 16, initialIndex - 15, initialIndex - 1, initialIndex + 14, initialIndex + 15 ]
            arrayOfAdjecentRects = arrayOfAdjecentRects.filter(i => i > 0)
            arrayOfAdjecentRects = arrayOfAdjecentRects.filter(i => i < 225)
        } else if(initialIndex % 15 === 1) {
            arrayOfAdjecentRects = [initialIndex - 15, initialIndex - 14, initialIndex + 1, initialIndex + 15, initialIndex + 16]
            arrayOfAdjecentRects = arrayOfAdjecentRects.filter(i => i > 0)
            arrayOfAdjecentRects = arrayOfAdjecentRects.filter(i => i < 225)
        }

        setAdjecentIndexes(arrayOfAdjecentRects)
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
                                clickedOnZero={(index: number) => handleClickedOnZero(index)}
                                adjecentIndexes={adjectIndexes}
                                useFlag={() => setFlagsLeft(state => +state - 1) }
                            />})
                    }
                </div>
            )
        })
        )
    }

    const handleRestartGame = () => {
        setActiveRestartStyle({bl: '2px solid gray', bt: '2px solid gray', br: '1px solid gray', bb: '1px solid gray', bg: '#bbb'})
    }

    return (
        <div>
            <Header>
                <Inner>
                    <Counter>{ flagsLeft && flagsLeft }</Counter>
                    <Restart
                        onMouseDown={handleRestartGame} 
                        onMouseUp={() => setActiveRestartStyle({bl: '2px solid #eee', bt: '2px solid #eee', br: '2px solid gray', bb: '2px solid gray', bg:'#bbb'})}
                        onMouseLeave={() => setActiveRestartStyle({bl: '2px solid #eee', bt: '2px solid #eee', br: '2px solid gray', bb: '2px solid gray', bg:'#bbb'})}
                        bl={activeRestartStyle.bl}
                        bt={activeRestartStyle.bt}
                        br={activeRestartStyle.br}
                        bb={activeRestartStyle.bb}
                        bg={activeRestartStyle.bg}
                        >
                        <img src={Smiley} width="17" />
                        </Restart>
                <Counter>150</Counter>
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
        border-right: 2px solid #eee;
        border-bottom: 2px solid #eee;
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