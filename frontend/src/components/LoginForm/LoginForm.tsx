import { FC, useState } from "react";
import useAuth from "../../hooks/useAuth";
import styles from "./LoginFrom.module.css"
import AuthButton from "../UI/Buttons/AuthButton";

const LoginForm: FC = () => {
    const {login, register} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        await login(email, password);
    };

    const handleRegister = async () => {
        await register(email, password);
    };

    return(
        <div className={styles.auth}>
            <div className={styles.authContent}>
                <h1 className={styles.contentH1}>Аутентификация</h1>
                <input type="text"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    placeholder="Email"
                    className={styles.contentInput}    
                />
                <input type="password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    placeholder="Password"
                    className={styles.contentInput}
                />
                <div className={styles.buttons}>
                    <div>
                        <AuthButton action={handleLogin}>
                            Войти
                        </AuthButton>
                    </div>
                    <div>
                        <AuthButton action={handleRegister}>
                            Зарегистрироваться
                        </AuthButton>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default LoginForm;
