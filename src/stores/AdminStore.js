import { defineStore } from 'pinia'

export const AdminStore = defineStore("admin", {

    state: () => {
        return {
            userid: null,
            account: "",
            token: ""
        }
    },
    actions: {},
    getters: {}

})
