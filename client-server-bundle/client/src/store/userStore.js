import {makeAutoObservable} from "mobx"
import api from "../http/core";

export default class userStore {
    isAuth = false;
    userData = {};
    constructor(){
        makeAutoObservable(this);
    }

    setAuth(bool) { 
        this.isAuth = bool;
    }
    setUserData(data) { 

        this.userData = data;
    }
    
    async logout(){
        localStorage.clear()
        this.setAuth(false)
        this.setUserData({})
        window.location.reload(true)
    }
    async refreshToken(token){
        try {
            const {data} = await api.post('/user/token',{token})
            const user = {user:data.user[0]}
            if(user.user === undefined){
                localStorage.removeItem('token')
                this.setAuth(false)
                this.setUserData({}) 
            }
            this.setUserData(user)
            this.setAuth(true)      
        } catch (error) {
            localStorage.removeItem('token')
            this.setAuth(false)
            this.setUserData({})
        }
    }
}