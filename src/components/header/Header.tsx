import React, { FormEvent, useEffect, useRef } from 'react'

// STYLE
import style from './Header.module.scss'
import { useAppDispatch, useAppSelector } from '../../store/reducers/store'
import { setSearchMode, setSearchString } from '../../store/actions/data'
import { useLocation, useNavigate } from 'react-router-dom'
import CrossSvg from '../../resources/svgs/CrossSvg/CrossSvg'
import HomeSvg from '../../resources/svgs/HomeSvg/HomeSvg'

type Event = {
    search: (ev: FormEvent<HTMLInputElement>) => void
    resetSearchMode: () => void
}

const Header: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const dispatch = useAppDispatch()
    const searchMode = useAppSelector((state) => state.data.searchMode)
    const searchString = useAppSelector((state) => state.data.searchString)

    useEffect(() => {
        if (!inputRef.current) return
        if (!searchMode) return
        inputRef.current.focus()
    }, [searchMode])

    useEffect(() => {
        dispatch(setSearchString(''))
        dispatch(setSearchMode(null))
    }, [])

    const event: Event = {
        search: (ev) => {
            if (!inputRef.current) return
            dispatch(setSearchString(inputRef.current.value))
        },
        resetSearchMode: () => {
            dispatch(setSearchMode(null))
        }
    }

    return (
        <div className={style.component}>
            {location.pathname === "/" ? null :
                <HomeSvg className={style.back_arrow} onClick={() => navigate("/")} />
            }
            <input
                ref={inputRef}
                onInput={(ev) => event.search(ev)}
                onBlur={() => event.resetSearchMode()}
                className={style.search_input}
                value={searchString}
                placeholder="Search"
            ></input>
        </div>
    )
}

export default Header
