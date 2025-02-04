import React, { useState } from 'react'
import PT from 'prop-types'

const initialFormValues = {
  username: '',
  password: '',
}
export default function LoginForm(props) {
  const [values, setValues] = useState(initialFormValues)
  const { login, setMessage } = props
  // ✨ where are my props? Destructure them here

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = async (evt) => {
    evt.preventDefault()
    const { username, password } = values
    if (isDisabled()) {
      return
    }

    try {
      const res = await login(username, password)
      if (res.ok) {
        console.log('Login successful:', res.message)
      } else {
        console.log('Login failed:', res.message)
        setMessage(res.message)
      }
    } catch (err) {
      console.error('Error during login', err)
    }
    
    // ✨ implement
  }

  const isDisabled = () => {
    const trimUsername = values.username.trim()
    const trimPassword = values.password.trim()
    return trimUsername.length < 3 || trimPassword.length < 8
    // ✨ implement
    // Trimmed username must be >= 3, and
    // trimmed password must be >= 8 for
    // the button to become enabled
  }

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={isDisabled()} id="submitCredentials">Submit credentials</button>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
}
