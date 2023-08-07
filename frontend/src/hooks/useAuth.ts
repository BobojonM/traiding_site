import AuthServise from "../servises/AuthService";
import { useDispatch } from "react-redux";
import { setAuth, setLoading, setUser } from "../store/stateSlice";
import { IUser } from "../models/IUser";
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";

const useAuth = () => {
  const dispatch = useDispatch();

  const login = async (email: string, password: string) => {
    dispatch(setLoading(true));
    try {
      const response = await AuthServise.login(email, password);
      console.log(response);

      localStorage.setItem('token', response.data.accessToken);
      dispatch(setAuth(true));
      dispatch(setUser(response.data.user));
    } catch(e: any) {
      console.log(e.response?.data?.message);
    }finally{
      dispatch(setLoading(false));
    }
  };

  const register = async (email: string, password: string) => {
    dispatch(setLoading(true));
    try {
      const response = await AuthServise.registration(email, password);
      console.log(response);

      localStorage.setItem('token', response.data.accessToken);
      dispatch(setAuth(true));
      dispatch(setUser(response.data.user));
    } catch(e: any) {
      console.log(e.response?.data?.message);
    }finally{
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    dispatch(setLoading(true));
    try{
      await AuthServise.logout();
      localStorage.removeItem('token');
      dispatch(setAuth(false));
      dispatch(setUser({} as IUser));
    }catch(e: any){
      console.log(e.response?.data?.message);
    }finally{
      dispatch(setLoading(false));
    }
  }

  const checkAuth = async () => {
    dispatch(setLoading(true));
    try{
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
      
      localStorage.setItem('token', response.data.accessToken);
      dispatch(setAuth(true));
      dispatch(setUser(response.data.user));
    }catch(e: any){
      console.log(e.response?.data?.message);
    }finally{
      dispatch(setLoading(false));
    }
  }

  return { login, register, logout, checkAuth};
};

export default useAuth;
