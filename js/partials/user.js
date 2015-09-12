/*
** User Module
**
*/

App.createModule('user',(function (app,$) {

	// define module
	// ====================================================================================
	var module = {};

	// define private variables
	// ====================================================================================
	var

	Defaults,
	credentials = {
		user_id 		: [
			"1e5cb1f2-0e3f-441d-8958-c6fc392071b0",
			"test1",
			"test2"
		],
		account_id	 	: [
			"5b960be8-f871-475c-ad76-6b8ab1bc4200",
			"test3",
			"test4"
		]
	},

	$userForm;

	// define private functions
	// ====================================================================================
	function definePrivateVariables () {
		Defaults = app.defaults;
	}

	// returns a list of available credentials acc. to scope
	function getAll (scope) {
		if ( scope in credentials ) {
			return credentials[scope];
		}
		return null;
	}


	// define public application interface
	// ====================================================================================
	module.getAll = getAll;

	// define module init
	// ====================================================================================
	module.init = function () {
		console.log('user module added');
		definePrivateVariables();
	};

	// retrn module object
	// ====================================================================================
	return module;

})(window.App,jQuery));


/*
** MODULE END
** =============================================================================================
*/


