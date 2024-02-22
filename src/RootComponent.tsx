import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import { ROUTES } from './resources/routes-constants'
import './styles/main.scss'

// TOOLS
import SvgReactConverter from './tools/SvgReactConverter/SvgReactConverter'

const RootComponent: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="*" element={<NotFoundPage />} />
                <Route path={ROUTES.HOMEPAGE_ROUTE} element={<HomePage />} />
                <Route path={ROUTES.SVG_REACT_CONVERTER} element={<SvgReactConverter />} />
            </Routes>
        </Router>
    )
}

export default RootComponent
