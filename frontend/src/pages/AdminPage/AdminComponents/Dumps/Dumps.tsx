import { FC, useEffect, useState } from "react";
import styles from './Dumps.module.css';

import { ITradingPair } from "../../../../models/ITradingPair";
import RuleService from "../../../../servises/RuleService";
import { DataInterace, IDate } from "../../../../models/IDates";


const timeframeOptions = [
    { value: 'all', label: 'End' },
    { value: '0-4', label: '00:00 - 04:00' },
    { value: '4-8', label: '04:00 - 08:00' },
    { value: '8-12', label: '08:00 - 12:00' },
    { value: '12-16', label: '12:00 - 16:00' },
    { value: '16-20', label: '16:00 - 20:00' },
    { value: '20-24', label: '20:00 - 24:00' },
];
const today = new Date();

const Dumps: FC = () => {
    const [pairs, setPairs] = useState<ITradingPair[]>([]);
    const [selectedDate, setSelectedDate] = useState(0);
    const [dates, setDates] = useState<IDate[]>([]);
    
    const getTop = async () => {
        try {
            const response = (await RuleService.getTopTradingPairs()).data;            
            setPairs([...response]);
        } catch (e: any) {
            console.error(e);
            setPairs([]);
        }
    };

    const getDates =async () => {
        try {
            const response = (await RuleService.dumpsGetPreviousDates()).data;            
            setDates([...response]);        
        } catch (e: any) {
            console.error(e);
        }
    };

    const changeDate = async (id: number) => {
        setSelectedDate(id);
        if (id !== 0){
            const response = (await RuleService.getDumpDataForDate(id));
            const newData = response.data[0].data;
    
            const newPairs: ITradingPair[] = [];
            Object.keys(newData).forEach((key: string) => {
                const tradingPair: DataInterace = newData[key];
                const {change, changepercent, pair, price} = tradingPair;
                
                newPairs.push({
                    tradingpairname: pair,
                    price,
                    change,
                    changepercent,
                });
            });
            setPairs(newPairs);
        }
    };

    const formatDate = (inputDate: string) => {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0'); 
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear(); 
        return `${day}/${month}/${year}`;
      };
      

    useEffect(() => {
        if(selectedDate === 0) {
            getDates();
            getTop();
            const fetchInterval = setInterval(() => {
                getTop();
            }, 5000);
            return () => {
                clearInterval(fetchInterval);
            };
        }
    }, [selectedDate]);

    return (
        <div className={styles.tradingpairs}>
            <h1>Pumps/Dumps</h1>
            <div className={styles.calendar}>
                <div className={styles.buttonsContainer}>
                    <button className={selectedDate === 0 ? styles.dateActive : styles.dateButton}
                        onClick={() => changeDate(0)}>
                        {`${today.getDate().toString().padStart(2, '0')}/${today.getMonth() + 1}/${today.getFullYear()}`}
                    </button>

                    {dates.map((elem) => (
                    <button key={elem.id}
                        className={selectedDate === elem.id ? styles.dateActive : styles.dateButton}
                        onClick={() => changeDate(elem.id)}>
                        {formatDate(elem.timestamp)}
                    </button>
                    ))}
                </div>

                {selectedDate === 0 || selectedDate === 1 
                ? (
                    <div className={styles.selectContainer}>
                        <span>Choose the timeframe</span>
                        <select>
                        {timeframeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                        </select>
                    </div>
                ) : null}
            </div>

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
                        <tr key={index + 1}>
                            <td>{index + 1}</td>
                            <td>
                                <a href={`https://www.tradingview.com/chart/?symbol=BINANCE:${elem.tradingpairname}.P`} target="_blank">
                                            {elem.tradingpairname}.P
                                </a>
                            </td>
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
