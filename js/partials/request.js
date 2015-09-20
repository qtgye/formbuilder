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

	nativeRequest = function (data,successCallback,errorCallback) {
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
		    catch (err) {}
		  }
		}
		return request;
	};

	// define private functions
	// ====================================================================================
	
	// sends a request
	function send (data,successCallback,errorCallback) {
		var url = POST.url + ( data.id ? '/' + data.id : '');
		// process data before sending
		var jsonString = JSON.stringify(data);

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

	// sends a request using native ajax
	function nativeSend (data,successCallback,errorCallback) {
		if ( nativeRequest ) {
			var url = POST.url + ( data.id ? '/' + data.id : '');
			// process data before sending
			var jsonString = JSON.stringify(data);
			jsonString = jsonString.replace(/\"(min|max)\":\"\d+\"/g,function (match) {
				var key = match.slice(0,5),
					stringedInt = match.slice(match.match(':').index+1);
				return key + ':' + stringedInt.replace('"','','g');
			});

			request.addEventListener('error',function (res) {
				console.log(res);
			});

			request.addEventListener('load',function (res) {
				console.log(res);
			});

			request.setRequestHeader("Content-type","application/json");
			request.open('POST', url, true);
			request.send(jsonString);
		}
		
	}

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
		swal({
			type 				: 'info',
			title 				: 'Loading template...',
			showConfirmButton 	: false
		});
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
	module.naiveSend 	= nativeSend;
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



