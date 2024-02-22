import { createAction } from '@reduxjs/toolkit'
import { SearchMode } from '../../types/states'

export const setContents = createAction<string[]>('data/setContents')

export const setSearchMode = createAction<SearchMode>('data/setSearchMode')

export const setSearchString = createAction<string>('data/setSearchString')

export const setHomePageSelected = createAction<number | null>('data/homePageSelected')
