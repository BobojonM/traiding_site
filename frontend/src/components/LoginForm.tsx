import { FC, useState } from "react";
import useAuth from "../hooks/useAuth";

const LoginForm: FC = () => {
    const {login, register} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
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
