/*

USAGE

<script>

var theValidatorHere = formValidator('#form', {

    config: {

        showErrors: true,
        validateOnBlur: true

    },

    fields: [

        {
            name: "nombre",
            rules: [

                {
                    name: 'minLength',
                    value: 3,
                    errorMessage: 'Name must be at least 3 chars long',
                    onSuccess: function(node) {
                        alert('nombre de boa!');
                    },
                    onError: function(node) {
                        alert('porra nombre!');
                    }
                }

            ]


        }

    ]

});


</script>


*/


//.remove() support for IE11

(function (arr) {
	arr.forEach(function (item) {
		if (item.hasOwnProperty('remove')) {
			return;
		}
		Object.defineProperty(item, 'remove', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function remove() {
				this.parentNode.removeChild(this);
			}
		});
	});
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

// Form serializer
var serialize = function(form) {

	// Setup our serialized data
	var serialized = [];

	// Loop through each field in the form
	for (var i = 0; i < form.elements.length; i++) {

		var field = form.elements[i];

		// Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
		if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

		// If a multi-select, get all selections
		if (field.type === 'select-multiple') {
			for (var n = 0; n < field.options.length; n++) {
				if (!field.options[n].selected) continue;
				serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
			}
		}

		// Convert field data to a query string
		else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
			serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
		}
	}

	return serialized.join('&');

};

var serializeObject = function (form) {

	var obj = {};
	Array.prototype.slice.call(form.elements).forEach(function (field) {
		if (!field.name || field.disabled || ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1) return;

		if (field.type === 'select-multiple') {

			var options = [];
			Array.prototype.slice.call(field.options).forEach(function (option) {
				if (!option.selected) return;
				options.push(option.value);
			});

			if (options.length) {
				obj[field.name] = options;
			}
			return;

		}

		if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked) return;
		obj[field.name] = field.value;

	});

	// Return the object
	return obj;

};



// Default rules
// -
var formValidatorRules = [


    {
        name: 'custom',
        errorMessage: 'Field is not valid',
        rule: (val, ruleValue) => {
            if(typeof ruleValue == "function") {
                if(ruleValue(val)) {
                    return true;
                } else {
                    return false;
                }
            }
        }

    },

    {
        name: 'regex',
        errorMessage: 'Field is not valid',
        rule: (val, ruleValue) => {
            if(ruleValue.test(val)) {
                return true;
            } else {
                return false;
            }
        }

    },

    {
        name: 'equals',
        errorMessage: 'Fields don\'t match',
        rule: (val, ruleValue) => {

            if(val == String(ruleValue)) {
                return true;
            } else {
                return false;
            }

        }

    },

    {
        name: 'required',
        errorMessage: 'This field is required',
        rule: (val, ruleValue) => {

            if(val.length > 0 && val != undefined) {
                return true;
            } else {
                return false;
            }

        }

    },

    {
        name: 'notEmpty',
        errorMessage: 'This field can\'t be empty',
        rule: (val, ruleValue) => {

            if(val.length != 0 && val != undefined) {
                return true;
            } else {
                return false;
            }

        }

    },

    {
        name: 'minLength',
        errorMessage: 'This field is invalid',
        rule: (val, ruleValue) => {

            if(val.length >= ruleValue) {
                return true;
            } else {
                return false;
            }

        }

    },


    {
        name: 'maxLength',
        errorMessage: 'This field is invalid',
        rule: (val, ruleValue) => {

            if(val.length >= ruleValue) {
                return true;
            } else {
                return false;
            }

        }

    },

    {
        name: 'isChecked',
        errorMessage: 'This field must be checked',
        rule: (val, ruleValue, field) => {

            if (field.checked == true){
                return true;
            } else {
                return false;
            }

        }

    },


    {
        name: 'email',
        errorMessage: 'This is not a valid e-mail',
        rule: (val, ruleValue) => {

            var emailRegex = /[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            
            if(emailRegex.test(val)) {
                return true;
            } else {
                return false;
            }

        }

    },

    {
        name: 'phone',
        errorMessage: 'This is not a valid phone',
        rule: (val, ruleValue) => {

            var phoneRegex = /[0-9.]{9}$/;
            // var phoneRegex = /^56(2|9)\d{8,8}$/;    //<--- more accurate
            if(phoneRegex.test(val)) {
                return true;
            } else {
                return false;
            }

        }

    },
    

    {
        name: 'date',
        errorMessage: 'This is not a valid date',
        rule: (val, ruleValue) => {

            var dateRegex = /^\d{1,2}\-\d{1,2}\-\d{4}$/;

            if(dateRegex.test(val)) {
                return true;
            } else {
                return false;
            }

        }

    }


]


// Init the form validator in a form
// -

var formValidator = function(form, options) {

    // Prevent an empty options  
    if(options.config == undefined) {
        options.config = {}
    }

    var formIsValid = true;
    var formIsSubmitting = false;


    // Exits init if finds more than one form
    if(document.querySelectorAll(form).length != 1) {
        return false;
    } else {
        var form = document.querySelectorAll(form)[0];
    }

    // Mount a rules object indexed by rule name
    var rules = {};
    formValidatorRules.forEach((rule) => {
        rules[rule.name] = rule;
    })

    // Mount an options object indexed by field name
    var fieldsOptions = {};
    options.fields.forEach((fieldOptions) => {
        fieldsOptions[fieldOptions.name] = fieldOptions;
    });

    // Initialize a fields errors object indexed by field name
    var fieldsErrors = {};

    // Get form field node by name 
    var getFormFieldNode = function(fieldName) {

        if(form.querySelectorAll('*[name="'+fieldName+'"]').length == 1) {
            var fieldNode = form.querySelector('*[name="'+fieldName+'"]');
        } else {
            var fieldNode = false;
        }
        return fieldNode;

    }

    var clearFieldValidation = function(fieldName) {

        var fieldNode = getFormFieldNode(fieldName);

        if(options.config && options.config.useValidationClasses) {

            fieldNode.classList.remove('is-invalid');
            fieldNode.classList.remove('is-valid');
            $(fieldNode).closest('.form-group').removeClass('has-errors');
        
        }

        if(options.config && options.config.showErrors) {

            if(fieldNode.parentNode.querySelectorAll('.form-validator-error').length > 0) {
                fieldNode.parentNode.querySelector('.form-validator-error').remove();
            }

        }

    }

    // Analyze individual field of the form
    var validateField = function(fieldName) {

        // Clear field errors
        fieldsErrors[fieldName] = [];

        var fieldIsValid = true;
        var fieldNode = getFormFieldNode(fieldName);
    
        if(fieldNode) {
            
            clearFieldValidation(fieldName);

            var fieldErrors = [];
            
            let fieldVal = fieldNode.value;
            let fieldRules = fieldsOptions[fieldName].rules;
            
            // Run through each fieldRule and test its rule()
            fieldRules.forEach((fieldRule) => {

                // Only check first error
                if(fieldIsValid) {
                    
                    if(fieldRule.value && fieldRule.value != undefined) {
                        var fieldRuleValue = fieldRule.value;
                    } else {
                        var fieldRuleValue = 0;
                    }
    
                    if(rules[fieldRule.name] && typeof rules[fieldRule.name].rule == "function") {
                        var ruleFn = rules[fieldRule.name];
                    } else {
                        console.log('Validator "' + fieldRule.name + '" not found on formValidatorRules object')
                    }
                    
                    if(ruleFn && ruleFn.rule(fieldVal, fieldRuleValue, fieldNode)) {
    
                        // Success 
    
                    } else {
    
                        // Fail
                        if(fieldRule.errorMessage) {
                            if(typeof fieldRule.errorMessage == "function") {
                                var errorMessage = fieldRule.errorMessage();
                            } else {
                                var errorMessage = fieldRule.errorMessage;
                            }
                        } else {
                            var errorMessage = rules[fieldRule.name].errorMessage;
                        }
    
                        fieldsErrors[fieldName].push({
                            val: fieldVal,
                            errorMessage: errorMessage
                        });
    
                        fieldErrors.push({
                            val: fieldVal,
                            errorMessage: errorMessage
                        })
                        
                        fieldIsValid = false;
    
                    }

                }

            })

            if(fieldIsValid) {
                delete fieldsErrors[fieldName];
            }

        } else {
            fieldIsValid = true;
        }

        if(options.config && options.config.useValidationClasses) {

            // Set valid/invalid classes 
            if(fieldIsValid) {
                fieldNode.classList.add('is-valid');
            } else {
                fieldNode.classList.add('is-invalid');
                $(fieldNode).closest('.form-group').addClass('has-errors');
            }
        
        }

        if(options.config && options.config.showErrors) {
         
            if(!fieldIsValid){
     
                var errorNode = document.createElement("div");
                errorNode.classList.add('form-validator-error');
                errorNode.classList.add('invalid-feedback');
                errorNode.classList.add('d-block');
                errorNode.innerHTML = fieldErrors[0].errorMessage;
                fieldNode.parentNode.insertBefore(errorNode, fieldNode);

            }
        
        }

        // Update formIsValid Variable
        if(Object.keys(fieldsErrors).length == 0) {
            formIsValid = true;
        } else {
            formIsValid = false;
        }
    
    }

    // Validate all fields of the form
    // --
    var validate = function() {

        options.fields.forEach((fieldOptions) => {
            var fieldName = fieldOptions.name;
            var fieldNode = getFormFieldNode(fieldName);

            if(fieldNode) {
                let validateFieldExecution = validateField(fieldName);
            }

        });

        if(!formIsValid) {
            let keys = Object.keys(fieldsErrors);
            getFormFieldNode(keys[0]).focus();
        }

    }

    // Clear validation
    // -- 
    var clearValidation = function() {

        options.fields.forEach((fieldOptions) => {
            var fieldName = fieldOptions.name;
            var fieldNode = getFormFieldNode(fieldName);

            if(fieldNode) {
                clearFieldValidation(fieldName);
            }

        });

    }

    // Events
    // --

    // Submit event
    form.addEventListener('submit', (event) => {    
        

        if(!formIsSubmitting) {

            validate();
        
            if(Object.keys(fieldsErrors).length > 0) {
                event.preventDefault();

            } else {
                
                // If an onSubmit is provided on config, will stop form submission and call onSubmit()
                if(typeof options.config.onSubmit == "function") {

                    formIsSubmitting = true;
                    options.config.onSubmit(
                    { 
                        serialized: serialize(form),
                        object: serializeObject(form)
                    }
                    
                    , event)
                    formIsSubmitting = false;
                    
                } else {
                    // Traditional form submission
                }
                
            }

        } else {
            event.preventDefault();
        }

    });


    // Apply field events
    options.fields.forEach((fieldOptions) => {
        
        var fieldName = fieldOptions.name;
        var fieldNode = getFormFieldNode(fieldName);
        
        if(fieldNode) {

            // Validate on blur
            if(options.config && options.config.validateOnBlur) {
                fieldNode.addEventListener('blur', (event) => {    
                    validateField(fieldName);
                });
            }

        
        }

    });


    // Interface 
    // -- 

    return {
        validate: validate,
        isValid: function() { return formIsValid },
        errors: fieldsErrors,
        clearValidation: clearValidation,
        clearFieldValidation: clearFieldValidation,
        submit: function() {
            if(typeof options.config.onSubmit == "function") {
                options.config.onSubmit({ 
                    serialized: serialize(form),
                    object: serializeObject(form)
                });
            } else {
                form.submit();
            }
        }
    }
  
    
}


export default formValidator;