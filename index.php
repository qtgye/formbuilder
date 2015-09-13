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

					<div class="pull-right form-loader js-form-loader">
						<div class="btn btn-default fetch-btn js-load-btn">
							<span class="fetch-btn-text-default">Load Form</span>
							<span class="fetch-btn-text-fetching"><i class="fa fa-spinner fa-lg fa-pulse"></i> Fetching</span>
						</div>
						<div class="form-list-dropdown js-form-loader-dropdown">
							<ul class="latest-form-list js-form-list">
								
							</ul>
							<div class="form-list-close js-form-list-close">CLOSE</div>
						</div>
					</div>					
				</div>

			</div>
			
			<div class="col-md-2">
				
				<div class="fields-list-guide js-fields-list-guide">
				</div>

				<div class="fields-list js-field-list">
				</div>

			</div>

			<div class="col-md-6 clearfix">				
				
				<!-- The Stage -->
				<div class="stage js-stage"></div>				

				<!-- guides -->
				<div class="guides">
					<div class="form-guide">
						<div class="section-guide">
							<div class="field-guide"></div>
						</div>
					</div>
				</div>

			</div>

			<div class="col-md-4 clearfix editor-guide js-editor-guide">
				
			</div>

		</div>
	</div>


	
	<!-- modal -->
	<div class="modal fade is-saving" id="modal" data-backdrop="false">
		<div class="modal-dialog modal-sm">
			<div class="modal-content">
				<div class="modal-saving">
					<h3>
						<i class="fa fa-spinner fa-pulse"></i> SAVING
					</h3>
				</div>
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
					<h4 class="js-form-title"><%=title%></h4>
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
			<div class="field js-drag-handle js-field-handle as-peg <%=( isAvailable ? '' : 'is-disabled' )%>" data-type="singleline" data-showif="<%=showif%>" data-hideif="<%=hideif%>" data-restriction="<%=restriction%>" data-is-available="<%=isAvailable%>">
				<div class="field-peg js-peg">
					<h5>Single Line</h5>
				</div>
				<div class="field-content js-drag-handle js-field-handle">
					<label><%=label%></label>
					<input type="text" id="<%=key%>" name="<%=key%>" placeholder="<%=placeholder%>" value="<%=value%>" <%=( required? 'required' : '' )%> >
					<span class="help-block field-description"><%=description%></span>
				</div>	
				<i class="disable-icon fa fa-eye-slash fa-lg"></i>		
			</div>
		</script>
		
		<!-- date -->
		<script class="field-template" data-type="date" id="tmpl-read-date" type="text/html">
			<div class="field js-drag-handle js-field-handle as-peg <%=( isAvailable ? '' : 'is-disabled' )%>" data-type="date" data-is-available="<%=isAvailable%>" data-format="<%=format%>" data-showif="<%=showif%>" data-hideif="<%=hideif%>">
				<div class="field-peg js-peg">
					<h5>Date</h5>
				</div>
				<div class="field-content js-drag-handle js-field-handle">
					<label><%=label%></label>
					<input type="date" id="<%=key%>" name="<%=key%>" <%=( required? 'required' : '' )%> >
					<span class="help-block field-description"><%=description%></span>
				</div>		
				<i class="disable-icon fa fa-eye-slash fa-lg"></i>				
			</div>
		</script>

		<!-- entity -->
		<script class="field-template" data-type="entity" id="tmpl-read-entity" type="text/html">
			<div class="field js-drag-handle js-field-handle as-peg <%=( isAvailable ? '' : 'is-disabled' )%>" data-type="entity">
				<div class="field-peg js-peg">
					<h5>Entity</h5>
				</div>
				<div class="field-content js-drag-handle js-field-handle">
					<label><%=label%></label>
					<span class="help-block field-description"><%=description%></span>
				</div>	
				<i class="disable-icon fa fa-eye-slash fa-lg"></i>					
			</div>
		</script>

		<!-- multiline -->
		<script class="field-template" data-type="multiline" id="tmpl-read-multiline" type="text/html">
			<div class="field js-drag-handle js-field-handle as-peg <%=( isAvailable ? '' : 'is-disabled' )%>" data-type="multiline">
				<div class="field-peg js-peg">
					<h5>Multiline</h5>
				</div>
				<div class="field-content js-drag-handle js-field-handle">
					<label><%=label%></label>
					<textarea id="<%=key%>" name="<%=key%>" placeholder="<%=placeholder%>" <%= (required?'required':'') %> ><%=value%></textarea>
					<span class="help-block field-description"><%=description%></span>
				</div>	
				<i class="disable-icon fa fa-eye-slash fa-lg"></i>					
			</div>
		</script>		

		<!-- selection -->
		<script class="field-template" data-type="selection" id="tmpl-read-selection" type="text/html">
			<div class="field js-drag-handle js-field-handle as-peg <%=( isAvailable ? '' : 'is-disabled' )%>" data-type="selection">
				<div class="field-peg js-peg">
					<h5>Selection</h5>
				</div>
				<div class="field-content js-drag-handle js-field-handle">
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
			<div class="field js-drag-handle js-field-handle as-peg <%=( isAvailable ? '' : 'is-disabled' )%>" data-type="radiobox">
				<div class="field-peg js-peg">
					<h5>Radio Box</h5>
				</div>
				<div class="field-content js-drag-handle js-field-handle">
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
			<div class="field js-drag-handle js-field-handle as-peg <%=( isAvailable ? '' : 'is-disabled' )%>" data-type="checkbox">
				<div class="field-peg js-peg">
					<h5>Checkbox</h5>
				</div>
				<div class="field-content js-drag-handle js-field-handle">
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
				<div class="action-button action-button-edit field-edit">
					edit
				</div>
				<div class="action-button action-button-remove field-remove">
					&times;
				</div>
			</div>
		</script>


		<!-- forms list -->
		<script id="tmplFormsList" type="text/html">
			<% formsList.forEach(function(form){ %>
				<li class="form-list-item">
					<a href="#" class="form-list-item-link js-form-item" data-form-id="<%=form.id%>">
						<i class="fa fa-spinner fa-lg fa-pulse form-list-item-spinner"></i><%=form.title%>
					</a>
				</li>
			<% }); %>			
		</script>

		

		<!-- editor template -->
		<script class="editor-template" id="tmpl-editor" type="text/html">
			<div class="editor" data-id="<%=id%>">

				<div class="editor-close">&times;</div>
				<div class="editor-container" data-id="<%=id%>">

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
						<% } else if ( key == 'name' ) { %>
							<div class="prop" data-key="name">
								<div class="prop-col">
									<label>Name :</label>
								</div>
								<div class="prop-col">
									<input type="text" name="name" value="<%=data[key]%>">
								</div>								
							</div>
						<% } else if ( key == 'title' ) { %>
							<div class="prop" data-key="title">
								<div class="prop-col">
									<label>Title :</label>
								</div>
								<div class="prop-col">
									<input type="text" name="title" value="<%=data[key]%>">
								</div>								
							</div>
						<% } else if ( key == 'key' ) { %>
							<div class="prop" data-key"key">
								<div class="prop-col">
									<label for="">Key :</label>
								</div>
								<div class="prop-col">
									<input type="text" name="key" value="<%=data[key]%>">
								</div>								
							</div>
						<% } else if ( key == 'required' ) {%>
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
						<% } else if ( key == 'isSwitch' ) {%>
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
						<% } else if ( key == 'label' ) { %>
							<div class="prop" data-key"label">
								<div class="prop-col">
									<label for="">Label :</label>
								</div>
								<div class="prop-col">
									<input type="text" name="label" value="<%=data[key]%>">
								</div>								
							</div>
						<% } else if ( key == 'placeholder' ) { %>
							<div class="prop" data-key"placeholder">
								<div class="prop-col">
									<label for="">Placeholder :</label>
								</div>
								<div class="prop-col">
									<input type="text" name="placeholder" value="<%=data[key]%>">
								</div>								
							</div>
						<% } else if ( key == 'value' ) { %>
							<% if ( type.match(/(singleline|date|entity|select|radiobox|checkbox)/) ) { %>
								<div class="prop" data-key"value">
									<div class="prop-col">
										<label for="">Default value :</label>
									</div>
									<div class="prop-col">
										<input type="text" name="value" value="<%=data[key]%>">
									</div>								
								</div>
							<% } else if ( type.match(/(multiline)/) ) { %>
								<div class="prop" data-key"value">
									<div class="prop-col">
										<label for="">Default Value :</label>
									</div>
									<div class="prop-col">
										<textarea name="value" rows="5"><%= data[key] %></textarea>
									</div>								
								</div>
							<% } %>
						<% } else if ( key == 'format' ) { %>
							<div class="prop" data-key"format">
								<div class="prop-col">
									<label for="">Format :</label>
								</div>
								<div class="prop-col">
									<input type="text" name="format" value="<%=data[key]%>">
								</div>								
							</div>
						<% } else if ( key == 'min' ) { %>
							<div class="prop" data-key"min">
								<div class="prop-col">
									<label for="">Min :</label>
								</div>
								<div class="prop-col">
									<input type="number" name="min" value="<%=data[key]%>">
								</div>								
							</div>
						<% } else if ( key == 'max' ) { %>
							<div class="prop" data-key"max">
								<div class="prop-col">
									<label for="">Max :</label>
								</div>
								<div class="prop-col">
									<input type="number" name="max" value="<%=data[key]%>">
								</div>								
							</div>
						<% } else if ( key == 'multiple' ) {%>
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
						<% } else if ( key == 'description' ) { %>
							<div class="prop" data-key"description">
								<div class="prop-col">
									<label for="">Description :</label>
								</div>
								<div class="prop-col">
									<textarea name="description" rows="5"><%= data[key] %></textarea>
								</div>								
							</div>
						<% } else if ( key == 'showif' ) { %>
							<div class="prop" data-key"showif">
								<div class="prop-col">
									<label for="">Show if :</label>
								</div>
								<div class="prop-col">
									<textarea name="showif" rows="5"><%= data[key] %></textarea>
								</div>								
							</div>
						<% } else if ( key == 'hideif' ) { %>
							<div class="prop" data-key"hideif">
								<div class="prop-col">
									<label for="">Hide if :</label>
								</div>
								<div class="prop-col">
									<textarea name="hideif" rows="5"><%= data[key] %></textarea>
								</div>								
							</div>
						<% } else if ( key == 'restriction' ) { %>
							<div class="prop" data-key"restriction">
								<div class="prop-col">
									<label for="">Restriction :</label>
								</div>
								<div class="prop-col">
									<textarea name="restriction" rows="5"><%= data[key] %></textarea>
								</div>								
							</div>
						<% } else if ( key == 'isBatch' ) {%>
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
						<% } else if ( key == 'options' ) { %>
							<div class="prop" data-key"options">
								<div class="prop-col">
									<label for="">Options :</label>
								</div>
								<div class="prop-col">
									<textarea name="options" rows="5"><%= data[key] %></textarea>
								</div>								
							</div>
						<% } else if ( key == 'user_id' ) { %>
							<div class="prop" data-key"user_id">
								<div class="prop-col">
									<label for="">User ID :</label>
								</div>
								<div class="prop-col">
									<select name="user_id" id="user_id">
										<% data[key].forEach(function(item){ %>
											<option value="<%=item.value%>" <%=(item.selected?'selected':'')%>>
												<%=item.value%>
											</option>
										<% }); %>										
									</select>
								</div>								
							</div>
						<% } else if ( key == 'account_id' ) { %>
							<div class="prop" data-key"account_id">
								<div class="prop-col">
									<label for="">Account ID :</label>
								</div>
								<div class="prop-col">
									<select name="account_id" id="account_id">
										<% data[key].forEach(function(item){ %>
											<option value="<%=item.value%>" <%=(item.selected?'selected':'')%>>
												<%=item.value%>
											</option>
										<% }); %>										
									</select>
								</div>								
							</div>
						<% } else if ( key == 'status' ) { %>
							<div class="prop" data-key"status">
								<div class="prop-col">
									<label for="">Status :</label>
								</div>
								<div class="prop-col">
									<select name="status" id="status">
										<option value="3" <%=(data[key]===3?'selected':'')%>>
											Draft
										</option>		
										<option value="0" <%=(data[key]===0?'selected':'')%>>
											Active
										</option>
										<option value="1" <%=(data[key]===1?'selected':'')%>>
											Suspended
										</option>
										<option value="2" <%=(data[key]===2?'selected':'')%>>
											Deleted
										</option>					
									</select>
								</div>								
							</div>
						<% } else if ( key == 'tags' ) { %>
							<div class="prop" data-key"tags">
								<div class="prop-col">
									<label for="">Tags :</label>
								</div>
								<div class="prop-col">
									<input type="text" name="tags" value="<%= data[key] %>">
								</div>								
							</div>
						<% } %>
					<% }; %>
				</form>
			</div>
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