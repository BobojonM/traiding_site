import { FC } from "react";
import { ButtonProps } from "./AuthButton";
import styles from "./Buttons.module.css"

interface NavButtonProps extends ButtonProps {

}

const RegularButton: FC<NavButtonProps> = ({action, children}) => {

    return(
        <button className={styles.regular} onClick={action}>
            {children}
        </button>
    )
}

export default RegularButton;