import React, { CSSProperties, Dispatch, ElementRef, ReactElement, RefObject, useEffect, useReducer, useRef, useState } from 'react'

import style from './SvgReactConverterEdit.module.scss'
import Input from '../../../../components/inputs/Input'
import DrawSvgs from '../drawSvg/DrawSvgs'
import { getBounding } from '../../utility/SvgFunctions'
import SvgFormatHandler from '../../utility/SvgFormatHandler'
import Button from '../../../../components/button/Button'
import CodeResult from '../codeResult/CodeResult'
import ComponentOptions from '../componentOptions/ComponentOptions'

type EditProps = {
    selected: number
    svgStringHandler: SvgFormatHandler
    setExportOptions: React.Dispatch<React.SetStateAction<object>>
}

type SizeLinesProps = {
    svgViewSize: number
    ViewboxSize: number
    selected: number
    svgStringHandler: SvgFormatHandler
    viewBox: HTMLDivElement
    svg: SVGElement
    viewBoxBounding: any
    setViewBoxBounding: any
}

const fixPageSizeScrolling = (viewBoxBounding: any, viewBox: HTMLDivElement) => {
    const updatedBounding = viewBox.getBoundingClientRect()
    const change = viewBoxBounding.top - updatedBounding.top
    const newScrollY = window.scrollY - change
    window.scrollTo({ top: newScrollY })
}


const SizeLines: React.FC<SizeLinesProps> = ({ viewBoxBounding, setViewBoxBounding, svg, viewBox, ViewboxSize, selected, svgStringHandler }) => {
    const linesRef = useRef<any>(null)
    const [lineClassMod, setLineClassMod] = useState<any | null>(null)
    const [dragStartInstance, setDragStartInstance] = useState<React.MouseEvent<SVGSVGElement, MouseEvent> | React.MouseEvent<HTMLDivElement, MouseEvent> | null>(null)
    const svgBounding = svg.getBoundingClientRect()
    const DragLineWidth = 32

    useEffect(() => {
        setViewBoxBounding(viewBox.getBoundingClientRect())
    }, [svgStringHandler.svgObjs, selected])

    const SvgRelativePos = {
        x: svgBounding.left - viewBoxBounding.left,
        y: svgBounding.top - viewBoxBounding.top
    }

    const stylePositions = [
        { top: SvgRelativePos.y + 'px' },
        { left: SvgRelativePos.x + svgBounding.width + 'px' },
        { top: SvgRelativePos.y + svgBounding.height + 'px' },
        { left: SvgRelativePos.x + 'px' },

        { top: SvgRelativePos.y + 'px', left: SvgRelativePos.x + 'px' },
        { left: SvgRelativePos.x + svgBounding.width + 'px', top: SvgRelativePos.y + 'px'},
        { top: SvgRelativePos.y + svgBounding.height + 'px', left: SvgRelativePos.x + 'px'},
        { top: SvgRelativePos.y + svgBounding.height + 'px', left: SvgRelativePos.x + svgBounding.width + 'px' }
    ]

    const SvgViewBox = svgStringHandler.getViewBox(selected)
    const scalingFactor = SvgViewBox.width > SvgViewBox.height ? svgBounding.width / SvgViewBox.width : svgBounding.height / SvgViewBox.height

    const lines = [
        { x1: 0, y1: DragLineWidth / 2, x2: ViewboxSize, y2: DragLineWidth / 2 },
        { x1: DragLineWidth / 2, y1: 0, x2: DragLineWidth / 2, y2: ViewboxSize },
        { x1: 0, y1: DragLineWidth / 2, x2: ViewboxSize, y2: DragLineWidth / 2 },
        { x1: DragLineWidth / 2, y1: 0, x2: DragLineWidth / 2, y2: ViewboxSize },
    ]

    const lineSvgProps = (i: number, type: string) => {
        if (type === "line") {
            const size = i % 2 === 0 ? { width: ViewboxSize, height: DragLineWidth } : { width: DragLineWidth, height: ViewboxSize }
            let lineType
            switch (i) {
                case 0:
                    lineType = 'y1'
                    break
                case 1:
                    lineType = 'x2'
                    break
                case 2:
                    lineType = 'y2'
                    break
                default:
                    lineType = 'x1'
                    break
            }
            return { ...size, 'data-line-type': lineType, 'data-line-index': i }
        } else {
            let lineType
            switch (i) {
                case 0:
                    lineType = 'x1y1'
                    break
                case 1:
                    lineType = 'x2y1'
                    break
                case 2:
                    lineType = 'x1y2'
                    break
                default:
                    lineType = 'x2y2'
                    break
            }
            return { 'data-line-type': lineType, 'data-line-index': i+"corner" }
        }
    }

    const checkScroll = (set: React.Dispatch<React.SetStateAction<DOMRect>>) => {
        set(viewBox.getBoundingClientRect())
    }
    // setViewBoxBounding(viewBox.getBoundingClientRect())
    useEffect(() => {
        const moveListener = (e: MouseEvent) => handleDrag(e, dragStartInstance)
        const stopListener = () => stopDrag(setDragStartInstance)
        const scrollListener = () => checkScroll(setViewBoxBounding);

        window.addEventListener('mousemove', moveListener)
        window.addEventListener('mouseup', stopListener)
        window.addEventListener("scroll", scrollListener)

        return () => {
            window.removeEventListener('mousemove', moveListener)
            window.removeEventListener('mouseup', stopListener)
            window.removeEventListener("scroll", scrollListener)
        }
    }, [dragStartInstance])

    const dragStart = (e: React.MouseEvent<SVGSVGElement, MouseEvent> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setViewBoxBounding(viewBox.getBoundingClientRect())
        const elm = e.target as any
        const lineIndex = elm.getAttribute('data-line-index')
        setLineClassMod({ index: lineIndex, className: style.line_svg_selected })
        svgStringHandler.savedViewBox = svgStringHandler.getViewBox(selected)

        setDragStartInstance(e)
    }
    const stopDrag = (set: React.Dispatch<React.SetStateAction<React.MouseEvent<SVGSVGElement, MouseEvent> | React.MouseEvent<HTMLDivElement, MouseEvent> | null>>) => {
        set(null)
        // setDragStartSvgBounrding(svgBounding)
        svgStringHandler.savedViewBox = svgStringHandler.getViewBox(selected)
        setLineClassMod(null)
    }

    const handleDrag = (e: MouseEvent, dragStartInstance: any) => {
  
        if (!dragStartInstance) return
            e.preventDefault()

        const dragLine = dragStartInstance.target
        const lineType = dragLine.getAttribute('data-line-type')
        const lineIndex = dragLine.getAttribute('data-line-index')
        // const classNames = dragLine.className.baseVal.split(" ")

        // if (!classNames.includes(style.line_svg_selected)) {
        //     classNames.push(style.line_svg_selected)
        // }

        // dragLine.className.baseVal = classNames.join(" ")
        let value = 0
        let value2 = 0
        if (lineType.includes('x')) value = e.clientX - dragStartInstance.clientX
        else value = e.clientY - dragStartInstance.clientY

        if (lineType.includes('y'))
            value2 = e.clientY - dragStartInstance.clientY
        // svg.style.width = svgBounding.width+e.clientX-dragStartInstance.clientX+"px"
        value = value / scalingFactor

        value2 = value2 / scalingFactor

        fixPageSizeScrolling(viewBoxBounding, viewBox)
        const dragState = svgStringHandler.setViewBox(selected, lineType, value, value2)

        if (dragState != null) {
            const mod = dragState.state === 'error' ? style.line_svg_error : style.line_svg_selected
            setLineClassMod({ index: dragState.index, className: mod })
        } else
            setLineClassMod({ index: lineIndex, className: style.line_svg_selected })
    }

    const getLineClassName = (i: number) => {
        const classNames = [style.line_svg]

        classNames.push(style["line_svg_"+i])

        if (i % 2)
            classNames.push(style.line_svg_horizontal)
        else
            classNames.push(style.line_svg_vertical)

        if (lineClassMod === null) return classNames.join(' ')

        if (lineClassMod.index == i) classNames.push(lineClassMod.className)

        if (lineClassMod.index === "0corner")
            if (i === 0 || i === 3)
                classNames.push(lineClassMod.className)

        if (lineClassMod.index === "1corner")
            if (i === 0 || i === 1)
                classNames.push(lineClassMod.className)

        if (lineClassMod.index === "2corner")
            if (i === 3 || i === 2)
                classNames.push(lineClassMod.className)

        if (lineClassMod.index === "3corner")
            if (i === 1 || i === 2)
                classNames.push(lineClassMod.className)

        return classNames.join(' ')
    }

    const getCornerClassName = (i: number) => {
        const classNames = [style.scale_lines_corner]
        classNames.push(style["scale_lines_corner_"+i])

        if (i === 0)
            classNames.push(style.scale_lines_corner_nw)
        if (i === 1)
            classNames.push(style.scale_lines_corner_ne)
        if (i === 2)
            classNames.push(style.scale_lines_corner_ne)
        if (i === 3)
            classNames.push(style.scale_lines_corner_nw)

        // if (lineClassMod.index.split("corner"))

        if (lineClassMod === null) return classNames.join(' ')



        // const cornerIndex = lineClassMod.index.split("corner")[0]
        // // for (let i = 0; i<linesRef.current.children.length; i++) {
        // //     linesRef.current.children[i].classList.remove(style.line_svg_selected)
        // // }

        // if (cornerIndex === "0") {
        //     linesRef.current.children[0].classList.add(lineClassMod.className)
        //     linesRef.current.children[6].classList.add(lineClassMod.className)
        //     console.log("ODWAOJDOWA", linesRef.current.children)
        //     // linesRef.current.children[3].classList.add(lineClassMod.className)
        // }

        return classNames.join(' ')
    }

    const cornerMouseOver = (i: number) => {
        if (lineClassMod === null)
            setLineClassMod({ index: i+"corner", className: style.line_svg_hover })
    }

    const cornerMouseOut = (i: number) => {
        setLineClassMod(null)
    }

    return (
        <div>
            <div className={style.scale_lines} ref={linesRef}>
                {lines.map((line, i) => (
                    <div key={"scale_line_"+i}>
                        <svg
                            className={getLineClassName(i)} 
                            style={stylePositions[i]}
                            onMouseDown={(e) => dragStart(e)}   
                            {...lineSvgProps(i, "line")}
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <line {...line}></line>
                        </svg>
                        <div className={getCornerClassName(i)} onMouseOver={() => cornerMouseOver(i)} onMouseOut={() => cornerMouseOut(i)} {...lineSvgProps(i, "corner")} onMouseDown={(e) => dragStart(e)} style={stylePositions[i+4]}></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const SvgReactConverterEdit: React.FC<EditProps> = ({ selected, svgStringHandler, setExportOptions }) => {
    const viewBoxRef = useRef<HTMLDivElement | null>(null);
    const drawSvgsRef = useRef<SVGElement | null>(null);

    const [viewBox, setViewBox] = useState<HTMLDivElement | null>(null)
    const [viewBoxBounding, setViewBoxBounding] = useState<DOMRect | null>(null)
    const [svg, setSvg] = useState<SVGElement | null>(null)

    useEffect(() => {
        if (!viewBoxRef.current || !drawSvgsRef.current) return

        const viewBoxCurrent = viewBoxRef.current;
        const drawSvgsCurrent = drawSvgsRef.current;


        setViewBox(viewBoxCurrent);
        setViewBoxBounding(viewBoxCurrent.getBoundingClientRect());
    

    if (typeof drawSvgsCurrent === "object") {
        setSvg(drawSvgsCurrent);
    }
    
    }, [viewBoxRef.current, drawSvgsRef.current])

    const svgViewSize = 400
    const ViewboxSize = 500
    if (svgStringHandler.svgObjs === null) return

    const obj = svgStringHandler.svgObjs[selected]

    const bounding = svgStringHandler.getViewBox(selected)

    const autoSize = (svg: SVGElement | null, selected: number) => {
        if (viewBox === null)
            return
        svgStringHandler.autoFitViewBox(svg, selected)
        fixPageSizeScrolling(viewBoxBounding, viewBox)
    }

    const aspectRatio = (svg: SVGElement | null, selected: number) => {
        if (viewBox === null)
            return
        svgStringHandler.aspectRatio(svg, selected)
        fixPageSizeScrolling(viewBoxBounding, viewBox)
    }

    const addScale = (selected: number, mode: boolean) => {
        if (viewBox === null)
            return
        svgStringHandler.addScale(selected, mode)
        fixPageSizeScrolling(viewBoxBounding, viewBox)
    }

    return (
        <div className={style.component}>
            <div className={style.component_main}>
                <div className={style.view_box} ref={viewBoxRef}>
                    <div className={style.view_box_aspect_actions}>
                        <Button className={style.view_box_aspect_actions_button} title='1/1' onClick={() => aspectRatio(svg, selected)}/>

                    </div>
                    <div className={style.view_box_actions}>
                        <div className={style.view_box_actions_size} onClick={() => addScale(selected, false)}>
                            -
                        </div>
                        <Button className={style.view_box_actions_center} title="Auto-fit" onClick={(ev) => autoSize(svg, selected)} />
                        <div className={style.view_box_actions_size} onClick={() => addScale(selected, true)}>
                            +
                        </div>
                    </div>
                    <div>
                        {viewBox && svg ? (
                            <SizeLines
                                viewBoxBounding={viewBoxBounding}
                                setViewBoxBounding={setViewBoxBounding}
                                svg={svg}
                                viewBox={viewBox}
                                svgStringHandler={svgStringHandler}
                                svgViewSize={svgViewSize}
                                ViewboxSize={ViewboxSize}
                                selected={selected}
                            />
                        ) : null}
                    </div>
                    <DrawSvgs ref={drawSvgsRef} obj={obj} className={bounding.width > bounding.height ? style.svg_vertical : style.svg_horizontal} />
                </div>
                <ComponentOptions svgStringHandler={svgStringHandler} selected={selected} />
            </div>
            <CodeResult svgStringHandler={svgStringHandler} selected={selected} />
        </div>
    )
}
export default SvgReactConverterEdit
