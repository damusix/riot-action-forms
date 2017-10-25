(function (exports) {
'use strict';

var config = {

    // Elements to be selected for validation
    elements: '[required],[data-validate],[data-equals],[data-regex],[data-cc]',

    // Regular expressions used to validate
    regexes: {

        alphanum: /^[a-z0-9]+$/i,
        alphanumspace: /^[a-z0-9\s]+$/i,
        name: /^[a-z\s\-\,\.]+$/i,
        username: /^[a-z0-9][a-z0-9\s\-\_\+\.]+[a-z0-9]$/i,
        fqdn: /^[a-z0-9][a-z0-9\-\_\.]+[a-z0-9]{2,20}$/i,
        tld: /^[a-z]{2,20}/i,
        phone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        email: /.+@.+\..+/i
    },

    // Feedback, state, and container classes
    classes: {

        container: 'field',
        error: 'error',
        help: 'help',
        hide: 'hide',
        info: 'info',
        success: 'success',
        warning: 'warning'
    },

    // Field formatting functions
    format: {
        creditcard: function (value) {

            var formatted = value.match(/([0-9]{4})|([0-9]+)/ig);
            console.log(formatted);
            return formatted ? formatted.join(' ') : '';
        }
    }
};

/*
 * Format a field's value based on functions in `config.format`
 *
 * @param { String } formatFn - Name of function in `config.format`
 * @param { HTMLFormElement } field - Field to format value of
 */
function formatValue(formatFn, field) {

    console.log(config.format);
    console.log(typeof config.format[formatFn] === 'function');
    console.log(formatFn);

    if (typeof config.format[formatFn] !== 'function') {

        throw TypeError((formatFn + " does not exist or is not a function"));
    }

    field.value = config.format[formatFn](field.value);
}

// Overwrite config
function configure(opts) {

    for (opt in opts) {

        if (config[opt].constructor === Object) {

            config[opt] = Object.assign({}, config[opt], opts[opt]);
        }
        else {

            config[opt] = opts[opt];
        }
    }
}


/**
 * Validates a value and returns true or false.
 * Throws error if it cannot validate
 *
 * @param { String } value - Value to be validated
 * @param { String | RegExp } rgx - String reference to `regexes` or a RegExp
 *
 * @returns { Boolean }
 */
function validateRegex(value, rgx) {

    // Accepts RegExp as second value
    if (rgx.constructor === RegExp) {

        return rgx.test(value);
    }

    // Second value is a string, so it must exist
    // inside of `config.regexes` object
    if (typeof rgx === 'string' && config.regexes[rgx] !== undefined) {

        return config.regexes[rgx].test(value);
    }

    // If conditions aren't met, throw error
    throw Error('second parameter is an invalid regular expression or does not exist within utilities object');

}


/**
 * Iterates through an object and checks for true or false
 *
 * @param { Object } obj - Object to iterate
 *
 * @returns { Boolean }
 */
function confirmValidation(obj) {

    // Iterate through the object
    for (var v in obj) {

        // And return false if any key is false
        if (obj[v] === false) {

            return false;
        }
    }

    return true;
}


/**
 * Crawls up the DOM starting from the `field` element
 * and finds containing element with class names specified
 * in the `classes` object.
 *
 * @param { HTMLFormElement } field - Field whose parent we will return
 * @param { Object } containerClass - Name of class the container will have
 *
 * @returns { HTMLElement }
 */
function findFieldContainer (field, containerClass) {

    if (field === document.body) {

        throw new Error(("Field named " + (field.name) + " is not inside a field container"));
    }

    var parent = field.parentElement;

    if (!parent.classList.contains(containerClass)) {

        parent = findFieldContainer(parent, containerClass);
    }

    return parent;
}

var classes = config.classes;

/**
 * Adds validation functionality to form fields
 * to display errors and help fields. Binds field with
 * Riot Observable and gives elements event features.
 *
 * @param { HTMLFormElement } field - Field whose parent we will return
 * @param { Object } validations - Parent form validation object
 *
 */
function bindField (field, validations) {

    var parent = findFieldContainer(field, classes.container || '.field' );

    var name = field.getAttribute('name');
    var type = field.getAttribute('type');
    var required = field.getAttribute('required') !== undefined;

    // Formatting function
    var format = field.getAttribute('format');

    // Validation function
    // input[data-validate] should be a function in
    var validate = field.getAttribute('validate');

    // Match value against another element
    // Should be a CSS selector
    var equals = field.getAttribute('equals');

    // Custom regular expression
    var regex = field.getAttribute('regex');

    // Events to bind to
    var on = field.getAttribute('on') || 'change';

    // Input validation object to handle multiple methods
    var validation = {};

    var isValid = false;

    if (field.getAttribute('disabled') || type === 'hidden') {

        return;
    }

    // Observer(field);
    riot.observable(field);

    // Form validation object
    validations[name] = isValid;

    var validateFn = function(e) {

        var keyCode = (window.event) ? e.which : e.keyCode;
        var isBlur = e.type ==='blur';
        var value = field.value;
        var empty = !value.length;

        // If it's required, it can't be empty
        if (required) {

            validation.required = !!value;

            if (type === 'checkbox') {

                validation.checked = field.checked;
            }

        }

        // Assert against existing validation function
        if (validate) {

            validation.validate = validateRegex(value, validate);
        }

        // Assert against custom regex
        if (regex) {

            var rgx = new RegExp(regex);
            validation.regex = rgx.test(value);
        }

        // Assert against another field's value
        if (equals) {

            var equalsElement = field.form.querySelector(equals);

            validation.equals = value === equalsElement.value;

            if (!equalsElement.isValid) {

                equalsElement.trigger('validate', {});
            }
        }


        // Check input validation
        isValid = confirmValidation(validation);

        // Input is not required and is empty
        if (!isValid && !required && !value && isBlur) {

            isValid = null;
        }

        validated(isValid);
        return isValid;

    };

    var validated = function(isValid) {

        // Bind to validation object for form check
        if (validate || regex || equals || required) {

            validations[name] = isValid;
        }

        // Bind validity to html element
        field.isValid = isValid;

        // If it's valid, remove error classes and hide the help block.
        // This is meant to work with bootstrap forms.
        if (isValid) {

            parent.classList.remove(classes.error);
            parent.classList.add(classes.success);

            parent.querySelector(("." + (classes.help))).classList.add(classes.hide);
        }
        else {

            parent.classList.add(classes.error);
            parent.classList.remove(classes.success);

            parent.querySelector(("." + (classes.help))).classList.remove(classes.hide);
        }

        // Allow fields that are not required
        if (isValid === null) {

            field.setBlank();
        }

        field.trigger('validated', { isValid: isValid, value: field.value });
    };

    field.on('validate', validateFn);

    // Bind events to validation function
    on.split(' ').map(function (o) {

        field[("on" + o)] = function (e) {

            if (format) {

                formatValue(format, field);
            }

            validateFn(e);
        };
    });


    var setBlank = function () {

        parent.classList.remove(classes.success, classes.error, classes.warning, classes.info);
        parent.querySelector(("." + (classes.help))).classList.add(classes.hide);
    };
}

function bindForm (form) {

    var inputs = form.querySelectorAll(config.elements);
    var submit = form.querySelector('[type=submit]');
    var validations = {};

    form.validations = validations;
    form.isValid = false;
    form.noValidate = true;

    // Observer(form);
    riot.observable(form);

    var validate = function() {

        form.isValid = confirmValidation(validations);
        return form.isValid;
    };

    var validateAll = function() {

        return new Promise(function (resolve, reject) {

            function assessSubmit() {

                // Returns true if valid
                if (validate()) {

                    resolve();
                }
                else {

                    reject();
                }
            }

            inputs.forEach(function (field, i) {

                if (i === (inputs.length-1)) {

                    field.one('validated', function () {

                        assessSubmit();
                    });
                }

                field.trigger('validate', {});
            });
        });
    };

    form.on('validate', function() {

        validateAll().then(function() {

            form.trigger('validated');
        });
    });

    form.on('validated', function () {

        if (form.isValid) {

            form.trigger('submit');
        }
    });

    // When the form is submitting, iterate through all the fields and validate them
    form.onsubmit = function(e) {

        e.preventDefault();

        if (!form.isValid) {

            form.trigger('validate');
        }
        else {

            form.trigger('validated');
            form.trigger('submitted');
        }
    };


    // Add validation functionality to form elements
    function bindFields() {

        inputs.forEach(function(field) {

            if (!field.on) {

                bindField(field, validations);
            }
        });
    }

    bindFields();

    // Rebind validations in case of new required fields
    if (!form.rebind) {

        form.rebind = function() {

            inputs = form.find(config.elements);
            bindFields();
        };

        form.on('rebind', form.rebind);
    }

    form.on('reset', function() {

        form.reset();
        form.isValid = false;

        inputs.forEach(function(field) {

            field.setBlank();
        });
    });
}

exports.bindForm = bindForm;
exports.config = config;
exports.formatValue = formatValue;
exports.configure = configure;
exports.validateRegex = validateRegex;
exports.confirmValidation = confirmValidation;
exports.findFieldContainer = findFieldContainer;

}((this.RiotActionForms = this.RiotActionForms || {})));
