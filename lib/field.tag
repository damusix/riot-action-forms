<field>

    <label
        ref='label'
        for='{ opts.name }'
        if={ opts.label }>
        { opts.label }
    </label>

    <input
        if={ opts.type !== 'textarea' }
        ref='input'
        type="{ opts.type || 'text' }"
        name='{ opts.name }'
        value='{ opts.value }'
        on='{ opts.on }'
        validate='{ opts.validate }'
        regex='{ opts.regex }'
        required={ required }
        placeholder='{ opts.placeholder }'>

    <textarea
        if={ opts.type === 'textarea' }
        ref='input'
        name='{ opts.name }'
        on='{ opts.on }'
        validate='{ opts.validate }'
        regex='{ opts.regex }'
        required={ required }
        placeholder='{ opts.placeholder }'>
        <yield />
    </textarea>

    <small class='{ config.classes.help } { config.classes.hide }'>{ opts.help || '' }</small>


    <script>

        import * as utils from './utils';

        const self = this;

        self.config = utils.config;
        self.required = Object.keys(self.opts).indexOf('required') > -1;

        self.on('before-mount', () => {
            self.root.classList.add(self.config.classes.container);
        });

        self.on('mount', () => {

            if (self.refs.label) {
                self.refs.label.onclick = () => {

                    self.refs.input.focus()
                }
            }
        });

    </script>
</field>
