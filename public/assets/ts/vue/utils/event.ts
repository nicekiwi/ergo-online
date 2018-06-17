import Vue from 'vue'
import io from 'socket.io-client'

const VueEvent = {
  vue: new Vue(),
  fire (event:string, data?:object) { this.vue.$emit(event, data || null) },
  on (event:string, callback?:Function) { this.vue.$on(event, callback) }
}

const SocketEvent = {
  fire (event:string, data?:object, options?:object) { io().emit(event, data || null) },
  on (event:string, callback?:Function) { io().on(event, callback) }
}

const VueToObj = (obj:object) => {
  return JSON.parse(JSON.stringify(obj))
}

export {
  VueToObj, VueEvent, SocketEvent
}