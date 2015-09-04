// Generates guid
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}





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
** Default data
**
*/

App.createModule('defaults',(function (app,$) {

	// define module
	// ====================================================================================
	var module = {};

	// define private variables
	// ====================================================================================
	var

	fields = {
		'singleline'	: {
			isSingleline	: true,
			isAvailable 	: true,
			key 			: 'name',
			required 		: false,
			label 			: 'Text Input:',
			placeholder 	: 'placeholder',
			value 			: '',
			description 	: '',
			showif 			: '',
			hideif 			: '',
			restriction 	: '',
			length 			: 100
		},
		'date'			: {
			isDate 			: true,
			isAvailable 	: true,
			key 			: 'date',
			required 		: false,
			label 			: 'Date:',
			format 			: 'DD MMMM YYYY',
			description 	: 'desc',
			showif 			: 's if',
			hideif 			: 'hide me if this happens'
		},
		'entity'		: {
			isEntity 		: true,
			isAvailable 	: true,
			key 			: 'directors',
			required 		: false,
			min 			: 0,
			max 			: 0,
			label 			: 'Directors',
			description 	: '',
			showif 			: '',
			hideif 			: ''
		},
		'multiline'		: {
			isMultiline 	: true,
			isAvailable 	: true,
			key 			: 'name',
			required 		: false,
			label 			: 'Multiline Input:',
			placeholder 	: 'placeholder',
			value 			: '',
			description 	: '',
			showif 			: '',
			hideif 			: '',
			restriction 	: ''
		},
		'selection' 	: {
			isSelect		: true,
			isAvailable 	: true,
			key 			: 'name',
			required 		: false,
			label 			: 'Select:',
			value 			: 'option2',
			multiple 		: false,
			description 	: '',
			showif 			: '',
			hideif 			: '',
			options 		: [
								{label: 'Option1', value: 'option1'},
								{label: 'Option2', value: 'option2'},
								{label: 'Option3', value: 'option3'}
							  ]
		},
		'radiobox' 		: {
			isRadiobox 		: true,
			isAvailable 	: true,
			key 			: 'name',
			label 			: 'Name',
			value 			: 'option2',
			description 	: '',
			showif 			: '',
			hideif 			: '',
			options 		: [
								{label: 'Option1', value: 'option1'},
								{label: 'Option2', value: 'option2'},
								{label: 'Option3', value: 'option3'}
							  ]
		},
		'checkbox' 				: {
			isCheckbox 		: true,
			isAvailable 	: true,
			key 			: 'name',
			min 			: 0,
			max 			: 0,
			label 			: 'Name',
			value 			: 'Daniel',
			description 	: '',
			showif 			: '',
			hideif 			: '',
			options 		: [
								{label: 'Option1', value: 'option1'},
								{label: 'Option2', value: 'option2'},
								{label: 'Option3', value: 'option3'}
							  ]
		}
	},

	section = {
		name 	: "Sample Section",
		showif 	: "xxx",
		hideif 	: "xxx",
		isBatch : true,
		fields 	: []
	};

	// define private functions
	// ====================================================================================
	


	// define public application interface
	// ====================================================================================
	module.fields 	= fields;
	module.section 	= section;



	// define module init
	// ====================================================================================
	module.init = function () {
		
	};

	// retrn module object
	// ====================================================================================
	return module;

})(window.App,jQuery));
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
	var fields 		= {},
		templates 	= {},
		checker 	= {
				isSingleline	: 'singleline'	,
				isDate 			: 'date'		,
				isEntity 		: 'entity'		,
				isMultiline		: 'multiline'	,
				isSelect 		: 'selection'	,
				isRadiobox 		: 'radiobox'	,
				isCheckbox 		: 'checkbox'
			},
		// contains function return appropriate data structures acc. to field type
		dataExtractor = {
			'singleline' : function ($el) {
				var $input = $el.find('input');
				return  {
					isSingleline	: true,
					isAvailable 	: $el.data('isAvailable'),
					key 			: $input.attr('name'),
					required 		: $input.attr('required') || false,
					label 			: $el.find('label').text(),
					placeholder 	: $input.attr('placeholder') || false,
					value 			: $input.val(),
					description 	: $el.find('.field-description').text(),
					showif 			: $el.data('showif'),
					hideif 			: $el.data('hideif'),
					restriction 	: $el.data('restriction'),
					length 			: $input.attr('length')
				};
			},
			'date' 		: function ($el) {
				var $input = $el.find('input');
				return {
					isDate 			: true,
					isAvailable 	: $el.data('isAvailable'),
					key 			: $input.attr('name'),
					required 		: $input.attr('required') || false,
					label 			: $el.find('label').text(),
					format		 	: $el.data('format'),
					description 	: $el.find('.field-description').text(),
					showif 			: $el.data('showif'),
					hideif 			: $el.data('hideif')
				}
			}
		};



	// The Field Class
	function Field (arg) {

		var self 		= this;

		if (  arg.context ) {
		// if the arg is a jquery object
			self.data 	= extractData(arg);
			self.$el 	= arg;
		} else {
		// if the arg is a data object
			self.data 	= arg;
			self.$el 	= $(renderData(arg));
		}

		self.id = guid();
		self.$el.attr('id',self.id);

		fields[self.id] = self;

		console.log(self);

	}

	// define private functions
	// ====================================================================================

	// prepares the templates
	function prepareTemplates () {		
		$('#templates').find('.field-template')
			.each(function (i,tmpl) {
				templates[this.getAttribute('data-type')] = this.innerHTML.trim();
			});
	}

	// renders a dom structure of the data
	function renderData (data) {	
		var dataType = getFieldType(data);
		return Mustache.render(templates[dataType],data);
	}

	// returns the fieldType
	function getFieldType (data) {
		return checker[Object.keys(data)[0]];
	}

	// gets the data from a jquery dom object
	function extractData ($el) {
		var type = $el.data('type');
		return dataExtractor[type]($el);
	}

	// Create a field object
	function create (arg) {
		var _newField = new Field(arg);

		

		console.log('created a new field');
		// console.log(_newField);
	}



	// define public application interface
	// ====================================================================================

	module.renderData 	= renderData	;
	module.create 		= create 		;
	// test
	module.extractData = extractData;


	// define module init
	// ====================================================================================
	module.init = function () {

		console.log('fileds module added');

		prepareTemplates();
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
	var Fields 		= app.fields,
		template 	= '',
		sections 	= {};

	// Section object class
	function Section (data) {
		
		var self 					= this,
			id 						= guid(),
			isSortableInitialized 	= false;

		// Define props
		self.id 				= id;
		self.data 				= data;
		self.$el 				= $(renderReadContent(data));
		self.$sectionContent 	= self.$el.find('.js-section-content');

		// Attach element id
		self.$el.attr('id',self.id);

		// initialize sortable
		self.initializeSortable = function () {
			self.$sectionContent.sortable({
				handle 		: '.js-drag-handle',
				connectWith : '.js-section-content',
				create 		: function () {
					isSortableInitialized = true;
				},
				start 		: onSortStart,
				stop 		: onSortStop,
				receive 	: onSortReceive
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
		return sections[sectionId];
	}

	// refreshes each section
	function refreshAll () {
		sections.forEach(function (_section) {
			_section.refreshSortable();
		});
	}

	// sort start handler
	function onSortStart (e,ui) {
		// get the helper's dimension for the item
		ui.helper.width(ui.item.width()).addClass('field-dragging');
	}

	// sort stop handler
	function onSortStop (e,ui) {
		// remove class
		(ui.helper || ui.item).removeClass('field-dragging');
	}

	// sortable list receive handler
	function onSortReceive (e,ui) {

		if ( ui.helper ) {
			// The element is new
			Fields.create(ui.helper);

		} else {
			// The element is existing field
			console.log('moved');
		}
	}


	// define public application interface
	// ====================================================================================

	module.create = function (data) {
		var newSection = new Section(data);

		sections[newSection.id] = newSection;
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
	var $form, $fieldSource, $protoField,
		Fields 		= app.fields,
		Defaults 	= app.defaults;

	// define private functions
	// ====================================================================================
	
	// Fills in predefined variables
	function defineVariables () {
		$fieldSource 	= $('.js-field-list');
		$form 			= app.form.$el;
	}

	// renders the fields with default data
	function renderFields () {
		for ( var key in Defaults.fields ) {
			var data = Defaults.fields[key];
			$fieldSource.append(Fields.renderData(data));
		}
	}

	// Initializes the draggable widgets
	function initializeDraggables () {

		$fieldSource.find('.field').draggable({
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
			width 		= $sample.outerWidth(true);

		ui.helper.css({
			width 	: width
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
		renderFields();
		initializeDraggables();
	};

	// retrn module object
	// ====================================================================================
	return module;

})(window.App,jQuery));