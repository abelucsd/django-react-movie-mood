import React from 'react'
import {Navigate, Route, RouteProps} from "react-router"
import {useSelector} from "react-redux"
import {RootState} from "../store/index.ts"
import Login from '../components/main/Login'

/**
 * component:
 */
const ProtectedRoute = (props) => {
    // authSlice auth 
    const auth = useSelector((state) => state.auth)
    console.log(auth)
    /**
     * Consider using a different url for Login instead of using Main. 
     * Could use a main page separate from Login.
     * Hide the main page with the ProtectedRoute
     */    
    if (auth.account) {
        if (props.path === "/") {
            return <Navigate replace to={"/login"} />
        }
        return <Route {...props} />        
    } else if (!auth.account) {
        // Consider using /login
        return <Navigate replace to={"/login"} />
    } else {
        // Account not found.
        return <div>Not Found</div>
    }    
}

export default ProtectedRoute