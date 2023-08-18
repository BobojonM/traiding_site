import { FC, useState } from "react";
import styles from './NavBar.module.css'
import NavButton from "../../../../components/UI/Buttons/NavButton";


export interface Section {
    name: string;
    val: string;
}

interface NavBarProps {
    onButtonClick: (buttonName: Section) => void;
}

const NavBar: FC<NavBarProps> = ({onButtonClick}) => {
    const [active, setActive] = useState(0); 

    const buttons: Section[] = [
        {
            name: 'rules',
            val: 'Правила'
        }, 
        {
            name: 'trends',
            val: 'Тренды'
        }
    ];

    const changeActive = (index: number) => {
        setActive(index);
        onButtonClick(buttons[index]);
    }
    return(
        <nav className={styles.navigation}>
            <ul>
                {buttons.map((elem, index) => (
                    <li key={elem.name}>
                        <NavButton action={() => changeActive(index)} isActive={index === active}>{elem.val}</NavButton>
                    </li>
                ))}
            </ul>
      </nav>
    )

}


export default NavBar;