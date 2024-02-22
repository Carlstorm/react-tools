import React, { PropsWithChildren } from 'react'

// STYLE
import style from './Page.module.scss'
import Header from '../header/Header'

const Page: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className={style.component}>
            <Header />
            <div className={style.content}>{children}</div>
        </div>
    )
}

export default Page
