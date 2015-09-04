/*
** Form module
**
** Handles the form
** 
** Dependency:
** - main app
** - sections module
**
*/

App.createModule('form',(function (app,$) {

	// define module
	// ====================================================================================
	var module = {};

	// define private variables
	// ====================================================================================
	var $form, $formContent, $addSection,
		Defaults, Sections;

	// define private functions
	// ====================================================================================
	
	// Fills in the predefined variables
	function defineVariables () {
		$form = module.$el= $('.form');
		$formContent 	= $form.find('.js-form-content');
		$addSection 	= $form.find('.js-add-section');
	
		Sections = app.sections;
		Defaults = app.defaults;
	}

	// Initializse jquery widgets
	function initializeSortable () {
		$formContent.sortable({
			handle 	: '.js-drag-handle'
		});
	}

	// Adds a section to the form
	function addSection (data) {

		var newSection = Sections.create(data);
			$formContent.append(newSection.$el);

			// Initialize sortable on the new element
			newSection.initializeSortable();

			$form.trigger('addSection');
		
	}

	// Binds events
	function bindHandlers () {

		// bind custom addSection event
		$form.on('addSection',function () {
			initializeSortable();
		});

		// bind add section click
		$addSection.on('click',function (e) {
			addSection(Defaults.section);
		});
	}


	// define public application interface
	// ====================================================================================
	module.addSection = addSection;

	// define module init
	// ====================================================================================
	
	module.init = function () {

		console.log('form module added');

		defineVariables();
		initializeSortable();
		bindHandlers();
	};

	// retrn module object
	// ====================================================================================
	return module;

})(window.App,jQuery));