import { AxiosResponse } from "axios";
import { IRule } from "../models/IRule";
import $api from "../http";

export default class RuleService{
    static async getRules(): Promise<AxiosResponse<IRule[]>>{
        return $api.get<IRule[]>('/rules');
    }

    static async changeStatus(id: number): Promise<AxiosResponse>{
        return $api.put(`/rules/status/${id}`);
    }
}