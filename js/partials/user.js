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
		],
		account_id	 	: [
			"5b960be8-f871-475c-ad76-6b8ab1bc4200",
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

	// updates user ids
	function updateUsers (usersArray) {
		credentials.user_id = usersArray;
	}

	// updates account ids
	function updateAccounts (accountsArray) {
		credentials.account_id = accountsArray;
	}


	// define public application interface
	// ====================================================================================
	module.getAll 			= getAll;
	module.updateUsers 		= updateUsers;
	module.updateAccounts 	= updateAccounts;


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


