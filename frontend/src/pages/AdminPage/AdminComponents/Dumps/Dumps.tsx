import { FC, useEffect, useState } from "react";
import styles from './Dumps.module.css';

import { ITradingPair } from "../../../../models/ITradingPair";
import RuleService from "../../../../servises/RuleService";

const Dumps: FC = () => {
    const [pairs, setPairs] = useState<ITradingPair[]>([]);

    const getTop = async () => {
        try {
            const response = (await RuleService.getTopTradingPairs()).data;            
            setPairs([...response]);
        } catch (e: any) {
            console.log(e);
            setPairs([]);
        }
    }

    useEffect(() => {
        getTop();
        const fetchInterval = setInterval(() => {
            getTop();
        }, 30000);
        return () => {
            clearInterval(fetchInterval);
        };
    }, []);

    return (
        <div className={styles.tradingpairs}>
            <h1>Pumps/Dumps</h1>
            <table className={styles.pairsTable}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Монета</th>
                        <th>Цена</th>
                        <th>Change</th>
                        <th>Change %</th>
                    </tr>
                </thead>
                <tbody>
                    {pairs.map((elem: ITradingPair, index) => (
                        <tr key={elem.tradingpairid}>
                            <td>{index + 1}</td>
                            <td>{elem.tradingpairname}</td>
                            <td>{elem.price}</td>
                            <td>{elem.change}</td>
                            <td>{elem.changepercent}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Dumps;
