import React from "react"
import BaseOptions from "./BaseOptions";

// // style
import style from './ComponentOptions.module.scss'
import FormatOptions from "./FormatOptions";
import SvgFormatHandler from "../../utility/SvgFormatHandler";


type ComponentOptionsProps = {
    svgStringHandler: SvgFormatHandler,
    selected: number
}


const ComponentOptions: React.FC<ComponentOptionsProps> = ({svgStringHandler, selected}) => {
    return (
        <div className={style.component}>
            <BaseOptions svgStringHandler={svgStringHandler} selected={selected} />
            <FormatOptions svgStringHandler={svgStringHandler} selected={selected}/>
        </div>
    )
}

export default ComponentOptions;