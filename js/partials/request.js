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


	// define private functions
	// ====================================================================================
	
	// sends a request
	function send (data,successCallback,errorCallback) {
		return $.ajax({
			url 		: 'http://api-dev.maxine.io:8000/api/v1/templates',
			method 		: 'POST',
			dataType 	: 'json',
			data 		: data,
			sucess 		: successCallback,
			error 		: errorCallback
		});
	}

	function get (url,successCallback,errorCallback) {
		return $.ajax({
			url 		: url,
			method 		: 'GET',
			dataType 	: 'json',
			success		: successCallback,
			error 		: errorCallback
		});
	}


	// define public application interface
	// ====================================================================================

	module.send 	= send;
	module.get 		= get;

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



