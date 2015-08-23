// Main Application
var App = window.App || (function (W,D,$) {

	var self = this;

	// module names store
	var self.modules = [];

	// module creator
	var self.createModule = function (moduleName,moduleObject) {
		
		if ( typeof moduleName !=== 'string' || typeof moduleObject !== 'object' ) return;

		self.modules.push(moduleName);
		self[moduleName,moduleObject];

	};

	return self;

})(window,document,$);