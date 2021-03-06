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
		errorFields = [],
		checker 	= {
				isSingleline	: 'singleline'	,
				isDate 			: 'date'		,
				isEntity 		: 'entity'		,
				isMultiline		: 'multiline'	,
				isSelect 		: 'selection'	,
				isSwitch 		: 'radiobox'	,
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
		self.id = guid();
		if (  arg.jquery ) {
			// if the arg is a jquery object (new field)
			self.type 	= arg.data('type');
			self.data 	= Defaults.fields[self.type];
			self.data.id = self.id;
			self.$el 	= arg;
			template 	= getTemplateString(self.type);
		} else {
			// if the arg is a data object
			self.data 	= arg;
			self.type 	= getFieldType(self.data);
			self.data.id = self.id;
			template 	= getTemplateString(self.type);
			self.$el 	= renderData();
		}

		self.data 			= cloneObject(self.data); // make sure data is not a reference
		// make sure booleans are not casted as strings
		for ( var key in self.data ) {
			if ( self.data[key] === "true" ) {
				self.data[key] = true;
			} 
			if ( self.data[key] === "false" ) {
				self.data[key] = false;
			} 
		}		
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

			// replace isSwitch/isRadio with selected property
			if ( 'isSwitch' in newData ) {
				if ( newData.isSwitch === true || self.data.isRadiobox === false  ) {
					self.data.isSwitch = true;
					delete self.data.isRadiobox;
				} else if ( newData.isSwitch === false || self.data.isRadiobox === true ) {
					self.data.isRadiobox = true;
					delete self.data.isSwitch;
				}
			}

			// prepare data for presentation
			var presentationData = cloneObject(self.data);
			if ( 'options' in presentationData ) {
				if ( presentationData.options instanceof Array && presentationData.options.length > 1 ) {
					var newOpts = presentationData.options.map(function (option) {
						
						var newLabel = option.label ? option.label.replace(/[\“\”\"]/gi,'') : option.label,
							newValue = option.value ? option.value.replace(/[\“\”\"]/gi,'') : option.value;
						return {label:newLabel, value:newValue};
					});
					presentationData.options = newOpts;
				}
			}
			console.log(presentationData.options);
			
			updateFieldDOM(self,presentationData);

			// validate options if any
			var isValid  = true;
			if ( self.data.isSwitch || self.data.isRadiobox || self.data.isSelect ) {
				if ( self.data.options instanceof Array && self.data.options.length > 1 ) {
					self.data.options.forEach(function (option) {
						var opt = option.label + ',' + option.value;
						if (
							!opt.match(/^[\“\"][^“”]+[\”\"],[\“\"][^“”]+[\”\"]$/)
							&& !opt.match(/^[^,]+,[^,]+$/)
							&& !opt.match(/^[\“\"][^“”]+[\”\"],[^,]+$/)
							&& !opt.match(/^[^\,]+,[\“\"][^“”]+[\”\"]$/)
						) {
							isValid = false;
						}
					});
				} else {
					isValid = false;
				}

				// if error
				if ( !isValid ) {
					Editor.hasError = true;
					Editor.errorEditor = self.id;
					console.log('error from field update');
				} else {
					if ( Editor.hasError && Editor.errorEditor == self.id ) {
						Editor.hasError = false;
						Editor.errorEditor = null;
					}
				}
			}

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
		
		self.editor.$form.on('keyup change',function (e) {
			var newData = self.editor.extractData();
			self.update(newData);
		});

		console.log(self.editor.id);

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

		self.data.id = self.id;
		self.update(self.data);
		
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
		// console.log(data);
		// console.log(dataType);
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
		var dataType;
		Object.keys(data).forEach(function (key) {
			if ( key in checker ) {
				dataType =  checker[key];
				return;
			}
		});
		return dataType;
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





