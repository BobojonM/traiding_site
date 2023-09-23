import { AxiosResponse } from "axios";
import { IRule } from "../models/IRule";
import $api from "../http";
import { IRuleSignal } from "../models/IRuleSignal";
import { ITrend } from "../models/ITrend";
import { ICombination } from "../models/ICombination";
import { ITradingPair } from "../models/ITradingPair";
import { ILevarage } from "../models/ILevarage";
import { IOption } from "../models/IOption";

export default class RuleService{
    static async getRules(): Promise<AxiosResponse<IRule[]>>{
        return $api.get<IRule[]>('/rules');
    }

    static async changeStatus(id: number): Promise<AxiosResponse>{
        return $api.put(`/rules/status/${id}`);
    }

    static async getSignals(ruleName: string): Promise<AxiosResponse<IRuleSignal[]>>{
        return $api.get<IRuleSignal[]>(`/rules/signals/${ruleName}`);
    }

    static async getTrends(timeframe: string): Promise<AxiosResponse<ITrend[]>>{
        return $api.get<ITrend[]>(`/trends/${timeframe}`);
    }

    static async getSignalsForTrends(data: number[]): Promise<AxiosResponse<IRuleSignal[]>>{
        return $api.post<IRuleSignal[]>(`/trends/signals`, {ids: data});
    }

    static async getConnections(timeframe: string, type: string): Promise<AxiosResponse<ICombination[]>>{
        return $api.get<ICombination[]>(`/connections/${timeframe}/${type}`);
    }

    static async getTradingPairs(): Promise<AxiosResponse<ITradingPair[]>>{
        return $api.get<ITradingPair[]>(`/tradingpairs/`);
    }

    static async getLevarages(): Promise<AxiosResponse<ILevarage[]>>{
        return $api.get<ILevarage[]>(`/settings/levarages/`);
    }

    static async getOptions(): Promise<AxiosResponse<IOption>>{
        return $api.get<IOption>(`/settings/options/`);
    }

    static async updateOption(key: string, secretKey: string, levarage: number): Promise<AxiosResponse<IOption>>{
        return $api.put<IOption>(`/settings/options/update/`, {key, secretKey, levarage});
    }
}