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


