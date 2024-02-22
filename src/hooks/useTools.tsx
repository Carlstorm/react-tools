import React, { ReactNode, useEffect } from 'react'
import { useAppSelector } from '../store/reducers/store'
import SvgReactConverterIcon from '../resources/svgs/tools/SvgReactConverterIcon'

// CONSTANTS
import { ROUTES } from '../resources/routes-constants'

export type Tool = {
    title: string
    icon: ReactNode
    path: string
}

const tools: Tool[] = [
    {
        title: 'svg converter',
        icon: <SvgReactConverterIcon />,
        path: ROUTES.SVG_REACT_CONVERTER
    }
]

const useTools = () => {
    const searchMode = useAppSelector((state) => state.data.searchMode)
    const searchString = useAppSelector((state) => state.data.searchString)

    if (!searchMode) return tools

    return tools.filter((tool) => tool.title.includes(searchString))
}

export default useTools
