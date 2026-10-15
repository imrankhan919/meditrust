import { createSlice } from '@reduxjs/toolkit'

const readStoredUser = () => {
    try {
        const raw = localStorage.getItem("user")
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}


const initialState = {
    user: readStoredUser()
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