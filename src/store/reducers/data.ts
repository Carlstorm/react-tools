import { createReducer } from '@reduxjs/toolkit'
import { setContents, setHomePageSelected, setSearchMode, setSearchString } from '../actions/data'
import { SearchMode } from '../../types/states'

interface DataReducer {
    contents: string[]
    searchString: string
    searchMode: SearchMode
    homePageSelected: number | null
}

const initialState: DataReducer = {
    contents: [],
    searchString: '',
    searchMode: null,
    homePageSelected: null
}

const dataReducer = createReducer<DataReducer>(initialState, (builder) => {
    builder.addCase(setContents, (state, action) => {
        state.contents = action.payload
    })
    builder.addCase(setSearchString, (state, action) => {
        state.searchString = action.payload
    })
    builder.addCase(setSearchMode, (state, action) => {
        state.searchMode = action.payload
    })
    builder.addCase(setHomePageSelected, (state, action) => {
        state.homePageSelected = action.payload
    })
})

export default dataReducer
