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
			name 		: 'New Form',
			sections 	: []
	},

	postData1			= {
			account_id 		: "5b960be8-f871-475c-ad76-6b8ab1bc4200",
			user_id 		: "1e5cb1f2-0e3f-441d-8958-c6fc392071b0",
			title			: "Test Form",
			author 			: "Jace",
			tags 			: "loans, investments, finance, business",
			description		: "Just testing the api",
			sequence		: 1,
			config 			: {}
	},

	postData  	= {
		id 				: guid(),
		user_id 		: "1e5cb1f2-0e3f-441d-8958-c6fc392071b0",
		fullname 		: "Cy Domingo",
		account_id 		: "5b960be8-f871-475c-ad76-6b8ab1bc4200",
		organisation 	: "LawCanvas",
		status 			: 0,
		title 			: "Loan Facility Agreement",
		author 			: "Drew Walker",
		tags 			: "loans, investments, finance, business",
		sequence 		: 0,
		description 	: "A loan agreement is a contract between a borrower and a lender which regulates the mutual promises made by each party. There are many types of loan agreements, including facilities agreements, revolvers, term loans and working capital loans",
		num_files 		: 0,
		num_docs 		: 0,
		created_at 		: Date.now(),
		updated_at 		: Date.now(),
		config 			: [
			// {
			// 	account_id: "fddf3117-f89c-4719-8c03-49c52a318be3",
			// 	user_id: "15b6f0cd-54ac-40c2-ab8c-22b2a86bde41",
			// 	title: "Loan Facility Agreement",
			// 	author: "Drew Walker",
			// 	tags: "loans, investments, finance, business",
			// 	description: "A loan agreement is a contract between a borrower and a lender which regulates the mutual promises made by each party. There are many types of loan agreements, including facilities agreements, revolvers, term loans and working capital loans",
			// 	sequence: 1,
			// 	config: {
			// 		flag: true,
			// 		message: "Template successfully created",
			// 		data: {
			// 			id: "29bb36b0-c10d-4e91-bdba-43759074798e",
			// 			status: 0,
			// 			created_at: "2015-09-10 23:08:10",
			// 			updated_at: "2015-09-10 23:08:10"
			// 		}
			// 	}
			// }
		]
	};




	// define private functions
	// ====================================================================================
	



	// define public application interface
	// ====================================================================================
	module.fields 	= fields;
	module.section 	= section;
	module.form 	= form;
	module.postData = postData;




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





