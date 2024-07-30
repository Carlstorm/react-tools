import React from 'react'

// components
import CodeBox from './CodeBox'

// style
import style from './CodeResult.module.scss'
import SvgFormatHandler from '../../utility/SvgFormatHandler'
import Button from '../../../../components/button/Button'
import JSZip from 'jszip'

type CodeResultProps = {
    svgStringHandler: SvgFormatHandler
    selected: number
}

const CodeResult: React.FC<CodeResultProps> = ({ svgStringHandler, selected }) => {
    const type = svgStringHandler.svgObjs[selected].exportOptions.type
    const exportStyle = svgStringHandler.svgObjs[selected].exportOptions.style
    const exportStyleFormat = svgStringHandler.svgObjs[selected].exportOptions.format

    const handleDownload = () => {
        const componentName = svgStringHandler.svgObjs[selected].componentName

        if (type === 'svg' || exportStyle === 'inline') {
            // Create a blob with the JavaScript content
            const blob = new Blob([svgStringHandler.makeSvgString(selected)], { type: 'text/javascript' });
            
            // Create a download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = GetComponentName();
            
            // Simulate click on the link to trigger download
            link.click();

            return
        }
        const zip = new JSZip();
        // Create a folder named 'assets'
        const folder = zip.folder(componentName);

        if (!folder)
            return
        
        // Add files to the folder
        folder.file(GetStyleName(), svgStringHandler.makeStyleString(selected));
        folder.file(GetComponentName(), svgStringHandler.makeSvgString(selected));
    
        // Generate the zip file
        zip.generateAsync({ type: 'blob' }).then(content => {
          // Create a download link
          const link = document.createElement('a');
          link.href = URL.createObjectURL(content);
          link.download = componentName+'.zip';
          link.click();
        });
      };

      const handleDownloadAll = () => {
        const combinedZip = new JSZip();

        svgStringHandler.svgObjs.forEach((element, i) => {

            if (type === 'svg' || exportStyle === 'inline') {
                combinedZip.file(GetComponentName(i), svgStringHandler.makeSvgString(i));
                return
            }

            const folder = combinedZip.folder(element.componentName);

            if (!folder)
                return

            // Add files to the folder
            folder.file(GetStyleName(i), svgStringHandler.makeStyleString(i));
            folder.file(GetComponentName(i), svgStringHandler.makeSvgString(i));
        });

        combinedZip.generateAsync({ type: 'blob' }).then(content => {
            // Create a download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'Svgs.zip';
            link.click();
          }); 
      };

    const GetComponentName = (index?: number) => {
        const id = typeof index == "undefined" ? selected : index;
        if (type === 'svg') return svgStringHandler.svgObjs[id].componentName + '.svg'
        else if (type === 'js') return svgStringHandler.svgObjs[id].componentName + '.jsx'
        else if (type === "razor") return svgStringHandler.svgObjs[id].componentName + '.razor'
        else return svgStringHandler.svgObjs[id].componentName + '.tsx'
    }

    const GetStyleName = (index?: number) => {
        const id = typeof index == "undefined" ? selected : index;
        let styleName = svgStringHandler.svgObjs[id].componentName
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

    return (
        <div className={style.component}>
            <div className={style.component_code}>
                <CodeBox 
                    svgStringHandler={svgStringHandler} 
                    content={svgStringHandler.makeSvgString(selected)} 
                    selected={selected} title={GetComponentName()} 
                    className={type === 'svg' || exportStyle === 'inline' ? "" : style.codeBoxLimit}
                />
                {type === 'svg' || exportStyle === 'inline' || exportStyle === 'params' ? null : (
                    <>
                        <div className={style.code_split}></div>
                        <CodeBox svgStringHandler={svgStringHandler} content={svgStringHandler.makeStyleString(selected)} selected={selected} title={GetStyleName()} />
                    </>
                )}
            </div>
            <div style={{display: "flex", gap: "8px"}}>
                <Button title='Download' className={style.component_download} onClick={() => handleDownload()}/>
                <Button title='Download All' className={style.component_download} onClick={() => handleDownloadAll()}/>
            </div>
        </div>
    )
}

export default CodeResult
