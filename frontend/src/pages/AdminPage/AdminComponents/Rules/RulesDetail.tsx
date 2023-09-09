import { FC, useEffect, useState } from "react";
import styles from './Rules.module.css'
import RuleService from "../../../../servises/RuleService";
import { IRuleSignal } from "../../../../models/IRuleSignal";

interface RulesDetail{
    ruleName: string;
}

const RulesDetail: FC<RulesDetail> = ({ruleName}) => {
    const [signals, setSignals] = useState<IRuleSignal[]>([]);

    const getSignals = async(ruleName: string) => {
        try{
            const response = (await RuleService.getSignals(ruleName)).data;
            
            setSignals(response);

        }catch(e: any){
            console.error(e);
          }
    }

    useEffect(() => {
        // Initial fetch when the component mounts
        getSignals(ruleName);

        // Set up a timer to fetch signals every minute
        const fetchInterval = setInterval(() => {
            getSignals(ruleName);
        }, 60000);

        // Clean up the timer when the component unmounts
        return () => {
            clearInterval(fetchInterval);
        };
    }, [ruleName]);

    return(
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
                            <td>{elem.tradingpair}</td>
                            <td>{elem.timeframe}</td>
                            <td>{elem.rule}</td>
                            <td>{elem.timestamp}</td>
                        </tr>
                    ))}
            </tbody>
        </table>
    )
}

export default RulesDetail;