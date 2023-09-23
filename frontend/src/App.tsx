import { useEffect } from 'react'
import './App.css'
import LoginForm from './components/LoginForm/LoginForm'
import useAuth from './hooks/useAuth'
import { useSelector } from 'react-redux'
import RootState from './models/RootState'
import AdminPage from './pages/AdminPage/AdminPage'
import Userbar from './components/Userbar/Userbar'

function App() {
  const isAuth = useSelector((state: RootState) => state.toolkit.isAuth);
  const isLoading = useSelector((state: RootState) => state.toolkit.isLoading);
  const user = useSelector((state: RootState) => state.toolkit.user);
  const {checkAuth} = useAuth();
  // const [users, setUsers] = useState<IUser[]>([]);
  
  
  
  useEffect(() => {
    if(!isAuth){
      checkAuth();
    }
  }, []);

  // const getUsers = async () => {
  //   try{
  //     const response = await UserService.fetchUsers();
  //     setUsers(response.data);
  //   }catch(e: any){
  //     console.log(e);
  //   }
  // }


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
        {/* <h1>{isAuth ? `User ${user.email} is loged in` : 'User is not loged in'}</h1>
        <h3>{user.isActivated ? 'Account is activated' : 'You better activate your account'}</h3>
        <button onClick={() => logout()}>Exit</button>
        <div>
          <button onClick={() => getUsers()}>Get users</button>
        </div>

        {users.map(user => 
          <div key={user.email}>{user.email}</div>  
        )} */}
        {user.isAdmin ? <AdminPage/> : (
          <div>
            <Userbar openSetting={() => {}}/>
            <h1>Здесь будет страница для обычных пользователей</h1>
          </div>

        )}
        
      </>
    )
  }


}

export default App
