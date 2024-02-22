import React, { ForwardRefExoticComponent, Ref, forwardRef, useImperativeHandle, useRef } from 'react'
import { VALID_ELEMENTS } from '../../resources/SvgReactConverter_valid_elements'
import { getBounding } from '../../utility/SvgFunctions'

type DrawProps = {
    obj: any
    className?: string
}

const DrawSvgs = forwardRef((props: DrawProps, ref: Ref<any>) => {
    let { obj } = props;
    const { className } = props;
    if (className)
        obj = obj.svg

    const Element = obj["#name"]

    const makeStyle = (styles: { [key: string]: { fill: string } }) => {
        let cssString = "";
    
        // Iterate over the entries of the styles object
        for (const [selector, properties] of Object.entries(styles)) {
            // Check if the styles object has the key
            if (Object.prototype.hasOwnProperty.call(styles, selector)) {
                cssString += `${selector} {\n`;
                // Iterate over the properties of each selector
                for (const [property, value] of Object.entries(properties)) {
                    // Check if the properties object has the key
                    if (Object.prototype.hasOwnProperty.call(properties, property)) {
                        const Fixedproperties = `${property}`.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                        cssString += `    ${Fixedproperties}: ${value};\n`;
                    }
                }
                cssString += `}\n`;
            }
        }
        return cssString;
    };

    const classNameCombined = []
    if (obj["$"] && obj["$"].className)
        classNameCombined.push(obj["$"].className)
    if (className)
        classNameCombined.push(className)

    const customProps: { [key: string]: string } = {};

    if (classNameCombined.length > 0)
        customProps.className = classNameCombined.join(" ")

    return (
        <Element {...obj["$"]} {...customProps} ref={ref}>
            {"styleSheet" in obj ?
                <style>
                    {makeStyle(obj.styleSheet)}
                </style>
            : null}
            {"children" in obj ?
                obj.children.map((child: any, i: number) => <DrawSvgs key={i+obj["#name"]+child["#name"]} obj={child} />)
            : null}
        </Element>
    )
})

DrawSvgs.displayName = 'DrawSvgs';

export default DrawSvgs