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
			format 			: 'DD MMMM YYYY',
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
			isRadiobox 		: true,
			isAvailable 	: true,
			key 			: 'radio',
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
			isCheckbox 		: true,
			isAvailable 	: true,
			key 			: 'checkbox',
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





