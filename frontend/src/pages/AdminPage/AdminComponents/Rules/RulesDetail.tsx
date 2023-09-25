import { FC, useEffect, useState } from "react";
import styles from './Rules.module.css'
import RuleService from "../../../../servises/RuleService";
import { IRuleSignal } from "../../../../models/IRuleSignal";

interface RulesDetail{
    ruleName: string;
    forTrends?: boolean
    signalIds?: number[]
}

const RulesDetail: FC<RulesDetail> = ({ruleName, forTrends = false, signalIds = []}) => {
    const [signals, setSignals] = useState<IRuleSignal[]>([]);

    const getSignals = async() => {
        try{
            const response = (await RuleService.getSignals(ruleName)).data;
            setSignals([...response]);
        }catch(e: any){
            console.error(e);
          }
    };

    const getSignalsForTrends = async() => {
        if (signalIds.length > 0) {
            try {
                const response = (await RuleService.getSignalsForTrends(signalIds)).data;
                setSignals([...response]);
            } catch(e: any){
                console.error(e);
            }
        }
    };

    useEffect(() => {
        if (!forTrends){
            getSignals();
            const fetchInterval = setInterval(() => {
                getSignals();
            }, 60000);
            return () => {
                clearInterval(fetchInterval);
            };
        } else {
            getSignalsForTrends();
        }
    }, [ruleName, forTrends]);

    return(
        <>
        {signals.length > 0 ? (
            <table className={styles.ruleTable}>
            <thead>
                <tr>
                    <th>Traiding Pair</th>
                    <th>Timeframe</th>
                    <th>Rule</th>
                    <th>Timestamp (Almaty)</th>
                </tr>
            </thead>
            <tbody>
                {signals
                    .map((elem: IRuleSignal) => (
                        <tr key={`${elem.signalid}${elem.timestamp}`}>
                            <td><a href={`https://www.tradingview.com/symbols/${elem.tradingpair}.P/`} target="_blank">{elem.tradingpair}</a></td>
                            <td>{elem.timeframe}</td>
                            <td>{elem.rule}</td>
                            <td>{elem.timestamp}</td>
                        </tr>
                    ))}
            </tbody>
        </table>
        ) : (
            <h1>Сигналы не найдены</h1>
        )}
        </>
        
    )
}

export default RulesDetail;