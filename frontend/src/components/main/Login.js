import React, {useState, useEffect} from 'react'
import './Main.css'
import axios from 'axios';
import authSlice from '../../store/slices/auth.ts';
import store from '../../store/index.ts';
import { Formik } from 'formik'
import './Login.css'

/**
 * 
 * @returns 
 */
function Login() {  
  const [showLogin, setShowLogin] = useState(true)
  const [showRegistration, setShowRegistration] = useState(false)
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

  const loginForm = () => {
    return (
      <div>
        <Formik
          initialValues={{ username: '', password: '' }}
          validate={values => {
            const errors = {}
            if (!values.username) {
              errors.email = 'Required username'
            }
            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2))
              setSubmitting(false)
            }, 400)
          }}
        > 
        {
          (
            {
              values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting
            }
          ) => (            
            <form className="loginform" onSubmit={handleSubmit}>
              <input className="usernamefield textfield"
                type="username"
                name="username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                />
              {errors.username && touched.username && errors.username}
              <input className="passwordfield textfield"
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {errors.password && touched.password && errors.password}
              <div className="submitbutton-container">
                <button className='submitbutton' type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    )
  }

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
  
  const loginView = () => {
    var loginButtonClass = showLogin ? 'button-mode-active' : 'button-mode-inactive'
    var registrationButtonClass = showRegistration ? 'button-mode-active' : 'button-mode-inactive'
    return (
    <div className="login">
      <div className="welcome-container">
      </div>      
      <div className="loginform-container">
        <div className="loginform-message">          
          <text className={loginButtonClass} onClick={handleLoginViewClick}>Login</text>
          <text className={registrationButtonClass} onClick={handleRegViewClick}>Register</text>
        </div>        
        <div>          
          { showLogin && loginForm() }
          { showRegistration }
        </div>
      </div>
    </div>
    )}

  
  const handleLoginViewClick = () => {
    if (showLogin == false) {
      setShowLogin(!showLogin)
      setShowRegistration(!showRegistration)    
    }
  }

  const handleRegViewClick = () => {
    if (showRegistration == false) {
      setShowRegistration(!showRegistration)
      setShowLogin(!showLogin)
    }
  }

  
  return (
    <div>
      {loginView()}
    </div>
  )
}

export default Login