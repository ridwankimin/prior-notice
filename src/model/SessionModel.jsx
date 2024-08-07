export default class SessionModel {
    getTokenJson() {
        const sesi = localStorage.getItem("expired")
        let user
        if (sesi) {
            user = JSON.parse(sesi)
        } else {
            user = false
        }
        return user;
    }

    getUserJson() {
        const sesi = localStorage.getItem("userEks")
        let user
        if (sesi) {
            user = JSON.parse(sesi)
        } else {
            user = false
        }
        return user;
    }
    
    getUserUptJson() {
        const sesi = localStorage.getItem("coreUser")
        let user
        if (sesi) {
            user = JSON.parse(sesi)
        } else {
            user = false
        }
        return user;
    }
}