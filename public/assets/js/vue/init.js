// setup VueStore
let VueStore = {
	userId: null
};

//setup event handler for component communication
let VueEvent = { 
	vue: new Vue(),
	fire: function(event, data) { this.vue.$emit(event, data || null) },
	on: function(event, callback) { this.vue.$on(event, callback) }
};

// some Utilities
let VueUtils = {
	VueToObj: function(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
};

axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest'
};
