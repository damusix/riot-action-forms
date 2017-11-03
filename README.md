# Riot Action Forms

Binds form with Riot Observable and implements validation based on element attributes. Serializes inputs using `form-serialize` and passes payload to `submit` event.

## Configuration

You can configure the forms using the `RiotActionForms.configure()` function. This will append to or override the default configurations.

The default configurations are
``` javascript
{

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

            const formatted = value.match(/([0-9]{4})|([0-9]+)/ig);
            return formatted ? formatted.join(' ') : '';
        }
    },

    // Serialization options for `form-serialize`
    serialize: {

        hash: true
    }
}

```

For example, you could do:

``` javascript

RiotActionForms.configure({

    // Add new regular expressions
    regexes: {

        strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^0-9a-zA-Z])(?=.{8,})/,
        confirmationCode: /[0-9a-f]/i,
        hexColor: /[0-9A-Fa-f]{6}/g,


        // Overwrite the builtin ones
        phone: /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },

    // Add new formatting functions. These will replace the field's value with the formatted value
    format: {

        phone: function (value) {

            const m = value.match(RiotActionForms.config.regexes.phone);

            if (!m) {

                return value;
            }

            let val = `(${m[1] || m[2]}) ${m[3]}-${m[4]}`

            if (m[5]) {
                val += ` extension ${m5}`;
            }

            return val;
        }
    }

    // If you wanted RiotActionForms to work with Twitter Bootstrap
    classes: {

        container: 'form-group',
        error: 'has-error',
        help: 'help-block',
        hide: 'hidden',
        info: 'has-info',
        success: 'has-success',
        warning: 'has-warning'
    },

    serialize: {

        // If you want the payload to serialize a query string instead of a JSON object
        hash: false,

        // If true, disabled fields will also be serialized
        disabled: true,

        // If true, empty fields will also be serialized
        empty: true
    }
})

```



## Events

###### FORM

Form will be Riot Observable and have `on` `one` `off` `trigger` functions appended to it. You can hook into the form's events as needed.

| Event | Description | Data Passed |
| ----- | ----------- | ----------- |
| 'validate' | Validates all fields in the form | `Event`: native `onsubmit` |
| 'validated' | After form has been validated | Same as `validate` |
| 'invalid' | If validation fails | `String`: Message noting the invalid fields <br> `Array`: list of invalid fields |
| 'submit' | After validation is successful | `Event`: native `onsubmit` <br> `Object\|String`: Serialized payload (type based on configuration)
| 'submitted' | After submit event | Same as `submit`
| 'rebind' | Triggers binding of elements for if new fields are added | N/A |
| 'rebinded' | After new elements have been binded | N/A |
| 'reset' | Resets the validity status of each element | N/A |
| 'ready' | After form has been binded and is ready to use | N/A |

---
###### FIELDS

Fields will be Riot Observable and have `on` `one` `off` `trigger` functions appended to it. You can hook into the fields' events as needed.

| Event | Description |
| ----- | ----------- |
| 'validate' | Validates field |
| 'validated' | After field has been validated |

---

## `my-form.tag`
``` html

<myform>

    <form ref='testForm'>

        <div class="field">

            <label for='alphanum'>Alphanumerical</label>
            <input type='text' name='alphanum' validate='alphanum' on='keyup blur' required />
            <small class='help hide'>Help for alphanum regex</small>
        </div>

        <div class="field">

            <label for='alphanum'>Alphanumerical Spaces</label>
            <input type='text' name='alphanumspace' validate='alphanumspace' on='keyup blur' required />
            <small class='help hide'>Help for alphanumspace regex</small>
        </div>

        <div class="field">

            <label for='name'>Name</label>
            <input type='text' name='name' validate='name' on='keyup blur' required />
            <small class='help hide'>Help for name regex</small>
        </div>

        <div class="field">

            <label for='username'>Username</label>
            <input type='text' name='username' validate='username' on='keyup blur' required />
            <small class='help hide'>Help for username regex</small>
        </div>

        <div class="field">

            <label for='fqdn'>FQDN</label>
            <input type='text' name='fqdn' validate='fqdn' on='keyup blur' required />
            <small class='help hide'>Help for fqdn regex</small>
        </div>

        <div class="field">

            <label for='tld'>TLD</label>
            <input type='text' name='tld' validate='tld' on='keyup blur' required />
            <small class='help hide'>Help for tld regex</small>
        </div>

        <div class="field">

            <label for='phone'>Phone</label>
            <input type='text' name='phone' validate='phone' on='keyup blur' required />
            <small class='help hide'>Help for phone regex</small>
        </div>

        <div class="field">

            <label for='email'>Email</label>
            <input type='text' name='email' validate='email' on='keyup blur' required />
            <small class='help hide'>Help for email regex</small>
        </div>

        <div class="field">

            <label for='equals1'>Equals 1</label>
            <input type='text' name='equals1' on='keyup blur' required />
            <small class='help hide'>Help for equals1 regex</small>
        </div>

        <div class="field">

            <label for='equals2'>Equals 2</label>
            <input type='text' name='equals2' equals='[name=equals1' on='keyup blur' required />
            <small class='help hide'>Help for equals2 regex</small>
        </div>

        <div class="field">

            <label for='regex'>Regex</label>
            <input type='text' name='regex' regex='regex' on='keyup blur' required />
            <small class='help hide'>Help for regex regex</small>
        </div>

        <div class="field">

            <label for='creditcard'>Format Credit Card</label>
            <input type='text' name='creditcard' format='creditcard' on='keyup blur' required />
            <small class='help hide'>Help for regex regex</small>
        </div>

        <div class='field'>

            <button>Submit</button>
        </div>
    </form>

    <script>

        this.mixin('actionForms');

        this.on('mount', () => {

            this.actionForms.bindForm(this.refs.testForm);

            console.log(this.refs.testForm);
        });
    </script>
</myform>

```

## `app.js`
``` javascript

riot.mixin('actionForms', { actionForms: RiotActionForms });

riot.mount('*');
```
