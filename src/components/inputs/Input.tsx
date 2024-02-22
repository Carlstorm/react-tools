import React from 'react'

// style
import style from './Input.module.scss'

type InputProps = {
    title?: string
    for?: string
    label?: string
    value?: string
    name: string
    onInput: (name: string, val: string) => void
}

const Input: React.FC<InputProps> = (props) => {


    return (
        <div className={style.component}>
            <label className={style.label}>{props.label}</label>
            <input className={style.input} value={props.value} onInput={(e) => props.onInput(props.name, e.currentTarget.value)}></input>
        </div>
    )
}

export default Input
