
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

		logos: [{  //Conside Eliminating these and just display the name (Bandwith saving) Test speed with & without
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

		setLogos: function(ctgry){

			var imgs = this.imgs;
			var self = this;
			self.logos.length = 0;

			sourceStore.getItem(ctgry)
			.then(function(value) {		
  				value.sources.forEach(function(obj){
                    
                    self.logos.push({
                    	id: obj.id,
                    	size: obj.urlsToLogos
                    });          
  				});
  			});	
		},

		getLogos: function(id){

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
            var ctgry = event.target.id;
            var self = this;
            
	    	sourceStore.getItem(ctgry).then(function(sources) {
				
  				if(!sources && navigator.onLine){

  					var url;

  					//If no sources and online, then fetch
  					if(ctgry == 'all'){
						url = self.sources+'&apiKey='+self.key;
					}else{   
					    url = self.sources+'&apiKey='+self.key+'&category='+ctgry;
					}

  					self.fetchSource(url, ctgry);

  				}else if(sources){   //Offline or Online    
                    
                    // If we have sources set logos and then get articles from db
                    self.setLogos(ctgry);
                    self.getArticlesFromDB(ctgry);
  				}else{ 
					
					//Case: offline and no Sources
					console.log('No Article Saved'); 
				}
  			});
	    	  
		},

		getArticlesFromDB: function(ctgry){

			var self = this;

			articleStore.getItem(ctgry).then(function(articles) {

				if(articles){
					self.results.length = 0;
					self.results = articles;
					console.log('Serving from iDB');
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

				sourceStore.setItem(ctgry, res).then(function(source) {	
					
					console.log(ctgry + " source updated!");

					self.setLogos(ctgry)
					self.results.length = 0;
					self.getArticles(source, ctgry);
				});
			});	
		},

		getArticles: function(source, ctgry){

			var requests = [];
			var self = this;

        	source.sources.forEach(function(obj){
				var request = self.makeRequests(obj.id); 
				requests.push(request);
			});

			Promise.all(requests).then(function(results) {
				articleStore.setItem(ctgry, self.results).then(function(value) {	
					console.log(ctgry+' articles updsted!'); // Save articles once loaded and rendered to user
				});
			});
		},

		makeRequests: function(source, sortBy){

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
