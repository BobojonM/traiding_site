import { ICombination } from "./ICombination";

export interface IDate{
    id: number
    timestamp: string
};

export interface DataInterace {
    change: number
    changepercent: number
    pair: string
    price: number
    data1h?: ICombination
    data15m?: ICombination
    data3m?: ICombination
};