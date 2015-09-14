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
