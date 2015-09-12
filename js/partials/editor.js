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
	
	var User,
		editors = {},
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
			data 	: prepareData(cloneObject(object.data))
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
		editorTemplate 	= $('#templates').find('#tmpl-editor').html();
		User 			= app.user;
	}

	// prepares the data to be rendered in the editor template
	function prepareData (fieldData) {

		// converts array to string in specified format
		if (fieldData.options) {
			fieldData.options = (function (options) {
				return options.map(function (pair) {
					return pair.label + ',' + pair.value;
				}).join('\r\n');
			})(fieldData.options);
		}
		// adds other options for user_id
		if ( fieldData.user_id ) {
			var userIds = User.getAll('user_id');
			fieldData.user_id = userIds.map(function (id) {
				return {
					value 		: id,
					selected 	: id == fieldData.user_id
				};
			});
		}
		// adds other options for account
		if ( fieldData.account_id ) {
			var userIds = User.getAll('account_id');
			fieldData.account_id = userIds.map(function (id) {
				return {
					value 		: id,
					selected 	: id == fieldData.account_id
				};
			});
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
			currentOpen = null;
		}
	}

	// bind event handlers
	function bindHandlers () {
		
		app.$body.on('click',function () {
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




