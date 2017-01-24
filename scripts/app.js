
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
		
		categories: [ // ability to add categories
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


		currentCategory: '',
	},

	methods: {

		setIcons: function(){

			var imgs = this.imgs;
			var self = this;

			sourceStore.getItem(this.currentCategory)
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

		getImages: function(id){

			console.log(this.imgs.id)
		},

		updateSources: function(){
			// User can update sources whilst online
			// run getSources iregadless of idb and (update idb)
		},

		getHeadlines: function(event){ 

			if (!navigator.onLine) {
				console.log('offline');
                 //Define offline behvior
                 //Set categories
                 //what to fetch e.t.c
				//use idb
				return;
			}

			//var lng: en, de, fr;
			//var ctry: au, de, gb, in, it, us;
            var ctgry;
            var url;
        
			if(event.target.id == 'all'){
			    ctgry = event.target.id;
				url = 'https://newsapi.org/v1/sources?&apiKey='+this.key;
			}else{   
				ctgry = event.target.id;
			    url = 'https://newsapi.org/v1/sources?&category='+ctgry+'&apiKey='+this.key;
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
  					value.sources.forEach(function(obj){
						self.getArticles(obj.id); //if a category returns null refresh sources/ delete category
					});
  				}
	  			
  			});


  			this.currentCategory = ctgry;
  			this.setIcons(); 
        },

        fetchSource:function(url, ctgry){
            
            var self = this; // Learn how to use call, apply and bind

			fetch(url, {
				method: 'get'
			}).then(function(res){
				return res.json();
			}).then(function(res){

				sourceStore.setItem(ctgry, res);
				console.log(ctgry + " saved!");

			    res.sources.forEach(function(obj){
					
					self.getArticles(obj.id);
				});

				 //Next time we dont need to make another request
                
                

                //To-do here
				//Save the array of sources in indexeddb in an object-category 
			    //for quicker access next time?? e.g object music={sources : res} So we fetch articles directly
			    //id, name, and image blobs
			});	
		},

		getArticles: function(source, sortBy){

			if(sortBy) {	
				var url = 'https://newsapi.org/v1/articles?source='+source+'&sortBy='+sortBy+'&apiKey='+this.key;
			}else {
				url = 'https://newsapi.org/v1/articles?source='+source+'&apiKey='+this.key; 
			}
           
			var self = this;

			fetch(url, { //Cross-browser : if fetch doesnt exist, fallback to xhttp
				method: 'get'
			}).then(function(res){
				return res.json();
			}).then(function(res){
				//console.log(res);
				self.results.push(res);
			});
			


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
		}
	}
});


// Onload
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



//Features
// Book mark to read later catchup section





































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
