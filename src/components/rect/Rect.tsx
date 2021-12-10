import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
import Flag from '../../img/flag.png'
import Bomb from '../../img/bomb.png'
import { ReactReduxContextValue } from 'react-redux'
import { compose } from 'redux'

interface IProps {
    clicked: (index: {row: Number, col: Number, index: Number}) => void,
    col: Number,
    row: Number,
    bombs?: Number[],
    showBombs: () => void,
    gameOver: boolean,
    gameStarted: boolean,
    clickedOnZero: (index:Number) => void,
    adjecentIndexes: Number[] | undefined,
    useFlag: () => void,
    restart: boolean,
    substractFlagCount: () => void,
    addFlagCount: () => void,
    bobmsArePlaced: boolean,
    index: Number,
    checkAdjecent: Boolean | null | void,
    completeArray: Number[] | null,
    flagsLeft: Number,
    sendCorrectFlaggedBomb: (index: Number) => void,
    removeCorrectFlaggedBomb: (index: Number) => void
}


const Rect: React.FC<IProps> = ({ clicked, col, row, index, bombs,flagsLeft, sendCorrectFlaggedBomb, removeCorrectFlaggedBomb, clickedOnZero, completeArray, bobmsArePlaced, showBombs, gameOver, checkAdjecent, adjecentIndexes,restart, substractFlagCount, addFlagCount }) => {
    const [rectContent, setRectContent] = useState<Number>(0)
    const [color, setColor] = useState('lightgray')
    const [borderLeftAndTop, setBorderLeftAndTop] = useState('2px solid white')
    const [borderRightAndBottom, setBorderRightAndBottom] = useState('2px solid gray')
    const [fontColor, setFontColor] = useState<string>('black')
    const [mineFlagged, setMineFlagged] = useState<boolean>(false)
    const [pressed, setPressed] = useState<boolean>(false)
    const [isBomb, setIsBomb] = useState<boolean>(false)
    const [userClicked, setUserClicked] = useState<boolean>(false)
    const [currentIndexesToPress, setCurrentIndexesToPress] = useState<Number[]>([])
    
    // resetni rect po restarte
    useEffect(() => {
        if(restart) {
            setColor('lightgray')
            setBorderLeftAndTop('2px solid white')
            setBorderRightAndBottom('2px solid gray')
            if(mineFlagged) {
                setMineFlagged(false)
            }
            if(isBomb) {
                setIsBomb(false)
            }
            if(rectContent && rectContent > 0) {
                setRectContent(0)
            }
            if(pressed) {
                setPressed(false)
            }
            if(userClicked) {
                setUserClicked(false)
            }
        }
    }, [restart])



    useEffect(() => {
        if(rectContent !== 0 && bobmsArePlaced && !userClicked && adjecentIndexes !== undefined) {
            if(checkAdjecent && adjecentIndexes !== undefined && adjecentIndexes.length > 0) {
                for(let i = 0; i <= adjecentIndexes.length - 1; i++) {
                    if(adjecentIndexes[i] === +index && !mineFlagged) {
                        setPressed(true)
                        if(adjecentIndexes[i] === +index && rectContent === 11) {
                            setPressed(true)
                            setUserClicked(true)
                            clickedOnZero(index)

                        }
                    }
                }
            }
        }
    }, [checkAdjecent, rectContent, pressed, adjecentIndexes])

    useEffect(() => {
        if(completeArray && completeArray.length > 0) {
            for(let i = 0; i<= completeArray.length - 1; i++) {
                if(completeArray[i] === index && !mineFlagged) {
                    setPressed(true)
                }
            }
        }
    }, [completeArray])


    // nastav prazdne policko (11) ak rectContent je 0 a bomby boli rozmiestnene 
    useEffect(() => {
        if(bobmsArePlaced && rectContent === 0) {
            setRectContent(11)
        }
    }, [bobmsArePlaced])
    

    useEffect(() => {

        if(isBomb) {
            setRectContent(10)
        }
    }, [isBomb])

    useEffect(( ) => {
        if(userClicked && isBomb && !mineFlagged) {
            setColor('red')
        }
    }, [userClicked])

    useEffect(() => {
        if(bombs && index > 0) {
            bombs.filter(bomb => {
                if(bomb === index) {
                    setIsBomb(true)
                    setRectContent(10)
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

        if(rectContent && rectContent > 0 && !isBomb && userClicked && !mineFlagged) {
            setPressed(true)
        }

    }, [rectContent])


    useEffect(() => {
        if(pressed && !isBomb) {
            setColor('#aaa')
            setBorderLeftAndTop('2px solid #999')
            setBorderRightAndBottom('2px solid #999')
        }

    },[pressed])


    useEffect(() => {
        if(bobmsArePlaced)
        if(mineFlagged && isBomb) {
            sendCorrectFlaggedBomb(index)
        } else if(isBomb && userClicked && !mineFlagged) {
            removeCorrectFlaggedBomb(index)
        }
    },[mineFlagged])


    // left click
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        if(e.button === 0) {
            
            setUserClicked(true)
            
            if(rectContent === 0 || rectContent === 11 && !gameOver && !userClicked) {
                for(let i = 0; i < 8; i++) {
                    setRectContent(11)
                    clickedOnZero(index)
                }
            }
        
            if(!mineFlagged && !gameOver) {
                
                clicked({ col: col, row: row, index: index})
                if(isBomb) {
                    setUserClicked(true)
                    showBombs() 
                    return            
                }
                
                setColor('#aaa')
                setBorderLeftAndTop('2px solid #999')
                setBorderRightAndBottom('2px solid #999')
                setPressed(true)
            } else {
                return
            }
        }
    }


    // bombFlagged
    const handleRightClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        if(color === 'lightgray' && !pressed && !gameOver && !mineFlagged) {
            setMineFlagged(true)
            setUserClicked(true)
            substractFlagCount()
        } else if (!pressed && !gameOver && mineFlagged) {
            setMineFlagged(false)
            addFlagCount()
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
                            if(bombs[i] === +index - 1){
                                setRectContent(state => +state + 1)
                            }
                            if(bombs[i] === +index - 16) {
                                setRectContent(state => +state + 1)
                            }
                            if(bombs[i] === +index + 14) {
                                setRectContent(state => +state + 1)
                            }
                        }
                    }

                    if(+row - 1 >= 0) {
                        if(+col === col) {
                            if(bombs[i] === +index - 15) {
                                setRectContent(state => +state + 1)
                            }
                            if(bombs[i] === +index + 15) {
                                setRectContent(state => +state + 1)
                            }
                        }
                    }

                    if(+row - 1 >= 0) {
                        if(+col + 1 < 16) {
                            if(bombs[i] === +index - 14) {
                                setRectContent(state => +state + 1)
                            }
                            if(bombs[i] === +index + 1) {
                                setRectContent(state => +state + 1)
                            }
                            if(bombs[i] === +index + 16) {
                                setRectContent(state => +state + 1)
                            }
                        }
                    }
                }
            }
        }
    }

    const handlePreview = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        if(e.button === 0 && e.buttons === 1 && !mineFlagged && !pressed && !gameOver) {
            
            if(e.type ==='mouseenter') {
                setColor('#aaa')
                setBorderLeftAndTop('2px solid #999')
                setBorderRightAndBottom('2px solid #999')
            }
            
            if(e.type === 'mouseleave') {
                setColor('lightgray')
                setBorderLeftAndTop('2px solid white')
                setBorderRightAndBottom('2px solid gray')
            }
        }

        if(e.buttons === 3) {
            
        }
    }

    return (
        <Rectangle 
                color={color} 
                lt={borderLeftAndTop} 
                br={borderRightAndBottom} 
                fontColor={fontColor}
                onContextMenu={(e : React.MouseEvent<HTMLElement>) => handleRightClick(e)} 
                onMouseUp={(e: React.MouseEvent<HTMLElement>) => handleClick(e)}

                onMouseDown={(e: React.MouseEvent<HTMLElement>) => handlePreview(e)}
                onMouseEnter={(e: React.MouseEvent<HTMLElement>) => handlePreview(e)}
                onMouseLeave={(e: React.MouseEvent<HTMLElement>) => handlePreview(e)}
                onMouseOver={(e: React.MouseEvent<HTMLElement>) => handlePreview(e)}
                >
            {  rectContent == 11 || rectContent == 0 || !pressed ? null : rectContent }
            { mineFlagged && <img src={Flag} /> }
            { gameOver && isBomb && !mineFlagged && <img src={Bomb} style={{ position: 'relative', left: '1px' }}/>}
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