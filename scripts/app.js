
// Init Database

var sourceStore = localforage.createInstance({
	name: "sourrces"
});

var articleStore = localforage.createInstance({
	name: "articles"
});



// Init App
var app = new Vue({
	
	el: '#app',
	data: {
		
		title: 'online',  //Use togle icon	
		
		color: 'color:#e33',
		
		key: 'f6448decf20240cda23e0d6d98d31e9c',
		
		categories: [
			{ type: 'all' },
      		{ type: 'business' },
      		{ type: 'gaming' },
      		{ type: 'general' },
      		{ type: 'music' },
      		{ type: 'science-and-nature' },
      		{ type: 'sport' },
      		{ type: 'technology' }
		],

		results: []
	},

	methods: {

		updateSources: function(){
			// User can update sources whilst online
			// run getSources iregadless of idb and (update idb)
		},


		getSources: function(event){ 

            this.results.length = 0;

           //1. Check if sources Exist in idb if(idb.category.length !== 0 then check)
			//If they do, get articles direct without fetch
			/*sources.forEach(function(obj){
				this.getArticles(obj.id);
			});
			   return; //Dont run
			*/

			//var lng: en, de, fr;
			//var ctry: au, de, gb, in, it, us;

			if(event.target.id !== 'all'){
			   var ctgry = event.target.id;
			   var url = 'https://newsapi.org/v1/sources?&category='+ctgry+'&apiKey='+this.key;
			}else{
				url = 'https://newsapi.org/v1/sources?&apiKey='+this.key;
			}

			var self = this; // Learn how to use call, apply and bind
           

			fetch(url, {
				method: 'get'
			}).then(function(res){
				return res.json();
			}).then(function(res){

			   res.sources.forEach(function(obj,i){
					self.getArticles(obj.id, null, i);
				});

				
                 
                //To-do here
				//Save the array of sources in indexeddb in an object-category 
			    //for quicker access next time?? e.g object music={sources : res} So we fetch articles directly
			    //id, name, and image blobs
			});		
		},

		getArticles: function(source, sortBy, i){

			if(sortBy) {	
				var url = 'https://newsapi.org/v1/articles?source='+source+'&sortBy='+sortBy+'&apiKey='+this.key;
			}else {
				url = 'https://newsapi.org/v1/articles?source='+source+'&apiKey='+this.key; 
			}

			var self = this;

			fetch(url, {
				method: 'get'
			}).then(function(res){
				return res.json();
			}).then(function(res){
				self.results.push(res.articles[i]);
				//console.log(res.articles[i]); 
			});

			// Push latest data to idb-for a particular category
			// Diferent datbase from sources, to be accessed when offline
		},

		setItem: function(key,item){  
			store.setItem(key, item).then(function() {
			    console.log('Key is cleared!');
			}).catch(function(err) {
			    console.log(err);
			});
		},

		createImage: function(id, blob){
		    var img = document.getElementById(id);        
		    img.src = createImageURI(blob);
		},

		getBlob: function(url){   
		    fetch(url).then(function(res){
				return res.blob();
			}).then(function(blob){
				console.log(blob); 
			});	
		},

		createImageURI: function(blob){
			var imageURI = window.URL.createObjectURL(blob);          
			return imageURI;
		},

		toggleOnline: function(){
			this.color = 'color:#0da'
			this.title = 'online'
		},

		toggleOffline: function(){
			this.color = 'color:#e33'
			this.title = 'offline'
		}
	}
});


// Onload
if (navigator.onLine) {
	//Online Behavior 
	app.toggleOnline();
	// Fetch data online
} else {
	// ofline Behaviour
	app.toggleOffline();

    //Fetch data from indexedDB
	//Links greyed out
	//Conyent discolored
}

// Online / offline Handlers when switching
self.addEventListener('online', function(e) {  
    app.toggleOnline();
});

self.addEventListener('offline', function(e) {
	app.toggleOffline();
});








































/*
function getArrBuffer(url){
	fetch(url).then(function(res) {
		return res.arrayBuffer();
	}).then(function(aBuffer) {  
		console.log(aBuffer)
		//Do something with aBuffer
	});
}

function aBufferToBlob(arrBuffer){
	var blob = new Blob([arrBuffer]);
	return blob;
}

function blobToArrayBuffer(blob){
  var reader = new FileReader();
  reader.readAsArrayBuffer(blob);
  reader.addEventListener("loadend", function() {
    var arrayBuffer = reader.result;
    console.log(arrayBuffer) // Do Something with aBuffer
  });  
}
*/
