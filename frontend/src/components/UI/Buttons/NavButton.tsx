import { FC } from "react";
import { ButtonProps } from "./AuthButton";
import styles from "./Buttons.module.css"

interface NavButtonProps extends ButtonProps {
    isActive: boolean;
  }

const NavButton: FC<NavButtonProps> = ({action, children, isActive}) => {
    const buttonClassName = isActive ? `${styles.nav} ${styles.nav_act}` : styles.nav;

    return(
        <button className={buttonClassName} onClick={action}>
            {children}
        </button>
    )
}

export default NavButton;