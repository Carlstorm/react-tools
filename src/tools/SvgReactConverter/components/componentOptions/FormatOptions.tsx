import React, { useState } from 'react'

// style
import style from './ComponentOptions.module.scss'
import SvgFormatHandler from '../../utility/SvgFormatHandler'
import Input from '../../../../components/inputs/Input'
import Button from '../../../../components/button/Button'

type FormatOptionsProps = {
    svgStringHandler: SvgFormatHandler
    selected: number
}

const FormatOptions: React.FC<FormatOptionsProps> = ({ svgStringHandler, selected }) => {
    const [blazor, setBlazor] = useState(false)
    const event = {
        input: (name: string, val: string) => {
            const updateSvgObjs = [...svgStringHandler.svgObjs]
            updateSvgObjs[selected].exportOptions[name] = val
            svgStringHandler.setSvgObjs(updateSvgObjs)
        },
        textFieldInput: (name: string, val: string) => {
            const updateSvgObjs = [...svgStringHandler.svgObjs]
            updateSvgObjs.forEach(element => {
                element.exportOptions[name] = val
            });
            svgStringHandler.setSvgObjs(updateSvgObjs)
        }
    }

    const toggleBlazor = () => {
        setBlazor(!blazor)
        const updateSvgObjs = [...svgStringHandler.svgObjs]
        if (!blazor) {
            updateSvgObjs.forEach(element => {
                element.exportOptions.type = "razor"
                element.exportOptions.style = "inline"
            });
        } else {
            updateSvgObjs.forEach(element => {
                element.exportOptions.type = "ts"
                element.exportOptions.style = "module"
            });
        }
        svgStringHandler.setSvgObjs(updateSvgObjs)
    }

    const selections = { ...svgStringHandler.svgObjs[selected].exportOptions }
    return (
        <>
            <span className={style.export_heading}>
                <span>Export options</span>
                <span className={style.export_blazor} onClick={() => toggleBlazor()}>{!blazor ? "blazor?" : "react?"}</span>
            </span>
            {!blazor ?
            <span>{!blazor ? "Type" : "Namespace"}</span>
            : null}
            {blazor ? 
                <>
                    <Input onInput={event.textFieldInput} label="Namespace" name="namespace" value={svgStringHandler.svgObjs[selected].exportOptions.namespace} />
                    <Input onInput={event.textFieldInput} label="Inherits" name="inherits" value={svgStringHandler.svgObjs[selected].exportOptions.inherit} />
                </>
            :
                <div className={style.export_options}>
                    <label onClick={() => event.input('type', 'ts')}>
                        TypeScript:
                        <input type="radio" name="type" value="ts" checked={selections.type === 'ts'}></input>
                    </label>
                    <label onClick={() => event.input('type', 'js')}>
                        JavaScript:
                        <input type="radio" name="type" value="js" checked={selections.type === 'js'}></input>
                    </label>
                    <label onClick={() => event.input('type', 'svg')}>
                        Svg:
                        <input type="radio" name="type" value="svg" checked={selections.type === 'svg'}></input>
                    </label>
                </div>
            }
            {blazor ? null :
                <>
                    <span>Style</span>
                    <div className={style.export_options}>
                        <label onClick={() => event.input('style', 'stylesheet')}>
                            Stylesheet:
                            <input type="radio" name="style" value="stylesheet" checked={selections.style === 'stylesheet'}
                            disabled={selections.type === "svg"}
                            ></input>
                        </label>
                        <label onClick={() => event.input('style', 'module')}>
                            Stylesheet/module:
                            <input type="radio" name="style" value="module" checked={selections.style === 'module'}
                            disabled={selections.type === "svg"}
                            ></input>
                        </label>
                        <label onClick={() => event.input('style', 'inline')}>
                            Inline:
                            <input type="radio" name="style" value="inline" checked={selections.style === 'inline'}
                                disabled={selections.type === "svg"}
                            ></input>
                        </label>
                    </div>
                </>
            }
            {blazor ? null :
            <>
                <span>Format</span>
                <div className={style.export_options}>
                    <label onClick={() => event.input('format', 'css')}>
                        Css:
                        <input type="radio" name="format" value="css" checked={selections.format === 'css'}
                        disabled={selections.type === "svg" || selections.style === "inline"}
                        ></input>
                    </label>
                    <label onClick={() => event.input('format', 'scss')}>
                        Scss:
                        <input type="radio" name="format" value="scss" checked={selections.format === 'scss'}
                        disabled={selections.type === "svg" || selections.style === "inline"}
                        ></input>
                    </label>
                    <label onClick={() => event.input('format', 'sass')}>
                        Sass:
                        <input type="radio" name="format" value="sass" checked={selections.format === 'sass'}
                        disabled={selections.type === "svg"  || selections.style === "inline"}
                        ></input>
                    </label>
                </div>
            </>
            }
        </>
    )
}

export default FormatOptions
