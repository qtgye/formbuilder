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

	sortableInitialized = false,

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
			Request.get(onGetForms);
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
			if ( isFormDataValid() ) {
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
	function isFormDataValid () {
		var isValid = true;
		getFormData().config.forEach(function (section) {
			if ( section.fields ) {
				section.fields.forEach(function (field) {
					// validate options
					if ( field.options ) {
						isValid = 	field.options.length > 1 &&
									field.options.every(function (option) {
										return option.label && option.value;
									});
						console.log('isValid : ' + isValid);
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
	};

	// retrn module object
	// ====================================================================================
	return module;

})(window.App,jQuery));


/*
** MODULE END
** =============================================================================================
*/



