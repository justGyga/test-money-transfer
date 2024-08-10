/* eslint-disable no-constructor-return */
import axios from "axios";

export class $Axios {
    constructor() {
        return axios.create();
    }

    static setHeaders(httpInstance, headers) {
        httpInstance.interceptors.request.use((config) => {
            Object.entries(headers).forEach(([key, value]) => {
                config.headers[key] = value;
            });
            return config;
        });
    }
}
