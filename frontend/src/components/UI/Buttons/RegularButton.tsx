import { FC } from "react";
import { ButtonProps } from "./AuthButton";
import styles from "./Buttons.module.css"

const RegularButton: FC<ButtonProps> = ({action, children}) => {

    return(
        <button type="button" className={styles.regular} onClick={action}>
            {children}
        </button>
    )
}

export default RegularButton;