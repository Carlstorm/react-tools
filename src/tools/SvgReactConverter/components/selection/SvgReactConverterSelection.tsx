import React, { FormEvent, MouseEventHandler, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import style from './SvgReactConverterSelection.module.scss'
import CrossSvg from '../../../../resources/svgs/CrossSvg/CrossSvg'
import SvgStringHandler from '../../utility/SvgFormatHandler'
import DrawSvgs from '../drawSvg/DrawSvgs'
import { getBounding } from '../../utility/SvgFunctions'

type SelectionProps = {
    selected: number
    setSelected: React.Dispatch<React.SetStateAction<number>>
    svgStringHandler: SvgStringHandler;
}

type Event = {
    filesFromBrowse: (ev: FormEvent<HTMLInputElement>) => void
    remove_item: (ev: React.MouseEvent<SVGSVGElement, MouseEvent>, index: number) => void
    select: (index: number) => void
}

const SvgReactConverterSelection: React.FC<SelectionProps> = ({ selected, setSelected, svgStringHandler }) => {
    const onDrop = useCallback((files: any) => {
        svgStringHandler.makeObjFromFiles(files)
    }, [svgStringHandler.svgObjs])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true })

    const event: Event = {
        remove_item: (ev, index) => {
            ev.stopPropagation()
            svgStringHandler.removeItem(index)
            if (svgStringHandler.svgObjs != null && selected === svgStringHandler.svgObjs.length-1)
                setSelected(selected-1)
        },
        select: (index: number) => {
            setSelected(index)
        },
        filesFromBrowse: (ev) => {
            const filesList = ev.currentTarget.files
            if (!filesList) return
            const files: File[] = Array.from(filesList)
            svgStringHandler.makeObjFromFiles(files)
            ev.currentTarget.value = ""
        }
    }

    const setItemClassName = (i: number) => {
        const classNames = [style.item]

        if (selected === i)
            classNames.push(style.item_selected)

        return classNames.join(" ")
    }

    const setSvgClassName = (obj:any) => {
        const boudning = getBounding(obj)
        if (boudning.width > boudning.height)
            return style.item_svg_horizontal
        else 
            return style.item_svg_vertical
    }

    if (!svgStringHandler.svgObjs) 
        return <p>an errror occured</p>

    return (
        <div className={style.component} {...getRootProps()} >
            <input {...getInputProps()}></input>
            <input onInput={(ev) => event.filesFromBrowse(ev)} type="file" id="add" multiple hidden></input>
            <span className={style.upload_more}>Drag and drop to <label htmlFor="add" className={style.upload_more_link}>Upload</label> more files</span>
            {isDragActive ? (
                <p className={style.drop_message}>Drop your files!</p>
            ) : null}
            <div className={style.component_content} style={{opacity: isDragActive ? 0 : 1}}>
                {svgStringHandler.svgObjs.map((obj, i) => (
                        <div 
                            key={'drawSvg' + i} 
                            className={setItemClassName(i)}
                            onClick={() => event.select(i)}
                        >
                            <CrossSvg className={style.remove_item} onClick={(ev) => event.remove_item(ev, i)}/>
                            <DrawSvgs obj={obj} className={setSvgClassName(obj)}/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SvgReactConverterSelection
