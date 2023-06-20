import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: ''
}

export const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setId: (state, { payload }) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.id = payload.id
        },
    },
})

// Action creators are generated for each case reducer function
export const { setId } = mainSlice.actions

export default mainSlice.reducer

export const mainState = (state) => state.main