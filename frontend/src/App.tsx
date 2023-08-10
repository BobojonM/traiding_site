import { useEffect, useState } from 'react'
import './App.css'
import LoginForm from './components/LoginForm/LoginForm'
import useAuth from './hooks/useAuth'
import { useSelector } from 'react-redux'
import RootState from './models/RootState'
import { IUser } from './models/IUser'
import UserService from './servises/UsersServise'

function App() {
  const isAuth = useSelector((state: RootState) => state.toolkit.isAuth);
  const isLoading = useSelector((state: RootState) => state.toolkit.isLoading);
  const user = useSelector((state: RootState) => state.toolkit.user);
  const {checkAuth, logout} = useAuth();
  const [users, setUsers] = useState<IUser[]>([]);
  // console.log(user);
  
  
  
  useEffect(() => {
    if(!isAuth){
      checkAuth();
    }
  }, []);

  const getUsers = async () => {
    try{
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    }catch(e: any){
      console.log(e);
    }
  }


  if(isLoading){
    return(<div className='loader'></div>)
  } 
  
  if(!isAuth){
    return(
      <>
        <div className='login'>
        </div>
        <LoginForm/>
      </>
    )
  }else{
    return (
      <>
        <h1>{isAuth ? `User ${user.email} is loged in` : 'User is not loged in'}</h1>
        <h3>{user.isActivated ? 'Account is activated' : 'You better activate your account'}</h3>
        <button onClick={() => logout()}>Exit</button>
        <div>
          <button onClick={() => getUsers()}>Get users</button>
        </div>

        {users.map(user => 
          <div key={user.email}>{user.email}</div>  
        )}
      </>
    )
  }


}

export default App
