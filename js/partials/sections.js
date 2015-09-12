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
		fieldHelperWidth;


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
				helper 		: 'clone',
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

			console.log(fieldsData);

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
		};

		// Adds a new field
		self.addField = function (fieldData) {
			self.$sectionContent.append(Fields.create(fieldData).$el);
		};

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
		// update fieldHelperWidth
		fieldHelperWidth = newSection.$el.innerWidth();
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
			// .width( fieldHelperWidth ? fieldHelperWidth : ui.item.width() )
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




