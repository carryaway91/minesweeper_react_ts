import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
interface IProps {
    clicked: (index: {row: Number, col: Number, index: Number}) => void,
    col: Number,
    row: Number,
    bombs?: Number[],
    showBombs: () => void,
    gameOver: boolean,
    gameStarted: boolean
}


const Rect: React.FC<IProps> = ({ clicked, col, row, bombs, gameStarted, showBombs, gameOver }) => {
    const [rectContent, setRectContent] = useState<Number|String>(0)
    const [color, setColor] = useState('lightgray')
    const [borderLeftAndTop, setBorderLeftAndTop] = useState('2px solid white')
    const [borderRightAndBottom, setBorderRightAndBottom] = useState('2px solid gray')
    const [fontColor, setFontColor] = useState<string>('black')
    const [mineFlagged, setMineFlagged] = useState<boolean>(false)
    const [pressed, setPressed] = useState<boolean>(false)
    const [isBomb, setIsBomb] = useState<boolean>(false)
    const [initialClick, setInitialClick] = useState<boolean>(true)
    const [userClicked, setUserClicked] = useState<boolean>(false)
    const [rectIndex, setRectIndex] = useState<number>(0)


    //nastav farbu a vypocitaj index policka
    useEffect(() => {
        setColor('lightgray')

        let index
        if(row === 1) {
            index = (15 / 15) * +col
        } else {
            index = 15 * (+row - 1) + +col 
        }
        setRectIndex(index)
    }, [])

    

    useEffect(() => {

        if(isBomb) {
            setRectContent('b')
        }

    }, [isBomb])

    useEffect(() => {
        if(bombs && rectIndex > 0) {
            bombs.filter(bomb => {
                if(bomb === rectIndex) {
                    setIsBomb(true)
                    setRectContent('b')
                }
            })
        }

        if(bombs) {
            checkForAdjecentBombs()
        }
    },[bombs])


    // nastavenie farieb cisel
    useEffect(() => {
        if(rectContent === 1) { setFontColor('blue') }
        if(rectContent === 2) { setFontColor('green') }
        if(rectContent === 3) { setFontColor('red') }
        if(rectContent === 4) { setFontColor('purple') }
        if(rectContent === 5) { setFontColor('maroon') }
        if(rectContent === 6) { setFontColor('navy') }
        if(rectContent === 7) { setFontColor('black') }
        if(rectContent === 8) { setFontColor('black') }

        if(rectContent > 0 && !isBomb && userClicked) {
            setPressed(true)
        }


    }, [rectContent])


    useEffect(() => {
        if(color === 'red') {
            setIsBomb(true)
        }
    },[color])


    
    //show all bombs

    useEffect(() => {
        if(gameOver && isBomb && !mineFlagged) {
            setColor('red')
            setPressed(true)
        }
    },[gameOver])

    useEffect(() => {
        if(pressed && !isBomb) {
            setColor('#aaa')
            setBorderLeftAndTop('2px solid #999')
            setBorderRightAndBottom('2px solid #999')
        }

    },[pressed])

    // left click
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        
        

        if(!mineFlagged && !gameOver) {

            clicked({ col: col, row: row, index: rectIndex})
            if(isBomb) {
                showBombs() //props metoda
                return            
            }


            setColor('#aaa')
            setBorderLeftAndTop('2px solid #999')
            setBorderRightAndBottom('2px solid #999')
            setPressed(true)
            setUserClicked(true)
        } else {
            return
        }
    }


    // bombFlagged
    const handleRightClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        if(color === 'lightgray' && !pressed && !gameOver) {
            setColor('green')
            setMineFlagged(true)
        } else if (color === 'green' && !pressed && !gameOver) {
            setColor('lightgray')
            setMineFlagged(false)
        }
    }

    // pozri bomby v okoli
    const checkForAdjecentBombs = () => {
        if(bombs) {
            for(let i = 0; i <= bombs.length - 1; i++) {
                // [hore, stred, dole] vlavo
                if(!mineFlagged) {

                    if(+row - 1 >= 0) {
                        if(+col - 1 > 0) {
                            if(bombs[i] === rectIndex - 1){
                                setRectContent(state => +state + 1)
                            }
                            if(bombs[i] === rectIndex - 16) {
                                setRectContent(state => +state + 1)
                            }
                            if(bombs[i] === rectIndex + 14) {
                                setRectContent(state => +state + 1)
                            }
                        }
                    }

                    if(+row - 1 >= 0) {
                        if(+col === col) {
                            if(bombs[i] === rectIndex - 15) {
                                setRectContent(state => +state + 1)
                            }
                            if(bombs[i] === rectIndex + 15) {
                                setRectContent(state => +state + 1)
                            }
                        }
                    }

                    if(+row - 1 >= 0) {
                        if(+col + 1 < 16) {
                            if(bombs[i] === rectIndex - 14) {
                                setRectContent(state => +state + 1)
                            }
                            if(bombs[i] === rectIndex + 1) {
                                setRectContent(state => +state + 1)
                            }
                            if(bombs[i] === rectIndex + 16) {
                                setRectContent(state => +state + 1)
                            }
                        }
                    }
                }
            }
        }
    }


    return (
        <Rectangle 
                color={color} 
                lt={borderLeftAndTop} 
                br={borderRightAndBottom} 
                fontColor={fontColor}
                onContextMenu={(e : React.MouseEvent<HTMLElement>) => handleRightClick(e)} 
                onClick={(e: React.MouseEvent<HTMLElement>) => handleClick(e)}>
            {/* rectContent == 'b'|| rectContent === NaN || rectContent == 'f' || rectContent == 0 ? null : userClicked ? rectContent : null */ rectContent}
        </ Rectangle>
    )
}


const Rectangle = styled.div<{ lt: string, br: string, fontColor: string}>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    background: ${props => props.color};
    border-top: ${props => props.lt};
    border-left: ${props => props.lt};
    border-right: ${props => props.br};
    border-bottom: ${props => props.br};
    font-weight: bold;
    color: ${props => props.fontColor};
    &::selection {
        user-select: none
    }
    
    
`
export default Rect