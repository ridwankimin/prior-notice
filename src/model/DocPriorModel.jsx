import axios from "axios";

const urlApi = import.meta.env.VITE_REACT_APP_BE_LINK;
const username = import.meta.env.VITE_REACT_APP_SITE_APIUSER
const password = import.meta.env.VITE_REACT_APP_SITE_APIPASS

export default class DocPriorModel {
    submitDocument(values) {
        let config = {
            method: (values?.docnbr ? 'put' : 'post'),
            maxBodyLength: Infinity,
            url: urlApi + 'docPrior',
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

    submitKomoditas(values, docnbr) {
        values['docnbr'] = docnbr
        let config = {
            method: (values?.id ? 'put' : 'post'),
            maxBodyLength: Infinity,
            url: urlApi + 'komoditas',
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
    
    submitKontainer(values, docnbr) {
        values['docnbr'] = docnbr
        let config = {
            method: (values?.id ? 'put' : 'post'),
            maxBodyLength: Infinity,
            url: urlApi + 'kontainer',
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
    
    submitCert(values, docnbr) {
        values['docnbr'] = docnbr
        let config = {
            method: (values?.id ? 'put' : 'post'),
            maxBodyLength: Infinity,
            url: urlApi + 'certPrior',
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
    
    getMasterKomoditas(id) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: urlApi + 'komoditas/masterReg?kdneg=' + id,
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            }
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }
    
    getRegLab(neg, kar) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: urlApi + 'regLab?kdneg=' + neg + "&kar=k" + kar?.toLowerCase(),
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            }
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }

    getKomoditas(id) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: urlApi + 'komoditas/getByDok?docnbr=' + id,
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            }
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }
    
    getKontainer(id) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: urlApi + 'kontainer/getByDok?docnbr=' + id,
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            }
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }
    
    getCertPrior(id) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: urlApi + 'certPrior/getByDok?docnbr=' + id,
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            }
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }
    
    getListPrior(user) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: urlApi + 'docPrior/getByRegID?regid=' + user,
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            }
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }
    
    getDocPriorAll(nomor) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: urlApi + 'docPrior/getAll?docnbr=' + nomor,
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            }
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }

    deleteKomoditas(id) {
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: urlApi + 'komoditas',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            },
            data: {
                id: id
            }
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }
    
    deleteKontainer(id) {
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: urlApi + 'kontainer',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            },
            data: {
                id: id
            }
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }
    
    deleteCertPrior(id) {
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: urlApi + 'certPrior',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            },
            data: {
                id: id
            }
        };

        if (import.meta.env.VITE_REACT_APP_BE_ENV == "DEV") {
            console.log(JSON.stringify(config))
        }
        return axios.request(config)
    }
}