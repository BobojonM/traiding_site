import { FC, useEffect, useState } from "react";
import styles from './Combinations.module.css'

import { ICombination } from "../../../../models/ICombination";
import RuleService from "../../../../servises/RuleService";
import { IRule } from "../../../../models/IRule";
import { getAlmatyTime } from "../../../../hooks/callbacks";

interface CombinationsMenu {
    name: string
    timeframe: '15m' | '1h' | '4h'
    type: 'long' | 'short'
}

const menu: CombinationsMenu[] = [
    {
        name: '15 мин Long',
        timeframe: '15m',
        type: 'long'
    },
    {
        name: '15 мин Short',
        timeframe: '15m',
        type: 'short'
    },
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

const formatDataMob = (data: string) => {
    const items = data.split('\n').filter(Boolean); // Remove empty strings

    return items.map((item, index) => {
        const [firstWord, date, time, rule] = item.split(' ');

        return (
            <div className={styles.grid} key={index}>
                <div className={styles.gridItem}>
                    <div><b>{firstWord}</b></div>
                    <div>{date}</div>
                </div>
                <div className={styles.gridItem}>
                    <div>{time}</div>
                    <div>{rule}</div>
                </div>
            </div>
        );
    });
};

const Combinations: FC = () => {
    const [combinations, setCombinations] = useState<ICombination[]>([]);
    const [active, setActive] = useState<CombinationsMenu>(menu[0]);
    const [mobActive, setMobActive] = useState<string>('15 мин Long');
    const [isSettings, setIsSettings] = useState(false);
    const [rules, setRules] = useState<IRule[]>([]);

    const changeActive = (id: number) => {
        setActive(menu[id]);
        setIsSettings(false);
    }

    const getConnections = async () => {
        try {
            const response = (await RuleService.getConnections(active.timeframe, active.type)).data;
            setCombinations([...response]);
        } catch (e: any) {
            console.log(e);
            setCombinations([]);
        }
    }

    const getRules = async () => {
        try {
            const response = (await RuleService.getRules()).data;
            setRules(response);
        } catch (e: any) {
            console.log(e);
        }
    }

    const toggleStatus = async (ruleId: number) => {
        const ruleIndex = rules.findIndex(rule => rule.ruleid === ruleId);

        if (ruleIndex !== -1) {
            await RuleService.changeConnectionStatus(rules[ruleIndex].ruleid);
            setRules(prevRules =>
                prevRules.map((rule, index) =>
                    index === ruleIndex ? { ...rule, connect_status: !rule.connect_status } : rule
                )
            );
        }
    }

    useEffect(() => {
        if (!isSettings) {
            getConnections();
            const fetchInterval = setInterval(() => {
                getConnections();
            }, 600000);

            return () => {
                clearInterval(fetchInterval);
            };
        } else {
            getRules();
        }

    }, [active, isSettings]);

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
                <li
                    className={isSettings ? styles.menu_active : ''}
                    onClick={() => {
                        setIsSettings(!isSettings);
                        setActive(menu[-1])
                    }}>
                    Настройки
                </li>
            </ul>

            <div className={styles.selectContainer}>
                <select
                    value={mobActive}
                    onChange={(event) => {
                        setActive(menu.find((item) => item.name === event.target.value)?? menu[0]);
                        setMobActive(event.target.value);
                        if (event.target.value === 'Настройки') {
                            setIsSettings(true);
                        } else {
                            setIsSettings(false);
                        }
                    }}
                    className={styles.menuSelect}
                    >
                    {menu.map((item) => (
                        <option key={item.name} value={item.name}>
                        {item.name}
                        </option>
                    ))}
                    <option value="Настройки" onClick={() => {
                        setIsSettings(true);
                        setActive(menu[-1]);
                        }}>
                        Настройки
                    </option>
                </select>
            </div>

            <table className={styles.combTable}>
                {isSettings ? (<caption>Управление правилами на 15м (1час совмещение)</caption>) : null}
                <thead>
                    {isSettings ? (
                        <tr>
                            <th>Правило</th>
                            <th>Описание</th>
                            <th>Тип</th>
                            <th>Connect Status</th>
                        </tr>
                    ) : (
                        <tr>
                            <th>Trading Pair</th>
                            <th>Data</th>
                            <th>Timestamp</th>
                        </tr>
                    )}
                </thead>
                <tbody>
                    {isSettings ? (
                        rules.map((elem: IRule) => (
                            <tr key={elem.ruleid}>
                                <td>{elem.rulename}</td>
                                <td>{elem.description}</td>
                                <td>{elem.type}</td>
                                <td>
                                    <label className={styles.switch}>
                                        <input
                                            type="checkbox"
                                            checked={elem.connect_status}
                                            onChange={() => toggleStatus(elem.ruleid)}
                                        />
                                        <span className={`${styles.slider} ${styles.round}`}></span>
                                    </label>
                                </td>
                            </tr>
                        ))
                    ) : (
                        combinations.map((elem: ICombination) => (
                            <tr key={elem.connectid}>
                                <td>
                                    <a href={`https://www.tradingview.com/chart/?symbol=BINANCE:${elem.tradingpair}.P`} target="_blank">
                                        {elem.tradingpair}.P
                                    </a>
                                </td>
                                <td>
                                    {formatData(elem.data)}
                                </td>
                                <td>{getAlmatyTime(elem.timestamp)}</td>
                            </tr>
                        ))
                    )}

                </tbody>
            </table>

            <div className={styles.cards}>
                {isSettings ? (
                    rules.map((elem: IRule) => (
                        <div key={elem.ruleid} className={styles.card}>
                            <div className={styles.cardHeader}>{elem.rulename}</div>
                            <div className={styles.cardContent}>
                                <span>Описание:</span> <span>{elem.description}</span>
                            </div>
                            <div className={styles.cardContent}>
                                <span>Тип:</span> <span>{elem.type}</span>
                            </div>
                            <div className={styles.cardContent}>
                                <span>Connect Status:</span>
                                <label className={styles.switch}>
                                    <input
                                        type="checkbox"
                                        checked={elem.connect_status}
                                        onChange={() => toggleStatus(elem.ruleid)}
                                    />
                                    <span className={`${styles.slider} ${styles.round}`}></span>
                                </label>
                            </div>
                        </div>
                    ))
                ) : (
                    combinations.map((elem: ICombination) => (
                        <div key={elem.connectid} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <a href={`https://www.tradingview.com/chart/?symbol=BINANCE:${elem.tradingpair}.P`} target="_blank">
                                    {elem.tradingpair}.P
                                </a>
                            </div>
                            <div className={styles.cardContent}>
                                <span>Data:</span>
                            </div>
                            <div>{formatDataMob(elem.data)}</div>
                            <div className={`${styles.cardAction} ${styles.cardContent}`}>
                                <span>Timestamp:</span> <span>{getAlmatyTime(elem.timestamp)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Combinations;
