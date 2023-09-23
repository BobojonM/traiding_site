export interface ITradingPair{
    tradingpairid: number
    tradingpairname: string
    future: boolean
    spot: boolean
    price: number
    change: number
    changepercent: number
}