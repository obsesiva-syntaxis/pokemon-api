import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { HttpAdapterEssence } from "../interfaces/http-adapter.interface";

@Injectable()
export class AxiosAdapter implements HttpAdapterEssence {
    private axios: AxiosInstance = axios;

    async get<X>(url: string): Promise<X> {
        try {
            const { data } = await this.axios.get<X>(url);
            return data;
        } catch (err) {
            throw new Error('This is an internal error - Check Logs');
        }
    }
}