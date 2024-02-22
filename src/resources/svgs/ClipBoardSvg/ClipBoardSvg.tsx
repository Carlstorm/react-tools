import React, { Ref, SVGProps, forwardRef } from 'react'
import style from './ClipBoardSvg.module.scss'

interface ClipBoardSvgProps extends SVGProps<SVGSVGElement> {
	customProps?: object
}

const ClipBoardSvg = forwardRef((props: ClipBoardSvgProps, ref?: Ref<SVGSVGElement>) => {
	const { customProps, ...svgProps } = props;

	return (
		<svg
			viewBox="3.5 1.5 17 21"
			xmlns="http://www.w3.org/2000/svg"
			{...svgProps}
			className={svgProps.className ? [svgProps.className, style._0].join(" ") : style._0}
			ref={ref}
		>
			<title>copy</title>
			<path
				d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z"
			></path>
		</svg>
	)
})

ClipBoardSvg.displayName = 'ClipBoardSvg';

export default ClipBoardSvg;
