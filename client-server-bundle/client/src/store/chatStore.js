import {makeAutoObservable} from "mobx"
import api from "../http/core";

export default class chatStore {
    selectedChatsData = {}
    chatsData = []
    loading = false
    loadingChat = false
    loadingChatBox = false
    serchResult = []
    messages = []
    notifications = []
    theme = false
    isOnlineUser = []
    // serchSelectedResult = []
    constructor(){
        makeAutoObservable(this);
    }

    setIsOnlineUser(data){
        this.isOnlineUser = data
        // console.log(this.isOnlineUser)
    }

    setTheme(bool){
        this.theme = bool
    }

    setNotifications(data){
        this.notifications = data
    }
    deleteNotifications(data){
        if(data.chat === undefined){
            const newNotifications = this.notifications.filter((notif) => notif.chat._id !== data._id )
            this.notifications = newNotifications
            return
        }else {
            const newNotifications = this.notifications.filter((notif) => notif.chat._id !== data.chat._id )
            this.notifications = newNotifications
        }
        
       
    }
    clearNotifications(){
        this.notifications = []
    }

    setMessages(data){
        // console.log(data)
        this.messages = data;
    }
    addMessages(data){
        // console.log(data)
        this.messages = [...this.messages, data]
    }

    setSelectedChatsData(data) { 
        this.selectedChatsData = data;
        if(!this.chatsData.find(chats => chats._id === this.selectedChatsData._id )){
            this.setChatsData([this.selectedChatsData,...this.chatsData])
        } 
    }
    setDummySelectedChatsData(loggedUserId) {
        this.selectedChatsData = {}
        if(loggedUserId){
            this.getUserChats(loggedUserId)
        }
    }

    setChatsData(data){
       this.chatsData = data;
    }
    setLoading(bool){
        this.loading = bool;
    }
    setLoadingChat(bool){
        this.loadingChat = bool;
    }
    setloadingChatBox(bool){
        this.loadingChatBox = bool;
    }
    setSerchResult(data){
        this.serchResult = data
    }
    // setSerchSelectedResult(user){
    //     this.serchSelectedResult = [...this.serchSelectedResult,user]
    // }

    async getMessages(){
        // this.setloadingChatBox(true)
        if (this.selectedChatsData._id === undefined){
            this.setLoadingChat(false)
            return null
        }
        try {
            const {data} = await api.get(`/message/${this.selectedChatsData._id}`)
            // this.setloadingChatBox(false)
            this.setMessages(data)
            // console.log(this.messages)
        } catch (error) {
            // this.setloadingChatBox(false)
            console.log(error)
        }
    }

    async searchHendler(search, loggedUserId){
        try {
            this.setLoading(true)
            const {data} = await api.get(`/user/getusers?search=${search}`)
            this.setSerchResult(data.filter(user=> (user._id !== loggedUserId)? user : null))
            this.setLoading(false)
        } catch (error) {
            this.setLoading(false)
            return new Error(error)
        }
    }
    async accessChat(userId,loggedUserId){
        try {
            this.setLoadingChat(true)
            this.setloadingChatBox(true)
            const {data} = await api.post(`/chat`, {userId,loggedUserId})
            this.setSelectedChatsData(data)
            this.setSerchResult([])
            this.setLoadingChat(false)
            this.setloadingChatBox(false)  
        } catch (error) {
            this.setLoadingChat(false)
            this.setloadingChatBox(false)
            return new Error(error)
        }
    }
    async getUserChats(loggedUserId){
        const {data} = await api.post('/chat/getchats',{loggedUserId})
        this.setChatsData(data)
        
        if(this.selectedChatsData._id !== undefined){
            const data = this.chatsData.find(chats => chats._id === this.selectedChatsData._id)
            if(data){
                this.setSelectedChatsData(data)
            }else{
                this.setDummySelectedChatsData()
            }
        }
    }
    async createGroupChat(selectedUsers,groupChatName,loggedUserId){
        console.log('createGroupChat endpoint')
        //users,name,loggedUserId | /chat/group
        const users = selectedUsers.map(user => user._id)
        // console.log(users)
        const {data} = await api.post(`/chat/group`, {users:users,name:groupChatName,loggedUserId})
        console.log(data)
        this.setSelectedChatsData(data)
    }

}