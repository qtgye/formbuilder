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

	module.hasError = false;
	module.errorEditor = null;



	// define private variables
	// ====================================================================================
	
	var User,
		editors = {},
		editorTemplate,
		editorClicked,
		currentOpen, // holds the data-id of the open editor

		$editorGuide;


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
		self.$optionsEl = self.$el.find('textarea[name="options"]');
		self.$form 		= self.$el.find('form');
		self.$close 	= self.$el.find('.editor-close');
		self.$container = self.$el.find('.editor-container');
		self.$value 	= self.$el.find('[data-key="value"]');
		// allowMultiple based elems
		self.$allowMultiple = self.$el.find('[data-key="multiple"]');
		self.$min 			= self.$el.find('[data-key="min"]');
		self.$max 			= self.$el.find('[data-key="max"]');

		// ensure isSwitch is always on top
		var $isSwitch = self.$el.find('[data-key="isSwitch"]');
		if ( $isSwitch.length > 0 ) {
			$isSwitch.prependTo(self.$form);
		}
		// ensure min/max are after the default value
		if ( self.$max.length > 0 )  {
			self.$max.insertAfter(self.$value);
			self.$min.insertAfter(self.$value);
		}

		self.$el.css({
			width: $editorGuide.width(),
			top: $editorGuide.offset().top,
			left: $editorGuide.offset().left
		});

		self.$container.css({
			'max-height' : app.$window.height()-120
		});

		// opens the editor
		function open () {
			module.closeEditor();
			console.log(module.hasError);
			if ( !module.hasError ) {				
				self.$parent.addClass('has-open-editor');
				currentOpen = self.id;
			}			
		}
		// closes the editor
		function close () {
			// validate options before closing;
			if ( object.data.isRadiobox || object.data.isSwitch || object.data.isSelect ) {
				var formDataString = self.$form.serialize(),
					optionsVal = self.$optionsEl.val().split(/[\r\n]/),
					isValid = true;
				if ( optionsVal.length >= 2 ) {
					optionsVal.forEach(function (option) {
						var opt = option.trim();
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
					isValid  = false;
				}

				if ( !isValid ) {
					swal({
						title 				: 'Oops!',
						text 				: "Options must have at least 2 pairs of valid label/vale",
						type 				: "error",
						showConfirmButton 	: true,
						confirmButtonText 	: "Ok"
					});
					module.hasError 	= true;
					module.errorEditor = self.id;

				} else {
					self.$parent.removeClass('has-open-editor');
					currentOpen = null;
					console.log(module.errorEditor);
					if ( module.hasError &&  module.errorEditor == self.id ) {
						console.log('this was error');
						module.hasError 	= false;
						module.errorEditor = null; 
					}
				}
			} else {
				self.$parent.removeClass('has-open-editor');
				currentOpen = null;
			}
			
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
					if ( pair.value.length > 1 ) {
						var arr = pair.value.split('\r\n');
						if ( arr.length > 1 ) {
							arr = arr.map(function (option) {
								var label,value,
									option = option.trim();
								// checked for quoted input
								if ( option.match(/^[\“\"][^“"]+[\”\"]/) ) {
									label = option.match(/^[\“\"][^“"]+[\”\"]/)[0];
									console.log('label match');
									console.log(label);
									value = option.slice(label.length+1).trim();
									label = label.trim();
									console.log('label should be ' + label);
								}
								else {
									label = option.substring(0,option.indexOf(','));
									value = option.replace(label+',','').trim();
									label = label.trim();
								}						
								return { label: label, value: value};
							});
						} else {
							arr = [];
						}						
						pair.value = arr;
					} else {
						pair.value = [];
					}
				}				
				// Convert to boolean
				if ( pair.value == "true" ) {
					pair.value = true;
				} else if ( pair.value == "false" ) {
					pair.value = false;
				}
				// Convert to int
				if ( pair.name == "min" || pair.name == "max" ) {
					pair.value = parseInt(pair.value);
				}
				newData[pair.name] = pair.value;
			});			

			// show/hide min/max acc. to allowMultiple
			if ( ('multiple' in newData) ) {
				if ( newData.multiple === true ) {
					self.$min.add(self.$max).removeClass('hidden');
				}
				else {
					self.$min.add(self.$max).addClass('hidden');
				}
			}


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

		// init extractData to trigger min/max visibility
		extractData();

		return self;
	}



	// define private functions
	// ====================================================================================
	
	// Fills the predefined variables
	function defineVariables () {
		editorTemplate 	= $('#templates').find('#tmpl-editor').html();
		User 			= app.user;

		$editorGuide 	= $('.js-editor-guide');
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
			var accountIds = User.getAll('account_id');
			fieldData.account_id = accountIds.map(function (id) {
				return {
					value 		: id,
					selected 	: id == fieldData.account_id
				};
			});
		}

		console.log(fieldData);

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

	// checks if there is an open editor
	function hasOpenEditor () {
		return currentOpen ? true : false;
	}

	// resets the currentOpen editor
	function reset () {
		currentOpen = null;
	}

	// checks if there is an error
	function editorHasError () {
		return module.hasError;
	}

	// bind event handlers
	function bindHandlers () {
		
		app.$html.on('click',function () {
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
	module.hasOpenEditor 	= hasOpenEditor;
	module.reset 			= reset;


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




