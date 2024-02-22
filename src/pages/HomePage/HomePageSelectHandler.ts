import { Dispatch, SetStateAction } from 'react'

export default class HomePageSelectHandler {
    setFocusIndex: Dispatch<SetStateAction<number | null>>
    focusIndex: number | null
    constructor(focusIndex: number | null, setFocusIndex: { (value: SetStateAction<number | null>): void; (value: SetStateAction<number | null>): void }) {
        this.focusIndex = focusIndex
        this.setFocusIndex = setFocusIndex
    }

    init() {
        this.setFocusIndex(0)
    }

    resetyes() {
        this.setFocusIndex(null)
    }

    next() {
        console.log(this.focusIndex)
        if (this.focusIndex != null) this.setFocusIndex(this.focusIndex + 1)
    }

    get() {
        return this.focusIndex
    }
}
