import React from 'react'
import xml2js from 'xml2js'
import { BANNED_SVG_PROPS } from '../resources/SvgReactConverter_valid_elements'
import { validateComponentName } from './SvgFunctions'
import { html as beautifyHtml, css_beautify } from 'js-beautify'

import ReactDOMServer from 'react-dom/server'
import DrawSvgs from '../components/drawSvg/DrawSvgs'
import CodeResult from '../components/codeResult/CodeResult'
import RenderSvgComponent from '../components/renderSvgComponent/RenderSvgComponent'
import FormatFunctions from './FormatFunctions'

interface SvgFormatHandler {
    svgObjs: any[]
    setSvgObjs: React.Dispatch<React.SetStateAction<object[]>>
    originalSvgObjs: any[]
    setOriginalSvgObjs: React.Dispatch<React.SetStateAction<object[]>>
    fileError: string | null
    setFileError: React.Dispatch<React.SetStateAction<string | null>>
    savedViewBox: any
    formatFunctions: FormatFunctions
}

type DragState = { state: 'error'; index: number } | null

interface ViewBox {
    x1: number
    y1: number
    x2: number
    y2: number
}

type ViewBoxKey = keyof ViewBox | 'x1y1' | 'x2y1' | 'x1y2' | 'x2y2'

class SvgFormatHandler implements SvgFormatHandler {
    constructor(
        svgObjs: any[],
        setSvgObjs: React.Dispatch<React.SetStateAction<object[]>>,
        fileError: string | null,
        setFileError: React.Dispatch<React.SetStateAction<string | null>>,
        originalSvgObjs: any[],
        setOriginalSvgObjs: React.Dispatch<React.SetStateAction<object[]>>,
    ) {
        this.svgObjs = svgObjs
        this.setSvgObjs = setSvgObjs
        this.fileError = fileError
        this.setFileError = setFileError
        this.savedViewBox = null
        this.originalSvgObjs = originalSvgObjs
        this.setOriginalSvgObjs = setOriginalSvgObjs
        this.formatFunctions = new FormatFunctions()
    }

    setViewBox(svgIndex: number, key: ViewBoxKey, val: number, val2?: number): DragState {
        const viewBox = this.getViewBox(svgIndex)
        let dragState: DragState = null
        const threshold = 0.33
        const calculateDragState = (Owidth: number, Oheight: number, index: number) => {
            if (dragState && dragState.index != index) return

            if (Owidth / Oheight < threshold) {
                dragState = { state: 'error', index }
                const modValues = {
                    x: this.savedViewBox.x2 - Oheight * threshold,
                    y: this.savedViewBox.y2 - Owidth * threshold
                }
                if (key.includes('x1')) {
                    viewBox.x1 = this.savedViewBox.x1 + modValues.x
                    viewBox.x2 = this.savedViewBox.x2 - modValues.x
                }
                if (key.includes('x2')) {
                    viewBox.x2 = this.savedViewBox.x2 - modValues.x
                }
                if (key.includes('y1')) {
                    viewBox.y1 = this.savedViewBox.y1 + modValues.y
                    viewBox.y2 = this.savedViewBox.y2 - modValues.y
                }
                if (key.includes('y2')) {
                    viewBox.y2 = this.savedViewBox.y2 - modValues.y
                }
            } else if (Oheight / Owidth < threshold) {
                dragState = { state: 'error', index }
            } else {
                if (key.includes('x1')) {
                    viewBox.x1 = this.savedViewBox.x1 + val
                    viewBox.x2 = this.savedViewBox.x2 - val
                }
                if (key.includes('x2')) {
                    viewBox.x2 = this.savedViewBox.x2 + val
                }
                if (key.includes('y1')) {
                    viewBox.y1 = this.savedViewBox.y1 + val
                    viewBox.y2 = this.savedViewBox.y2 - val
                }
                if (key.includes('y2')) {
                    viewBox.y2 = this.savedViewBox.y2 + val
                }
                dragState = null
            }
        }

        const calculateDragStateOmni = (iX: number, iY: number) => {
            let dragStateIsset = false
            const [Owidth, Oheight] = iX === 3 ? [this.savedViewBox.x2 - val, viewBox.y2] : [this.savedViewBox.x2 + val, viewBox.y2]
            if (Owidth / Oheight < threshold) {
                dragStateIsset = true
                dragState = { state: 'error', index: iX }
                const modVal = this.savedViewBox.x2 - viewBox.y2 * threshold
                if (key.includes('x1')) {
                    viewBox.x1 = this.savedViewBox.x1 + modVal
                    viewBox.x2 = this.savedViewBox.x2 - modVal
                }
                if (key.includes('x2')) {
                    viewBox.x2 = this.savedViewBox.x2 - modVal
                }
            } else {
                dragState = null
                if (key.includes('x1')) {
                    viewBox.x1 = this.savedViewBox.x1 + val
                    viewBox.x2 = this.savedViewBox.x2 - val
                }
                if (key.includes('x2')) {
                    viewBox.x2 = this.savedViewBox.x2 + val
                }
            }
            if (val2 != null) {
                const [Owidth, Oheight] = iY === 0 ? [viewBox.x2, this.savedViewBox.y2 - val2] : [viewBox.x2, this.savedViewBox.y2 + val2]
                if (Oheight / Owidth < threshold) {
                    dragState = { state: 'error', index: iY }
                    const modVal = this.savedViewBox.y2 - viewBox.x2 * threshold
                    if (key.includes('y1')) {
                        viewBox.y1 = this.savedViewBox.y1 + modVal
                        viewBox.y2 = this.savedViewBox.y2 - modVal
                    }
                    if (key.includes('y2')) {
                        viewBox.y2 = this.savedViewBox.y2 - modVal
                    }
                } else {
                    if (!dragStateIsset) dragState = null
                    if (key.includes('y1')) {
                        viewBox.y1 = this.savedViewBox.y1 + val2
                        viewBox.y2 = this.savedViewBox.y2 - val2
                    }
                    if (key.includes('y2')) {
                        viewBox.y2 = this.savedViewBox.y2 + val2
                    }
                }
            }
        }

        switch (key) {
            case 'x1':
                calculateDragState(this.savedViewBox.x2 - val, viewBox.y2, 3)
                break
            case 'x2':
                calculateDragState(this.savedViewBox.x2 + val, viewBox.y2, 1)
                break
            case 'y1':
                calculateDragState(viewBox.x2, this.savedViewBox.y2 - val, 0)
                break
            case 'y2':
                calculateDragState(viewBox.x2, this.savedViewBox.y2 + val, 2)
                break
            case 'x1y1':
                calculateDragStateOmni(3, 0)
                break
            case 'x2y1':
                calculateDragStateOmni(1, 0)
                break
            case 'x1y2':
                calculateDragStateOmni(3, 2)
                break
            case 'x2y2':
                calculateDragStateOmni(1, 2)
                break
            default:
                break
        }

        const UpdatedSvgObjs = [...this.svgObjs]
        UpdatedSvgObjs[svgIndex].svg['$'].viewBox = [viewBox.x1, viewBox.y1, viewBox.x2, viewBox.y2].join(' ')

        this.setSvgObjs(UpdatedSvgObjs)

        return dragState
    }

    aspectRatio(svg: SVGElement | null, svgIndex: number) {
        const viewBox = this.getViewBox(svgIndex)
        console.log(viewBox.width, viewBox.height)
        if (viewBox.x2 > viewBox.y2) {
            const diff = viewBox.x2 - viewBox.y2
            viewBox.y1 = viewBox.y1 - diff / 2
            viewBox.y2 = viewBox.y2 + diff
        } else if (viewBox.y2 > viewBox.x2) {
            const diff = viewBox.y2 - viewBox.x2
            viewBox.x1 = viewBox.x1 - diff / 2
            viewBox.x2 = viewBox.x2 + diff
        }

        const UpdatedSvgObjs = [...this.svgObjs]
        UpdatedSvgObjs[svgIndex].svg['$'].viewBox = [viewBox.x1, viewBox.y1, viewBox.x2, viewBox.y2].join(' ')
        this.setSvgObjs(UpdatedSvgObjs)
    }

    autoFitViewBox(svg: SVGElement | null, svgIndex: number) {
        if (svg === null) return

        let minX = Number.POSITIVE_INFINITY
        let minY = Number.POSITIVE_INFINITY
        let maxX = Number.NEGATIVE_INFINITY
        let maxY = Number.NEGATIVE_INFINITY

        // Get all child elements of the SVG
        const childElements = svg.children

        // Loop through the child elements to calculate the content size
        for (let i = 0; i < childElements.length; i++) {
            const element = childElements[i]
            if (element instanceof SVGGraphicsElement) {
                // Get the bounding box of the element
                let bbox
                if (['path', 'circle', 'rect', 'polygon'].includes(element.tagName)) {
                    // If the element is a relevant type, calculate its bounding box
                    bbox = element.getBBox()
                    // Include the stroke width in the bounding box
                    const {strokeWidth} = getComputedStyle(element)

                    if (strokeWidth && strokeWidth != "1px") {
                        const strokeVal = strokeWidth.includes("px") ? strokeWidth.replace("px", "") : strokeWidth;
                        const strokeValFloat = parseFloat(strokeVal) || 1
                        bbox.x -= strokeValFloat / 2
                        bbox.y -= strokeValFloat / 2
                        bbox.width += 2 * (strokeValFloat / 2)
                        bbox.height += 2 * (strokeValFloat / 2)
                    }
                } else {
                    // For other elements, just get their bounding box
                    bbox = element.getBBox()
                }

                minX = Math.min(minX, bbox.x)
                minY = Math.min(minY, bbox.y)
                maxX = Math.max(maxX, bbox.x + bbox.width)
                maxY = Math.max(maxY, bbox.y + bbox.height)
            }
        }

        const UpdatedSvgObjs = [...this.svgObjs]
        UpdatedSvgObjs[svgIndex].svg['$'].viewBox = [minX, minY, maxX - minX, maxY - minY].join(' ')
        this.setSvgObjs(UpdatedSvgObjs)
    }

    getViewBox(svgIndex: number, original?: boolean) {
        const objs = original ? this.originalSvgObjs : this.svgObjs
        const { viewBox } = objs[svgIndex].svg['$']
        const [x1, y1, x2, y2] = viewBox.split(' ').map((val: string) => eval(val))
        return {
            width: x2 - x1,
            height: y2 - y1,
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        }
    }

    makeSvgObjs(filesData: { svgCode: string; file: File | null }[]) {
        if (!filesData) return
        const SvgObjs = filesData.map((data) => {
            let result
            xml2js.parseString(data.svgCode, { explicitChildren: true, preserveChildrenOrder: true, childkey: 'children' }, (error: any, data: any) => {
                if (error) {
                    console.error('Error parsing XML:', error)
                } else {
                    result = data
                }
            })
            return result
        })

        const formattedObjs = this.formatFunctions.format(SvgObjs).map((svgObj, i) => ({
            svg: svgObj,
            componentName: filesData[i].file != null ? validateComponentName(filesData[i].file!.name, true) : '',
            svgTitle: '',
            exportOptions: {
                type: 'ts',
                style: 'module',
                format: 'scss'
            }
        }))

        const classCombine = this.classCombine(formattedObjs)
        // const classCombine = formattedObjs
        const svgObjs = [...this.svgObjs]
        svgObjs.push(...classCombine)
        this.setSvgObjs(svgObjs)

        const originalSvgObjs = [...this.originalSvgObjs]
        originalSvgObjs.push(...classCombine.map((obj: any) => this.deepCopy(obj)))
        this.setOriginalSvgObjs(originalSvgObjs)
    }


    async makeObjFromFiles(files: File[]) {
        let hasErrors = false
        const promises: any[] = []

        files.forEach((file) => {
            if (file.type !== 'image/svg+xml') {
                hasErrors = true
                return
            }

            const promise = new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => {
                    resolve(reader.result)
                }
                reader.readAsText(file)
            })

            promises.push(promise)
        })

        Promise.all(promises)
            .then((results) => {
                if (hasErrors) {
                    this.setFileError('One or more files are not valid SVG files!')
                } else {
                    const filesData = results.map((result, i) => ({ svgCode: `${result}`, file: files[i] }))
                    this.makeSvgObjs(filesData)
                }
            })
            .catch((error) => {
                console.error(error)
                this.setFileError('An error occurred while processing files.')
            })
    }

    classCombine(objs: any[]) {
        const newArray: any[] = []
        objs.forEach((obj) => {
            const collectionArray: any[] = []
            const styleSheet = obj.svg.styleSheet
            Object.keys(styleSheet).forEach((key) => {
                const index = collectionArray.findIndex((obj) => JSON.stringify(obj.value) === JSON.stringify(styleSheet[key]))
                if (index >= 0) {
                    collectionArray[index].classNames.push(key)
                } else {
                    collectionArray.push({ classNames: [key], value: obj.svg.styleSheet[key] })
                }
            })

            const newStyleSheet: { [key: string]: any } = {}
            collectionArray.forEach((collectionObj, i) => {
                newStyleSheet['.' + obj.componentName + '_class_' + i] = collectionObj.value
            })

            const classUseCount: { [key: string]: any } = {}
            Object.keys(newStyleSheet).forEach((key) => {
                classUseCount[key] = 0
            })

            const replaceClassNames = (svgObjs: any[]) => {
                const newArrayChildren: any[] = []
                svgObjs.forEach((svgObj) => {
                    if ('children' in svgObj && Array.isArray(svgObj.children)) replaceClassNames(svgObj.children)

                    if ('$' in svgObj && 'className' in svgObj['$']) {
                        collectionArray.forEach((collectionObj, i) => {
                            if (collectionObj.classNames.includes('.' + svgObj['$'].className)) {
                                svgObj['$'].className = Object.keys(newStyleSheet)[i].slice(1)
                                classUseCount[Object.keys(newStyleSheet)[i]]++
                            }
                        })
                    }
                    newArrayChildren.push(svgObj)
                })
                return newArrayChildren
            }

            if ('children' in obj.svg && Array.isArray(obj.svg.children)) obj.svg.children = replaceClassNames(obj.svg.children)

            if ('$' in obj.svg && 'className' in obj.svg['$']) {
                collectionArray.forEach((collectionObj, i) => {
                    if (collectionObj.classNames.includes('.' + obj.svg['$'].className)) {
                        obj.svg['$'].className = Object.keys(newStyleSheet)[i].slice(1)
                        classUseCount[Object.keys(newStyleSheet)[i]]++
                    }
                })
            }

            const filteredNewClasses: { [key: string]: any } = {}
            Object.keys(newStyleSheet).forEach((key, i) => {
                if (classUseCount[key] > 0) filteredNewClasses[key] = newStyleSheet[key]
            })

            obj.svg.styleSheet = filteredNewClasses
            newArray.push(obj)

        })
        return newArray
    }

    deepCopy(obj: any): any {
        if (obj === null || typeof obj !== 'object') {
            return obj
        }

        if (Array.isArray(obj)) {
            const arrCopy = []
            for (const item of obj) {
                arrCopy.push(this.deepCopy(item))
            }
            return arrCopy
        }

        const objCopy: Record<string, any> = {}
        for (const key in obj) {
            if (key in obj) {
                objCopy[key] = this.deepCopy(obj[key])
            }
        }

        return objCopy
    }

    removeItem(index: number) {
        if (this.svgObjs === null) return
        const svgObjsCopy = [...this.svgObjs]
        svgObjsCopy.splice(index, 1)
        this.setSvgObjs(svgObjsCopy)

        const originalSvgObjsCopy = [...this.originalSvgObjs]
        originalSvgObjsCopy.splice(index, 1)
        this.setOriginalSvgObjs(originalSvgObjsCopy)
    }

    addScale(svgIndex: number, mode: boolean) {
        const scaleStepPercentage = 0.025
        const originalViewBox = this.getViewBox(svgIndex, true)

        const relativeValue = originalViewBox.width * (mode ? -scaleStepPercentage : scaleStepPercentage)
        const viewBox = this.getViewBox(svgIndex)

        if (this.savedViewBox) {
            viewBox.x1 = this.savedViewBox.x1 - relativeValue / 2
            viewBox.x2 = this.savedViewBox.x2 + relativeValue
            viewBox.y1 = this.savedViewBox.y1 - relativeValue / 2
            viewBox.y2 = this.savedViewBox.y2 + relativeValue
        } else {
            viewBox.x1 -= relativeValue / 2
            viewBox.x2 += relativeValue
            viewBox.y1 -= relativeValue / 2
            viewBox.y2 += relativeValue
        }

        const UpdatedSvgObjs = [...this.svgObjs]
        UpdatedSvgObjs[svgIndex].svg['$'].viewBox = [viewBox.x1, viewBox.y1, viewBox.x2, viewBox.y2].join(' ')
        this.setSvgObjs(UpdatedSvgObjs)
    }

    htmlToReact(htmlString: string) {
        // Regular expression to find style attributes
        const styleRegex = /style="(.*?)"/g

        const attrRegex = /(\w+):(\w+)=/g

        // Replace style attributes with React style objects
        let reactHtmlString = htmlString.replace(styleRegex, (_, styles) => {
            // Convert styles to object
            const styleObj: { [key: string]: string } = {}
            styles.split(';').forEach((style: string) => {
                const [key, value] = style.split(':').map((s) => s.trim())
                if (key && value) {
                    styleObj[key] = value
                }
            })
            return `style={${JSON.stringify(styleObj)}}`
        })

        // Replace other attributes that need conversion
        reactHtmlString = reactHtmlString.replace(attrRegex, (_, prefix, attr) => {
            const camelCaseAttr = prefix + attr.charAt(0).toUpperCase() + attr.slice(1)
            return `${camelCaseAttr}=`
        })

        reactHtmlString = reactHtmlString.replaceAll('class=', 'className=')

        const reactPropsHtmlString = reactHtmlString.replace(/reactProps="reactProps"/g, '{...svgProps}')
        const reactRefHtmlString = reactPropsHtmlString.replace(/forwardRef="forwardRef"/g, 'ref={ref}')
        return reactRefHtmlString
    }

    makeSvgString(selected: number) {
        const type = this.svgObjs[selected].exportOptions.type
        const style = this.svgObjs[selected].exportOptions.style

        if (type === "svg")
            return this.createSvgHtml(selected, type, style)
        else
            return this.createSvgReact(selected, type, style)
    }

    createSvgHtml(selected: number, type: string, style: string) {
        const obj = this.svgObjs[selected].svg
        const title = this.svgObjs[selected].svgTitle

        const svgString = ReactDOMServer.renderToStaticMarkup(<RenderSvgComponent style={style} title={title} obj={obj} type={type} />)

        const reactifiedSvgString = svgString
        const formattedSvgString = beautifyHtml(reactifiedSvgString, {
            indent_size: 4,
            indent_level: 0,
            wrap_line_length: 80,
            wrap_attributes: 'force-expand-multiline'
        })

        // Extract CSS from the formatted SVG
        const styleStartIndex = formattedSvgString.indexOf('<style>') + '<style>'.length
        const styleEndIndex = formattedSvgString.indexOf('</style>') + '</style>'.length
        const cssString = formattedSvgString.substring(styleStartIndex, styleEndIndex).replace('</style>', '')

        // Format CSS separately (You can use any CSS formatter here)
        const formattedCssString = css_beautify(cssString, {
            indent_size: 4,
            indent_level: 2,
            indent_with_tabs: false,
            selector_separator_newline: true,
            newline_between_rules: true,
            space_around_selector_separator: true
        })

        // Adjust indentation for </style>
        const indent = ' '.repeat(4)
        const indentedStyleEndTag = `\n${indent}</style>`

        // Replace original CSS with formatted CSS
        const finalSvgString =
            formattedSvgString.substring(0, styleStartIndex) + '\n' + formattedCssString + indentedStyleEndTag + formattedSvgString.substring(styleEndIndex)

        return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
${finalSvgString}
        `
    }

    createSvgReact(selected: number, type: string, style: string) {
        const obj = this.svgObjs[selected].svg
        const title = this.svgObjs[selected].svgTitle

        const svgString = ReactDOMServer.renderToStaticMarkup(<RenderSvgComponent style={style} title={title} obj={obj} />)

        const moduleIfyClassNames = (content: string) => {
            return content.replace(/className="(.*?)"/g, (match, className) => {
                const classNameSplit = className.split("_")
                const classNameNumber = classNameSplit[classNameSplit.length-1]
                return `className={style._${classNameNumber}}`;
            });
        }

        const reactifiedSvgString = this.htmlToReact(svgString)
        const formattedSvgString = beautifyHtml(reactifiedSvgString, {
            indent_size: 1,
            indent_level: 2,
            indent_with_tabs: true,
            wrap_line_length: 60,
            wrap_attributes: 'force-expand-multiline'
        })

        let actualFinalString = ""

        if (style === "inline") {
            // Extract CSS from the formatted SVG
            const styleStartIndex = formattedSvgString.indexOf('<style>') + '<style>'.length
            const styleEndIndex = formattedSvgString.indexOf('</style>') + '</style>'.length
            const cssString = formattedSvgString.substring(styleStartIndex, styleEndIndex).replace('</style>', '')

            // Format CSS separately (You can use any CSS formatter here)
            const formattedCssString = css_beautify(cssString, {
                indent_size: 1,
                indent_level: 4,
                indent_with_tabs: true,
                selector_separator_newline: true,
                newline_between_rules: true,
                space_around_selector_separator: true
            })

            // Adjust indentation for </style>
            const indentLevel = 3 // or any other appropriate indent level
            const indent = ' '.repeat(indentLevel * 4)
            const indentedStyleEndTag = `\n${indent}</style>\n`

            // Replace original CSS with formatted CSS
            const finalSvgString =
                formattedSvgString.substring(0, styleStartIndex) + '\n' + formattedCssString + indentedStyleEndTag + formattedSvgString.substring(styleEndIndex)

            const styleElementToString = finalSvgString.replace('<style>', '<style>{`')
            actualFinalString = styleElementToString.replace('</style>', '`}</style>')
        } else if (style === "module") {
            actualFinalString = moduleIfyClassNames(formattedSvgString)
        } else 
            actualFinalString = formattedSvgString

            
        if (type === "ts")
            return this.makeTsString(actualFinalString, selected)
        else (type === "js")
            return this.makeJsString(actualFinalString, selected)
    }

    styleSheetImport(selected: number) {
        const exportStyle = this.svgObjs[selected].exportOptions.style
        const exportStyleFormat = this.svgObjs[selected].exportOptions.format
    
        const GetStyleName = () => {
            let styleName = this.svgObjs[selected].componentName
            if (exportStyle === "module") {
                styleName += ".module"            
            }
    
            if (exportStyleFormat === "css")
                styleName += ".css"
            else if (exportStyleFormat === "scss")
                styleName += ".scss"
            else if (exportStyleFormat === "sass")
                styleName += ".sass"
    
            return styleName
        }


        const style = this.svgObjs[selected].exportOptions.style
        if (style === "inline")
            return ""
        else if (style === "module")
            return `import style from './${GetStyleName()}'\n`
        else
            return `import './${GetStyleName()}'\n`
    }

    makeTsString(finalSvgString: string, selected: number) {
        const htmlString = `import React, { Ref, SVGProps, forwardRef } from 'react'
${this.styleSheetImport(selected)}
interface ${this.svgObjs[selected].componentName}Props extends SVGProps<SVGSVGElement> {
\tcustomProps?: object
}

const ${this.svgObjs[selected].componentName} = forwardRef((props: ${this.svgObjs[selected].componentName}Props, ref?: Ref<SVGSVGElement>) => {
\tconst { customProps, ...svgProps } = props;

\treturn (
${finalSvgString}
\t)
})

${this.svgObjs[selected].componentName}.displayName = '${this.svgObjs[selected].componentName}';

export default ${this.svgObjs[selected].componentName};
`
        return htmlString
    }

    makeJsString(finalSvgString: string, selected: number) {
        const htmlString = `import React, { forwardRef } from 'react'
${this.styleSheetImport(selected)}
const ${this.svgObjs[selected].componentName} = forwardRef((props, ref) => {
\tconst { customProps, ...svgProps } = props;

\treturn (
${finalSvgString}
\t)
})

${this.svgObjs[selected].componentName}.displayName = '${this.svgObjs[selected].componentName}';

export default ${this.svgObjs[selected].componentName};
`
        return htmlString
    }    


    makeStyleString(selected: number) {
        const formatType = this.svgObjs[selected].exportOptions.format
        const styleType = this.svgObjs[selected].exportOptions.style
        const obj = this.svgObjs[selected].svg

        const classPreflix = styleType === "module" ? "." : "&";

        const makeStyle = (styles: { [key: string]: { fill: string } }) => {
            let cssString = "";
            let baseClassName = ""
        
            // Iterate over the entries of the styles object
            let i = 0;
            for (const [selector, properties] of Object.entries(styles)) {
                
                // Check if the styles object has the key
                if (Object.prototype.hasOwnProperty.call(styles, selector)) {
                    
                    if (formatType === "sass") {
                        if (selector.includes("_0")) {
                            baseClassName = selector.replace("_0", "")
                        }
                        if (styleType === "module")
                            cssString += `${classPreflix}_${i}`;
                        else
                            cssString += i === 0 ? `${classPreflix}_${i}` : `\t${classPreflix}_${i}`;
                        i++
                        // Iterate over the properties of each selector
                        for (const [property, value] of Object.entries(properties)) {
                            // Check if the properties object has the key
                                cssString += "\n"
                            if (Object.prototype.hasOwnProperty.call(properties, property)) {
                                const Fixedproperties = `${property}`.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                                
                                cssString += `${styleType === "module" ? "\t" : "\t\t"}${Fixedproperties}: ${value}`;
                            }
                        }
                        cssString += `\n\n`;
                    } else if (formatType === "scss") {
                        if (selector.includes("_0")) {
                            baseClassName = selector.replace("_0", "")
                        }
                        cssString += `${classPreflix}_${i} {\n`;
                        i++
                        // Iterate over the properties of each selector
                        for (const [property, value] of Object.entries(properties)) {
                            // Check if the properties object has the key
                            if (Object.prototype.hasOwnProperty.call(properties, property)) {
                                const Fixedproperties = `${property}`.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                                cssString += `${Fixedproperties}: ${value};\n`;
                            }
                        }
                        cssString += `}`;
                    } else {
                        if (styleType === "module") {
                            const classSplit = selector.split("_")
                            const classNumber = classSplit[classSplit.length-1]
                            cssString += `._${classNumber} {\n`;
                        } else
                            cssString += `${selector} {\n`;
                        // Iterate over the properties of each selector
                        for (const [property, value] of Object.entries(properties)) {
                            // Check if the properties object has the key
                            if (Object.prototype.hasOwnProperty.call(properties, property)) {
                                const Fixedproperties = `${property}`.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                                cssString += `${Fixedproperties}: ${value};\n`;
                            }
                        }
                        cssString += `}\n\n`;
                    }
                }
            }
            if (styleType === "module")
                return cssString

            if (formatType === "scss")
                return `${baseClassName} {
\t${cssString}
}`

            if (formatType === "sass")
                return `${baseClassName}
\t${cssString}
`
            else
                return cssString;
        };


        let formattedCssString = ""
        if (formatType != "sass")
            formattedCssString = css_beautify(makeStyle(obj.styleSheet), {
                indent_size: 1,
                indent_level: 0,
                indent_with_tabs: true,
                selector_separator_newline: true,
                newline_between_rules: true,
                space_around_selector_separator: true
            })
        else 
            formattedCssString = makeStyle(obj.styleSheet);

        return formattedCssString;
    }
}


export default SvgFormatHandler

