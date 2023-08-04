import { FC, useState } from "react";
import { useDispatch} from "react-redux";
import AuthServise from "../servises/AuthService";
import { setAuth, setUser } from "../store/stateSlice";

const LoginForm: FC = () => {
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async(email: string, password: string) => {
        try{
            const response = await AuthServise.login(email, password);
            console.log(response);
            
            localStorage.setItem('token', response.data.accessToken);
            dispatch(setAuth(true));
            dispatch(setUser(response.data.user));
        }catch{
            console.log('Some error happened');   
        }
    }

    const register = async(email: string, password: string) => {
        try{
            const response = await AuthServise.registration(email, password);
            console.log(response);

            localStorage.setItem('token', response.data.accessToken);
            dispatch(setAuth(true));
            dispatch(setUser(response.data.user));
        }catch{
            console.log('Some error happened');   
        }
    }

    return(
        <div>
            <input type="text"
                onChange={e => setEmail(e.target.value)}
                value={email}
                placeholder="Email"    
            />
            <input type="text"
                onChange={e => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
            />
            <button onClick={() => login(email, password)}>Login</button>
            <button onClick={() => register(email, password)}>Registration</button>
        </div>
    );
}

export default LoginForm;
