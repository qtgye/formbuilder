/*
** Request module
**
** handles ajax requests
**
*/

App.createModule('request',(function (app,$) {

	// define module
	// ====================================================================================
	var module = {};

	// define private variables
	// ====================================================================================
	var 

	// POST params
	POST = {
		url 	: 'http://api-dev.maxine.io:8000/api/v1/templates'
	},

	// GET params
	GET = {
		url 	: 'http://api-dev.maxine.io:8000/api/v1/templates',
		params 	: [
			{ sort 	: 'created_at' 	},
			{ order	: 'DESC'		},
			{ limit	: 50 			}
		],
		getURL : function () {
			if ( this.params.length === 0 ) {
				return this.url;
			} else {
				console.log(this.params);
				return this.url + '?' +
					this.params.map(function (pair) {
					for ( var key in pair ) {
							return key + '=' + pair[key];
						}
					}).join('&');
			}
		}
	},

	nativeRequest = (function () {
		var request;
		if (window.XMLHttpRequest) { // Mozilla, Safari, ...
		  request = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE
		  try {
		    request = new ActiveXObject('Msxml2.XMLHTTP');
		  } 
		  catch (e) {
		    try {
		      request = new ActiveXObject('Microsoft.XMLHTTP');
		    } 
		    catch (e) {}
		  }
		}
		return request;
	})();

	// define private functions
	// ====================================================================================
	
	// sends a request
	function send (data,successCallback,errorCallback) {
		var url = POST.url + ( data.id ? '/' + data.id : '');
		// process data before sending
		var jsonString = JSON.stringify(data);
		jsonString = jsonString.replace(/\"\d+\"/g,function (match) {
			return match.replace('"','','g');
		});

		return $.ajax({
			url 		: url,
			contentType : 'application/json',
			method 		: 'POST',
			dataType 	: 'json',
			data 		: jsonString,
			success 	: successCallback,
			error 		: errorCallback
		});
	}

	// sends a request using native xmlHTTP request
	// function nativeSend (data,successCallback,errorCallback) {
	// 	var url = POST.url + ( data.id ? '/' + data.id : '');
		

	// 	nativeRequest.addEventListener("load", function (r) {
	// 		var jsonData = JSON.parse(r.originalTarget.responseText);
	// 		if ( jsonData.flag ) {
	// 			successCallback(jsonData);
	// 		} else {
	// 			errorCallback(jsonData);
	// 		}			
	// 	});
	// 	nativeRequest.addEventListener("error", function (response) {
	// 		console.log(response);
	// 	});

	// 	// process data before sending
	// 	var jsonString = JSON.stringify(data);
	// 	// jsonString = jsonString.replace(/\"\d+\"/g,('$&').replace('\"',''));
	// 	jsonString = jsonString.replace(/\"\d+\"/g,function (match) {
	// 		return match.replace('"','','g');
	// 	});
	// 	console.log(jsonString);

	// 	nativeRequest.open('POST', url, true);
	// 	nativeRequest.setRequestHeader('Content-Type', 'application/json');
	// 	nativeRequest.send(jsonString);
	// }

	// gets a list of latest forms
	function get (successCallback,errorCallback) {
		return $.ajax({
			url 		: GET.getURL(),
			method 		: 'GET',
			dataType 	: 'json',
			success		: successCallback,
			error 		: errorCallback
		});
	}

	// gets a form by id
	function getForm (id,successCallback,errorCallback) {
		return $.ajax({
			url 		: GET.url + '/' + id,
			method 		: 'GET',
			dataType 	: 'json',
			success		: successCallback,
			error 		: errorCallback
		});
	}


	// define public application interface
	// ====================================================================================

	module.send 		= send;
	// module.nativeSend 	= nativeSend;
	module.get 			= get;
	module.getForm 		= getForm;

	// define module init
	// ====================================================================================
	module.init = function () {
		
	};

	// retrn module object
	// ====================================================================================
	return module;

})(window.App,jQuery));


/*
** MODULE END
** =============================================================================================
*/



