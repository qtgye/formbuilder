/*
** Sections module
**
** Handles form sections
** 
** Dependency:
** - main app
**
*/

App.createModule('sections',(function (app,$) {

	// define module
	// ====================================================================================
	var module = {};

	// define private variables
	// ====================================================================================
	var Fields 		= app.fields,
		template 	= '',
		sections 	= {};

	// Section object class
	function Section (data) {
		
		var self 					= this,
			id 						= guid(),
			isSortableInitialized 	= false;

		// Define props
		self.id 				= id;
		self.data 				= data;
		self.$el 				= $(renderReadContent(data));
		self.$sectionContent 	= self.$el.find('.js-section-content');

		// Attach element id
		self.$el.attr('id',self.id);

		// initialize sortable
		self.initializeSortable = function () {
			self.$sectionContent.sortable({
				handle 		: '.js-drag-handle',
				connectWith : '.js-section-content',
				create 		: function () {
					isSortableInitialized = true;
				},
				start 		: onSortStart,
				stop 		: onSortStop,
				receive 	: onSortReceive
			});

		};

		// refreshes sortable to find added elements
		self.refreshSortable = function () {
			if ( isSortableInitialized ) {
				self.$sectionContent.sortable('refresh');
			}
		};


	}

	// define private functions
	// ====================================================================================
	
	// One time called template preparation
	function prepareTemplate () {
		template = $('#tmpl-read-section').html();
	}

	// get a rendered html of the data
	function renderReadContent(data) {
		var output = Mustache.render(template,data);
		return output;
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
		ui.helper.width(ui.item.width()).addClass('field-dragging');
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
			Fields.create(ui.helper);

		} else {
			// The element is existing field
			console.log('moved');
		}
	}


	// define public application interface
	// ====================================================================================

	module.create = function (data) {
		var newSection = new Section(data);

		sections[newSection.id] = newSection;
		return newSection;
	};

	module.refreshAll = refreshAll;
	module.getSection = getSection;


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