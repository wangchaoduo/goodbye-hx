import * as deepEql from 'deep-eql'
class Store {
    constructor() {
        this.getState = this.getState.bind(this)
    }
    state: any = {}


    listener = {}
    getState() {
        return this.state
    }
    init = (initState?) => {
        this.state = initState
    }
    listen = (id: string, fields: string[], callback: Function) => {
        this.listener[id] = {
            fields: fields,
            callback: callback
        };
    }
    dispatch = (newState) => {
        let ids = [];
        for (const key in this.state) {
            if (newState[key] !== undefined && !deepEql(newState[key], this.state[key])) {
                this.state[key] = newState[key];
                for (const listenerKey in this.listener) {
                    if (this.listener[listenerKey].fields.indexOf(key) !== -1) {
                        ids.push(listenerKey);
                    }
                }
            }
        };
        // ids = [...new Set(ids)];
        ids.forEach(function (listenerKey) {
            this.listener[listenerKey].callback(this.state);
        }, this);
    }
}

const oriStore = new Store()
export default oriStore
export let getState = oriStore.getState