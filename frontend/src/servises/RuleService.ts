import { AxiosResponse } from "axios";
import { IRule } from "../models/IRule";
import $api from "../http";
import { IRuleSignal } from "../models/IRuleSignal";
import { ITrend } from "../models/ITrend";

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
        return $api.get<ITrend[]>(`/trends/${timeframe}`)
    }
}