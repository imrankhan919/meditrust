import { createSlice } from '@reduxjs/toolkit'

let userExist = JSON.parse(localStorage.getItem("user"))


const initialState = {
    user: userExist || null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        register: (state, action) => {
            return {
                ...state,
                user: action.payload
            }
        }
    }
});

export const { register } = authSlice.actions

export default authSlice.reducer