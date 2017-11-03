(function (exports,riot$1) {
'use strict';

riot$1 = 'default' in riot$1 ? riot$1['default'] : riot$1;

var config = {

    // Elements to be selected for validation
    elements: [
        'input[required],input[validate],input[format],input[equals],input[regex]',
        'textarea[required],textarea[validate],textarea[format],textarea[equals],textarea[regex]',
        'select[required],select[validate],select[equals]' ].join(','),

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
    },

    // Serialization options for `form-serialize`
    serialize: {

        hash: true
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
 * @param { Boolean } isForm - Whether to confirm validation for the form
 *
 * @returns { Boolean }
 */
function confirmValidation(obj, isForm) {

    // Iterate through the object
    for (var v in obj) {

        var check = obj[v];

        if (isForm) {

            check = obj[v].required && obj[v].valid;

            if (!obj[v].required) {

                check = obj[v].valid;
            }
        }

        // And return false if any key is false
        if (check === false) {

            return check;
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

riot$1.tag2('field', '<label ref="label" for="{opts.name}" if="{opts.label}"> {opts.label} </label> <input if="{opts.type !== \'textarea\'}" ref="input" type="{opts.type || \'text\'}" name="{opts.name}" riot-value="{opts.value}" on="{opts.on}" validate="{opts.validate}" regex="{opts.regex}" required="{required}" placeholder="{opts.placeholder}"> <textarea if="{opts.type === \'textarea\'}" ref="input" name="{opts.name}" on="{opts.on}" validate="{opts.validate}" regex="{opts.regex}" required="{required}" placeholder="{opts.placeholder}"> <yield></yield> </textarea> <small class="{config.classes.help} {config.classes.hide}">{opts.help || \'\'}</small>', '', '', function(opts) {

        var self = this;

        self.config = config;
        self.required = Object.keys(self.opts).indexOf('required') > -1;

        self.on('before-mount', function () {
            self.root.classList.add(self.config.classes.container);
        });

        self.on('mount', function () {

            if (self.refs.label) {
                self.refs.label.onclick = function () {

                    self.refs.input.focus();
                };
            }
        });

});

// get successful control from form and assemble into object
// http://www.w3.org/TR/html401/interact/forms.html#h-17.13.2

// types which indicate a submit action and are not successful controls
// these will be ignored
var k_r_submitter = /^(?:submit|button|image|reset|file)$/i;

// node names which could be successful controls
var k_r_success_contrls = /^(?:input|select|textarea|keygen)/i;

// Matches bracket notation.
var brackets = /(\[[^\[\]]*\])/g;

// serializes form fields
// @param form MUST be an HTMLForm element
// @param options is an optional argument to configure the serialization. Default output
// with no options specified is a url encoded string
//    - hash: [true | false] Configure the output type. If true, the output will
//    be a js object.
//    - serializer: [function] Optional serializer function to override the default one.
//    The function takes 3 arguments (result, key, value) and should return new result
//    hash and url encoded str serializers are provided with this module
//    - disabled: [true | false]. If true serialize disabled fields.
//    - empty: [true | false]. If true serialize empty fields
function serialize(form, options) {
    if (typeof options != 'object') {
        options = { hash: !!options };
    }
    else if (options.hash === undefined) {
        options.hash = true;
    }

    var result = (options.hash) ? {} : '';
    var serializer = options.serializer || ((options.hash) ? hash_serializer : str_serialize);

    var elements = form && form.elements ? form.elements : [];

    //Object store each radio and set if it's empty or not
    var radio_store = Object.create(null);

    for (var i=0 ; i<elements.length ; ++i) {
        var element = elements[i];

        // ingore disabled fields
        if ((!options.disabled && element.disabled) || !element.name) {
            continue;
        }
        // ignore anyhting that is not considered a success field
        if (!k_r_success_contrls.test(element.nodeName) ||
            k_r_submitter.test(element.type)) {
            continue;
        }

        var key = element.name;
        var val = element.value;

        // we can't just use element.value for checkboxes cause some browsers lie to us
        // they say "on" for value when the box isn't checked
        if ((element.type === 'checkbox' || element.type === 'radio') && !element.checked) {
            val = undefined;
        }

        // If we want empty elements
        if (options.empty) {
            // for checkbox
            if (element.type === 'checkbox' && !element.checked) {
                val = '';
            }

            // for radio
            if (element.type === 'radio') {
                if (!radio_store[element.name] && !element.checked) {
                    radio_store[element.name] = false;
                }
                else if (element.checked) {
                    radio_store[element.name] = true;
                }
            }

            // if options empty is true, continue only if its radio
            if (val == undefined && element.type == 'radio') {
                continue;
            }
        }
        else {
            // value-less fields are ignored unless options.empty is true
            if (!val) {
                continue;
            }
        }

        // multi select boxes
        if (element.type === 'select-multiple') {
            val = [];

            var selectOptions = element.options;
            var isSelectedOptions = false;
            for (var j=0 ; j<selectOptions.length ; ++j) {
                var option = selectOptions[j];
                var allowedEmpty = options.empty && !option.value;
                var hasValue = (option.value || allowedEmpty);
                if (option.selected && hasValue) {
                    isSelectedOptions = true;

                    // If using a hash serializer be sure to add the
                    // correct notation for an array in the multi-select
                    // context. Here the name attribute on the select element
                    // might be missing the trailing bracket pair. Both names
                    // "foo" and "foo[]" should be arrays.
                    if (options.hash && key.slice(key.length - 2) !== '[]') {
                        result = serializer(result, key + '[]', option.value);
                    }
                    else {
                        result = serializer(result, key, option.value);
                    }
                }
            }

            // Serialize if no selected options and options.empty is true
            if (!isSelectedOptions && options.empty) {
                result = serializer(result, key, '');
            }

            continue;
        }

        result = serializer(result, key, val);
    }

    // Check for all empty radio buttons and serialize them with key=""
    if (options.empty) {
        for (var key in radio_store) {
            if (!radio_store[key]) {
                result = serializer(result, key, '');
            }
        }
    }

    return result;
}

function parse_keys(string) {
    var keys = [];
    var prefix = /^([^\[\]]*)/;
    var children = new RegExp(brackets);
    var match = prefix.exec(string);

    if (match[1]) {
        keys.push(match[1]);
    }

    while ((match = children.exec(string)) !== null) {
        keys.push(match[1]);
    }

    return keys;
}

function hash_assign(result, keys, value) {
    if (keys.length === 0) {
        result = value;
        return result;
    }

    var key = keys.shift();
    var between = key.match(/^\[(.+?)\]$/);

    if (key === '[]') {
        result = result || [];

        if (Array.isArray(result)) {
            result.push(hash_assign(null, keys, value));
        }
        else {
            // This might be the result of bad name attributes like "[][foo]",
            // in this case the original `result` object will already be
            // assigned to an object literal. Rather than coerce the object to
            // an array, or cause an exception the attribute "_values" is
            // assigned as an array.
            result._values = result._values || [];
            result._values.push(hash_assign(null, keys, value));
        }

        return result;
    }

    // Key is an attribute name and can be assigned directly.
    if (!between) {
        result[key] = hash_assign(result[key], keys, value);
    }
    else {
        var string = between[1];
        // +var converts the variable into a number
        // better than parseInt because it doesn't truncate away trailing
        // letters and actually fails if whole thing is not a number
        var index = +string;

        // If the characters between the brackets is not a number it is an
        // attribute name and can be assigned directly.
        if (isNaN(index)) {
            result = result || {};
            result[string] = hash_assign(result[string], keys, value);
        }
        else {
            result = result || [];
            result[index] = hash_assign(result[index], keys, value);
        }
    }

    return result;
}

// Object/hash encoding serializer.
function hash_serializer(result, key, value) {
    var matches = key.match(brackets);

    // Has brackets? Use the recursive assignment function to walk the keys,
    // construct any missing objects in the result tree and make the assignment
    // at the end of the chain.
    if (matches) {
        var keys = parse_keys(key);
        hash_assign(result, keys, value);
    }
    else {
        // Non bracket notation can make assignments directly.
        var existing = result[key];

        // If the value has been assigned already (for instance when a radio and
        // a checkbox have the same name attribute) convert the previous value
        // into an array before pushing into it.
        //
        // NOTE: If this requirement were removed all hash creation and
        // assignment could go through `hash_assign`.
        if (existing) {
            if (!Array.isArray(existing)) {
                result[key] = [ existing ];
            }

            result[key].push(value);
        }
        else {
            result[key] = value;
        }
    }

    return result;
}

// urlform encoding serializer
function str_serialize(result, key, value) {
    // encode newlines as \r\n cause the html spec says so
    value = value.replace(/(\r)?\n/g, '\r\n');
    value = encodeURIComponent(value);

    // spaces should be '+' rather than '%20'.
    value = value.replace(/%20/g, '+');
    return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + value;
}

var index = serialize;

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

    var parent;

    try {
        parent = findFieldContainer(field, classes.container || '.field' );

    }
    catch (e) {

        console.log(e.message);
        parent = false;
    }

    var name = field.getAttribute('name');
    var type = field.getAttribute('type');
    var required = [undefined, null].indexOf(field.getAttribute('required')) === -1;

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

    var valid = false;
    var hasValue = false;

    if (field.getAttribute('disabled') || type === 'hidden') {

        return;
    }

    // Observer(field);
    riot.observable(field);

    // Form validation object
    validations[name] = { required: required, valid: valid };

    var validateFn = function(e) {

        var keyCode = (window.event) ? e.which : e.keyCode;
        var isBlur = e.type ==='blur';
        var value = field.value;

        var empty = !value.length;
        hasValue = !!value;

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

            if (!equalsElement.valid) {

                equalsElement.trigger('validate', {});
            }
        }

console.log(name, validation);
        // Check input validation
        valid = confirmValidation(validation);
console.info(!valid && !required && !value);
console.info(!valid, !required, !value);
        // Input is not required and is empty
        if (!valid && !required && !value) {
console.warn("NBULLLL");
            valid = null;
        }

        validated(valid);
        return valid;

    };

    var validated = function(valid) {

        // Bind to validation object for form check
        if (validate || regex || equals || required) {

            validations[name].valid = valid;
        }

        // Bind validity to html element
        field.valid = valid;

        // If it's valid, remove error classes and hide the help block.
        // This is meant to work with bootstrap forms.

        var feedbackElement = parent;

        if (!parent) {

            feedbackElement = field;
        }


        if (valid && hasValue) {

            feedbackElement.classList.remove(classes.error);
            feedbackElement.classList.add(classes.success);

            parent && parent.querySelector(("." + (classes.help))).classList.add(classes.hide);
        }
        else if (!valid || (required && !hasValue)) {

            feedbackElement.classList.add(classes.error);
            feedbackElement.classList.remove(classes.success);

            parent && parent.querySelector(("." + (classes.help))).classList.remove(classes.hide);
        }
        else if (!required && !hasValue) {

            valid = null;
        }

        // Allow fields that are not required
        if (valid === null) {

            field.setBlank();
        }

        field.trigger('validated', { valid: valid, value: field.value });
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


    field.setBlank = function () {

        var feedbackElement = parent;

        if (!parent) {

            feedbackElement = field;
        }


        feedbackElement.classList.remove(classes.success, classes.error, classes.warning, classes.info);
        parent && parent.querySelector(("." + (classes.help))).classList.add(classes.hide);
    };
}

function bindForm (form, opts) {
    if ( opts === void 0 ) opts={};


    var inputs = form.querySelectorAll(config.elements);
    var submit = form.querySelector('[type=submit]');
    var validations = {};

    form.validations = validations;
    form.isValid = false;
    form.noValidate = true;

    // Observer(form);
    riot.observable(form);

    var validate = function() {

        form.isValid = confirmValidation(validations, 'valid');
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

                    var badFields = [];
                    for (var k in form.validations) {

                        if (!form.validations[k].valid) {

                            badFields.push(k);
                        }
                    }

                    reject({
                        msg: ("Bad Fields: " + (badFields.join(','))),
                        fields: badFields
                    });
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

    form.on('validate', function(e) {

        validateAll().then(function() {

            form.trigger('validated', e);
        }).catch(function (obj) {

            console.log(obj);
            var msg = obj.msg;
            var fields = obj.fields;

            form.trigger('invalid', msg, fields);
            console.log(msg);
        });
    });

    form.on('validated', function (e) {

        if (form.isValid) {

            var payload = index(form, config.serialize);
            form.trigger('submit', e, payload);
        }
    });

    form.on('submit', function (e, payload) {

        form.trigger('submitted', e, payload);
    });

    // When the form is submitting, iterate through all the fields and validate them
    form.onsubmit = function(e) {

        e.preventDefault();

        form.trigger('validate', e);
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
            form.trigger('rebinded');
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

    form.trigger('ready');
}

exports.bindForm = bindForm;
exports.config = config;
exports.formatValue = formatValue;
exports.configure = configure;
exports.validateRegex = validateRegex;
exports.confirmValidation = confirmValidation;
exports.findFieldContainer = findFieldContainer;

}((this.RiotActionForms = this.RiotActionForms || {}),riot));
