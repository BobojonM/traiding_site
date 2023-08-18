import { FC } from "react";
import styles from './NavBar.module.css'
import NavButton from "../../../../components/UI/Buttons/NavButton";


const NavBar: FC = () => {
    return(
        <nav className={styles.navigation}>
            <ul>
                <li>
                    <NavButton action={() => {}} isActive={false}>Правила</NavButton>
                </li>
                <li>
                    <NavButton action={() => {}} isActive={true}>Тренды</NavButton>
                </li>
            </ul>
      </nav>
    )

}


export default NavBar;