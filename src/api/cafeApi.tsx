import axios from "axios";

import { getData } from "../helpers/storage";


const baseURL = 'http://192.168.1.124:8080/api';

const cafeApi = axios.create({ baseURL });

// Middleware
cafeApi.interceptors.request.use(
    async( config ) => {
        const token = await getData('token');

        if ( token ) {
            config.headers['x-token'] = token;
        }

        return config;
    }
)


export default cafeApi;