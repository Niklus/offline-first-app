
// Init Database

var sourceStore = localforage.createInstance({
	name: "sources"
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

		sources: 'https://newsapi.org/v1/sources?',

		articles: 'https://newsapi.org/v1/articles?',

		categories: [ 
			'all',
			'business',
			'gaming',
			'general',
			'music',
			'science-and-nature',
      		'sport',
      		'technology'
		],

		results: [],

		logos: [{
			id: '',
            size: {
            	large: '',
            	medium: '',
            	small: ''
            }
		}],

		timer: [] //Limit nmber of requests- timer oject maybe
	},

	methods: {

		setIcons: function(ctgry){

			var imgs = this.imgs;
			var self = this;
			self.logos.length = 0;

			sourceStore.getItem(ctgry)
			.then(function(value) {		
  				value.sources.forEach(function(obj){
                    
                    var id = obj.id;

                    self.logos.push({
                    	id: id,
                    	size: obj.urlsToLogos
                    });          
  				});
  			});	
		},

		getIcons: function(id){

			var arr = this.logos;

			for(var i = 0; i<arr.length; i++){
				if (arr[i].id === id){
					return arr[i].size.small;
				}
			}
		},

		getHeadlines: function(event){ 
             
            //var lng: en, de, fr;
			//var ctry: au, de, gb, in, it, us;
            var ctgry;
            var url;

			if (!navigator.onLine) { // And timer
				//console.log('offline');

				var ctgry = event.target.id;
				var self = this;

				articleStore.getItem(ctgry).then(function(value) {

					if(value){
						self.results.length = 0; 
						self.results = value;
					}else{
						console.log('No Savings Bro!')
					}
				});


                //Define offline behvior
                //Set categories
                //what to fetch e.t.c
				//use idb
				return;
			}
        
			if(event.target.id == 'all'){
			    ctgry = event.target.id;
				url = this.sources+'&apiKey='+this.key;
			}else{   
				ctgry = event.target.id;
			    url = this.sources+'&apiKey='+this.key+'&category='+ctgry;
			}


			this.results.length = 0; 
			//Clear if online
            //Or if idb has data
            //if idb empty and offline save current results to idb -just incase :)
            
           
            var self = this;

	    	sourceStore.getItem(ctgry).then(function(value) {
				
  				if(!value){
  					self.fetchSource(url, ctgry)

  				}else{
                    self.makeRequests(value, ctgry)
  				}
  			});
	    	  
		},
  		

        fetchSource: function(url, ctgry){
            
            var self = this; // Learn how to use call, apply and bind

			fetch(url, {

				method: 'get'
			}).then(function(res){

				return res.json();
			}).then(function(res){

				sourceStore.setItem(ctgry, res).then(function(value) {	
					
					console.log(ctgry + " saved!");

					self.makeRequests(value, ctgry);

				});
			});	
		},

		makeRequests: function(value, ctgry){

			this.setIcons(ctgry)

			var requests = [];
			var self = this;


        	value.sources.forEach(function(obj){

				var request = self.getArticles(obj.id); 

				requests.push(request);
			});

			

			Promise.all(requests).then(function(results) {

				articleStore.setItem(ctgry, self.results).then(function(value) {	
					console.log(ctgry+' articles updated')	
				});
			});
		},

		getArticles: function(source, sortBy){

			if(sortBy) {	
				var url = this.articles+'source='+source+'&sortBy='+sortBy+'&apiKey='+this.key;
			}else {
				url = this.articles+'source='+source+'&apiKey='+this.key; 
			}
           
			var self = this;

			var request = fetch(url, { //Cross-browser : if fetch doesnt exist, fallback to xhttp
				method: 'get'
			}).then(function(res){
				return res.json();
			}).then(function(res){

				self.results.push(res);
				//self.getBlob(res.articles.urlToImage);
			});

			return request;
		
			// Push latest data to idb-for a particular category
			// Diferent datbase from sources, to be accessed when offline
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
		},

		init: function(){

			// Onload
			// Onload: populate with available sources if any, else use general
			if (navigator.onLine) {
				//Online Behavior 
				app.toggleOnline();
				// Fetch data online -populate with recent headlines based on idb
				// if no idb sources then get all popular
			} else {
				// ofline Behaviour
				app.toggleOffline();
			    //Fetch most recent data from indexedDB or saved bookmarks
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
		}
	}
});

app.init();



//Features
// Book mark to read later catchup section

//MAKE BLOBS if possible, link them with their counter part articles and
//Conditionally render when user is ofline


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
