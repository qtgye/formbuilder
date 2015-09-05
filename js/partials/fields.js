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
	function Field (arg) {

		var self 		= this;

		// construct
		(function () {

			if (  arg.context ) {
				// if the arg is a jquery object (new field)
				self.data 	= Defaults.fields[arg.data('type')];
				self.$el 	= arg;
			} else {
				// if the arg is a data object
				self.data 	= arg;
				self.$el 	= $(renderData(arg));
			}

			self.data 			= cloneObject(self.data); // make sure data is not a reference
			self.id 			= guid();
			self.type 			= arg.data('type');
			self.$fieldHeader 	= self.$el.find('.field-header');
			self.$fieldContent 	= self.$el.find('.field-content');
			self.sectionId 		= null; // will hold containing section's id

			self.$el.attr('id',self.id);
			// add action buttons
			self.$fieldHeader.prepend($(tmpl(templates.actions,self)));
			self.$edit 		= self.$el.find('.field-edit');
			self.$remove 	= self.$el.find('.field-remove');

			// methods
			self.update = function (newData) {
				
				for ( var key in self.data ) {
					self.data[key] = newData[key];
				}

				updateFieldDOM(self,self.data);
			};
			// removes the dom element and the object entirely
			self.remove = function () {
				self.$el.slideUp(300,function () {
					self.$el.remove();
					delete fields[self.id];
				});
			};

			// setup editor
			self.editor 	= Editor.create(self);
			self.$el.append(self.editor.$el);
			self.$edit.on('click',function () {
				self.editor.toggle();
			});
			self.editor.$save.on('click',function () {
				var newData = self.editor.extractData();
				self.update(newData);
			});
			self.$remove.on('click',self.remove);

			// add to store
			fields[self.id] = self;

		})();
		
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