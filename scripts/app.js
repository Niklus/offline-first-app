
// Init Database
if(!storage){
	var storage = localforage.createInstance({
		name: "store"
	});
}

// Init App
var app = new Vue({
	
	el: '#app',
	data: {
		title: 'Offline Web App',  	
		message: 'Offline Web App!!',		
		copyright: 'by Nicholas',  // title, message and copyright put on html
		color: 'color:yellow'
	},

	methods: {

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
		}
	}
});


// Check if the user is connected initial load
if (navigator.onLine) {
	app.color = 'color:yellow'
	//Online Behavior 
} else {
	app.color = 'color:red'
	//Offline behavior
}

// Online / offline Handlers when switching
self.addEventListener('online', function(e) {  
    
    app.color = 'color:yellow'
    // Resync data with server.
    // hideOfflineWarning
});

self.addEventListener('offline', function(e) {

	app.color = 'color:red'
    // Queue up events for server.
    // showOfflineWarning / page
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
