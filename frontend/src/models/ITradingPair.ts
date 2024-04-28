export type SignalData = {
    '4h': string
    '1h': string
    '15m': string
    '3m': string
};

export interface ITradingPair{
    tradingpairid?: number
    tradingpairname: string
    future?: boolean
    spot?: boolean
    price: number
    change: number
    changepercent: number
    fifteen?: boolean
    hour?: boolean
    four?: boolean
    day?: boolean
    lastupdate?: string
    signalData?: SignalData | null
}