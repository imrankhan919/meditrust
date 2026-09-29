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
        },
        logoutUser: (state, action) => {
            return {
                ...state,
                user: null
            }
        },
        getProfile: (state, action) => {
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload
                }
            }
        }
    }
});

export const { register, getProfile, logoutUser } = authSlice.actions

export default authSlice.reducer