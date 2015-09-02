/*
** Handles interactions in the fields source area
**
** module dependencies
** - Fields module
**
*/

App.createModule('fieldSource',(function (app,$) {

	// define module
	// ====================================================================================
	var module = {};

	// define private variables
	// ====================================================================================
	var $form, $fieldSource, $protoField;

	// define private functions
	// ====================================================================================
	
	// Fills in predefined variables
	function defineVariables () {
		$fieldSource 	= $('.js-field-list'); 
		$protoField 	= $fieldSource.find('.field');
		$form 			= app.form.$el;
	}

	// Binds event handlers
	function bindHandlers () {
		
	}

	// Initializes the draggable widgets
	function initializeDraggables () {

		$protoField.draggable({
			handler 			: '.js-drag-handler',
	    	connectToSortable 	: '.js-section-content',
	    	helper				: "clone",
	    	zIndex				: 100,
	    	revert 				: "invalid",
	    	// events
	    	start 				: draggableOnStart,
	    	stop 				: draggableOnStop
	    });
	}


	// Handles onStart event of draggable
	function draggableOnStart (e,ui) {
		var $sample 	= $('.js-field-list .field'),
			width 		= $sample.width(),
			height 		= $sample.height();

		ui.helper.css({
			width 	: width,
			height 	: height
		}).addClass('field-dragging');
	}


	// Handles onStop event of draggable
	function draggableOnStop (e,ui) {
		if (ui.helper) {
			ui.helper.css({
				width 	: 'auto',
				height 	: 'auto'
			}).removeClass('field-dragging');
		}
		// console.log(e.target);
		$(e.target).sortable({handle:'.js-drag-handle'});
		console.log($(e.target).sortable({handle:'.js-drag-handle'}));
		// $(e.target).sortable({
		// 	''
		// }).sortable('refresh');
	}

	


	// define public application interface
	// ====================================================================================


	// define module init
	// ====================================================================================
	module.init = function () {
		defineVariables();
		bindHandlers();
		initializeDraggables();
	};

	// retrn module object
	// ====================================================================================
	return module;

})(window.App,jQuery));