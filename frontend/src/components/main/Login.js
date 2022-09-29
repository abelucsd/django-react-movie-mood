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
            <form onSubmit={handleSubmit}>
              <input className='usernamefield'
                type="username"
                name="username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                />
              {errors.username && touched.username && errors.username}
              <input className='passwordfield'
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {errors.password && touched.password && errors.password}
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
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
  return (
    <div className="login">      
      <div className="loginform-container">
        <div className="loginform-message">
          Please Login
        </div>
        <div className="loginform">
          
          {loginForm()}
        </div>
      </div>

    </div>
  )
}

export default Login