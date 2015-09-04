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