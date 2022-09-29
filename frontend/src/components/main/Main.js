import React, {useState, useEffect} from 'react'
import './Main.css'
import axios from 'axios';
import authSlice from '../../store/slices/auth.ts';
import store from '../../store/index.ts';

function Main() {
    /**
     * States:
     *  - logged in, logged out
     *  - 
     */

    const [errorMessage, setErrorMessage] = useState("")
    const [isLogged, setIsLogged] = useState(false)
    const [userDetails, setUserDetails] = useState({
        user: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        password2: "",
        isCreated: false,
    })

    const goLogin = (e) => {
        console.log("Logging in")
        let {user, password} = e.target
        axios.post(`${process.env.REACT_APP_MAIN_URL}/login/`, {user, password})
        .then((res) => {
            // dispatch to change the state.
            store.dispatch(
                authSlice.actions.setAccount(res.data.user)
            )
            store.dispatch(
                authSlice.actions.setAuthTokens({
                    token: res.data.access,
                    refreshToken: res.data.refresh
                })
            )
            // Could set a loading state to check if promise is complete.
        })
        .catch((err) => {
            setErrorMessage(err.response.data.detail.toString())
        })
    }


    return (
        <div>Hi</div>
    )
}

export default Main