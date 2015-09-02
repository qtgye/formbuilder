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
	var defaults = {
			name 	: 'Sample Section'
		},
		template = '',
		sections = [];

	// Section object class
	function Section (data) {
		
		var self 					= this,
			id 						= Date.now(),
			isSortableInitialized 	= false;

		self.id 	= id;
		self.data 	= data;
		self.$el 	= $(renderReadContent(data));
		self.$sectionContent = self.$el.find('.js-section-content');

		// initialize sortable
		self.initializeSortable = function () {
			self.$sectionContent.sortable({
				handle 		: '.js-drag-handle',
				connectWith : '.js-section-content',
				create 		: function () {
					isSortableInitialized = true;
				}
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
		var section = null;
		
		while ( i < sections.length || sectionId != sections[i].id ) {
			i++;
		}

		section = i != sections.length ? sections[i] : null;

	}

	// refreshes each section
	function refreshAll () {
		sections.forEach(function (_section) {
			_section.refreshSortable();
		});
	}


	// define public application interface
	// ====================================================================================

	module.create = function (data) {
		var newSection = new Section(data);

		sections.push(newSection);
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