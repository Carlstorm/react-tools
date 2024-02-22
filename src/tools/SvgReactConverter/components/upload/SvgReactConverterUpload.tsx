import React, { Dispatch, FormEvent, SetStateAction, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Button from '../../../../components/button/Button'
import style from './SvgReactConverterUpload.module.scss'
import SvgStringHandler from '../../utility/SvgFormatHandler'

type Event = {
    filesFromText: (ev: FormEvent<HTMLTextAreaElement>) => void
    filesFromBrowse: (ev: FormEvent<HTMLInputElement>) => void
}

const Or: React.FC = () => {
    return (
        <div className={style.Or}>
            <div></div>
            <span>OR</span>
            <div></div>
        </div>
    )
}

type UploadProps = {
    svgStringHandler: SvgStringHandler;
}

const SvgReactConverterUpload: React.FC<UploadProps> = ({ svgStringHandler }) => {

    const onDrop = useCallback((files: any) => {
        svgStringHandler.makeObjFromFiles(files)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true })

    const event: Event = {
        filesFromText: (ev) => {
            const value = ev.currentTarget.value
            svgStringHandler.makeSvgObjs([{svgCode: value, file: null}])
        },
        filesFromBrowse: (ev) => {
            const filesList = ev.currentTarget.files
            if (!filesList) return
            const files: File[] = Array.from(filesList)
            svgStringHandler.makeObjFromFiles(files)
        }
    }

    return (
        <div className={style.upload}>
            <div className={style.upload_container}>
                <div className={style.upload_drop} {...getRootProps()}>
                    <div className={style.upload_actions}>
                        <input {...getInputProps()}></input>
                        {isDragActive ? (
                            <p>Drop your files!</p>
                        ) : (
                            <>
                                <input onChange={(ev) => event.filesFromBrowse(ev)} type="file" id="upload" multiple hidden></input>
                                {svgStringHandler.fileError ? <p className={style.error}>{svgStringHandler.fileError}</p> : <p>Drag and drop svg files!</p>}
                                <Or />
                                <Button title="Browse files" for={'upload'} />
                            </>
                        )}
                    </div>
                </div>
                <Or />
                <textarea onInput={(ev) => event.filesFromText(ev)} spellCheck="false" placeholder="Paste svg code"></textarea>
            </div>
        </div>
    )
}

export default SvgReactConverterUpload
