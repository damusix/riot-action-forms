import serialize from 'form-serialize';
import { bindField } from './bind-field';
import { confirmValidation, config } from './utils';

export function bindForm (form, opts={}) {

    let inputs = form.querySelectorAll(config.elements);
    const submit = form.querySelector('[type=submit]');
    const validations = {};

    form.validations = validations;
    form.isValid = false;
    form.noValidate = true;

    // Observer(form);
    riot.observable(form);

    const validate = function() {

        form.isValid = confirmValidation(validations, 'valid');
        return form.isValid;
    };

    const validateAll = function() {

        return new Promise((resolve, reject) => {

            function assessSubmit() {

                // Returns true if valid
                if (validate()) {

                    resolve();
                }
                else {

                    const badFields = [];
                    for (let k in form.validations) {

                        if (!form.validations[k].valid) {

                            badFields.push(k);
                        }
                    }

                    reject({
                        msg: `Bad Fields: ${badFields.join(',')}`,
                        fields: badFields
                    });
                }
            }

            inputs.forEach((field, i) => {

                if (i === (inputs.length-1)) {

                    field.one('validated', () => {

                        assessSubmit();
                    });
                }

                field.trigger('validate', {});
            });
        });
    }

    form.on('validate', function(e) {

        validateAll().then(function() {

            form.trigger('validated', e);
        }).catch((obj) => {

            console.log(obj);
            const { msg, fields } = obj;

            form.trigger('invalid', msg, fields);
            console.log(msg);
        });
    });

    form.on('validated', function (e) {

        if (form.isValid) {

            const payload = serialize(form, config.serialize);
            form.trigger('submit', e, payload);
        }
    });

    form.on('submit', (e, payload) => {

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
        }

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
};
