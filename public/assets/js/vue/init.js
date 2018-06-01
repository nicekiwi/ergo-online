
//setup event handler for component communication
let VueEvent = {
	vue: new Vue(),
	fire (event, data) { this.vue.$emit(event, data || null) },
	on (event, callback) { this.vue.$on(event, callback) }
}

// some Utilities
let VueUtils = {
	VueToObj(obj) {
		return JSON.parse(JSON.stringify(obj))
	}
}

axios.defaults.headers.common = {
	'X-Requested-With': 'XMLHttpRequest'
}