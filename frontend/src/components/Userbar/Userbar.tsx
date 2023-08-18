import { FC } from "react";
import { useSelector } from "react-redux";
import RootState from "../../models/RootState";
import useAuth from "../../hooks/useAuth";
import styles from './Userbar.module.css'

const Userbar: FC = () => {
    const user = useSelector((state: RootState) => state.toolkit.user);
    const {logout} = useAuth();

    return(
        <div className={styles.pannel}>
            <div className={styles.content}>
                <h3>Добро пожаловать, {user.email}</h3>
                <h4>{user.isActivated ? 'Аккаунт активирован' : 'Вам надо активировать аккаунт'}</h4>
                <button onClick={() => logout()}>Выйти</button>
            </div>
        </div>
    )
}

export default Userbar;