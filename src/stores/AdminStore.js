import { defineStore } from 'pinia'

export const AdminStore = defineStore("admin", {

    state: () => {
        return {
            userid: 0,
            account: "",
            token: ""
        }
    },
    actions: {},
    getters: {}

})
