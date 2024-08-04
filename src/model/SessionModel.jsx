export default class SessionModel {
    getTokenJson() {
        const sesi = localStorage.getItem("tokenpj")
        let user
        if (sesi) {
            user = JSON.parse(sesi)
        } else {
            user = false
        }
        return user;
    }

    getUserJson() {
        const sesi = localStorage.getItem("userpj")
        let user
        if (sesi) {
            user = JSON.parse(sesi)
        } else {
            user = false
        }
        return user;
    }
    
    getUserUptJson() {
        const sesi = localStorage.getItem("userupt")
        let user
        if (sesi) {
            user = JSON.parse(sesi)
        } else {
            user = false
        }
        return user;
    }
}