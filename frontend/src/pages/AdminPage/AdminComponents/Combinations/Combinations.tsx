import { FC, useEffect, useState } from "react";
import styles from './Combinations.module.css'

import { ICombination } from "../../../../models/ICombination";
import RuleService from "../../../../servises/RuleService";

interface CombinationsMenu {
    name: string
    timeframe: '1h' | '4h'
    type: 'long' | 'short'
}

const menu: CombinationsMenu[] = [
    {
        name: '1 час Long',
        timeframe: '1h',
        type: 'long'
    },
    {
        name: '1 час Short',
        timeframe: '1h',
        type: 'short'
    },
    {
        name: '4 часа Long',
        timeframe: '4h',
        type: 'long'
    },
    {
        name: '4 часа Short',
        timeframe: '4h',
        type: 'short'
    }
]

const formatData = (data: string) => {
    // Split the data string by '\n' to create an array of items
    const items = data.split('\n').filter(Boolean); // Remove empty strings

    return items.map((item, index) => {
        const [firstWord, date, time, rule] = item.split(' ');

        return (
            <div className={styles.list} key={index}>
                <div><b>{firstWord}</b></div>
                <div>{date}</div>
                <div>{time}</div>
                <div>{rule}</div>
            </div>
        );
    });
};

const Combinations: FC = () => {
    const [combinations, setCombinations] = useState<ICombination[]>([]);
    const [active, setActive] = useState<CombinationsMenu>(menu[0]);

    const changeActive = (id: number) => {
        setActive(menu[id]);
    }

    const getConnections = async () => {
        try {
            const response = (await RuleService.getConnections(active.timeframe, active.type)).data;
            console.log(response);

            setCombinations([...response]);
        } catch (e: any) {
            console.log(e);
            setCombinations([]);
        }
    }

    useEffect(() => {
        getConnections();
        // Set up a timer to fetch signals every minute
        const fetchInterval = setInterval(() => {
            getConnections();
        }, 600000);

        // Clean up the timer when the component unmounts
        return () => {
            clearInterval(fetchInterval);
        };
}, [active]);

    return (
        <div className={styles.combinations}>

            <h1>Совмещения</h1>
            <ul className={styles.menu}>
                {menu.map((elem: CombinationsMenu, index: number) => (
                    <li key={elem.name}
                        className={active === elem ? styles.menu_active : ''}
                        onClick={() => changeActive(index)}>{elem.name}
                    </li>
                ))}
            </ul>

            <table className={styles.combTable}>
                <thead>
                    <tr>
                        <th>Trading Pair</th>
                        <th>Data</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {combinations.map((elem: ICombination) => (
                        <tr key={elem.connectid}>
                            <td>{elem.tradingpair}</td>
                            <td>
                                {formatData(elem.data)}
                            </td>
                            <td>{elem.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Combinations;
