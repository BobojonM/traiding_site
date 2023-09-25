import { FC, useEffect, useState } from "react";
import styles from './Pairs.module.css';

import { ITradingPair } from "../../../../models/ITradingPair";
import RuleService from "../../../../servises/RuleService";

interface PairsInterface {
    position?: 'VN' | 'NN' | ''
    timeframe?: string
}

const Pairs: FC<PairsInterface> = ({position = '', timeframe = ''}) => {
    const [pairs, setPairs] = useState<ITradingPair[]>([]);
    const [active, setActive] = useState(0); 
    
    const menu = ['Все', 'Futures', 'Spots'];

    const changeActive = (id: number) => {
        setActive(id);
    }

    const getConnections = async () => {
        if (timeframe && position) {
            try {
                const response = (await RuleService.getPairsForTrends(position || 'VN', timeframe)).data;            
                setPairs([...response]);
            } catch (e: any) {
                console.log(e);
                setPairs([]);
            }
        } else {
            try {
                const response = (await RuleService.getTradingPairs()).data;            
                setPairs([...response]);
            } catch (e: any) {
                console.log(e);
                setPairs([]);
            }
        }
    }

    useEffect(() => {
        getConnections();
    }, [position, timeframe]);

    return (
        <div className={styles.tradingpairs}>
            <h1>Монеты</h1>
            {position && timeframe ? (
                <>
                <h1 className={styles.warning}>Текущие монеты только для последнего тренда! {timeframe} {position}</h1>
                <table className={styles.pairsTable}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Монета</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pairs.map((elem: ITradingPair, index) => (
                            <tr key={elem.tradingpairid}>
                                <td>{index + 1}</td>
                                <td>
                                    <a href={`https://www.tradingview.com/symbols/${elem.tradingpairname}.P/`} target="_blank">
                                        {elem.tradingpairname}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </>
            ) 
            : (
                <>
                <ul className={styles.menu}>
                    {menu.map((elem: string, index: number) => (
                        <li key={elem} 
                            className={active === index ? styles.menu_active : ''}
                            onClick={() => changeActive(index)}>{elem}
                        </li>
                    ))}
                </ul>

                <table className={styles.pairsTable}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Монета</th>
                            <th>Futures</th>
                            <th>Spot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pairs
                            .filter(elem => menu[active] === 'Все' || (menu[active] === 'Futures' ? elem.future : elem.spot))
                            .map((elem: ITradingPair, index) => (
                            <tr key={elem.tradingpairid}>
                                <td>{index + 1}</td>
                                <td>
                                    <a href={`https://www.tradingview.com/symbols/${elem.tradingpairname}.P/`} target="_blank">
                                        {elem.tradingpairname}
                                    </a>
                                </td>
                                <td>
                                    {elem.future ? (
                                        <label className={styles.container}>
                                            <input type="checkbox" checked={true} readOnly={true}/>
                                            <div className={styles.checkmark}></div>
                                        </label>
                                    ) : null}
                                </td>
                                <td>
                                    {elem.spot ? (
                                        <label className={styles.container}>
                                            <input type="checkbox" checked={true} readOnly={true}/>
                                            <div className={styles.checkmark}></div>
                                        </label>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </>
            )}
            
        </div>
    )
}

export default Pairs;
