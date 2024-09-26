import axios from "axios";
import SessionModel from "./SessionModel";

const urlSsm = import.meta.env.VITE_REACT_APP_BE_SSM;
const urlApi = import.meta.env.VITE_REACT_APP_BE_LINK;
const username = import.meta.env.VITE_REACT_APP_SITE_APIUSER
const password = import.meta.env.VITE_REACT_APP_SITE_APIPASS
const user = new SessionModel().getUserJson()

export default class UserEksModel {
    registrasi(values) {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: urlApi + 'registrasi',
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            },
            data: values
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }
    
    forgot(values) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: urlApi + 'registrasi?email=' + values.email,
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            }
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }
    
    reset(values) {
        values['email'] = user?.email
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: urlApi + 'login/reset',
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            },
            data: values
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }
    
    login(values) {
        values['time'] = (new Date()).toLocaleString('en-CA', { hourCycle: 'h24' }).replace(',', '').slice(0, 19)
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: urlApi + 'login',
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            },
            data: values
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }
    
    getMasterKomoditas(kar) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: urlSsm + 'komoditas/all?kar=' + kar,
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            }
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }
    
    getMasterKodeHs(kar) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: urlSsm + 'kodehs?kar=' + kar,
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            }
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }
}