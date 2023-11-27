import { FC, useEffect, useState } from "react";
import styles from './Rules.module.css'
import RuleService from "../../../../servises/RuleService";
import { IRuleSignal } from "../../../../models/IRuleSignal";

interface RulesDetail{
    ruleName: string;
    forTrends?: boolean
    signalIds?: number[]
}

interface RulesMenu {
    name: string
    timeframe: 'all' | '3m' | '15m' | '30m' | '1h' | '4h' | '1d'
}

const menu: RulesMenu[] = [
    {
        name: 'Все',
        timeframe: 'all',
    },
    {
        name: '3 мин',
        timeframe: '3m',
    },
    {
        name: '15 мин',
        timeframe: '15m',
    },
    {
        name: '30 мин',
        timeframe: '30m',
    },
    {
        name: '1 час',
        timeframe: '1h',
    },
    {
        name: '4 часа',
        timeframe: '4h',
    },
    {
        name: '1 день',
        timeframe: '1d',
    }
]

const RulesDetail: FC<RulesDetail> = ({ruleName, forTrends = false, signalIds = []}) => {
    const [signals, setSignals] = useState<IRuleSignal[]>([]);
    const [active, setActive] = useState<RulesMenu>(menu[0]);

    const changeActive = (id: number) => {
        setActive(menu[id]);
    }

    const getSignals = async() => {
        try{
            const response = (await RuleService.getSignals(ruleName, active.timeframe)).data;
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
    }, [ruleName, forTrends, active]);

    const getAlmatyTime = (time: string) => {
        const inputDateString = time;
        const inputDate = new Date(inputDateString);
        const sixHoursLater = new Date(inputDate.getTime());


        const year = sixHoursLater.getFullYear();
        const month = String(sixHoursLater.getMonth() + 1).padStart(2, '0');
        const day = String(sixHoursLater.getDate()).padStart(2, '0');
        const hours = String(sixHoursLater.getHours()).padStart(2, '0');
        const minutes = String(sixHoursLater.getMinutes()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
        return formattedDate
      }

    return(
        <>
        {signals.length > 0 ? (
            <> {!forTrends ? ( <ul className={styles.menu}>
                    {menu.map((elem: RulesMenu, index: number) => (
                        <li key={elem.name}
                            className={active === elem ? styles.menu_active : ''}
                            onClick={() => changeActive(index)}>{elem.name}
                        </li>
                    ))}
                </ul>
                ): (<br></br>)}
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
                    </table></>
        ) : (
            <h1>Сигналы не найдены</h1>
        )}
        </>
        
    )
}

export default RulesDetail;