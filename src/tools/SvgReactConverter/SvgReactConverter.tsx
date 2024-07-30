import React, { useEffect, useState } from 'react'

import Tool from '../../components/tool/Tool'
import SvgReactConverterUpload from './components/upload/SvgReactConverterUpload'
import SvgReactConverterSelection from './components/selection/SvgReactConverterSelection'
import SvgFormatHandler from './utility/SvgFormatHandler'
import SvgReactConverterEdit from './components/edit/SvgReactConverterEdit'
import Button from '../../components/button/Button'

const SvgReactConverter: React.FC = () => {
    const [exportOptions, setExportOptions] = useState({})
    const [originalSvgObjs, setOriginalSvgObjs] = useState<object[]>([])
    const [svgObjs, setSvgObjs] = useState<object[]>([])
    const [fileError, setFileError] = useState<string | null>(null)
    const svgStringHandler = new SvgFormatHandler(svgObjs, setSvgObjs, fileError, setFileError, originalSvgObjs, setOriginalSvgObjs)
    
    const [selected, setSelected] = useState<number>(0)
    
    useEffect(() => {
        if (svgObjs === null || svgObjs.length < 1)
            setSelected(0)
    },[svgObjs])

    return (
        <Tool>
            {svgObjs === null || svgObjs.length < 1 ? (
                <SvgReactConverterUpload svgStringHandler={svgStringHandler} />
            ) : (
                <>
                    <SvgReactConverterSelection 
                        svgStringHandler={svgStringHandler}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <SvgReactConverterEdit setExportOptions={setExportOptions} svgStringHandler={svgStringHandler} selected={selected} />
                </>
            )}
        </Tool>
    )
}

export default SvgReactConverter
