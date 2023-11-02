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

    const getAlmatyTime = (time: string) => {
        const inputDateString = time;
        const inputDate = new Date(inputDateString);
        const sixHoursLater = new Date(inputDate.getTime());


        const year = sixHoursLater.getFullYear();
        const month = String(sixHoursLater.getMonth() + 1).padStart(2, '0');
        const day = String(sixHoursLater.getDate()).padStart(2, '0');
        const hours = String(sixHoursLater.getHours()).padStart(2, '0');
        const minutes = String(sixHoursLater.getMinutes()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:00`;
        return formattedDate
      }

    return(
        <>
        {signals.length > 0 ? (
            <table className={styles.ruleTable}>
            <thead>
                <tr>
                    <th>Traiding Pair</th>
                    <th>Timeframe</th>
                    <th>Rule</th>
                    {ruleName === 'GFLYShort' || ruleName === 'BFLYLong' ? (<th>Ratio</th>) : null}
                    <th>Timestamp (Almaty)</th>
                </tr>
            </thead>
            <tbody>
                {signals
                    .map((elem: IRuleSignal) => (
                        <tr key={`${elem.signalid}${elem.timestamp}`}>
                            <td><a href={`https://www.tradingview.com/chart/?symbol=BINANCE:${elem.tradingpair}.P`} target="_blank">{elem.tradingpair}</a></td>
                            <td>{elem.timeframe}</td>
                            <td>{elem.rule}</td>
                            {ruleName === 'GFLYShort' || ruleName === 'BFLYLong' ? 
                            (<td>CR: {elem.ratio.CR.toFixed(2)}, PR: {elem.ratio.PR.toFixed(2)}</td>) : null}
                            
                            <td>{getAlmatyTime(elem.timestamp).toString()}</td>
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