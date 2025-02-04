import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin()
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = async ( username, password ) => {
    try {
      setMessage("")
      setSpinnerOn(true)
  
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
  
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Login failed. Please try again.')
      }
  
      const data = await res.json()
      localStorage.setItem('token', data.token)
      setMessage(data.message)
      redirectToArticles()
      return { ok: true, message: data.message}
  
    } catch (err) {
      setMessage(`An error occurred: ${err.message}`)
      console.error("Login error:", err)
      return { ok: false, message: err.message }
    } finally {
      setSpinnerOn(false)
    }
  
    
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = async () => {
    setSpinnerOn(true)

    const token = localStorage.getItem('token')
    if(!token) {
      setMessage("You must be logged in to view articles")
      redirectToLogin()
      return
    }

    try {
      const res = await fetch(articlesUrl, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": 'application/json',
        },
      })
      const data = await res.json() 
        if (res.ok) {
          setArticles(data.articles)
          setMessage(`Here are your articles, Foo!`)
        } else {
          setMessage('Failed to fetch articles.')
        }
      } catch (err) {
        setMessage('An error occurred while fetching articles.')
      } finally {
        setSpinnerOn(false)
      }
    
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = async (article) => {
    setMessage("")
    setSpinnerOn(true)

    const token = localStorage.getItem('token')
    if(!token) {
      setMessage("You must be logged in to post an article")
      redirectToLogin()
      return
    }

    try {

      const res = await fetch(articlesUrl, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": 'application/json',
        },
        body: JSON.stringify( article ),
      })
      const data = await res.json() 
      if (res.ok) {
        setMessage('Well done, Foo. Great article!')
        setArticles(prevArticles => [...prevArticles, data.article])
      } else {
        setMessage(data.message || 'Failed to post article')
      }
    } catch (err) {
      setMessage('An error occured while posting the article')
    } finally {
      setSpinnerOn(false)
    }
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = async ({ article_id, article }) => {
    setMessage("")
    setSpinnerOn(true)

    const token = localStorage.getItem('token')
    if(!token) {
      setMessage("You must be logged in to update an article")
      redirectToLogin()
      return
    }

    try {
      const res = await fetch(`${articlesUrl}/${article_id}`, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),  // article to update
      })
  
      const data = await res.json()
  
      if (res.ok) {
        setArticles(prevArt => prevArt.map(art => art.article_id === article_id ? {...art, ...article} : art))
        setMessage("Nice update, Foo!")
        // Optionally, you can fetch the updated articles to reflect the change
      } else {
        setMessage(data.message || 'Failed to update article')
      }
  
    } catch (err) {
      setMessage('An error occurred while updating the article')
    } finally {
      setSpinnerOn(false)
    }
    // ✨ implement
    // You got this!
  }

  const deleteArticle = async (article_id) => {
    setMessage("")
    setSpinnerOn(true)

    const token = localStorage.getItem('token')
    if(!token) {
      setMessage("You must be logged in to delete an article")
      redirectToLogin()
      return
    }
    try {
      const res = await fetch(`${articlesUrl}/${article_id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
          "Content-Type": 'application/json',
        },
      })
      if (res.ok) {
        setArticles(art => art.filter(article => article.article_id !== article_id))
        setMessage(`Article ${article_id} was deleted, Foo!`)
      } 
    } catch (err) {
      setMessage('An error occured while deleting the article')
    } finally {
      setSpinnerOn(false)
    }
    // ✨ implement
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/" >Login</NavLink>
          <NavLink id="articlesScreen" to="/articles" >Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle} updateArticle={updateArticle} setCurrentArticleId={setCurrentArticleId} currentArticle={currentArticleId}/>
              <Articles articles={articles} getArticles={getArticles} deleteArticle={deleteArticle} setCurrentArticleId={setCurrentArticleId}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}

