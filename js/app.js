/*jslint evil:true*/
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
 
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
     
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
       
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
       
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'") +

        "');}return p.join('');");
   
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();
/*
** Application Core
**
*/

var App = window.App || (function (W,D,$) {

	// private vars
	var self = this;

	// app properties
	self.$window 	= $(window);
	self.$document 	= $(document);
	self.$html 		= $('html');
	self.$body 		= $('body');
	self.modules 	= [];


	// module creator
	self.createModule = function (moduleName,moduleObject) {

		if ( (typeof moduleName != 'string') || (typeof moduleObject != 'object') ) {
			return;
		}

		self.modules.push(moduleName);
		self[moduleName] = moduleObject;
	};

	// Initialize modules
	$(document).ready(function () {
		App.modules.forEach(function (moduleName) {
			if ( self[moduleName].init && typeof self[moduleName].init == 'function' ) {
				self[moduleName].init();
			}
		});
	});

	return self;

})(window,document,jQuery);


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