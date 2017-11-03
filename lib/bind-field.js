
import { validateRegex, confirmValidation, findFieldContainer, formatValue, config } from './utils';

const classes = config.classes;

/**
 * Adds validation functionality to form fields
 * to display errors and help fields. Binds field with
 * Riot Observable and gives elements event features.
 *
 * @param { HTMLFormElement } field - Field whose parent we will return
 * @param { Object } validations - Parent form validation object
 *
 */
export function bindField (field, validations) {

    let parent

    try {
        parent = findFieldContainer(field, classes.container || '.field' );

    }
    catch (e) {

        console.log(e.message);
        parent = false;
    }

    const name = field.getAttribute('name');
    const type = field.getAttribute('type');
    const required = [undefined, null].indexOf(field.getAttribute('required')) === -1;

    // Formatting function
    const format = field.getAttribute('format');

    // Validation function
    // input[data-validate] should be a function in
    const validate = field.getAttribute('validate');

    // Match value against another element
    // Should be a CSS selector
    const equals = field.getAttribute('equals');

    // Custom regular expression
    const regex = field.getAttribute('regex');

    // Events to bind to
    const on = field.getAttribute('on') || 'change';

    // Input validation object to handle multiple methods
    const validation = {};

    let valid = false;
    let hasValue = false;

    if (field.getAttribute('disabled') || type === 'hidden') {

        return;
    }

    // Observer(field);
    riot.observable(field);

    // Form validation object
    validations[name] = { required, valid };

    const validateFn = function(e) {

        const keyCode = (window.event) ? e.which : e.keyCode;
        const isBlur = e.type ==='blur';
        const value = field.value;

        const empty = !value.length;
        hasValue = !!value;

        // If it's required, it can't be empty
        if (required) {

            validation.required = !!value;

            if (type === 'checkbox') {

                validation.checked = field.checked
            }

        }

        // Assert against existing validation function
        if (validate) {

            validation.validate = validateRegex(value, validate);
        }

        // Assert against custom regex
        if (regex) {

            const rgx = new RegExp(regex);
            validation.regex = rgx.test(value);
        }

        // Assert against another field's value
        if (equals) {

            const equalsElement = field.form.querySelector(equals);

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

    const validated = function(valid) {

        // Bind to validation object for form check
        if (validate || regex || equals || required) {

            validations[name].valid = valid;
        }

        // Bind validity to html element
        field.valid = valid;

        // If it's valid, remove error classes and hide the help block.
        // This is meant to work with bootstrap forms.

        let feedbackElement = parent;

        if (!parent) {

            feedbackElement = field;
        }


        if (valid && hasValue) {

            feedbackElement.classList.remove(classes.error);
            feedbackElement.classList.add(classes.success);

            parent && parent.querySelector(`.${classes.help}`).classList.add(classes.hide);
        }
        else if (!valid || (required && !hasValue)) {

            feedbackElement.classList.add(classes.error);
            feedbackElement.classList.remove(classes.success);

            parent && parent.querySelector(`.${classes.help}`).classList.remove(classes.hide);
        }
        else if (!required && !hasValue) {

            valid = null;
        }

        // Allow fields that are not required
        if (valid === null) {

            field.setBlank();
        }

        field.trigger('validated', { valid, value: field.value });
    };

    field.on('validate', validateFn);

    // Bind events to validation function
    on.split(' ').map((o) => {

        field[`on${o}`] = (e) => {

            if (format) {

                formatValue(format, field);
            }

            validateFn(e);
        }
    });


    field.setBlank = () => {

        let feedbackElement = parent;

        if (!parent) {

            feedbackElement = field;
        }


        feedbackElement.classList.remove(classes.success, classes.error, classes.warning, classes.info);
        parent && parent.querySelector(`.${classes.help}`).classList.add(classes.hide);
    };
}
