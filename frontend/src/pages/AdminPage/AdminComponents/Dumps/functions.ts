import { ICombination } from "../../../../models/ICombination";
import { IRuleSignal } from "../../../../models/IRuleSignal";
import { ITradingPair, SignalData } from "../../../../models/ITradingPair";
import RuleService from "../../../../servises/RuleService";

export const findSignalDataOld = async (tradingPairName: string, timeframe: number) => {  
    const response: ICombination[] = (await RuleService.getTopConnections(true, timeframe, tradingPairName)).data;  
    
    const signalData = response.length > 0 ? response[0].data : null;
    const initData =  { '4h': 'No Data', '1h': 'No Data', '15m': 'No Data', '3m': 'No Data' };

    if (!signalData) {
        return initData;
    }

    const dataParts = signalData.split('\n');
    const dataObject = { '4h': '', '1h': '', '15m': '', '3m': 'No Data' };

    dataParts.forEach(part => {
        if (part.includes('1h')) dataObject['1h'] = part;
        else if (part.includes('15m')) dataObject['15m'] = part;
        else if (part.includes('4h')) dataObject['4h'] = part;
        else if (part.includes('3m')) dataObject['3m'] = part;
        else if (part.includes('5m')) dataObject['3m'] = part;
    });

    if (dataObject['3m'] === 'No Data') {
        return initData;
    }

    return dataObject as SignalData;
};

export const findSignalsFor3 = async (tradingPairName: string) => {
    const response: IRuleSignal[] = (await RuleService.getSignalsForTimframes('3m', tradingPairName)).data;
    const initData =  { '4h': 'No Data', '1h': 'No Data', '15m': 'No Data', '3m': 'No Data' };

    if (response.length === 0) {
        return initData;
    }

    const data  = `${response[0].timeframe} ${response[0].timestamp} ${response[0].rule}`;
    
    const dataObject = { '4h': 'No Data', '1h': 'No Data', '15m': 'No Data', '3m': data };

    return dataObject as SignalData;
};

const getDataPart = (part: string) => {
    const parts = part.split(' ');
    if (parts.length < 4) return new Date('1999-11-23 00:00:00+06:00');

    return new Date(`${parts[1]} ${parts[2]}`);
};

export const comparePairsByData = (a: ITradingPair, b: ITradingPair) => {
    // Handle cases where signalData is null
    if (!a.signalData && !b.signalData) return 0; // Both are null, considered equal
    if (!a.signalData) return 1; // Null values go last
    if (!b.signalData) return 1; // Null values go last

    if (a.tradingpairname === "BTCUSDT") return -1;
    if (b.tradingpairname === "BTCUSDT") return 1;

    // Compare the '3m' property
    const aValue = getDataPart(a.signalData["3m"]);
    const bValue = getDataPart(b.signalData["3m"]);

    if (aValue < bValue) return 1;
    if (aValue > bValue) return -1;
    return 0;
};

export const formatDate = (inputDate: string) => {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear(); 
    return `${day}/${month}/${year}`;
};

export const formatTimestamp = (isoString?: string): string => {
    if (isoString) {
        const date = new Date(isoString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
      
        return `${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    return '';
};

export const comparePairsByPercent = (a: ITradingPair, b: ITradingPair) => {
    // Handle cases where signalData is null
    if (!a.signalData && !b.signalData) return 0; // Both are null, considered equal
    if (!a.signalData) return 1; // Null values go last
    if (!b.signalData) return 1; // Null values go last

    if (a.tradingpairname === "BTCUSDT") return -1;
    if (b.tradingpairname === "BTCUSDT") return 1;

    if (a.changepercent < b.changepercent) return 1;
    if (a.changepercent > b.changepercent) return -1;
    return 0;
};


// const processDataPart = (part?: string) => {
//     if (part) {
//         const parts = part.split(' ');
//         if (parts.length < 4) return 'No Data';
    
//         const timeframe = parts[0];
       
//         const timeStampPart = parts[2].split('+')[0];
//         const hourwithmin = timeStampPart.split(':')[0] + ':' + timeStampPart.split(':')[1]; 
//         const timeStamp = parts[1] + ' ' + hourwithmin;
//         const ruleName = parts[3];
    
//         const ruleNameWithColor = <span className={ruleName.includes("Long") ? styles.longRuleStyle : styles.shortRuleStyle}>{ruleName}</span>
    
//         if (timeframe === '5m' || timeframe === '3m')
//             return <span>{ruleNameWithColor} {timeframe}<br />{timeStamp}</span>;
        
//         return <span>{ruleNameWithColor}<br />{timeStamp}</span>;
//     }
// };

    // // Function to find the signal data for a trading pair
    // const findSignalResponse = (response?: string) => {        
    //     const signalData = response ?? null;
    //     const initData =  { '4h': 'No Data 2', '1h': 'No Data 2', '15m': 'No Data 2', '3m': 'No Data 2' };

    //     if (signalData === null) {
    //         return initData as SignalData;
    //     }
    
    //     const dataParts = signalData.split('\n');
    //     const dataObject = { '4h': '', '1h': '', '15m': '', '3m': 'No Data 2' };
    
    //     dataParts.forEach(part => {
    //         if (part.includes('1h')) dataObject['1h'] = part;
    //         else if (part.includes('15m')) dataObject['15m'] = part;
    //         else if (part.includes('4h')) dataObject['4h'] = part;
    //         else if (part.includes('3m')) dataObject['3m'] = part;
    //         else if (part.includes('5m')) dataObject['3m'] = part;
    //     });

    //     if (dataObject['3m'] === 'No Data 2') {
    //         return initData;
    //     }
    
    //     return dataObject as SignalData;
    // };