
Vue.use(VueMaterial);

Vue.material.registerTheme('default', {
  primary: 'blue-grey',
  accent: 'teal',
  warn: 'red',
  background: 'white'
});

var app = new Vue({
	
	el: '#app',
	
	data: {	
		
		color: '',
		
		key: 'f6448decf20240cda23e0d6d98d31e9c',

		sources: 'https://newsapi.org/v1/sources?',

		sourceStore: '',

		articles: 'https://newsapi.org/v1/articles?',

		articleStore: '',

		categories: [ 
			'general',
			'business',
			'sport',
			'technology',
			'gaming',
			'music',
			'science-and-nature'
		],// remove 'all' category for now

		lang: '',

		ctry: '',

		sortby: '',

		results: [],

		logos: [{  //Conside Eliminating these and just display the name (Bandwith saving) Test speed with & without
			id: '',
            size: {
            	large: '',
            	medium: '',
            	small: ''
            }
		}],

		timer: [], //Limit nmber of requests- timer oject maybe

		readability: ''

	},

	methods: {

		setLang: function(e){
			//var lng: en, de, fr;
		},

		setCtry: function(e){
			//var ctry: au, de, gb, in, it, us;
		},

		sortby: function(e){
			//var sortby: top, popular, latest e.t.c
		},

		getCategory: function(e){ 
             
            var ctgry = e.target.id;

            console.log(id);

            //this.getHeadlines(ctgry);	  
		},

		getHeadlines: function(ctgry){

			var self = this;
            
	    	self.sourceStore.getItem(ctgry).then(function(sources) {
				
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

			self.articleStore.getItem(ctgry).then(function(articles) {

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

				self.sourceStore.setItem(ctgry, res).then(function(source) {	
					
					console.log(ctgry + " source updated!");

					self.setLogos(ctgry)
					self.results.length = 0;
					self.fetchArticles(source, ctgry);
				});
			});	
		},

		fetchArticles: function(source, ctgry){

			var self = this;
			var requests = [];

        	source.sources.forEach(function(obj){
        		var source = obj.id;
				var request = self.makeRequests(source); 
				requests.push(request);
			});

			Promise.all(requests).then(function(value) {
	
				self.articleStore.setItem(ctgry, self.results).then(function(value) {	
					console.log(ctgry+' articles updated!'); // Save articles once loaded and rendered to user
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

		setLogos: function(ctgry){

			var imgs = this.imgs;
			var self = this;
			self.logos.length = 0;

			self.sourceStore.getItem(ctgry)
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

		toggleNetwork: function(){

			if (navigator.onLine) {	
				this.color = 'color:#ccff00';
				this.readability = 'Read More';		
			} else {
				this.color = 'color:#e00001';
				this.readability = 'Read Later';	
			}
		},

	    toggleLeftSidenav() {
	      this.$refs.leftSidenav.toggle();
	    },

	    open(ref) {
	      console.log('Opened: ' + ref);
	    },

	    close(ref) {
	      console.log('Closed: ' + ref);
	    },

		init: function(){

			// Init Database

			this.sourceStore = localforage.createInstance({
				name: "sources"
			});

			this.articleStore = localforage.createInstance({
				name: "articles"
			});

			this.getHeadlines('business');

			this.toggleNetwork();

			var self = this;

			// Online / offline Handlers when switching
			window.addEventListener('online', function(e) {  
			    self.toggleNetwork();
			});

			window.addEventListener('offline', function(e) {
				self.toggleNetwork();
			});
		}
	}
});

app.init();








