/*
** Sections module
**
** Handles form sections
** 
** Dependency:
** - main app
**
*/

App.createModule('sections',(function (app,$) {

	// define module
	// ====================================================================================
	var module = {};

	// define private variables
	// ====================================================================================
	var defaults = {
			name 	: 'Sample Section'
		},
		template = '',
		sections = [];

	// Section object class
	function Section ($element) {
		
		var self 	= this,
			id 		= Date.now();


		// unfinished.............


	}

	// define private functions
	// ====================================================================================
	
	function prepareTemplate () {
		template = $('#tmpl-read-section').html();
	}

	function renderReadContent(data) {
		var output = Mustache.render(template,data);
		return output;
	}


	// define public application interface
	// ====================================================================================

	// Adds a new section to the form
	module.add = function () {
		// body...
	};

	module.create = function (data) {
		var newSection = new Section(data);

		sections.push(newSection);
		return newSection.$el;
	};


	// define module init
	// ====================================================================================
	module.init = function () {
		
		prepareTemplate();
	};

	// retrn module object
	// ====================================================================================
	return module;

})(window.App,jQuery));