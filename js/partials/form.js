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
		Sections,
		sampleData = {
			name 	: 'Dummy Section'
		};

	// define private functions
	// ====================================================================================
	
	// Fills in the predefined variables
	function defineVariables () {
		$form = module.$el= $('.form');
		$formContent 	= $form.find('.js-form-content');
		$addSection 	= $form.find('.js-add-section');
	
		Sections = app.sections;
	}

	// Initializse jquery widgets
	function initializeWidgets () {
		$formContent.sortable({
			handle 	: '.js-drag-handle'
		});
	}

	// Binds events
	function bindHandlers () {

		// bind custom addSection event
		$form.on('addSection',function () {
			initializeWidgets();
		});

		// bind add section click
		$addSection.on('click',function (e) {
			var $newSection = $(Sections.create(sampleData));
			$formContent.append($newSection);

			// Initialize sortable on the new element
			$newSection.find('.js-section-content')
				.sortable({
					handle : '.js-drag-handle'
				});

			$form.trigger('addSection');
		});
	}


	// define public application interface
	// ====================================================================================


	// define module init
	// ====================================================================================
	
	module.init = function () {

		defineVariables();
		initializeWidgets();
		bindHandlers();
	};

	// retrn module object
	// ====================================================================================
	return module;

})(window.App,jQuery));