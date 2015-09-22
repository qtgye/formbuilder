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
			key 			: 'singleline',
			required 		: false,
			label 			: 'Label',
			placeholder 	: 'placeholder',
			value 			: '',
			min 			: 0,
			max 			: 0,
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
			label 			: 'Label',
			format 			: 'YYYY-MM-DD',
			placeholder		: '',
			value 			: '',
			allowFuture 	: true,
			description 	: '',
			showif 			: '',
			hideif 			: ''
		},
		'entity'		: {
			isEntity 		: true,
			isAvailable 	: true,
			key 			: 'entity',
			required 		: false,
			min 			: 0,
			max 			: 0,
			label 			: 'Label',
			description 	: '',
			showif 			: '',
			hideif 			: ''
		},
		'multiline'		: {
			isMultiline 	: true,
			isAvailable 	: true,
			key 			: 'multiline',
			required 		: false,
			label 			: 'Multiline Input:',
			placeholder 	: 'placeholder',
			value 			: '',
			min 			: 0,
			max 			: 0,
			description 	: '',
			showif 			: '',
			hideif 			: '',
			restriction 	: ''
		},
		'selection' 	: {
			id 				: guid(),
			isSelect		: true,
			isAvailable 	: true,
			key 			: 'name',
			required 		: false,
			label 			: 'Label',
			value 			: '',
			min 			: 0,
			max 			: 0,
			description 	: '',
			multiple 		: false,
			showif 			: '',
			hideif 			: '',
			options 		: [
								{label: 'Option1', value: 'option1'},
								{label: 'Option2', value: 'option2'}
							  ]
		},
		'radiobox' 		: {
			id 				: guid(),
			isRadiobox 		: true,
			isAvailable 	: true,
			key 			: 'radio',
			required 		: false,
			label 			: 'Label',
			value 			: '',
			description 	: '',
			showif 			: '',
			hideif 			: '',
			options 		: [
								{label: 'Option1', value: 'option1'},
								{label: 'Option2', value: 'option2'}
							  ]
		},
		'checkbox' 				: {
			id 				: guid(),
			isCheckbox 		: true,
			isAvailable 	: true,
			key 			: 'checkbox',
			required 		: false,
			min 			: 0,
			max 			: 0,
			label 			: 'Label',
			value 			: '',
			description 	: '',
			showif 			: '',
			hideif 			: '',
			options 		: [
								{label: 'Option1', value: 'option1'},
								{label: 'Option2', value: 'option2'}
							  ]
		}
	},

	section = {
			name 		: "New Section",
			description : '',
			showif 		: "",
			hideif 		: "",
			isBatch 	: false,
			fields 		: []
	},

	form 	= {
			account_id 		: "5b960be8-f871-475c-ad76-6b8ab1bc4200",
			user_id 		: "1e5cb1f2-0e3f-441d-8958-c6fc392071b0",
			title 			: 'New Form',
			status 			: 0,
			description 	: '',
			tags 			: '',
			config		: []
	};




	// define private functions
	// ====================================================================================
	



	// define public application interface
	// ====================================================================================
	module.fields 	= fields;
	module.section 	= section;
	module.form 	= form;




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
	var 

	// POST params
	POST = {
		url 	: 'http://api-dev.maxine.io:8000/api/v1/templates'
	},

	// GET params
	GET = {
		url 	: 'http://api-dev.maxine.io:8000/api/v1/templates',
		params 	: [
			{ sort 	: 'created_at' 	},
			{ order	: 'DESC'		},
			{ limit	: 50 			}
		],
		getURL : function () {
			if ( this.params.length === 0 ) {
				return this.url;
			} else {
				console.log(this.params);
				return this.url + '?' +
					this.params.map(function (pair) {
					for ( var key in pair ) {
							return key + '=' + pair[key];
						}
					}).join('&');
			}
		}
	},

	nativeRequest = function (data,successCallback,errorCallback) {
		var request;
		if (window.XMLHttpRequest) { // Mozilla, Safari, ...
		  request = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE
		  try {
		    request = new ActiveXObject('Msxml2.XMLHTTP');
		  } 
		  catch (e) {
		    try {
		      request = new ActiveXObject('Microsoft.XMLHTTP');
		    } 
		    catch (err) {}
		  }
		}
		return request;
	};

	// define private functions
	// ====================================================================================
	
	// sends a request
	function send (data,successCallback,errorCallback) {
		var url = POST.url + ( data.id ? '/' + data.id : '');
		// process data before sending
		var jsonString = JSON.stringify(data);

		return $.ajax({
			url 		: url,
			contentType : 'application/json',
			method 		: 'POST',
			dataType 	: 'json',
			data 		: jsonString,
			success 	: successCallback,
			error 		: errorCallback
		});
	}

	// sends a request using native ajax
	function nativeSend (data,successCallback,errorCallback) {
		if ( nativeRequest ) {
			var url = POST.url + ( data.id ? '/' + data.id : '');
			// process data before sending
			var jsonString = JSON.stringify(data);
			jsonString = jsonString.replace(/\"(min|max)\":\"\d+\"/g,function (match) {
				var key = match.slice(0,5),
					stringedInt = match.slice(match.match(':').index+1);
				return key + ':' + stringedInt.replace('"','','g');
			});

			request.addEventListener('error',function (res) {
				console.log(res);
			});

			request.addEventListener('load',function (res) {
				console.log(res);
			});

			request.setRequestHeader("Content-type","application/json");
			request.open('POST', url, true);
			request.send(jsonString);
		}
		
	}

	// gets a list of latest forms
	function get (successCallback,errorCallback) {
		return $.ajax({
			url 		: GET.getURL(),
			method 		: 'GET',
			dataType 	: 'json',
			success		: successCallback,
			error 		: errorCallback
		});
	}

	// gets a form by id
	function getForm (id,successCallback,errorCallback) {
		swal({
			type 				: 'info',
			title 				: 'Loading template...',
			showConfirmButton 	: false
		});
		return $.ajax({
			url 		: GET.url + '/' + id,
			method 		: 'GET',
			dataType 	: 'json',
			success		: successCallback,
			error 		: errorCallback
		});
	}


	// define public application interface
	// ====================================================================================

	module.send 		= send;
	module.naiveSend 	= nativeSend;
	module.get 			= get;
	module.getForm 		= getForm;

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
** User Module
**
*/

App.createModule('user',(function (app,$) {

	// define module
	// ====================================================================================
	var module = {};

	// define private variables
	// ====================================================================================
	var

	Defaults,
	credentials = {
		user_id 		: [
			"1e5cb1f2-0e3f-441d-8958-c6fc392071b0",
		],
		account_id	 	: [
			"5b960be8-f871-475c-ad76-6b8ab1bc4200",
		]
	},

	$userForm;

	// define private functions
	// ====================================================================================
	function definePrivateVariables () {
		Defaults = app.defaults;
	}

	// returns a list of available credentials acc. to scope
	function getAll (scope) {
		if ( scope in credentials ) {
			return credentials[scope];
		}
		return null;
	}

	// updates user ids
	function updateUsers (usersArray) {
		credentials.user_id = usersArray;
	}

	// updates account ids
	function updateAccounts (accountsArray) {
		credentials.account_id = accountsArray;
	}


	// define public application interface
	// ====================================================================================
	module.getAll 			= getAll;
	module.updateUsers 		= updateUsers;
	module.updateAccounts 	= updateAccounts;


	// define module init
	// ====================================================================================
	module.init = function () {
		console.log('user module added');
		definePrivateVariables();
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
** Modal module
**
*/

App.createModule('modal',(function (app,$) {

	// define module
	// ====================================================================================
	var module = {};

	// define private variables
	// ====================================================================================
	var 

	modal = {};

	// define private functions
	// ====================================================================================
	function definePrivateVariables () {
		
	}

	// handles the modal
	function modalHandler () {
		
		modal.$el 		=	$('#modal');
		modal.$content 	=	modal.$el.find('.modal-content');
		modal.show 		=	show;
		modal.hide 		=	hide;
		modal.partials 	=	{
			$saving 			: $('.modal-saving'),
			$saveSuccess 		: $('.modal-save-success'),
			$saveError 			: $('.modal-save-error')
		};


		modal.changeContent 	= function (contentType,modalData) {
			modal.$content.empty();
			if ( '$'+contentType in modal.partials ) {
				var $content = modal.partials['$'+contentType].clone();
				if ( contentType == 'saveError' ) {
					$content.find('.modal-error-content').text(modalData);
				}
				modal.$content.append($content);
				modal.$content.find('.modal-close').on('click',function () {
					modal.hide();
				});
			}			
		};



	}

	// shows the modal
	function show (contentType,modalData) {
		if ( contentType ) {
			modal.changeContent(contentType,modalData);
			modal.$el.modal({
				show 		: true,
				backdrop 	: false
			});
		}
		
	}

	// hides the modal
	function hide () {
		modal.$el.modal('hide');
	}


	// define public application interface
	// ====================================================================================
	module.show = show;
	module.hide = hide;

	// define module init
	// ====================================================================================
	module.init = function () {
		definePrivateVariables();
		modalHandler();
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
		dragHelperWidth,
		$fieldGuide;


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
				handle 		: '.js-field-handle',
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
				var fieldData = cloneObject(_field.data);
				if ( fieldData.id ) {
					delete fieldData.id;
				}
				// process min/max
				if ( 'multiple' in fieldData && fieldData.multiple === false ) {
					delete fieldData.min;
					delete fieldData.max;
				}
				fieldsData[index] = fieldData;
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
			if (self.data.fields && self.data.fields.length > 0 ) {
				self.data.fields.forEach(function (fieldData) {
					self.addField(fieldData);
				});
			}
		};

		// Adds a new field
		self.addField = function (fieldData) {
			self.$sectionContent.append(Fields.create(fieldData).$el);
		};

		if ( self.data.fields && self.data.fields.length ) {
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
		self.$edit 		= self.$sectionHeader.find('.field-edit');
		self.$remove 	= self.$sectionHeader.find('.field-remove');
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
	
	// prepares the predefined variables
	function definePrivateVariables () {
		$fieldGuide = $('.field-guide');
	}

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
			.width( $fieldGuide.width() )
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
		}

		Fields.getField((ui.helper||ui.item)[0].id).sectionId = self.id;
		// update receiving section's fields data
		sections[$(e.target).parent()[0].id].updateFieldsData();	
		// update fieldHelperWidth
		fieldHelperWidth = Fields.getField((ui.helper||ui.item)[0].id).$el.width();
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
		
		definePrivateVariables();
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
	Editor,
	User,


	sortableInitialized = false,
	formDataError = [],

	data,
	template,
	form,
	formLoader,

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
		User 		= app.user 		;

		data 		= cloneObject(data);
		template 	= $('#tmpl-read-form')[0].innerHTML;

		$stage 			= $('.js-stage');
		$formActions 	= $('.js-form-actions');
		$saveBtn 		= $('.js-form-save');
		$clearBtn		= $('.js-form-clear');
		$createBtn 		= $('.js-form-create');

	}

	// creates the form object using default data
	function create (data) {
		
		form  = {
			title  	: data.title,
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

		// render sections
		if ( data.config && data.config.length > 0 ) {
			data.config.forEach(function (sectionData) {
				addSection(sectionData);
			});
		}

		return form;

	}


	// Initializes the form loader at the header
	function initializeFormLoader () {		
		var $formLoader 			= $('.js-form-loader'),
			$formLoaderBtn 			= $formLoader.find('.js-load-btn'),
			$formLoaderDropdown 	= $formLoader.find('.js-form-loader-dropdown'),
			$formList 				= $formLoader.find('.js-form-list'),
			$formListClose 			= $formLoader.find('.js-form-list-close'),
			formListTemplateString	= $('#tmplFormsList')[0].innerHTML,
			latestForms 			= [],
			isFetching 				= false;

		formLoader 	= {};
		formLoader.fetchedFormId = null;

		// Gets form ids from cookie
		function getLatestForms () {
			$formLoader.addClass('is-fetching');
			Request.get(onGetForms,onGetFormsError);
		}

		// handles form list GET
		function onGetForms (data) {
			latestForms = [];
			$formLoader.removeClass('is-fetching');
			if ( data.flag ) {
				latestForms = data.data;
				renderFetchedForms();
			}
			else {
				// error
			}
			formLoader.isFetching = false;
		}

		// handles error in fetching forms
		function onGetFormsError (response) {
			console.log(response);
		}

		// resets the form loader
		function reset () {
			formLoader.isFetching = false;
			$formList.empty();
			$formLoader.removeClass('is-open');
		}
		formLoader.reset = reset;

		// renders the fetched forms in list
		function renderFetchedForms () {
			var $list = $(tmpl(formListTemplateString,{formsList:latestForms}));
			$formList
				.empty()
				.append($list);
			$formLoader.addClass('is-open');
			// bind each item
			$list.children().each(function () {
				var $el 	= $(this),
					formId 	= $el.data('formId');
				$el.click(function (e) {
					e.preventDefault();
					if ( !formLoader.isFetching ) {
						formLoader.fetchedFormId = formId;
						$el.addClass('is-loading');										
						Request.getForm(formId,onFetchFormSuccess,onFetchFormError);								
					}					
				});
			});
		}		

		$formLoaderBtn.on('click',function () {
			if ( !formLoader.isFetching ) {
				formLoader.isFetching = true;
				$formLoader.removeClass('is-open');
				getLatestForms();
			}
		});
		$formListClose.on('click',function () {
			reset();
		});

		// public methods
		formLoader.reset = reset;

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
			validateForm();
			if ( formDataError.length === 0 && !Editor.hasError ) {
				var formData 	= cloneObject(getFormData());
				console.log('data to send:');
				console.log(formData);
				// send the data
				swal({
					type 	: 'info',
					title   : 'Saving form...',
					allowEscapeKey : false,
					showConfirmButton : false
				});
				Editor.closeEditor();
				Request.send(formData,onSendSuccess,onSendError);
			} else {
				swal({
					type 				: 'error',
					title   			: 'The form cannot be saved due to error.',
					text 				: formDataError.join('\r\n'),
					allowEscapeKey 		: true,
					confirmButtonText	: 'Ok'
				});
			}
		});
		// clears the form contents and data
		$clearBtn.on('click',clearFormContent);
		// creates a new form
		$createBtn.on('click',function () {
			var defaultForm = cloneObject(Defaults.form);
			replaceForm(defaultForm);
			app.$body.removeClass('is-update');
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
		form.data.config = [];
		form.$formContent.empty();
		sortableInitialized = false;
		Editor.reset();
	}

	// updates the form data
	function updateForm (newData) {
		form.data.user_id 		= newData.user_id;
		form.data.account_id	= newData.account_id;
		form.data.title 		= newData.title;
		form.data.description 	= newData.description;
		form.data.tags 			= newData.tags;
		form.data.status 		= newData.status;
		form.$formTitle.text(newData.title);
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
		if ( newData && newData.title ) {
			removeForm();
			create(newData);
			Editor.closeEditor();
		}		
	}

	// resets the form into a default one
	function resetForm () {
		var formData = cloneObject(Defaults.form);
		if ( form.data.id ) {
			formData.id = form.data.id;
		}
		replaceForm(formData);
	}

	// gets the form data for saving
	function getFormData () {
		form.data.config = extractContentData();
		return form.data;
	}	

	// validates form data prior to sending
	function validateForm () {
		var isValid = true;
		formDataError = [];
		getFormData().config.forEach(function (section) {
			if ( section.fields ) {
				section.fields.forEach(function (_field) {
					// validate options for selected field types
					if ( _field.isSelect || _field.isSwitch || _field.isRadiobox ) {
						console.log('validating,..');
						if ( _field.options instanceof Array ) {
							if ( _field.options.length > 1 ) {								
								_field.options.forEach(function (option) {
									var opt = option.label + ',' + option.value;
									console.log(opt);
									if (
										!opt.match(/^[\“\"][^“”]+[\”\"],[\“\"][^“”]+[\”\"]$/)
										&& !opt.match(/^[^,]+,[^,]+$/)
										&& !opt.match(/^[\“\"][^“”]+[\”\"],[^,]+$/)
										&& !opt.match(/^[^\,]+,[\“\"][^“”]+[\”\"]$/)
									) {
										isValid = false;	
										formDataError.push('Options must have at least two pairs of valid label and value.');							
									}
								});
							} else {								
								isValid = false;
								formDataError.push('Options must have at least two pairs of valid label and value.');
							}
						} else {
							isValid = false;
							formDataError.push('Options must have at least two pairs of valid label and value.');
						}
					}
				});
			}
		});
		return isValid;
	}

	// handles successful form fetch
	function onFetchFormSuccess (data) {	
		var newFormData = {};
		if ( data.flag ) {				
			formLoader.reset();
			newFormData.id 				= formLoader.fetchedFormId;
			newFormData.user_id 		= data.data.user_id;		
			newFormData.account_id 		= data.data.account_id;		
			newFormData.status 			= data.data.status;		
			newFormData.title 			= data.data.title;
			newFormData.description 	= data.data.description;
			newFormData.tags 			= data.data.tags;
			newFormData.config			= data.data.config;
			// look for select with multiple == false to add min/max
			newFormData.config.forEach(function (sectionData,sIndex) {
				if ( sectionData.fields ) {
					sectionData.fields.forEach(function (fieldData,fIndex) {
						if ( ('multiple' in fieldData) && fieldData.multiple === false ) {
							fieldData.min = 0;
							fieldData.max = 0;
						}
					});
				}				
			});
			console.log('new form data:');
			console.log(newFormData);
			try  {
				replaceForm(newFormData);
				app.$body.addClass('is-update');
				swal({
					type 				: 'success',
					title 				: 'Template successfuly loaded!',
					showConfirmButton 	: false,
					timer 				: 2000
				});
			} catch (e) {
				swal({
					type 				: 'error',
					title 				: 'The template cannot be loaded due to an error.',
					showConfirmButton 	: true,
					confirmButtonText 	: 'Ok'
				});
				console.log(e);
			}		
			
		} else {
			swal({
				type 	: 'error',
				title   : 'The form was not saved due to an error.',
				text 	: data.message,
				confirmButtonText : 'Ok'
			});
		}			
	}

	// handles sent data success
	function onSendSuccess (data) {
		if ( data.flag ) {
			console.log(data);
			if ( data.data ) {
				form.data.id = data.data.id;
			}			
			app.$body.addClass('is-update');
			swal({
				type 	: 'success',
				title   : data.message,
				timer 	: 2000
			});
		} else {
			swal({
				type 	: 'error',
				title   : 'The form was not saved due to an error.',
				text 	: data.message.config[0],
				confirmButtonText : 'Ok'
			});
		}
		
	}	

	// handles sent data error
	function onSendError (response) {
		var text = [];
		if ( typeof response.message == 'object' ) {
			text = [];
			Object.keys(response.message).forEach(function (key) {
				text.push(response.message[key]);
			});
			text = text.join('\r\n');
			swal({
				type 	: 'error',
				title   : 'The form was not saved due to error.',
				text 	: text,
				confirmButtonText : 'Ok'
			});
		} else if ( typeof response.message == 'string' ) {
			swal({
				type 	: 'error',
				title   : 'The form was not saved due to error.',
				text 	: response.message,
				confirmButtonText : 'Ok'
			});
		} else if ( response.responseJSON && typeof response.responseJSON.message == 'string') {
			swal({
				type 	: 'error',
				title   : 'The form was not saved due to error.',
				text 	: response.responseJSON.message,
				confirmButtonText : 'Ok'
			});
		} else if ( response.responseJSON && typeof response.responseJSON.message == 'object') {
			text = [];
			Object.keys(response.responseJSON.message).forEach(function (key) {
				text.push(response.responseJSON.message[key]);
			});
			text = text.join('\r\n');
			swal({
				type 	: 'error',
				title   : 'The form was not saved due to error.',
				text 	: text,
				confirmButtonText : 'Ok'
			});
		} else {
			swal({
				type 	: 'error',
				title   : 'The form was not saved due to an unknown error.',
				confirmButtonText : 'Ok'
			});
		}
	}

	// handles form fetch error
	function onFetchFormError (response) {
		if ( response.responseJSON && !response.responseJSON.flag ) {
			swal({
				type 				: 'error',
				title 				: 'The template cannot be loaded due to an error.',
				text 				: response.responseJSON.message,
				showConfirmButton 	: true,
				confirmButtonText 	: 'Ok'
			});
		}
	}

	// loads defaults
	function loadDefaults () {
		// create initial form
		module.create(cloneObject(Defaults.form));

		// loaded template if id is present
		var pathname = window.location.pathname;
		if ( pathname.length > 1 ) {
			formLoader.fetchedFormId = pathname.slice(1);			
			Request.getForm(formLoader.fetchedFormId,onFetchFormSuccess,onFetchFormError);
			swal({
				type 				: 'info',
				title 				: 'Loading template...',
				showConfirmButton 	: false
			});	
		}

		swal.close();
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
		initializeFormLoader();

		swal({
			type 				: 'info',
			title 				: 'Preparing Form Builder...',
			showConfirmButton 	: false,
			allowEscapeKey 		: false
		});



		// uncomment this
		// $.ajax({
		// 	url 		: '',
		// 	method 		: 'GET',
		// 	dataType 	: 'json',
		// 	error 		: function (response) {
		// 		// error handler
		// 	},
		// 	success		: function (data) {
		// 		// update user ids by using
		// 		// User.updateUsers(arrayOfIds)

		// 		// update account ids by using
		// 		// User.updateAccounts(arrayOfIds)

		// 		// loadDefaults();		
		// 	}			
		// });

		// move this function call inside success callback
		loadDefaults();		
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


