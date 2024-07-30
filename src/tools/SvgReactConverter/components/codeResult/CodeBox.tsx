import React from "react"

// style
import style from './CodeResult.module.scss'
import SvgFormatHandler from "../../utility/SvgFormatHandler"
import ClipBoardSvg from "../../../../resources/svgs/ClipBoardSvg/ClipBoardSvg"


type CodeBoxProps = {
    title: string
    svgStringHandler: SvgFormatHandler,
    selected: number,
    content: string,
    className?: string;
}

const PlainSvg = () => {
    return 
}



const CodeBox: React.FC<CodeBoxProps> = ({title, svgStringHandler, selected, content, className}) => {

        
    const copyCode = () => {
        navigator.clipboard.writeText(content)
    }

    return (
        <div className={[style.CodeBox, className].join(" ")}>
            
            <div className={style.CodeBox_title}>
                <span>{title}</span>
                <div className={style.CodeBox_title_copy} onClick={() => copyCode()}>
                    <ClipBoardSvg />
                    <span>Copy code</span>
                </div>
            </div>

            <div className={style.CodeBox_content}>
                <p style={{whiteSpace: "pre-wrap"}}>{content}</p>
            </div>
            
        </div>
    )
}

export default CodeBox