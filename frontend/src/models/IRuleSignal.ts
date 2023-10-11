export interface ICrPr {
    PR: number,
    CR: number
}

export interface IRuleSignal{
    signalid: number
    tradingpair: string
    timeframe: string
    rule: string
    ratio: ICrPr
    timestamp: string
}