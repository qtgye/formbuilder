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

		console.log('fileds module added');

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
	function Section (data) {
		
		var self 					= this,
			id 						= Date.now(),
			isSortableInitialized 	= false;

		self.id 	= id;
		self.data 	= data;
		self.$el 	= $(renderReadContent(data));
		self.$sectionContent = self.$el.find('.js-section-content');

		// initialize sortable
		self.initializeSortable = function () {
			self.$sectionContent.sortable({
				handle 		: '.js-drag-handle',
				connectWith : '.js-section-content',
				create 		: function () {
					isSortableInitialized = true;
				}
			});

		};

		// refreshes sortable to find added elements
		self.refreshSortable = function () {
			if ( isSortableInitialized ) {
				self.$sectionContent.sortable('refresh');
			}
		};


	}

	// define private functions
	// ====================================================================================
	
	// One time called template preparation
	function prepareTemplate () {
		template = $('#tmpl-read-section').html();
	}

	// get a rendered html of the data
	function renderReadContent(data) {
		var output = Mustache.render(template,data);
		return output;
	}

	// searches and returns a section referenced by id
	function getSection (sectionId) {
		var section = null;
		
		while ( i < sections.length || sectionId != sections[i].id ) {
			i++;
		}

		section = i != sections.length ? sections[i] : null;

	}

	// refreshes each section
	function refreshAll () {
		sections.forEach(function (_section) {
			_section.refreshSortable();
		});
	}


	// define public application interface
	// ====================================================================================

	module.create = function (data) {
		var newSection = new Section(data);

		sections.push(newSection);
		return newSection;
	};

	module.refreshAll = refreshAll;
	module.getSection = getSection;


	// define module init
	// ====================================================================================
	module.init = function () {

		console.log('sectionsmodule added');
		
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
			addSection(sampleData);
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