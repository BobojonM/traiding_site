import { FC, ReactNode, MouseEventHandler } from "react";
import styles from "./Buttons.module.css"

export interface ButtonProps {
    action: MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
  }

const AuthButton: FC<ButtonProps> = ({action, children}) => {
    return(
        <button className={styles.authButton} onClick={action}>
            {children}
        </button>
    )
}

export default AuthButton;