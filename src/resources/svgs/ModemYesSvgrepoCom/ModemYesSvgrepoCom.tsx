import React, { Ref, SVGProps, forwardRef } from 'react'
import style from './ModemYesSvgrepoCom.module.sass'

interface ModemYesSvgrepoComProps extends SVGProps<SVGSVGElement> {
	customProps?: object
}

const ModemYesSvgrepoCom = forwardRef((props: ModemYesSvgrepoComProps, ref?: Ref<SVGSVGElement>) => {
	const { customProps, ...svgProps } = props;

	return (
		<svg
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
			version="1.1"
			{...svgProps}
			ref={ref}
		>
			<path
				d="m 15,15 c 7,-2 14,-1 19,4 5,5 5,13 3,17 C 36,30 34,25 29,21 22,15 15,15 15,15 z"
				className={style._0}
			></path>
			<path
				d="m 16,5 c 9,-1 20,4.6 24,9 6,7 8,16 8,22 C 51,30 53,21 44,10 35,-1 21,2 16,5 z"
				className={style._1}
			></path>
			<path
				d="m 15,69 0,-30 c 0,0 -3,-1 -3,-7 0,-4 3,-7 7,-7 5,0 8,3 8,7 0,6 -3,7 -3,7 l 0,30 z"
				className={style._2}
			></path>
			<path
				d="m 92,69 c 4,0 5,1 5,5 l 0,18 c 0,5 0,6 -5,6 L 7,98 C 2,98 2,97 2,90 L 2,74 c 0,-3 0,-5 4,-5 z"
				className={style._3}
			></path>
			<circle
				cx="19"
				cy="82"
				r="4"
				className={style._4}
			></circle>
			<circle
				cx="83"
				cy="82"
				r="4"
				className={style._5}
			></circle>
			<circle
				cx="68"
				cy="82"
				r="4"
				className={style._5}
			></circle>
			<circle
				cx="53"
				cy="82"
				r="4"
				className={style._5}
			></circle>
			<path
				d="M 38,49 C 41,53 56,82 58,95 63,87 63,73 98,35 86,42 69,57 57,68 54,64 48,56 38,49"
				className={style._6}
			></path>
		</svg>
	)
})

ModemYesSvgrepoCom.displayName = 'ModemYesSvgrepoCom';

export default ModemYesSvgrepoCom;
