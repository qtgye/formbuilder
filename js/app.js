/* jslint evil:true */

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



// recursive function to clone an object. If a non object parameter
// is passed in, that parameter is returned and no recursion occurs.
// source: http://heyjavascript.com/4-creative-ways-to-clone-objects/
function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
 
    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }
 
    return temp;
}



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
** DEFINE MODULES AFTER THIS SEPARATOR
** =============================================================================================
*/



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
			restriction 	: ''
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
			value 			: 'option3',
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
** MODULE END
** =============================================================================================
*/






/*
** Editor module
**
** handles editors
**
*/

App.createModule('editor',(function (app,$) {



	// define module
	// ====================================================================================
	var module = {};



	// define private variables
	// ====================================================================================
	
	var editorTemplate;


	// Editor Class
	// @param object : the Form/Section/Field object instance
	function Editor (object) {
		
		var self = this;

		var editorData = {
			id 		: object.$el[0].id, // the field id
			type 	: object.type,
			data 	: prepareData(object.data)
		};

		self.$parent 	= object.$el;
		self.$el 		= $(tmpl(editorTemplate,editorData));
		self.$form 		= self.$el.find('form');
		self.$close 	= self.$el.find('.editor-close');

		// opens the editor
		function open () {
			self.$parent.addClass('has-open-editor');
		}
		// closes the editor
		function close () {
			self.$parent.removeClass('has-open-editor');
		}
		// toggles the editor
		function toggle () {
			self.$parent.toggleClass('has-open-editor');
		}
		// extracts the changes
		function extractData () {

			var newData 	= {},
				formData 	= self.$form.serializeArray();
			
			formData.forEach(function (pair) {
				// Convert options into array
				if ( pair.name == 'options' ) {
					var arr = pair.value.split('\r\n').map(function (option) {
						var opt = option.split(',');
						return { label: opt[0], value: opt[1]};
					});
					pair.value = arr;
				}
				// Convert to boolean
				if ( pair.value == "true" ) {
					pair.value = true;
				} else if ( pair.value == "false" ) {
					pair.value = false;
				}
				newData[pair.name] = pair.value;
			});

			return newData;
			
		}
		self.open 			= open;
		self.close 			= close;
		self.toggle 		= toggle;
		self.extractData 	= extractData;

		self.$close.on('click',close);

		return self;
	}



	// define private functions
	// ====================================================================================
	
	// Fills the predefined variables
	function defineVariables () {
		editorTemplate = $('#templates').find('#tmpl-editor').html();
	}

	// prepares the data to be rendered in the editor template
	function prepareData (fieldData) {

		// converts array to string in specified format
		if (fieldData.options) {
			fieldData.options = (function (options) {
				console.log(options);
				return options.map(function (pair) {
					return pair.label + ',' + pair.value;
				}).join('\r\n');
			})(fieldData.options);
		}	

		return fieldData;
	}

	// creates an Editor instance
	function create (object) {
		return new Editor(object);
	}




	// define public application interface
	// ====================================================================================

	module.create 		= create;


	// define module init
	// ====================================================================================
	module.init = function () {
		
		defineVariables();

	};



	// retrn module object
	// ====================================================================================
	return module;

})(window.App,jQuery));


/*
** MODULE END
** =============================================================================================
*/





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
		Defaults 	= app.defaults,
		Editor 		= app.editor,
		checker 	= {
				isSingleline	: 'singleline'	,
				isDate 			: 'date'		,
				isEntity 		: 'entity'		,
				isMultiline		: 'multiline'	,
				isSelect 		: 'selection'	,
				isRadiobox 		: 'radiobox'	,
				isCheckbox 		: 'checkbox'
			};


	// The Field Class
	// @param arg = either a field data or jquery dom object
	function Field (arg) {

		
		var self 		= this;

		// private variables
		// ------------------------
		var	template; // will hold the template for this field object

		// Construct
		// -----------------------
		if (  arg.context ) {
			// if the arg is a jquery object (new field)
			self.type 	= arg.data('type');
			self.data 	= Defaults.fields[self.type];
			self.$el 	= arg;
			template 	= getTemplateString(self.type);
		} else {
			// if the arg is a data object
			self.data 	= arg;
			self.type 	= getFieldType(self.data);
			template 	= getTemplateString(self.type);
			self.$el 	= renderData();
		}

		self.data 			= cloneObject(self.data); // make sure data is not a reference
		self.id 			= guid();
		self.type 			= arg.data('type');
		self.$fieldHeader 	= self.$el.find('.field-header');
		self.$fieldContent 	= self.$el.find('.field-content');
		self.sectionId 		= null; // will hold containing section's id

		self.$el.attr('id',self.id);		

		// private methods
		// ------------------------

		// get a jquery dom object of rendered data
		function renderData () {
			return $(tmpl(template,self.data));
		}		

		// public methods
		// ------------------------
		self.update = function (newData) {
			
			for ( var key in self.data ) {
				if ( key in newData ) {
					self.data[key] = newData[key];
				}				
			}

			updateFieldDOM(self,self.data);
		};
		// removes the field object entirely
		self.remove = function () {			
			delete fields[self.id];			
		}

		// setup editor
		// ------------------------
		self.editor 	= Editor.create(self);
		self.$el.append(self.editor.$el);
		
		self.editor.$form.on('keyup change',function () {
			var newData = self.editor.extractData();
			self.update(newData);
		});

		// add action buttons
		// ------------------------
		self.$fieldHeader.prepend($(tmpl(templates.actions,self)));
		self.$edit 		= self.$el.find('.field-edit');
		self.$remove 	= self.$el.find('.field-remove');
		self.$edit.on('click',self.editor.toggle);
		self.$remove.on('click', function () {
			self.$el.addClass('field-removing');
			setTimeout(function () {
				self.$el.remove();
				self.remove();
			},500);
		});

		// add to store
		// ------------------------
		fields[self.id] = self;
		
	}



	// define private functions
	// ====================================================================================

	// prepares the templates
	function prepareTemplates () {		
		$('#templates').find('.field-template')
			.each(function (i,tmpl) {
				templates[this.getAttribute('data-type')] = this.innerHTML.trim();
			});
		templates.actions = $('#templates').find('#tmpl-actions').html().trim();
	}

	// renders a dom structure of the data
	function renderData (data) {	
		var dataType = getFieldType(data);
		return tmpl(templates[dataType],data);
	}

	// gets the template string for a Field instance data
	function getTemplateString (type) {
		return templates[type];
	}

	// updates a the field dom with given data
	function updateFieldDOM (_field,data) {
		var $rendered = $(renderData(data));

		_field.$fieldContent
			.empty()
			.html($rendered.find('.field-content').html());
	}

	// returns the fieldType
	function getFieldType (data) {
		return checker[Object.keys(data)[0]];
	}

	// get a field object
	function getField (id) {
		return fields[id];		
	}

	// Create a field object
	function create (arg) {
		var _newField = new Field(arg);

		console.log('created a new field');
		return _newField;
		// console.log(_newField);
	}



	// define public application interface
	// ====================================================================================

	module.renderData 	= renderData	;
	module.create 		= create 		;
	module.getField 	= getField 		;


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
** MODULE END
** =============================================================================================
*/






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
** MODULE END
** =============================================================================================
*/




/*
** Sections module
**
** Handles form sections
** 
** Dependency:
** - main app
** - fields module
**
*/

App.createModule('sections',(function (app,$) {



	// define module
	// ====================================================================================
	var module = {};



	// define private variables
	// ====================================================================================
	var Fields 			= app.fields,
		Editor 			= app.editor,
		template 		= '',
		actionsTemplate	= '',
		sections 		= {},
		helperWidth;


	// Section object class
	function Section (data) {
		
		var self 					= this,
			id 						= guid(),
			isSortableInitialized 	= false;

		console.log('New Section : ' + id);

		// Define props
		self.id 				= id;
		self.data 				= data;
		self.$el 				= $(renderData(data));
		self.$sectionHeader 	= self.$el.find('.js-section-header');
		self.$sectionContent 	= self.$el.find('.js-section-content');

		// Attach element id
		self.$el.attr('id',self.id);

		// initializes sortable
		self.initializeSortable = function () {
			self.$sectionContent.sortable({
				handle 		: '.js-drag-handle',
				connectWith : '.js-section-content',
				create 		: function () {
					isSortableInitialized = true;
				},
				start 		: onSortStart,
				stop 		: onSortStop,
				receive 	: onSortReceive,
				remove 		: onSortRemove
			});
		};

		// refreshes sortable to find added elements
		self.refreshSortable = function () {
			if ( isSortableInitialized ) {
				self.$sectionContent.sortable('refresh');
			}
		};

		// gets the field objects
		self.getContentObjects = function () {
			var fieldObjects = [];

			self.$sectionContent.find('.field')
				.each(function (key,field) {
					var id 		= field.id,
						_field 	= Fields.getField(id);
					fieldObjects.push(_field);
				});

			return fieldObjects;
		};

		// extracts the content data
		self.extractContentData = function () {
			var fieldsData 		= [],
				contentObjects	= self.getContentObjects();

			contentObjects.forEach(function (_field) {
				fieldsData[key] = _field.data;
			});

			return fieldsData;
		};

		// update the section's fields data
		self.updateFieldsData = function () {
			self.data.fields = self.extractContentData();
		};

		// removes the dom element and the object entirely
		// including its fields
		self.remove = function () {
			delete sections[self.id];
		};

		// add action buttons
		self.$sectionHeader.prepend($(tmpl(actionsTemplate,self)));
		self.$edit 		= self.$el.find('.field-edit');
		self.$remove 	= self.$el.find('.field-remove');
		self.$remove.on('click',function () {
			self.$el.addClass('section-removing');
			setTimeout(function () {
				self.$el.remove();
				// remove the fields content
				self.getContentObjects()
					.forEach(function (_field) {
						_field.remove();
					});
				self.remove();
			},500);
		});

		// setup editor
		self.editor 	= Editor.create(self);
		self.$el.append(self.editor.$el);
		self.$edit.on('click',function () {
			self.editor.toggle();
		});


		// add to store
		sections[self.id] = self;

	}



	// define private functions
	// ====================================================================================
	
	// One time called template preparation
	function prepareTemplate () {
		template 		= $('#tmpl-read-section').html().trim();
		actionsTemplate = $('#templates').find('#tmpl-actions').html().trim();
	}

	// get a rendered html of the data
	function renderData(data) {
		var output = tmpl(template,data);
		return output;
	}

	// creates a section object from data
	function createSection (data) {
		var newSection = new Section(data);
		return newSection;
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
		ui.helper
			.width( helperWidth ? helperWidth : ui.item.width() )
			.addClass('field-dragging');

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
			var _newField = Fields.create(ui.helper);

			// Update vars
			helperWidth = _newField.$el.width();

		}

		Fields.getField((ui.helper||ui.item)[0].id).sectionId = self.id;
		// update receiving section's fields data
		sections[$(e.target).parent()[0].id].updateFieldsData();	
	}

	// sortable list remove handler
	function onSortRemove (e,ui) {
		// update source section's fields data
		sections[$(e.target).parent()[0].id].updateFieldsData();
		console.log('removed');
	}




	// define public application interface
	// ====================================================================================

	module.create 		= createSection;
	module.refreshAll 	= refreshAll;
	module.getSection 	= getSection;


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
** MODULE END
** =============================================================================================
*/





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

/*
** MODULE END
** =============================================================================================
*/


