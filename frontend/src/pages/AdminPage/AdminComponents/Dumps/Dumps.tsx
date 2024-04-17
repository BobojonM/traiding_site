import { FC, useEffect, useState } from "react";
import styles from './Dumps.module.css';

import { ITradingPair, SignalData } from "../../../../models/ITradingPair";
import RuleService from "../../../../servises/RuleService";
import { DataInterace, IDate } from "../../../../models/IDates";
import { ICombination } from "../../../../models/ICombination";
import { IRuleSignal } from "../../../../models/IRuleSignal";

interface timeframeInterface {
    value: string | number,
    label: string
}

const today = new Date();

const formatDate = (inputDate: string) => {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear(); 
    return `${day}/${month}/${year}`;
};

const processDataPart = (part: string) => {
    const parts = part.split(' ');
    if (parts.length < 4) return 'No Data';

    const timeframe = parts[0];
   
    const timeStampPart = parts[2].split('+')[0];
    const timeStamp = parts[1] + ' ' + timeStampPart;
    const ruleName = parts[3];

    if (timeframe === '5m' || timeframe === '3m')
        return <span>{ruleName} {timeframe}<br />{timeStamp}</span>;
    
    return <span>{ruleName}<br />{timeStamp}</span>;
};

const getDataPart = (part: string) => {
    const parts = part.split(' ');
    if (parts.length < 4) return new Date('1999-11-23 00:00:00+06:00');

    return new Date(`${parts[1]} ${parts[2]}`);
}

const comparePairs = (a: ITradingPair, b: ITradingPair) => {
    // Handle cases where signalData is null
    if (!a.signalData && !b.signalData) return 0; // Both are null, considered equal
    if (!a.signalData) return 1; // Null values go last
    if (!b.signalData) return 1; // Null values go last

    if (a.tradingpairname === "BTCUSDT") return -1;
    if (b.tradingpairname === "BTCUSDT") return -1;

    // Compare the '3m' property
    const aValue = getDataPart(a.signalData["3m"]);
    const bValue = getDataPart(b.signalData["3m"]);

    if (aValue < bValue) return 1;
    if (aValue > bValue) return -1;
    return 0;
}

const Dumps: FC = () => {
    const [pairs, setPairs] = useState<ITradingPair[]>([]);
    const [selectedDate, setSelectedDate] = useState(0);
    const [dates, setDates] = useState<IDate[]>([]);
    const [selectedTimeframe, setSelectedTimeframe] = useState('all');
    const [timeframeOptions, setTimeframeOptions] = useState<timeframeInterface[]>();
    const [timeframe, setTimeframe] = useState(1);
    const [timeframes, setTimeframes] = useState(['1h', '15m', '3m']);

    // Function to find the signal data for a trading pair
    const findSignalData = async (tradingPairName: string) => {  
        const response: ICombination[] = (await RuleService.getTopConnections(true, timeframe, tradingPairName)).data;  
        
        const signalData = response.length > 0 ? response[0].data : null;
        const initData =  { '1h': 'No Data', '15m': 'No Data', '3m': 'No Data' };

        if (!signalData) {
            return initData;
        }
    
        const dataParts = signalData.split('\n');
        const dataObject = { '1h': '', '15m': '', '3m': 'No Data' };
    
        dataParts.forEach(part => {
            if (part.includes('1h')) dataObject['1h'] = part;
            else if (part.includes('15m')) dataObject['15m'] = part;
            else if (part.includes('3m')) dataObject['3m'] = part;
            else if (part.includes('5m')) dataObject['3m'] = part;
        });

        if (dataObject['3m'] === 'No Data') {
            return initData;
        }
    
        return dataObject as SignalData;
    };

    const findSignals = async (tradingPairName: string) => {
        const response: IRuleSignal[] = (await RuleService.getSignalsForTimframes('3m', tradingPairName)).data;
        const initData =  { '1h': 'No Data', '15m': 'No Data', '3m': 'No Data' };

        if (response.length === 0) {
            return initData;
        }

        const data  = `${response[0].timeframe} ${response[0].timestamp} ${response[0].rule}`;

        
        const dataObject = { '1h': 'No Data', '15m': 'No Data', '3m': data };

        return dataObject as SignalData;
    }

    // Function to find the signal data for a trading pair
    const findSignalResponse = (response?: ICombination) => {        
        const signalData = response?.data ?? null;
        const initData =  { '1h': 'No Data 2', '15m': 'No Data 2', '3m': 'No Data 2' };

        if (signalData === null) {
            return initData as SignalData;
        }
    
        const dataParts = signalData.split('\n');
        const dataObject = { '1h': '', '15m': '', '3m': 'No Data 2' };
    
        dataParts.forEach(part => {
            if (part.includes('1h')) dataObject['1h'] = part;
            else if (part.includes('15m')) dataObject['15m'] = part;
            else if (part.includes('3m')) dataObject['3m'] = part;
            else if (part.includes('5m')) dataObject['3m'] = part;
        });

        if (dataObject['3m'] === 'No Data 2') {
            return initData;
        }
    
        return dataObject as SignalData;
    };
    
    const getTop = async () => {
        try {
            const response = (await RuleService.getTopTradingPairs()).data;     
            
            const pairsWithSignals = await Promise.all(response.map(async (pair) => {
                try {
                    const signalData = timeframe === 3 ? (await findSignals(pair.tradingpairname)) : (await findSignalData(pair.tradingpairname));
                    return { ...pair, signalData };
                } catch (error) {
                    console.error(`Error fetching signal data for ${pair.tradingpairname}:`, error);
                    return { ...pair, signalData: null }; // or a default value
                }
            }));

            // Sort the pairs by signalData
            pairsWithSignals.sort(comparePairs);

            setPairs([...pairsWithSignals]);            
        } catch (e: any) {
            console.error(e);
            setPairs([]);
        }
    };

    const getDates = async () => {
        try {
            const response = (await RuleService.dumpsGetPreviousDates()).data;            
            setDates([...response]);        
        } catch (e: any) {
            console.error(e);
        }
    };

    const getTimeframes = async (date: string) => {
        const response = (await RuleService.getFourHoursForDate(date)).data;
    
        const formattedTimeframes = response.map((item) => {
            const timestamp = new Date(item.timestamp);
            const hours = timestamp.getHours().toString().padStart(2, '0');
            return {
                value: item.id,
                label: hours + ':00' 
            };
        });
        if(selectedDate === 0){
            setTimeframeOptions([{ value: 'all', label: 'Текущие' }, ...formattedTimeframes]);
        }
        else {
            setTimeframeOptions(formattedTimeframes);
        }
    };

    const changeTimeframe = async (timeframe: number) => {
        setTimeframe(timeframe)
        if (timeframe === 15){
            setTimeframes(['15m', '3m'])
        } else if (timeframe === 3) {
            setTimeframes(['3m'])
        } else {
            setTimeframes(['1h', '15m', '3m'])
        }
    }

    const changeDate = async (id: number, index: number) => {
        setSelectedDate(index);
        if (id !== 0){
            const response = (await RuleService.getDumpDataForDate(id));
            const newData = response.data[0].data;
    
            const newPairs: ITradingPair[] = [];
            Object.keys(newData).forEach((key: string) => {
                const tradingPair: DataInterace = newData[key];
                const {change, changepercent, pair, price, data1h, data15m, data3m} = tradingPair;

                var data = data15m;
                if (timeframe === 1){
                    data = data1h;
                } else if (timeframe === 3){
                    data = data3m;
                }
                    
                const signalData = findSignalResponse(data);
            
                newPairs.push({
                    tradingpairname: pair,
                    price,
                    change,
                    changepercent,
                    signalData
                });
            });

            // Sort the pairs by signalData
            newPairs.sort(comparePairs);

            setPairs(newPairs);
        }
    };

    const handleTimeframeChange = async (value: string) => {
        setSelectedTimeframe(value);
        if(value !== 'all'){
            const response = (await RuleService.getDumpForHours(parseInt(value)));
            const newData = response.data[0].data;
    
            const newPairs: ITradingPair[] = [];
            Object.keys(newData).forEach((key: string) => {
                const tradingPair: DataInterace = newData[key];
                const {change, changepercent, pair, price, data1h, data15m, data3m} = tradingPair;

                var data = data15m;
                if (timeframe === 1){
                    data = data1h;
                } else if (timeframe === 3){
                    data = data3m;
                }

                const signalData = findSignalResponse(data);
                
                newPairs.push({
                    tradingpairname: pair,
                    price,
                    change,
                    changepercent,
                    signalData
                });
            });

            // Sort the pairs by signalData
            newPairs.sort(comparePairs);
            
            setPairs(newPairs);
        }
    };
      

    useEffect(() => {
        if(selectedDate === 0 || selectedDate === 1) {
            let date = today.getDate().toString();
            if(selectedDate === 1){
                date = new Date(dates[selectedDate - 1].timestamp).getDate().toString().padStart(2, '0');
            }
            getTimeframes(date);
        }
        if(selectedDate === 0 && selectedTimeframe === 'all') {
            getDates();
            getTop();
            const fetchInterval = setInterval(() => {
                getTop();
            }, 30000);
            return () => {
                clearInterval(fetchInterval);
            };
        }

    }, [selectedDate, selectedTimeframe, timeframe]);

    return (
        <div className={styles.tradingpairs}>
            <h1>Pumps/Dumps</h1>
            <div className={styles.calendar}>
                <div className={styles.buttonsContainer}>
                    <button className={timeframe === 1 ? styles.timeframeActive : styles.timeframeButton}
                        onClick={() => changeTimeframe(1)}>
                       1h
                    </button>

                    
                    <button className={timeframe === 15 ? styles.timeframeActive : styles.timeframeButton}
                        onClick={() => changeTimeframe(15)}>
                        15m
                    </button>

                    <button className={timeframe === 3 ? styles.timeframeActive : styles.timeframeButton}
                        onClick={() => changeTimeframe(3)}>
                        3m
                    </button>
                </div>
                <br></br>

                <div className={styles.buttonsContainer}>
                    <button className={selectedDate === 0 ? styles.dateActive : styles.dateButton}
                        onClick={() => changeDate(0, 0)}>
                        {`${today.getDate().toString().padStart(2, '0')}/${today.getMonth() + 1}/${today.getFullYear()}`}
                    </button>

                    {dates.map((elem, index) => (
                    <button key={elem.id}
                        className={selectedDate === index + 1 ? styles.dateActive : styles.dateButton}
                        onClick={() => changeDate(elem.id, index + 1)}>
                        {formatDate(elem.timestamp)}
                    </button>
                    ))}
                </div>

                {selectedDate === 0 || selectedDate === 1 
                ? (
                    <div className={styles.selectContainer}>
                        <span>Выберите время:</span>
                        <select value={selectedTimeframe} onChange={(e) => handleTimeframeChange(e.target.value)}>
                        {timeframeOptions?.map((option) => (
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
                        {timeframe === 1 && <th>1h</th>}
                        {timeframe !== 3 && <th>15m</th>}
                        <th>3m/5m</th>
                    </tr>
                </thead>
                <tbody>
                    {pairs.map((elem: ITradingPair, index) => (
                        <tr key={index}>
                            <td>{index}</td>
                            <td>
                                <a href={`https://www.tradingview.com/chart/?symbol=BINANCE:${elem.tradingpairname}.P`} target="_blank">
                                            {elem.tradingpairname}.P
                                </a>
                            </td>
                            <td>{elem.price}</td>
                            <td>{elem.change}</td>
                            <td>{elem.changepercent}%</td>
                            {/* <td>{findSignalData(elem.tradingpairname)}</td> */}
                            {(timeframes as (keyof SignalData)[]).map((timeFrame) => (
                                <td key={timeFrame}>{processDataPart(elem.signalData?.[timeFrame] || 'No Data')}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Dumps;
