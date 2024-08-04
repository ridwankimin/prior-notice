import axios from "axios";

export default class LuarModel {
    getAddress(lat, lon) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + lon,
        };
        return axios.request(config)
    }
}