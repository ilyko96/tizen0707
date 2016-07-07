
window.onload = function () {
	
	var indicator = document.getElementById("indicator");
	indicator.style.visibility = "hidden";
	

};


var indexedDB 	  = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
IDBTransaction  = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
baseName 	  = "filesBase7",
storeName 	  = "filesStore7";



function getFeed(){
	var indicator = document.getElementById("indicator");
	indicator.style.visibility = "visible";
    	var width = screen.width;
    	var arr = [];
    	var i=0;
	 var FEED_URL = "http://www.3dnews.ru/news/rss/";
	 
	 
	 
	 $(document).ready(function () {
		    $.ajax({
		        type: "GET",
		        url: FEED_URL,
		        dataType: "xml",
		        error: 	    getStorage(function(res){
			    	for(var field in res) {
			    		for ( fieldValue in (value = res[ field ]) ){
			    		
			    			switch (fieldValue) {
			    			  case 'title':
			    				  var title = value[fieldValue];
			    			  case 'description':
			    				  var description = value[fieldValue];
			    			  case 'image':
			    				  var url = value[fieldValue];

			    			}
			    		}
			    		
			    //	$("#rssContent").append("key: " + field + "<br> значение: " + value[fieldValue] + "<br><br>-------------<br>");
					        $("#rssContent").append('<div class="feed"><div class="image"><img src="' + url + '" width=' + width + 'px /><div class="title"> Title:' + title 
					        		+ '</div><br><div class="description">description: ' + description + '</div></div>');
			    		}
			    		}),
		        success: xmlParser
		    });
		});

		function xmlParser(xml) {

			indicator.style.display = "none";
			clearStorage();
		//  delData(1054);
		    $(xml).find("item").each(function () {
		    	  var url =  $(this).find("enclosure").attr('url')

		    	  
			        $("#rssContent").append('<div class="feed"><div class="image"><img src=' + url + ' width=' + width + 'px /><div class="title"> Title:' + $(this).find("title").text() 
			        		+ '</div><br><div class="description">Desc: ' + $(this).find("description").text() + '</div></div>');


		          arr[i] = { title:$(this).find("title").text(), description:$(this).find("description").text(), image:$(this).find("enclosure").attr('url')};
		    	
		    	  setData(arr[i]); // чем плоха данная схема? переделать на передачу массива.
		          
		          // вытащить запись по ключу
		          //      getData(13, function(res){$("#rssContent").append(res["key"] + "<br><br>");});
		          
		          i++;
		    });
		    

		}
	 
	 





function logerr(err){
	console.log(err);
}

function connectDB(f){
	var request = indexedDB.open(baseName, 1);
	request.onerror = logerr;
	request.onsuccess = function(){
		f(request.result);
	}
	request.onupgradeneeded = function(e){
		var objectStore = e.currentTarget.result.createObjectStore(storeName, { autoIncrement: true });
		connectDB(f);
	}
}

function getData(key, f){
	connectDB(function(db){
		var request = db.transaction([storeName], "readonly").objectStore(storeName).get(key);
		request.onerror = logerr;
		request.onsuccess = function(){
			f(request.result ? request.result : -1);
		}
	});
}

function getStorage(f){
	connectDB(function(db){
		var rows = [],
			store = db.transaction([storeName], "readonly").objectStore(storeName);

		if(store.mozGetAll)
			store.mozGetAll().onsuccess = function(e){
				f(e.target.result);
			};
		else
			store.openCursor().onsuccess = function(e) {
				var cursor = e.target.result;
				if(cursor){
					rows.push(cursor.value);
					cursor.continue();
				}
				else {
					f(rows);
				}
			};
	});
}

function setData(obj){
	connectDB(function(db){
		var request = db.transaction([storeName], "readwrite").objectStore(storeName).add(obj);
		request.onerror = logerr;
		request.onsuccess = function(){
			return request.result;
		}
	});
}

function delData(key){
	connectDB(function(db){
		var request = db.transaction([storeName], "readwrite").objectStore(storeName).delete(key);
		request.onerror = logerr;
		request.onsuccess = function(){
			console.log("File delete from DB:", file);
		}
	});
}

function clearStorage(){
	connectDB(function(db){
		var request = db.transaction([storeName], "readwrite").objectStore(storeName).clear();;
		request.onerror = logerr;
		request.onsuccess = function(){
			console.log("Clear");
		}
	});
}
}
