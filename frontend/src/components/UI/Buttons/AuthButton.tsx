import { FC, ReactNode, MouseEventHandler } from "react";
import styles from "./AuthButton.module.css"

interface AuthButtonProps {
    action: MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
  }

const AuthButton: FC<AuthButtonProps> = ({action, children}) => {
    return(
        <button className={styles.authButton} onClick={action}>
            {children}
        </button>
    )
}

export default AuthButton;