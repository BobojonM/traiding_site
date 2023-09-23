import { FC } from "react";
import { useSelector } from "react-redux";
import RootState from "../../models/RootState";
import useAuth from "../../hooks/useAuth";
import styles from './Userbar.module.css'
import RegularButton from "../UI/Buttons/RegularButton";

interface UserbarInterface {
    openSetting: () => void 
}

const Userbar: FC<UserbarInterface> = ({openSetting}) => {
    const user = useSelector((state: RootState) => state.toolkit.user);
    const {logout} = useAuth();
    const settings = () => {
        openSetting();
    }
    return(
        <div className={styles.pannel}>
            <div className={styles.content}>
                <h3>Добро пожаловать, {user.email}</h3>
                <h4>{user.isActivated ? 'Аккаунт активирован' : 'Вам надо активировать аккаунт'}</h4>

                {user.isAdmin 
                ? (
                    <div className={styles.settings}>
                        <RegularButton action={settings}>Настройки</RegularButton>
                    </div>
                ) : null}

                <button onClick={() => logout()}>Выйти</button>
            </div>
        </div>
    )
}

export default Userbar;