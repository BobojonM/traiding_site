import { FC, useEffect, useState } from "react";
import styles from './Pairs.module.css';

import { ITradingPair } from "../../../../models/ITradingPair";
import RuleService from "../../../../servises/RuleService";

const Pairs: FC = () => {
    const [pairs, setPairs] = useState<ITradingPair[]>([]);

    const getConnections = async () => {
        try {
            const response = (await RuleService.getTradingPairs()).data;
            console.log(response);
            
            setPairs([...response]);
        } catch (e: any) {
            console.log(e);
            setPairs([]);
        }
    }

    useEffect(() => {
        getConnections();
    }, []);

    return (
        <div className={styles.tradingpairs}>
            <h1>Монеты</h1>
            <table className={styles.pairsTable}>
                <thead>
                    <tr>
                        <th>Монета</th>
                        <th>Future</th>
                        <th>Spot</th>
                    </tr>
                </thead>
                <tbody>
                    {pairs.map((elem: ITradingPair) => (
                        <tr key={elem.tradingpairid}>
                            <td>{elem.tradingpairname}</td>
                            <td>
                                {elem.future ? (
                                    <label className={styles.container}>
                                        <input type="checkbox" checked={true}/>
                                        <div className={styles.checkmark}></div>
                                    </label>
                                ) : null}
                            </td>
                            <td>
                                {elem.spot ? (
                                    <label className={styles.container}>
                                        <input type="checkbox" checked={true}/>
                                        <div className={styles.checkmark}></div>
                                    </label>
                                ) : null}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Pairs;
