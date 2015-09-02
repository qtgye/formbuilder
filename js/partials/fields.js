/*
** Fields module
**
** Handles form fields
** 
** Dependency:
** - main app
** - form module
** - section module
**
*/

App.createModule('fields',(function (app,$) {

	// define module
	// ====================================================================================
	var module = {};

	// define private variables
	// ====================================================================================


	// define private functions
	// ====================================================================================
	function fieldsHandler () {
		console.log('fields module added');
	}


	// define public application interface
	// ====================================================================================

	// Adds a new section to the form
	module.add = function () {
		// body...
	};


	// define module init
	// ====================================================================================
	module.init = function () {
		fieldsHandler();
	};

	// retrn module object
	// ====================================================================================
	return module;

})(window.App,jQuery));