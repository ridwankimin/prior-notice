import axios from "axios";

const urlApi = import.meta.env.VITE_REACT_APP_BE_LINK;
const username = import.meta.env.VITE_REACT_APP_SITE_APIUSER
const password = import.meta.env.VITE_REACT_APP_SITE_APIPASS

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
}