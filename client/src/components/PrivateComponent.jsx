import React from 'react'
import useAuthStatus from '../hooks/useAuthStatus'
import Loader from './common/Loader'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateComponent = () => {

    const { isLoggedIn, checkingUser } = useAuthStatus()

    if (checkingUser) {
        return <Loader />
    }


    return isLoggedIn ? <Outlet /> : <Navigate to={"/login"} />

}

export default PrivateComponent
