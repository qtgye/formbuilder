<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Javascript Form Builder</title>

	<!-- LIB STYLESHEETS -->
	<link rel="stylesheet" href="lib/bootstrap/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="lib/font-awesome/css/font-awesome.min.css">

	<!-- CUSTOM STYLESHEETS -->
	<link rel="stylesheet" href="css/style.css">

</head>
<body>
	
	<div class="container main-container">
		<div class="row">
			
			<div class="col-md-12 viewport-header">
				
				<h4 class="pull-left">Form Builder JS App</h4>
				
				<div class="pull-right clearfix">
					<div class="btn-group pull-right">
						<div class="btn btn-primary js-form-save">SAVE</div>
						<div class="btn btn-default js-form-clear">CLEAR FORM</div>
					</div>

					<div class="btn-group pull-right">
						<div class="btn btn-default js-load-form" data-source="/samples/one.json">Load Form</div>
					</div>					
				</div>

			</div>
			
			<div class="col-md-2">

				<div class="fields-list js-field-list">
				</div>

			</div>

			<div class="col-md-6 clearfix">
				
				<!-- The Stage -->
				<div class="js-stage"></div>				

			</div>

		</div>
	</div>


	








	<div id="templates" class="hidden">
		
		<!-- read templates -->

		<!-- form -->
		<script class="form-template" id="tmpl-read-form" type="text/html">
			<form class="form js-form" action="" name="" method="post">
				<div class="form-header form-header">
					<div class="btn btn-primary js-add-section pull-right">Add Section</div>
					<div class="btn btn-primary js-edit-form pull-right">Edit Form</div>
					<h4 class="js-form-title"><%=name%></h4>
				</div>
				<div class="form-content js-form-content">
					
				</div>				
			</form>
		</script>

		<!-- section -->
		<script class="section-template" id="tmpl-read-section" type="text/html">
			<div class="section has-open-editor">
				<div class="section-header js-section-header js-section-handle">
					<h5 class="js-section-name"><%=name%></h5>
				</div>
				<div class="section-content js-section-content">
					
				</div>
			</div>
		</script>

		<!-- singleline -->
		<script class="field-template" data-type="singleline" id="tmpl-read-singleline" type="text/html">
			<div class="field has-open-editor js-drag-handle as-peg <%=( isAvailable ? '' : 'is-disabled' )%>" data-type="singleline" data-showif="<%=showif%>" data-hideif="<%=hideif%>" data-restriction="<%=restriction%>" data-is-available="<%=isAvailable%>">
				<div class="field-peg js-peg">
					<h5>Single Line</h5>
				</div>
				<div class="field-content js-drag-handle">
					<label><%=label%></label>
					<input type="text" id="<%=key%>" name="<%=key%>" placeholder="<%=placeholder%>" value="<%=value%>" <%=( required? 'required' : '' )%> >
					<span class="help-block field-description"><%=description%></span>
				</div>	
				<i class="disable-icon fa fa-eye-slash fa-lg"></i>		
			</div>
		</script>
		
		<!-- date -->
		<script class="field-template" data-type="date" id="tmpl-read-date" type="text/html">
			<div class="field has-open-editor js-drag-handle as-peg <%=( isAvailable ? '' : 'is-disabled' )%>" data-type="date" data-is-available="<%=isAvailable%>" data-format="<%=format%>" data-showif="<%=showif%>" data-hideif="<%=hideif%>">
				<div class="field-peg js-peg">
					<h5>Date</h5>
				</div>
				<div class="field-content js-drag-handle">
					<label><%=label%></label>
					<input type="date" id="<%=key%>" name="<%=key%>" <%=( required? 'required' : '' )%> >
					<span class="help-block field-description"><%=description%></span>
				</div>		
				<i class="disable-icon fa fa-eye-slash fa-lg"></i>				
			</div>
		</script>

		<!-- entity -->
		<script class="field-template" data-type="entity" id="tmpl-read-entity" type="text/html">
			<div class="field has-open-editor js-drag-handle as-peg <%=( isAvailable ? '' : 'is-disabled' )%>" data-type="entity">
				<div class="field-peg js-peg">
					<h5>Entity</h5>
				</div>
				<div class="field-content js-drag-handle">
					<label><%=label%></label>
					<span class="help-block field-description"><%=description%></span>
				</div>	
				<i class="disable-icon fa fa-eye-slash fa-lg"></i>					
			</div>
		</script>

		<!-- multiline -->
		<script class="field-template" data-type="multiline" id="tmpl-read-multiline" type="text/html">
			<div class="field has-open-editor js-drag-handle as-peg <%=( isAvailable ? '' : 'is-disabled' )%>" data-type="multiline">
				<div class="field-peg js-peg">
					<h5>Multiline</h5>
				</div>
				<div class="field-content js-drag-handle">
					<label><%=label%></label>
					<textarea id="<%=key%>" name="<%=key%>" placeholder="<%=placeholder%>" <%= (required?'required':'') %> ><%=value%></textarea>
					<span class="help-block field-description"><%=description%></span>
				</div>	
				<i class="disable-icon fa fa-eye-slash fa-lg"></i>					
			</div>
		</script>		

		<!-- selection -->
		<script class="field-template" data-type="selection" id="tmpl-read-selection" type="text/html">
			<div class="field has-open-editor js-drag-handle as-peg <%=( isAvailable ? '' : 'is-disabled' )%>" data-type="selection">
				<div class="field-peg js-peg">
					<h5>Selection</h5>
				</div>
				<div class="field-content js-drag-handle">
					<label><%=label%></label>
					<select id="<%=key%>" name="<%=key%>" value="<%=value%>" <%= ( multiple ? 'multiple' : '' ) %> >
						<% options.forEach(function(option){ %>
				    		<option value="<%=option.value%>" <%= ( value == option.value ? 'selected' : '' ) %> ><%=option.label%></option>
						<% }); %>
					</select>
					<span class="help-block field-description"><%=description%></span>
				</div>	
				<i class="disable-icon fa fa-eye-slash fa-lg"></i>					
			</div>
		</script>

		<!-- radio -->
		<script class="field-template" data-type="radiobox" id="tmpl-read-radio" type="text/html">
			<div class="field has-open-editor js-drag-handle as-peg <%=( isAvailable ? '' : 'is-disabled' )%>" data-type="radiobox">
				<div class="field-peg js-peg">
					<h5>Radio Box</h5>
				</div>
				<div class="field-content js-drag-handle">
					<label><%=label%></label>
					<span class="help-block field-description"><%=description%></span>
					<% options.forEach(function(option){ %>
						<label>
							<input type="radio" name="<%=option.key%>" value="<%=option.value%>" <%= ( value == option.value ? 'checked' : '' ) %>><%=option.label%>
						</label>
					<% }); %>
				</div>	
				<i class="disable-icon fa fa-eye-slash fa-lg"></i>					
			</div>
		</script>
		
		<!-- checkbox -->
		<script class="field-template" data-type="checkbox" id="tmpl-read-checkbox" type="text/html">
			<div class="field has-open-editor js-drag-handle as-peg <%=( isAvailable ? '' : 'is-disabled' )%>" data-type="checkbox">
				<div class="field-peg js-peg">
					<h5>Checkbox</h5>
				</div>
				<div class="field-content js-drag-handle">
					<label><%=label%></label>
					<span class="help-block field-description"><%=description%></span>
					<% options.forEach(function(option) { %>
						<label>
							<input type="checkbox" name="<%=option.key%>" value="<%=option.value%>" <%= ( value == option.value ? 'checked' : '' ) %> ><%=option.label%>
						</label>
					<% }); %>					
				</div>		
				<i class="disable-icon fa fa-eye-slash fa-lg"></i>				
			</div>
		</script>


		<!-- action buttons -->
		<script class="actions-template" id="tmpl-actions" type="text/html">
			<div class="actions">
				<div class="btn btn-primary field-edit">
					edit
				</div>
				<div class="btn btn-warning field-remove">
					&times;
				</div>
			</div>
		</script>


		<!-- editor template -->
		<script class="editor-template" id="tmpl-editor" type="text/html">
			<div class="editor" data-id="<%=id%>">
				
				<form action="" method="post" class="editor-form js-editor-form">
					
					<% for ( key in data ) { %>
						<% if ( key == 'isAvailable' ) {%>
							<div class="prop" data-key"isAvailable">
								<div class="prop-col">
									<label for="">Show on start :</label>
								</div>
								<div class="prop-col">
									<label for="<%=id%>_isAvailable_radio_true">
										<input <%= ( data[key] === true ? 'checked' : '' ) %> type="radio" name="isAvailable" value="true" id="<%=id%>_isAvailable_radio_true">
										True
									</label>
									<label for="<%=id%>_isAvailable_radio_false">
										<input <%= ( data[key] === false ? 'checked' : '' ) %> type="radio" name="isAvailable" value="false" id="<%=id%>_isAvailable_radio_false">
										False
									</label>
								</div>																
							</div>
						<% } %>
						<% if ( key == 'name' ) { %>
							<div class="prop" data-key="name">
								<div class="prop-col">
									<label>Name :</label>
								</div>
								<div class="prop-col">
									<input type="text" name="name" value="<%=data[key]%>">
								</div>								
							</div>
						<% } %>
						<% if ( key == 'key' ) { %>
							<div class="prop" data-key"key">
								<div class="prop-col">
									<label for="">Key :</label>
								</div>
								<div class="prop-col">
									<input type="text" name="key" value="<%=data[key]%>">
								</div>								
							</div>
						<% } %>
						<% if ( key == 'required' ) {%>
							<div class="prop" data-key"required">
								<div class="prop-col">
									<label for="">Required :</label>	
								</div>
								<div class="prop-col">
									<label for="<%=id%>_required_radio_true">
										<input <%= ( data[key] === true ? 'checked' : '' ) %> type="radio" name="required" value="true" id="<%=id%>_required_radio_true">
										True
									</label>
									<label for="<%=id%>_required_radio_false">
										<input <%= ( data[key] === false ? 'checked' : '' ) %> type="radio" name="required" value="false" id="<%=id%>_required_radio_false">
										False
									</label>
								</div>																
							</div>
						<% } %>
						<% if ( key == 'isSwitch' ) {%>
							<div class="prop" data-key"isSwitch">
								<div class="prop-col">
									<label for="">Switch :</label>	
								</div>
								<div class="prop-col">
									<label for="<%=id%>_isSwitch_radio_true">
										<input <%= ( data[key] === true ? 'checked' : '' ) %> type="radio" name="isSwitch" value="true" id="<%=id%>_isSwitch_radio_true">
										True
									</label>
									<label for="<%=id%>_isSwitch_radio_false">
										<input <%= ( data[key] === false ? 'checked' : '' ) %> type="radio" name="isSwitch" value="false" id="<%=id%>_isSwitch_radio_false">
										False
									</label>
								</div>																
							</div>
						<% } %>
						<% if ( key == 'label' ) { %>
							<div class="prop" data-key"label">
								<div class="prop-col">
									<label for="">Label :</label>
								</div>
								<div class="prop-col">
									<input type="text" name="label" value="<%=data[key]%>">
								</div>								
							</div>
						<% } %>
						<% if ( key == 'placeholder' ) { %>
							<div class="prop" data-key"placeholder">
								<div class="prop-col">
									<label for="">Placeholder :</label>
								</div>
								<div class="prop-col">
									<input type="text" name="placeholder" value="<%=data[key]%>">
								</div>								
							</div>
						<% } %>
						<% if ( key == 'value' ) { %>
							<% if ( type.match(/(singleline|date|entity|select|radiobox|checkbox)/) ) { %>
								<div class="prop" data-key"value">
									<div class="prop-col">
										<label for="">Default value :</label>
									</div>
									<div class="prop-col">
										<input type="text" name="value" value="<%=data[key]%>">
									</div>								
								</div>
							<% } %>
							<% if ( type.match(/(multiline)/) ) { %>
								<div class="prop" data-key"value">
									<div class="prop-col">
										<label for="">Value :</label>
									</div>
									<div class="prop-col">
										<textarea name="value" rows="5"><%= data[key] %></textarea>
									</div>								
								</div>
							<% } %>
						<% } %>
						<% if ( key == 'format' ) { %>
							<div class="prop" data-key"format">
								<div class="prop-col">
									<label for="">Format :</label>
								</div>
								<div class="prop-col">
									<input type="text" name="format" value="<%=data[key]%>">
								</div>								
							</div>
						<% } %>
						<% if ( key == 'min' ) { %>
							<div class="prop" data-key"min">
								<div class="prop-col">
									<label for="">Min :</label>
								</div>
								<div class="prop-col">
									<input type="number" name="min" value="<%=data[key]%>">
								</div>								
							</div>
						<% } %>
						<% if ( key == 'max' ) { %>
							<div class="prop" data-key"max">
								<div class="prop-col">
									<label for="">Max :</label>
								</div>
								<div class="prop-col">
									<input type="number" name="max" value="<%=data[key]%>">
								</div>								
							</div>
						<% } %>
						<% if ( key == 'multiple' ) {%>
							<div class="prop" data-key"multiple">
								<div class="prop-col">
									<label for="">Allow multiple :</label>	
								</div>
								<div class="prop-col">
									<label for="<%=id%>_multiple_radio_true">
										<input <%= ( data[key] === true ? 'checked' : '' ) %> type="radio" name="multiple" value="true" id="<%=id%>_multiple_radio_true">
										True
									</label>
									<label for="<%=id%>_multiple_radio_false">
										<input <%= ( data[key] === false ? 'checked' : '' ) %> type="radio" name="multiple" value="false" id="<%=id%>_multiple_radio_false">
										False
									</label>
								</div>																
							</div>
						<% } %>
						<% if ( key == 'description' ) { %>
							<div class="prop" data-key"description">
								<div class="prop-col">
									<label for="">Description :</label>
								</div>
								<div class="prop-col">
									<textarea name="description" rows="5"><%= data[key] %></textarea>
								</div>								
							</div>
						<% } %>
						<% if ( key == 'showif' ) { %>
							<div class="prop" data-key"showif">
								<div class="prop-col">
									<label for="">Show if :</label>
								</div>
								<div class="prop-col">
									<textarea name="showif" rows="5"><%= data[key] %></textarea>
								</div>								
							</div>
						<% } %>
						<% if ( key == 'hideif' ) { %>
							<div class="prop" data-key"hideif">
								<div class="prop-col">
									<label for="">Hide if :</label>
								</div>
								<div class="prop-col">
									<textarea name="hideif" rows="5"><%= data[key] %></textarea>
								</div>								
							</div>
						<% } %>
						<% if ( key == 'restriction' ) { %>
							<div class="prop" data-key"restriction">
								<div class="prop-col">
									<label for="">Restriction :</label>
								</div>
								<div class="prop-col">
									<textarea name="restriction" rows="5"><%= data[key] %></textarea>
								</div>								
							</div>
						<% } %>
						<% if ( key == 'isBatch' ) {%>
							<div class="prop" data-key"isBatch">
								<div class="prop-col">
									<label for="">Is Batch :</label>	
								</div>
								<div class="prop-col">
									<label for="<%=id%>_isBatch_radio_true">
										<input <%= ( data[key] === true ? 'checked' : '' ) %> type="radio" name="isBatch" value="true" id="<%=id%>_isBatch_radio_true">
										True
									</label>
									<label for="<%=id%>_isBatch_radio_false">
										<input <%= ( data[key] === false ? 'checked' : '' ) %> type="radio" name="isBatch" value="false" id="<%=id%>_isBatch_radio_false">
										False
									</label>
								</div>																
							</div>
						<% } %>
						<% if ( key == 'options' ) { %>
							<div class="prop" data-key"options">
								<div class="prop-col">
									<label for="">Options :</label>
								</div>
								<div class="prop-col">
									<textarea name="options" rows="5"><%= data[key] %></textarea>
								</div>								
							</div>
						<% } %>
					<% }; %>
				</form>
			</div>
		</script>


	</div> 


	<!-- LIB JS -->
	<script src="lib/jquery-1.11.1/dist/jquery.min.js"></script>
	<script src="lib/jquery-ui/jquery-ui.min.js"></script>
	<script src="lib/bootstrap/dist/js/bootstrap.min.js"></script>

	<!-- APP JS -->
	<script src="js/app.js"></script>
	
	
</body>
</html>