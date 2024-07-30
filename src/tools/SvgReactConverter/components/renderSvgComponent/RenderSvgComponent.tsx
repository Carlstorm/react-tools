import React from 'react'

type DrawProps = {
    obj: any
    title?: string
    type?: string
    style?: string
}

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
                    cssString += `${Fixedproperties}: ${value};\n`;
                }
            }
            cssString += `}\n`;
        }
    }
    return cssString;
};

const RenderSvgChild: React.FC<DrawProps> = ({obj}) => {
    const Element = obj["#name"]

    return (
        <Element {...obj["$"]}>
            {"children" in obj ?
                obj.children.map((child: any, i: number) => <RenderSvgChild key={i+obj["#name"]+child["#name"]} obj={child} />)
            : null}
        </Element>
    )
}

export const RenderSvgComponent: React.FC<DrawProps> = ({title, obj, type, style}) => {
    const Element = obj["#name"]

    if (type && type === "svg")
        return (
            <Element {...obj["$"]}>
                {title ? <title>{title}</title> : null}
                {obj.styleSheet ? 
                <style>{makeStyle(obj.styleSheet)}</style>
                : null}
                {"children" in obj ?
                    obj.children.map((child: any, i: number) => <RenderSvgChild key={i+obj["#name"]+child["#name"]} obj={child} />)
                : null}
            </Element>
        )
    if (type && type === "razor") {
      return (
        <Element {...obj["$"]}
            className={[obj["$"].className,"@Class"].join(" ")}
            clickEvPlaceHolder="clickEvPlaceHolder"
            stylePlaceHolder="stylePlaceHolder"
            strokePlaceHolder="strokePlaceHolder"
            fillPlaceHolder="fillPlaceHolder"
        >
            {/* {title ? <title>{title}</title> : null} */}
            {obj.styleSheet && (style === "inline" || style === "params") ? 
                <style>{makeStyle(obj.styleSheet)}</style>
            : null}
            {"children" in obj ?
                obj.children.map((child: any, i: number) => <RenderSvgChild key={i+obj["#name"]+child["#name"]} obj={child} />)
            : null}
        </Element>
      )  
    }
    return (
        <Element {...obj["$"]} reactProps="reactProps" forwardRef="forwardRef">
            {title ? <title>{title}</title> : null}
            {obj.styleSheet && (style === "inline" || type === "svg") ? 
                <style>{makeStyle(obj.styleSheet)}</style>
            : null}
            {"children" in obj ?
                obj.children.map((child: any, i: number) => <RenderSvgChild key={i+obj["#name"]+child["#name"]} obj={child} />)
            : null}
        </Element>
    )
}

export default RenderSvgComponent