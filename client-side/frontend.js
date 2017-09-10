window.Vue = require('vue')

try {
    window.$ = window.jQuery = require('jquery');

    require('bootstrap-sass');
} catch (e) {}

window.socket = require('socket.io-client')('http://localhost:3000')

Vue.component('tasks', require('./components/tasks.vue'))
new Vue({
	el : "#app"
});