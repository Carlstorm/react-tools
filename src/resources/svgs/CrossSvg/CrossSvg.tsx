import React, { MouseEventHandler, SVGProps } from 'react'

type CrossSvgProps = {
    className?: string;
  } & SVGProps<SVGSVGElement>;

const CrossSvg: React.FC<CrossSvgProps> = (props) => {
    return (
        <svg {...props} viewBox="2 2 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 9L15 15" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 9L9 15" strokeLinecap="round" strokeLinejoin="round"/>
         </svg>
    )
}

export default CrossSvg
