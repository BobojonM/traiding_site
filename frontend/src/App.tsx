import { useEffect } from 'react'
import './App.css'
import LoginForm from './components/LoginForm/LoginForm'
import useAuth from './hooks/useAuth'
import { useSelector } from 'react-redux'
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import RootState from './models/RootState'
import AdminPage from './pages/AdminPage/AdminPage'
import Userbar from './components/Userbar/Userbar'
import LandingPage from './pages/landing/LandingPage'

function App() {
  const isAuth = useSelector((state: RootState) => state.toolkit.isAuth);
  const user = useSelector((state: RootState) => state.toolkit.user);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    if (!isAuth) {
      checkAuth();
    }
  }, [isAuth, checkAuth]);

  useEffect(() => {
    if (isAuth && user.isAdmin) {
      navigate('/admin');
    } else if (isAuth && !user.isAdmin) {
      navigate('/user');
    }
  }, [isAuth, user]);

  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="/user"
          element={isAuth && !user.isAdmin ? (
            <div>
              <Userbar openSetting={() => {}} />
              <h1>Здесь будет страница для обычных пользователей</h1>
            </div>
          ) : <Navigate to="/" />}
        />
      </Routes>
  );
}

export default App;
