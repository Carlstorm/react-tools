import React, { PropsWithChildren, useEffect } from 'react'
import Page from '../page/Page'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../resources/routes-constants'

type Event = {
    keyBinds: (ev: KeyboardEvent) => void
}

const Tool: React.FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate()

    useEffect(() => {
        document.addEventListener('keydown', event.keyBinds)
        return () => {
            document.removeEventListener('keydown', event.keyBinds)
        }
    }, [])

    const event: Event = {
        keyBinds: (ev) => {
            if (ev.key === 'Escape') navigate(ROUTES.HOMEPAGE_ROUTE)
        }
    }

    return <Page>{children}</Page>
}

export default Tool
