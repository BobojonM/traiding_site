import { useEffect } from 'react'
import './App.css'
import LoginForm from './components/LoginForm'
import useAuth from './hooks/useAuth'
import { useSelector } from 'react-redux'
import RootState from './models/RootState'

function App() {
  const isAuth = useSelector((state: RootState) => state.toolkit.isAuth);
  const isLoading = useSelector((state: RootState) => state.toolkit.isLoading);
  const {checkAuth, logout} = useAuth();
  console.log(isAuth);
  console.log('is loading' + isLoading);
  
  
  
  useEffect(() => {
    if(localStorage.getItem('token')){
      checkAuth();
    }
  }, []);


  if(isLoading){
    return(<div className='loader'></div>)
  } 
  
  if(!isAuth){
    return(
      <LoginForm/>
    )
  }else{
    return (
      <>
        <h1>{isAuth ? 'User is loged in' : 'User is not loged in'}</h1>
        <button onClick={() => logout()}>Exit</button>
      </>
    )
  }


}

export default App
