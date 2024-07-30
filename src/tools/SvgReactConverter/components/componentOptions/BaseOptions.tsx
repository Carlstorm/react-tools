import React, { Ref, useEffect, useRef } from "react"

// components
import Input from "../../../../components/inputs/Input";
import SvgFormatHandler from "../../utility/SvgFormatHandler";


type BaseOptionsProps = {
    svgStringHandler: SvgFormatHandler
    selected: number
}

const BaseOptions: React.FC<BaseOptionsProps> = ({svgStringHandler, selected}) => {
    // const testRef:Ref<SVGSVGElement> = useRef(null)

    const event = {
        input: (name: string, val: string) => {
            const updateSvgObjs = [...svgStringHandler.svgObjs]
            updateSvgObjs[selected][name] = val
            const newClassName = svgStringHandler.classCombine(updateSvgObjs)
            svgStringHandler.setSvgObjs(newClassName)
        }
    }

    return (
        <>
            <Input onInput={event.input} name="componentName" label="Component name" value={svgStringHandler.svgObjs[selected].componentName} />
            <Input onInput={event.input} disabled={svgStringHandler.svgObjs[selected].exportOptions.type == "razor"} label="Svg title" name="svgTitle" value={svgStringHandler.svgObjs[selected].exportOptions.type == "razor" ? "" : svgStringHandler.svgObjs[selected].svgTitle} />
        </>
    )
}

export default BaseOptions;