import { AxiosResponse } from "axios";
import { IRule } from "../models/IRule";
import $api from "../http";
import { IRuleSignal } from "../models/IRuleSignal";

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
}