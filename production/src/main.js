// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueMaterial from 'vue-material'

Vue.use(VueMaterial)

Vue.material.registerTheme('default', {
	primary: 'blue-grey',
	accent: 'teal',
	warn: 'red',
	background: 'white'
});


var app = new Vue({
  
  el: '#app',
  
  template: '<App/>',
  
  components: { App }
  
});




/*

First us the sw-precache plugin

Service Worker Registration

if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
	  // Registration was successful
	}).catch(function(err) {
	  // registration failed 
	  console.log('ServiceWorker registration failed: ', err);
	});
}
*/
