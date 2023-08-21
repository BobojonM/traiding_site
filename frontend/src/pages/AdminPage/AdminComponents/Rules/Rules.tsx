import { FC, useState } from "react";
import styles from './Rules.module.css'

const Rules: FC = () => {
    const menu = ['Long', 'Short', 'Все'];
    const [active, setActive] = useState(0); 

    const changeActive = (id: number) => {
        setActive(id);
    }
    return(
        <div className={styles.rules}>
            <h1>Правила</h1>
            <ul className={styles.menu}>
                {menu.map((elem: string, index: number) => (
                    <li key={elem} 
                        className={active === index ? styles.menu_active : ''}
                        onClick={() => changeActive(index)}>{elem}
                    </li>
                ))}
            </ul>

            
        </div>
    )
}

export default Rules;