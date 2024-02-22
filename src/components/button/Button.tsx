import React, { MouseEvent } from 'react'

// style
import style from './Button.module.scss'

type ButtonProps = {
    title?: string
    for?: string
    className?: string
    onClick?: (ev?: React.MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => void
}

const Button: React.FC<ButtonProps> = (props) => {
    const { title, onClick, className } = props

    const clickEvent = (ev: React.MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
        if (onClick) onClick(ev)
    }

    const classNames = [style.component, className]

    if (props.for) {
        return (
            <label className={classNames.join(" ")} htmlFor={props.for} onClick={(ev) => clickEvent(ev)}>
                {title}
            </label>
        )
    }

    return <span className={classNames.join(" ")} onClick={(ev) => clickEvent(ev)} >{title}</span>
}

export default Button
