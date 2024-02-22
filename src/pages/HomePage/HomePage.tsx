import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// CONSTANTS
import { ROUTES } from '../../resources/routes-constants'

// STYLE
import style from './HomePage.module.scss'
import SvgReactConverterIcon from '../../resources/svgs/tools/SvgReactConverterIcon'
import Page from '../../components/page/Page'
import { useAppDispatch, useAppSelector } from '../../store/reducers/store'
import { setHomePageSelected, setSearchMode, setSearchString } from '../../store/actions/data'
import useTools, { Tool } from '../../hooks/useTools'
import HomePageSelectHandler from './HomePageSelectHandler'

type Event = {
    openTool: (path: string) => void
    initSearch: (dispatch: any) => void
    select: (homePageSelected: any, setHomePageSelected: any, ev: KeyboardEvent) => void
}
const HiddenElm = () => {
    return (
        <div className={style.grid_item_hidden}>
            <SvgReactConverterIcon />
            <span>hiddenElm</span>
        </div>
    )
}

const spanStyles: React.CSSProperties[] = []
const cssHackEmptysAmount = Array(6).fill(null)
const empties = cssHackEmptysAmount.map((empt, i) => <HiddenElm key={`hiddenElm${i}`} />)

const HomePage: React.FC = () => {
    const tools = useTools()
    const [homePageSelected, setHomePageSelected] = useState<number | null>(null)
    const searchMode = useAppSelector((state) => state.data.searchMode)
    const searchString = useAppSelector((state) => state.data.searchString)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const event: Event = {
        openTool: (path) => {
            navigate(path)
        },
        initSearch: (dispatch) => {
            dispatch(setSearchMode('home'))
        },
        select: (homePageSelected, setHomePageSelected, ev) => {
            if (ev.key === 'Escape') {
                setHomePageSelected(null)
                return
            }
            if (ev.key === 'Tab')
                ev.preventDefault()

            if (homePageSelected === null) {
                if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft'  || ev.key === 'Tab') {
                    setHomePageSelected(0)
                    return
                }
            }
            if (ev.key === 'Enter') {
                if (!tools[homePageSelected]) return
                event.openTool(tools[homePageSelected].path)
                setHomePageSelected(0)
            }
            if (ev.key === 'Tab') setHomePageSelected(homePageSelected + 1)
            if (ev.key === 'Tab' && ev.shiftKey) setHomePageSelected(homePageSelected - 1)
            if (ev.key === 'ArrowRight') setHomePageSelected(homePageSelected + 1)
            if (ev.key === 'ArrowLeft') setHomePageSelected(homePageSelected - 1)
        }
    }

    const handleKeyDown = (ev: KeyboardEvent) => {
        if (!searchMode) event.initSearch(dispatch)
        event.select(homePageSelected, setHomePageSelected, ev)
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [event])

    useEffect(() => {
        if (homePageSelected != null && homePageSelected >= tools.length - 1) setHomePageSelected(tools.length - 1)
        if (homePageSelected != null && homePageSelected <= 0) setHomePageSelected(0)
    }, [homePageSelected])

    useEffect(() => {
        if (searchMode === 'home' && searchString) setHomePageSelected(0)
        if (!searchString) setHomePageSelected(null)
    }, [searchString])

    const makeGridSpanStyles = () => {
        for (let i = 0; i < tools.length; i++) {
            if (i > tools.length - 3) {
                spanStyles.push({ gridRow: 'span 1', gridColumn: 'span 1' })
            } else {
                if (Math.random() < 0.5) {
                    if (Math.random() < 0.5) spanStyles.push({ gridRow: 'span 2', gridColumn: 'span 1' })
                    else spanStyles.push({ gridRow: 'span 1', gridColumn: 'span 2' })
                } else {
                    spanStyles.push({ gridRow: 'span 1', gridColumn: 'span 1' })
                }
            }
        }
    }

    if (spanStyles.length === 0) makeGridSpanStyles()
    else if (tools.length < spanStyles.length) makeGridSpanStyles()

    const setClass = (i: number) => {
        const classList = [style.grid_item]
        if (i === homePageSelected) classList.push(style.grid_item_focus)
        return classList.join(' ')
    }

    return (
        <Page>
            <div className={style.component}>
                <div className={style.grid}>
                    {tools.map((tool, i) => (
                        <div key={`tool-${i}`} style={spanStyles[i]} className={setClass(i)} onClick={() => event.openTool(tool.path)}>
                            {tool.icon}
                            <span>{tool.title}</span>
                        </div>
                    ))}
                    {empties}
                </div>
            </div>
        </Page>
    )
}

export default HomePage
