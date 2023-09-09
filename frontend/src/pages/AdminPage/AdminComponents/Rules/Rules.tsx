import { FC, useEffect, useState } from "react";
import styles from './Rules.module.css'
import { IRule } from "../../../../models/IRule";
import RuleService from "../../../../servises/RuleService";
import RegularButton from "../../../../components/UI/Buttons/RegularButton";
import RulesDetail from "./RulesDetail";


const Rules: FC = () => {
    const [rules, setRules] = useState<IRule[]>([]);
    const [menu, setMenu] = useState<string[]>(['Все']);
    const [active, setActive] = useState(0); 
    const [signalRule, setSignalRule] = useState<string>('');

    const changeActive = (id: number) => {
        setActive(id);
    }
    
    const showSignals = (ruleName: string) => {
        setSignalRule(ruleName);
    }

    const getRules = async() => {
        try{
            const response = (await RuleService.getRules()).data;
            setRules(response);
            const distinctTypes = [...new Set(response.map(rule => rule.type))].filter(type => !menu.includes(type));
            setMenu([...menu, ...distinctTypes]);
        }catch(e: any){
            console.log(e);
          }
    }

    const toggleStatus = async (ruleId: number) => {
        const ruleIndex = rules.findIndex(rule => rule.ruleid === ruleId);
    
        if (ruleIndex !== -1) {
            await RuleService.changeStatus(rules[ruleIndex].ruleid);
            setRules(prevRules =>
                prevRules.map((rule, index) =>
                    index === ruleIndex ? { ...rule, status: !rule.status } : rule
                )
            );
        }
    }
    

    useEffect(() => {
        getRules();
    }, []);

    return(
        <div className={styles.rules}>
            {signalRule ? (
                <>
                <h1>Сигналы для {signalRule}</h1>
                <RegularButton action={() => setSignalRule('')}>Назад</RegularButton>
                <RulesDetail ruleName={signalRule}/>
                </>
            ) : (
                <>
                    <h1>Правила</h1>
                    <ul className={styles.menu}>
                        {menu.map((elem: string, index: number) => (
                            <li key={elem} 
                                className={active === index ? styles.menu_active : ''}
                                onClick={() => changeActive(index)}>{elem}
                            </li>
                        ))}
                    </ul>

                    <table className={styles.ruleTable}>
                        <thead>
                            <tr>
                                <th>Rule Name</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules
                                .filter(elem => menu[active] === 'Все' || elem.type === menu[active])
                                .map((elem: IRule) => (
                                    <tr key={elem.ruleid}>
                                        <td>{elem.rulename}</td>
                                        <td>{elem.description}</td>
                                        <td>{elem.type}</td>
                                        <td>
                                            <label className={styles.switch}>
                                                <input
                                                    type="checkbox"
                                                    checked={elem.status}
                                                    onChange={() => toggleStatus(elem.ruleid)}
                                                />
                                                <span className={`${styles.slider} ${styles.round}`}></span>
                                            </label>
                                        </td>
                                        <td><RegularButton action={() => showSignals(elem.rulename)}>Signals</RegularButton></td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </>
            )}

        </div>
    )
}

export default Rules;