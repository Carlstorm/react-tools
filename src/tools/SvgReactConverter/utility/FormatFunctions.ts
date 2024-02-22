

class FormatFunctions {
    constructor() {
    }

    format(SvgObjs: any[]) {
        const fixStyleElm: any[] = SvgObjs.map((svgObj: any) => this.fixStyleElm(svgObj.svg))

        const resturcturedSVGObjs: any[] = fixStyleElm.map((svgObj: any) => this.cleanSvgStructure(svgObj))

        const removeUselessElements: any[] = this.removeUselessElements(resturcturedSVGObjs)

        const popProplessParents: any[] = this.popProplessParents(removeUselessElements)

        const objectifyStyle: any[] = this.objectifyStyle(popProplessParents)

        const stylifyStylableProps: any[] = this.stylifyStylableProps(objectifyStyle)

        const styleifyCssElementSelectors: any[] = this.styleifyCssElementSelectors(stylifyStylableProps)

        const passStyleNPropsToChildren: any[] = this.passStyleNPropsToChildren(styleifyCssElementSelectors)

        const removeUnnesesaryStyles: any[] = this.removeUnnesesaryStyles(passStyleNPropsToChildren)
        const removeStyleParentDublicates: any[] = this.removeStyleParentDublicates(removeUnnesesaryStyles)
        const combineAndRemoveEmptyStyles: any[] = this.combineAndRemoveEmptyStyles(removeStyleParentDublicates)
        const CleanedSvgObjs: any[] = this.popProplessParents(combineAndRemoveEmptyStyles)
        const ReactifiedSvgObjs: any[] = this.ReactifySvgObjs(CleanedSvgObjs)
        const fixViewBoxAndDimensions: any[] = this.fixViewBoxAndDimensions(ReactifiedSvgObjs)

        const classifyStyles: any[] = this.classifyStyles(fixViewBoxAndDimensions)

        return classifyStyles
    }
    
    ObjectiFyStyleElement(styleStr: string) {
        const styleElement = document.createElement('style')
        styleElement.textContent = styleStr
        document.body.appendChild(styleElement)
        const styleObjNew: { [key: string]: any } = {}
        if (styleElement.sheet?.cssRules)
            for (let i = 0; i < styleElement.sheet?.cssRules.length; i++) {
                const rule = styleElement.sheet?.cssRules[i] as CSSStyleRule
                styleObjNew[rule.selectorText] = (() => {
                    const cssObj: { [key: string]: any } = {}
                    const style = rule.style as any
                    for (let u = 0; u < rule.styleMap.size; u++) {
                        const key = style[u]
                        cssObj[key] = style[key]
                    }
                    return cssObj
                })()
            }
        document.body.removeChild(styleElement)
        return styleObjNew
    }

    fixStyleElm(svgobj: any) {
        Object.keys(svgobj).forEach((objKey) => {
            if (['style'].includes(objKey)) {
                const index = svgobj.children.findIndex((child: any) => child['#name'] === 'style')
                if (index != -1) svgobj.styleSheet = { ...this.ObjectiFyStyleElement(svgobj[objKey][0]) }
            } else if (Array.isArray(svgobj[objKey])) {
                svgobj[objKey] = svgobj[objKey].map((childObj: any) => this.fixStyleElm(childObj))
            }
        })
        return svgobj
    }

    cleanSvgStructure(svgobj: any) {
        Object.keys(svgobj).forEach((objKey) => {
            if (!['$', '#name', 'children', 'styleSheet'].includes(objKey)) {
                delete svgobj[objKey]
            } else if (objKey === 'children' && 'children' in svgobj) {
                svgobj[objKey] = svgobj[objKey].map((childObj: any) => this.cleanSvgStructure(childObj))
            }
        })
        return svgobj
    }

    
    removeUselessElements(svgobjs: any[]) {
        const newArray: any[] = []
        svgobjs.forEach((svgObj) => {
            if ('children' in svgObj) svgObj.children = this.removeUselessElements(svgObj.children)
            if ('children' in svgObj && svgObj.children.length > 0) {
                newArray.push(svgObj)
            } else if (!['g', 'defs'].includes(svgObj['#name']) && '$' in svgObj && Object.keys(svgObj['$']).length > 0) {
                newArray.push(svgObj)
            }
        })
        return newArray
    }

    combineAndRemoveEmptyStyles(svgobjs: any[]) {
        const newArray: any[] = []
        svgobjs.forEach((svgObj) => {
            if ('children' in svgObj) {
                svgObj.children = this.combineAndRemoveEmptyStyles(svgObj.children)

                const comparisonObj: any = {}

                svgObj.children.forEach((child: any) => {
                    if (!('$' in child) || !('style' in child['$'])) return

                    Object.keys(child['$'].style).forEach((styleKey) => {
                        if (!(styleKey in comparisonObj)) comparisonObj[styleKey] = []

                        comparisonObj[styleKey].push(child['$'].style[styleKey])
                    })
                })

                const isSameValue = (values: string[]) => {
                    const firstValue = values[0]
                    for (let i = 1; i < values.length; i++) {
                        if (values[i] !== firstValue) {
                            return false
                        }
                    }
                    return true
                }

                Object.keys(comparisonObj).forEach((styleKey) => {
                    if (comparisonObj[styleKey].length === svgObj.children.length && isSameValue(comparisonObj[styleKey])) {
                        svgObj.children.forEach((child: any) => {
                            if (!('$' in child) || !('style' in child['$'])) return
                            delete child['$'].style[styleKey]
                        })
                        if (!('$' in svgObj)) svgObj['$'] = {}
                        if (!('style' in svgObj['$'])) svgObj['$'].style = {}

                        svgObj['$'].style[styleKey] = comparisonObj[styleKey][0]
                    }
                })

                svgObj.children.forEach((child: any) => {
                    if (!('$' in child) || !('style' in child['$'])) return
                    if (Object.keys(child['$'].style).length < 1) delete child['$'].style

                    if (Object.keys(child['$']).length < 1) delete child['$']
                })
            }

            newArray.push(svgObj)
        })
        return newArray
    }

    popProplessParents(svgobjs: any[]) {
        const newArray: any[] = []
        svgobjs.forEach((svgObj) => {
            if (svgObj['#name'] === 'defs') {
                newArray.push(svgObj)
                return
            }
            if ('children' in svgObj) {
                svgObj.children = this.popProplessParents(svgObj.children)
                if (!('$' in svgObj) || !(Object.keys(svgObj['$']).length > 0)) {
                    newArray.push(...svgObj.children)
                } else {
                    newArray.push(svgObj)
                }
            } else {
                newArray.push(svgObj)
            }
        })
        return newArray
    }

    objectifyStyle(svgobjs: any[]) {
        const newArray: any[] = []
        svgobjs.forEach((svgObj) => {
            if ('children' in svgObj) {
                svgObj.children = this.objectifyStyle(svgObj.children)
            }
            if (!('$' in svgObj) || svgObj['#name'] == 'style') {
                newArray.push(svgObj)
                return
            }
            if ('style' in svgObj['$']) {
                const styleObj: any = {}
                const styleString = svgObj['$']['style']
                styleString
                    .replaceAll(' ', '')
                    .split(';')
                    .forEach((strObj: { split: (arg0: string) => [any, any] }) => {
                        const [strObjKey, strObjVal] = strObj.split(':')
                        if (strObjKey === '') return
                        styleObj[strObjKey] = strObjVal
                    })
                svgObj['$'].style = styleObj
            }
            newArray.push(svgObj)
        })
        return newArray
    }

    stylifyStylableProps(svgobjs: any[]) {
        const newArray: any[] = []
        svgobjs.forEach((svgObj) => {
            if ('children' in svgObj) {
                svgObj.children = this.stylifyStylableProps(svgObj.children)
            }
            if (!('$' in svgObj)) {
                newArray.push(svgObj)
                return
            }

            const propKeys = Object.keys(svgObj['$'])

            propKeys.forEach((propkey: string) => {
                if (
                    [
                        'stroke',
                        'stroke-dasharray',
                        'stroke-dashoffset',
                        'stroke-linecap',
                        'stroke-linejoin',
                        'stroke-miterlimit',
                        'stroke-opacity',
                        'stroke-width',
                        'text-anchor',
                        'text-decoration',
                        'text-rendering',
                        'transform',
                        'unicode-bidi',
                        'vector-effect',
                        'visibility',
                        'word-spacing',
                        'writing-mode',
                        'alignment-baseline',
                        'baseline-shift',
                        'clip',
                        'clip-path',
                        'clip-rule',
                        'color',
                        'color-interpolation',
                        'color-interpolation-filters',
                        'color-rendering',
                        'cursor',
                        'direction',
                        'display',
                        'dominant-baseline',
                        'fill',
                        'fill-rule',
                        'fill-opacity',
                        'filter',
                        'flood-color',
                        'flood-opacity',
                        'font-family',
                        'font-size',
                        'font-stretch',
                        'font-style',
                        'font-variant',
                        'font-weight',
                        'image-rendering',
                        'letter-spacing',
                        'lighting-color',
                        'marker-end',
                        'marker-mid',
                        'marker-start',
                        'mask',
                        'opacity',
                        'overflow',
                        'pointer-events',
                        'shape-rendering',
                        'stop-color',
                        'stop-opacity'
                    ].includes(propkey)
                ) {
                    if (!('style' in svgObj['$'])) svgObj['$'].style = {}
                    svgObj['$'].style[propkey] = svgObj['$'][propkey]
                    delete svgObj['$'][propkey]
                }
            })
            newArray.push(svgObj)
        })
        return newArray
    }

    styleifyCssElementSelectors(svgobjs: any[]) {
        const styleSheets: any[] = []

        const setStyle = (svgobjs: any[], index?: any) => {
            const newArray: any[] = []
            svgobjs.forEach((svgObj, i) => {
                if (index === null) styleSheets.push(svgObj.styleSheet ? svgObj.styleSheet : {})

                const styleSheet = styleSheets[index != null ? index : i]
                const elementStyleSelectors = Object.keys(styleSheet).filter((key) => !key.startsWith('.') && !key.startsWith('#'))

                if ('children' in svgObj) svgObj.children = setStyle(svgObj.children, index != null ? index : i)

                if (elementStyleSelectors.includes(svgObj['#name'])) {
                    svgObj['$'].style = {
                        ...styleSheet[svgObj['#name']],
                        ...svgObj['$'].style
                    }
                }
                newArray.push(svgObj)
            })
            return newArray
        }

        const cleanStyleSheets = (svgobjs: any[]) => {
            const newArray: any[] = []
            svgobjs.forEach((svgObj, i) => {
                const styleSheet = styleSheets[i]
                const elementStyleSelectors = Object.keys(styleSheet).filter((key) => !key.startsWith('.') && !key.startsWith('#'))
                elementStyleSelectors.forEach((key) => {
                    delete svgObj.styleSheet[key]
                })
                newArray.push(svgObj)
            })
            return newArray
        }

        const fixedStyle = setStyle(svgobjs, null)
        const returnObj = cleanStyleSheets(fixedStyle)

        return returnObj
    }

    passStyleNPropsToChildren(svgobjs: any[]) {
        const newArray: any[] = []

        const getElmProps = (propObj: { [x: string]: any }) => {
            if (propObj['#name'] === 'svg' || !('$' in propObj))
                return {
                    props: [],
                    style: []
                }

            const attributes = propObj['$']
            const props: any = {}
            const styleProps: any = {}
            Object.keys(attributes).forEach((key) => {
                if (key === 'style') {
                    Object.keys(attributes[key]).forEach((styleKey) => {
                        styleProps[styleKey] = attributes.style[styleKey]
                    })
                } else props[key] = attributes[key]
            })

            return {
                props: props,
                style: styleProps
            }
        }

        svgobjs.forEach((svgObj) => {
            if (!['defs', 'mask', 'linearGradient'].includes(svgObj['#name'])) {
                const svgObjPropsNStyle = getElmProps(svgObj)
                if ('children' in svgObj) {
                    svgObj.children.forEach((child: any) => {
                        const childPropsNStyle = getElmProps(child)
                        Object.keys(svgObjPropsNStyle.props).forEach((propKey) => {
                            if (!Object.keys(childPropsNStyle.props).includes(propKey)) {
                                child['$'][propKey] = svgObjPropsNStyle.props[propKey]
                            }
                        })

                        Object.keys(svgObjPropsNStyle.style).forEach((styleKey) => {
                            if (!Object.keys(childPropsNStyle.style).includes(styleKey)) {
                                if (!('$' in child)) {
                                    child['$'] = {}
                                }
                                if (!('style' in child['$'])) child['$'].style = {}
                                child['$'].style[styleKey] = svgObjPropsNStyle.style[styleKey]
                            }
                        })

                        svgObj.children = this.passStyleNPropsToChildren(svgObj.children)
                    })
                }
            }
            newArray.push(svgObj)
        })
        return newArray
    }

    removeUnnesesaryStyles(svgobjs: any[]) {
        const newArray: any[] = []
        svgobjs.forEach((svgObj) => {
            if ('children' in svgObj) svgObj.children = this.removeUnnesesaryStyles(svgObj.children)

            if (!('$' in svgObj) || !('style' in svgObj['$'])) {
                newArray.push(svgObj)
                return
            }

            const cleanStyle: any = {}
            const styleKeys = Object.keys(svgObj['$'].style)
            let filteredStyleKeys: string[] = [...Object.keys(svgObj['$'].style)]

            if ((styleKeys.includes('stroke') && svgObj['$'].style['stroke'] == 'none') || !styleKeys.includes('stroke')) {
                filteredStyleKeys = filteredStyleKeys.filter((styleKey) => !styleKey.includes('stroke'))
            }

            if (styleKeys.includes('fill') && svgObj['$'].style['fill'] == 'none') {
                filteredStyleKeys = filteredStyleKeys.filter((styleKey) => !styleKey.includes('fill-'))
            }

            if (styleKeys.includes('opacity') && svgObj['$'].style['opacity'] == '1') {
                filteredStyleKeys = filteredStyleKeys.filter((styleKey) => !styleKey.includes('opacity'))
            }

            if (styleKeys.includes('transform')) {
                filteredStyleKeys = filteredStyleKeys.filter((styleKey) => !styleKey.includes('transform'))
            }

            filteredStyleKeys.forEach((styleKey) => {
                cleanStyle[styleKey] = svgObj['$'].style[styleKey]
            })

            svgObj['$'].style = cleanStyle

            newArray.push(svgObj)
        })
        return newArray
    }


    removeStyleParentDublicates(svgobjs: any[]) {
        const newArray: any[] = []
        svgobjs.forEach((svgObj) => {
            if ('children' in svgObj) {
                svgObj.children = this.removeStyleParentDublicates(svgObj.children)
                // let newChildren = []
                svgObj.children.forEach((child: any, i: number) => {
                    if (!('$' in child) || !('$' in svgObj) || !('style' in svgObj['$']) || !('style' in child['$'])) return
                    const parentStyleKeys = Object.keys(svgObj['$'].style)
                    parentStyleKeys.forEach((styleKey) => {
                        if (svgObj['$'].style[styleKey] === child['$'].style[styleKey]) delete child['$'].style[styleKey]
                    })
                })
            }
            newArray.push(svgObj)
        })
        return newArray
    }

    fixViewBoxAndDimensions(svgobjs: any[]) {
        const newArray: any[] = []
        svgobjs.forEach((svgObj) => {
            if (!('viewBox' in svgObj['$'])) {
                if ('width' in svgObj['$'] && 'height' in svgObj['$']) {
                    let { width, height } = svgObj['$']
                    width = !width.includes('px') ? width : width.Split['px'][0]
                    height = !width.includes('px') ? width : width.Split['px'][0]
                    svgObj['$']['viewBox'] = `0 0 ${width} ${height}`
                    delete svgObj['$']['height']
                    delete svgObj['$']['width']
                }
            } else if (svgObj['$'].viewBox.includes(',')) svgObj['$'].viewBox = svgObj['$'].viewBox.replaceAll(',', ' ')
            if ('width' in svgObj['$'] && 'height' in svgObj['$']) {
                delete svgObj['$']['height']
                delete svgObj['$']['width']
            } else {
                if ('width' in svgObj['$'] && 'height' in svgObj['$']) {
                    delete svgObj['$']['height']
                    delete svgObj['$']['width']
                }
            }

            newArray.push(svgObj)
        })
        return newArray
    }

    ReactifySvgObjs(svgobjs: any[]) {
        const newArray: any[] = []
        svgobjs.forEach((svgObj) => {
            if ('children' in svgObj) svgObj.children = this.ReactifySvgObjs(svgObj.children)

            if (!('$' in svgObj)) {
                newArray.push(svgObj)
                return
            }

            Object.keys(svgObj['$']).forEach((key) => {
                if (key == 'style') {
                    Object.keys(svgObj['$']['style']).forEach((styleKey) => {
                        const newStyleKey = styleKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
                        if (newStyleKey != styleKey) {
                            svgObj['$']['style'][newStyleKey] = svgObj['$']['style'][styleKey]
                            delete svgObj['$']['style'][styleKey]
                        }
                    })
                    return
                }

                let newKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
                switch (newKey) {
                    case 'class':
                        newKey = 'className'
                        break
                    case 'xmlns:xlink':
                        newKey = 'xmlnsXlink'
                        break
                    case 'xml:space':
                        newKey = 'xmlSpace'
                        break
                    default:
                        break
                }
                if (newKey != key) {
                    svgObj['$'][newKey] = svgObj['$'][key]
                    delete svgObj['$'][key]
                }
            })
            newArray.push(svgObj)
        })
        return newArray
    }

    classifyStyles(svgobjs: any[], index?: any) {
        const combinedStyles: any[] = []

        const findValidClassName = (baseName: any, index: any) => {
            const r = (Math.random() + 1).toString(36).substring(3)
            const className = '.' + baseName + '_' + r
            const fix = className.replaceAll(' ', '').replaceAll(',', '')
            return fix
        }

        const doClassing = (svgobjs: any[], index?: any) => {
            const newArray: any[] = []
            svgobjs.forEach((svgObj, i) => {
                if (index === null) combinedStyles.push(svgObj.styleSheet ? svgObj.styleSheet : {})
                if ('children' in svgObj) {
                    svgObj.children = doClassing(svgObj.children, index != null ? index : i)
                }
                if ('$' in svgObj && 'style' in svgObj['$']) {
                    if ('className' in svgObj['$']) {
                        const originalClassName = svgObj['$'].className
                        const className = findValidClassName(originalClassName, index != null ? index : i)
                        combinedStyles[index != null ? index : i] = {
                            ...combinedStyles[index != null ? index : i],
                            [className]: svgObj['$'].style
                        }
                        delete combinedStyles[index != null ? index : i]['.' + originalClassName]
                        svgObj['$'].className = className.slice(1)
                        delete svgObj['$'].style
                    } else {
                        const className = findValidClassName(svgObj['#name'], index != null ? index : i)
                        combinedStyles[index != null ? index : i] = {
                            ...combinedStyles[index != null ? index : i],
                            [className]: svgObj['$'].style
                        }
                        const realClassName = className.slice(1)
                        svgObj['$'].className = `${realClassName}`
                        delete svgObj['$'].style
                    }
                }
                newArray.push(svgObj)
            })
            return newArray
        }

        const classified = doClassing(svgobjs, null)
        return classified.map((obj, i) => ({ ...obj, styleSheet: combinedStyles[i] }))
    }
}


export default FormatFunctions
