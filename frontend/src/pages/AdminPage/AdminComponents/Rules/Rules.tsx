import { FC, useEffect, useState } from "react";
import styles from './Rules.module.css'
import { IRule } from "../../../../models/IRule";
import RuleService from "../../../../servises/RuleService";

const Rules: FC = () => {
    const [rules, setRules] = useState<IRule[]>([]);
    const [menu, setMenu] = useState<string[]>(['Все']);
    const [active, setActive] = useState(0); 

    const changeActive = (id: number) => {
        setActive(id);
    }

    const getRules = async() => {
        try{
            const response = (await RuleService.getRules()).data;
            setRules(response);
            const distinctTypes = [...new Set(response.map(rule => rule.type))];
            setMenu([...menu, ...distinctTypes]);
        }catch(e: any){
            console.log(e);
          }
    }

    useEffect(() => {
        getRules();
    }, []);

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
            <ul>

                {rules
                .filter(elem => menu[active] === 'Все' || elem.type === menu[active]) // Filter rules based on selected type
                .map((elem: IRule, index: number) => (
                    <li key={index}>
                        {elem.rulename}
                    </li>
                ))}
            </ul> 
        </div>
    )
}

export default Rules;