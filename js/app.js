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
** Request module
**
** handles ajax requests
**
*/

App.createModule('request',(function (app,$) {

	// define module
	// ====================================================================================
	var module = {};

	// define private variables
	// ====================================================================================


	// define private functions
	// ====================================================================================
	
	// sends a request
	function send (data,successCallback,errorCallback) {
		return $.ajax({
			url 		: 'http://api-dev.maxine.io:8000/api/v1/templates',
			method 		: 'POST',
			dataType 	: 'json',
			data 		: data,
			sucess 		: successCallback,
			error 		: errorCallback
		});
	}

	function get (url,successCallback,errorCallback) {
		return $.ajax({
			url 		: url,
			method 		: 'GET',
			dataType 	: 'json',
			success		: successCallback,
			error 		: errorCallback
		});
	}


	// define public application interface
	// ====================================================================================

	module.send 	= send;
	module.get 		= get;

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
	
	var editors = {},
		editorTemplate,
		editorClicked,
		currentOpen; // holds the data-id of the open editor


	// Editor Class
	// @param object : the Form/Section/Field object instance
	function Editor (object) {
		
		var self = this;

		var editorData = {
			id 		: object.$el[0].id || object.id, // the field id
			type 	: object.type,
			data 	: prepareData(object.data)
		};

		self.id 		= editorData.id;

		self.$parent 	= object.$el;
		self.$el 		= $(tmpl(editorTemplate,editorData));
		self.$form 		= self.$el.find('form');
		self.$close 	= self.$el.find('.editor-close');

		// opens the editor
		function open () {
			module.closeEditor();
			self.$parent.addClass('has-open-editor');
			currentOpen = self.id;
		}
		// closes the editor
		function close () {
			self.$parent.removeClass('has-open-editor');
		}
		// toggles the editor
		function toggle () {
			if ( self.$parent.hasClass('has-open-editor') )
			{
				close();
			} else {
				open();
			}
		}
		// on editor click
		function onEditorClick (e) {
			module.editorClicked = true;
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
		self.$el.on('click',onEditorClick);

		// add tp store
		editors[self.id] = self;

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

	// closes the current editor
	function closeEditor () {
		if ( currentOpen ) {
			editors[currentOpen].close();
		}
	}

	// bind event handlers
	function bindHandlers () {
		
		app.$body.on('click',function () {
			console.log(module.editorClicked);
			if ( !module.editorClicked ) {
				closeEditor();
			}
			module.editorClicked = false;
		});

	}


	// define public application interface
	// ====================================================================================

	module.create 			= create;
	module.closeEditor		= closeEditor;
	module.editorClicked	= false;


	// define module init
	// ====================================================================================
	module.init = function () {
		
		defineVariables();
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
			isSwitch 		: false,
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
			name 		: "New Section",
			description : 'Lorem Ipsum',
			showif 		: "",
			hideif 		: "",
			isBatch 	: true,
			fields 		: []
	},

	form 	= {
			name 		: 'New Form',
			sections 	: []
	},

	postData1			= {
			account_id 		: "5b960be8-f871-475c-ad76-6b8ab1bc4200",
			user_id 		: "1e5cb1f2-0e3f-441d-8958-c6fc392071b0",
			title			: "Test Form",
			author 			: "Jace",
			tags 			: "loans, investments, finance, business",
			description		: "Just testing the api",
			sequence		: 1,
			config 			: {}
	},

	postData  	= {
		id 				: guid(),
		user_id 		: "1e5cb1f2-0e3f-441d-8958-c6fc392071b0",
		fullname 		: "Cy Domingo",
		account_id 		: "5b960be8-f871-475c-ad76-6b8ab1bc4200",
		organisation 	: "LawCanvas",
		status 			: 0,
		title 			: "Loan Facility Agreement",
		author 			: "Drew Walker",
		tags 			: "loans, investments, finance, business",
		sequence 		: 0,
		description 	: "A loan agreement is a contract between a borrower and a lender which regulates the mutual promises made by each party. There are many types of loan agreements, including facilities agreements, revolvers, term loans and working capital loans",
		num_files 		: 0,
		num_docs 		: 0,
		created_at 		: Date.now(),
		updated_at 		: Date.now(),
		config 			: [
			// {
			// 	account_id: "fddf3117-f89c-4719-8c03-49c52a318be3",
			// 	user_id: "15b6f0cd-54ac-40c2-ab8c-22b2a86bde41",
			// 	title: "Loan Facility Agreement",
			// 	author: "Drew Walker",
			// 	tags: "loans, investments, finance, business",
			// 	description: "A loan agreement is a contract between a borrower and a lender which regulates the mutual promises made by each party. There are many types of loan agreements, including facilities agreements, revolvers, term loans and working capital loans",
			// 	sequence: 1,
			// 	config: {
			// 		flag: true,
			// 		message: "Template successfully created",
			// 		data: {
			// 			id: "29bb36b0-c10d-4e91-bdba-43759074798e",
			// 			status: 0,
			// 			created_at: "2015-09-10 23:08:10",
			// 			updated_at: "2015-09-10 23:08:10"
			// 		}
			// 	}
			// }
		]
	};




	// define private functions
	// ====================================================================================
	



	// define public application interface
	// ====================================================================================
	module.fields 	= fields;
	module.section 	= section;
	module.form 	= form;
	module.postData = postData;




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
		if (  arg.jquery ) {
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
		self.$fieldContent 	= self.$el.find('.field-content');
		self.sectionId 		= null; // will hold containing section's id

		self
			.$el.attr('id',self.id)
			.removeClass('as-peg');

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

			if ( !self.data.isAvailable ) {
				self.$el.addClass('is-disabled');
			} else {
				self.$el.removeClass('is-disabled');
			}

		};
		// removes the field object entirely
		self.remove = function () {			
			delete fields[self.id];			
		};

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
		self.$el.append($(tmpl(templates.actions,self)));
		self.$edit 		= self.$el.find('.field-edit');
		self.$remove 	= self.$el.find('.field-remove');
		self.$edit.on('click',function (e) {
			self.editor.toggle();
			return false;
		});
		self.$remove.on('click', function () {
			self.$el.addClass('field-removing');
			setTimeout(function () {
				self.$el.remove();
				self.remove();
			},500);
			return false;
		});

		self.editor.open();

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

		Editor.closeEditor();
		_newField.editor.open();

		console.log('New field : ' + _newField.id);
		return _newField;
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
		self.data 				= cloneObject(data);
		self.$el 				= $(renderData(data));
		self.$sectionHeader 	= self.$el.find('.js-section-header');
		self.$sectionName	 	= self.$el.find('.js-section-name');
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

			contentObjects.forEach(function (_field,index) {
				fieldsData[index] = _field.data;
			});

			return fieldsData;
		};

		// extracts the full data including the fields
		// this does not update the data, but returns a clone of it
		self.extractData = function () {			
			var data = cloneObject(self.data);
			data.fields = self.extractContentData();
			return data;
		};

		// updates section data and dom
		self.update = function (newData) {
			
			for ( var key in self.data ) {
				if ( key in newData ) {
					self.data[key] = newData[key];
				}				
			}

			self.$sectionName.text(self.data.name);
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

		// render fields
		self.renderFields = function () {
			if (self.data.fields.length > 0 ) {
				self.data.fields.forEach(function (fieldData) {
					self.addField(fieldData);
				});
			}
		}

		// Adds a new field
		self.addField = function (fieldData) {
			self.$sectionContent.append(Fields.create(fieldData).$el);
		}

		if ( self.data.fields.length ) {
			self.renderFields();
		}

		// setup editor
		self.editor 	= Editor.create(self);
		self.$el.append(self.editor.$el);	

		self.editor.$form.on('keyup change',function () {
			var newData = self.editor.extractData();
			self.update(newData);
		});

		// add action buttons
		self.$sectionHeader.prepend($(tmpl(actionsTemplate,self)));
		self.$edit 		= self.$el.find('.field-edit');
		self.$remove 	= self.$el.find('.field-remove');
		// bind buttons
		self.$edit.on('click',function (e) {
			e.preventDefault();
			self.editor.toggle();
			return false;
		});
		self.$remove.on('click',function (e) {
			e.preventDefault();
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
		Editor.closeEditor();
		newSection.editor.open();
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
	}




	// define public application interface
	// ====================================================================================

	module.create 		= createSection;
	module.refreshAll 	= refreshAll;
	module.getSection 	= getSection;


	// define module init
	// ====================================================================================
	module.init = function () {

		console.log('sections module added');
		
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
	var

	Request,
	Defaults,

	sortableInitialized = false,

	data,
	template,
	form,

	$stage;




	// define private functions
	// ====================================================================================
	
	// Fills in the predefined variables
	function defineVariables (data) {

		Defaults 	= app.defaults 	;
		Editor 		= app.editor 	;
		Sections 	= app.sections 	;
		Fields 		= app.fields 	;
		Request 	= app.request 	;

		data 		= cloneObject(data);
		template 	= $('#tmpl-read-form')[0].innerHTML;

		$stage 		= $('.js-stage');
		$saveBtn 	= $('.js-form-save');
		$clearBtn 	= $('.js-form-clear');

		$formList 	= $('.js-form-list');
		$loadForm 	= $formList.find('.js-load-form');

	}

	// creates the form object using default data
	function create (data) {
		
		form  = {
			name  	: data.name,
			id 		: guid(),
			data 	: data,
			$el 	: $(tmpl(template,data))
		};

		$stage.append(form.$el);
		
		form.$formHeader 	= form.$el.find('.js-form-header');
		form.$formTitle 	= form.$el.find('.js-form-title');
		form.$formContent 	= form.$el.find('.js-form-content');
		form.$addSectionBtn = form.$el.find('.js-add-section');		
		form.$editBtn 		= form.$el.find('.js-edit-form');

		bindFormHandlers();

		// setup editor
		// setup editor
		form.editor 	= Editor.create(form);
		form.$el.append(form.editor.$el);	

		form.editor.$form.on('keyup change',function () {
			var newData = form.editor.extractData();
			updateForm(newData);
		});
		form.$editBtn.on('click',function (e) {
			e.preventDefault();
			form.editor.toggle();
			return false;
		});

		console.log(data);


		// render sections
		if ( data.sections.length > 0 ) {
			data.sections.forEach(function (sectionData) {
				addSection(sectionData);
			});
		}

		return form;

	}

	// Initializse jquery widgets
	function initializeSortable () {
		form.$formContent.sortable({
			handle 	: '.js-section-handle'
		});
		sortableInitialized = true;
	}

	// Refresh sortable to detect new elements
	function refreshSortable () {
		if ( sortableInitialized ) {
			form.$formContent.sortable('refresh');
		} else {
			initializeSortable();
		}
	}

	// Adds a section to the form
	function addSection (data) {

		var newSection = Sections.create(data);
			form.$formContent.append(newSection.$el);
			// Initialize sortable on the new element
			newSection.initializeSortable();
			refreshSortable();		
	}

	// Binds events
	function bindFormHandlers () {
		// bind add section click
		form.$addSectionBtn.on('click',function () {
			addSection(Defaults.section);
			return false;
		});		
	}

	// Bind handlers for elements outside the form
	function bindGlobalHandlers () {
		// get the form contents data
		$saveBtn.on('click',function () {
			var formData 	= getFormData(),
				postData 	= cloneObject(Defaults.postData);
			postData.config.push(formData);
			console.log('POST data:');
			console.log(postData);
			Request.send({data:postData},onSendSuccess);
		});
		// clears the form contents and data
		$clearBtn.on('click',clearFormContent);
		// Fetches forms
		$loadForm.on('click',function (e) {
			Request.get('/getForms.php',onGetForms);
		});
	}

	// gets the section objects
	function getContentObjects () {
		var sectionObjects = [];

		form.$formContent.find('.section')
			.each(function (key,section) {
					var id 			= section.id,
						_section	= Sections.getSection(id);
					sectionObjects.push(_section);
				});

		return sectionObjects;

	}

	// get the data of the sections
	function extractContentData () {
		var sectionsData 	= [],
			sectionObjects 	= getContentObjects();

		sectionObjects.forEach(function (_section) {
			// return only a copy of the data
			var sectionData = cloneObject(_section.extractData());
			sectionsData.push(sectionData);
		});

		return sectionsData;
	}

	// clears the form content
	function clearFormContent () {
		getContentObjects().forEach(function (_section) {
			_section.remove();
		});
		form.data.sections = [];
		form.$formContent.empty();
		sortableInitialized = false;
	}

	// updates the form data
	function updateForm (newData) {
		form.data.name = newData.name;
		form.$formTitle.text(newData.name);
	}

	// deletes the form and its data
	function removeForm () {
		clearFormContent();
		form.$el.remove();
		form = null;
	}

	// replaces the form with a new one
	function replaceForm (newData) {
		// verify newData
		if ( newData.name ) {
			removeForm();
			create(newData);
			Editor.closeEditor();
		}		
	}

	// gets the form data for saving
	function getFormData () {
		form.data.sections = extractContentData();
		return form.data;
	}

	// handles form list GET
	function onGetForms (data) {
		if ( data.forms ) {
			if ( data.forms.length > 0 ) {
				// list forms
			} else {
				// no forms
			}
		}
		else {
			// error
		}

	}

	// handles sent data success
	function onSendSuccess (data) {
		console.log('request sent');
		console.log(data);
	}


	// define public application interface
	// ====================================================================================
	module.create 				= create;
	module.addSection 			= addSection;
	module.initializeSortable 	= initializeSortable;
	module.extractContentData 	= extractContentData;
	module.getFormData 			= getFormData;
	module.replace 				= replaceForm;

	// define module init
	// ====================================================================================
	
	module.init = function () {

		console.log('form module added');

		defineVariables();
		bindGlobalHandlers();
		// create initial form
		module.create(Defaults.form);

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

	function bindHandlers () {
		$('.js-peg').on('click',function () {
			return false;
		});
	}

	


	// define public application interface
	// ====================================================================================


	// define module init
	// ====================================================================================
	module.init = function () {
		defineVariables();
		renderFields();
		initializeDraggables();
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


