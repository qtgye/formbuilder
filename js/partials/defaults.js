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
			key 			: 'name',
			required 		: false,
			label 			: 'Text Input:',
			placeholder 	: 'placeholder',
			value 			: '',
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
			label 			: 'Date:',
			format 			: 'DD MMMM YYYY',
			description 	: 'desc',
			showif 			: 's if',
			hideif 			: 'hide me if this happens'
		},
		'entity'		: {
			isEntity 		: true,
			isAvailable 	: true,
			key 			: 'directors',
			required 		: false,
			min 			: 0,
			max 			: 0,
			label 			: 'Directors',
			description 	: '',
			showif 			: '',
			hideif 			: ''
		},
		'multiline'		: {
			isMultiline 	: true,
			isAvailable 	: true,
			key 			: 'name',
			required 		: false,
			label 			: 'Multiline Input:',
			placeholder 	: 'placeholder',
			value 			: '',
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
			label 			: 'Select:',
			value 			: 'option2',
			multiple 		: false,
			description 	: '',
			showif 			: '',
			hideif 			: '',
			options 		: [
								{label: 'Option1', value: 'option1'},
								{label: 'Option2', value: 'option2'},
								{label: 'Option3', value: 'option3'}
							  ]
		},
		'radiobox' 		: {
			isRadiobox 		: true,
			isAvailable 	: true,
			key 			: 'name',
			label 			: 'Name',
			isSwitch 		: false,
			value 			: 'option2',
			description 	: '',
			showif 			: '',
			hideif 			: '',
			options 		: [
								{label: 'Option1', value: 'option1'},
								{label: 'Option2', value: 'option2'},
								{label: 'Option3', value: 'option3'}
							  ]
		},
		'checkbox' 				: {
			isCheckbox 		: true,
			isAvailable 	: true,
			key 			: 'name',
			min 			: 0,
			max 			: 0,
			label 			: 'Name',
			value 			: 'option3',
			description 	: '',
			showif 			: '',
			hideif 			: '',
			options 		: [
								{label: 'Option1', value: 'option1'},
								{label: 'Option2', value: 'option2'},
								{label: 'Option3', value: 'option3'}
							  ]
		}
	},

	section = {
		name 		: "New Section",
		description : 'Lorem Ipsum',
		showif 		: "",
		hideif 		: "",
		isBatch 	: true,
		fields 		: []
	},

	form 	= {
		name 	: 'Form'
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





