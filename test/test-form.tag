<test-form>

    <form ref='testForm'>

        <field
            label='Required Field'
            type='text'
            name='reqfield[test]'
            validate='alphanum'
            on='keyup keypress blur'
            required
            help='This field is required and needs to be alphanum'
            >
        </field>

        <field
            label='Not Required Field'
            type='text'
            name='notreqfield'
            validate='alphanum'
            on='keyup keypress blur'
            help='Thdis NOT field is required but needs to be alphanum'
            >
        </field>

        <field
            label='Not Required Textarea'
            type='textarea'
            name='txt1'
            regex='[a-zA-Z0-9\s]\{20,\}'
            on='keyup keypress blur'
            help='Atleast 20 characters'
        ></field>

        <field
            label='Required Textarea'
            type='textarea'
            name='txt2'
            regex='[a-zA-Z0-9\s]\{10,\}'
            on='keyup keypress blur'
            help='Atleast 10 characters'
            required
        ></field>

        <input type='text' name='alphanum1' validate='alphanum' on='keyup keypress blur' required placeholder='LALA' />

        <input type='text' name='alphanum2' validate='alphanum' on='keyup keypress blur' placeholder='LALA' />


        <div class="field">

            <label for='alphanum'>Alphanumerical</label>
            <input type='text' name='alphanum' validate='alphanum' on='keyup keypress blur' required />
            <small class='help hide'>Help for alphanum regex</small>
        </div>

        <div class="field">

            <label for='alphanum'>Alphanumerical Spaces</label>
            <input type='text' name='alphanumspace' validate='alphanumspace' on='keyup keypress blur' required />
            <small class='help hide'>Help for alphanumspace regex</small>
        </div>

        <div class="field">

            <label for='name'>Name</label>
            <input type='text' name='name' validate='name' on='keyup keypress blur' required />
            <small class='help hide'>Help for name regex</small>
        </div>

        <div class="field">

            <label for='username'>Username</label>
            <input type='text' name='username' validate='username' on='keyup keypress blur' required />
            <small class='help hide'>Help for username regex</small>
        </div>

        <div class="field">

            <label for='fqdn'>FQDN</label>
            <input type='text' name='fqdn' validate='fqdn' on='keyup keypress blur' required />
            <small class='help hide'>Help for fqdn regex</small>
        </div>

        <div class="field">

            <label for='tld'>TLD</label>
            <input type='text' name='tld' validate='tld' on='keyup keypress blur' required />
            <small class='help hide'>Help for tld regex</small>
        </div>

        <div class="field">

            <label for='phone'>Phone</label>
            <input type='text' name='phone' validate='phone' on='keyup keypress blur' required />
            <small class='help hide'>Help for phone regex</small>
        </div>

        <div class="field">

            <label for='email'>Email</label>
            <input type='text' name='email' validate='email' on='keyup keypress blur' required />
            <small class='help hide'>Help for email regex</small>
        </div>

        <div class="field">

            <label for='equals1'>Equals 1</label>
            <input type='text' name='equals1' on='keyup keypress blur' required />
            <small class='help hide'>Help for equals1 regex</small>
        </div>

        <div class="field">

            <label for='equals2'>Equals 2</label>
            <input type='text' name='equals2' equals='[name=equals1' on='keyup keypress blur' required />
            <small class='help hide'>Help for equals2 regex</small>
        </div>

        <div class="field">

            <label for='regex'>Regex</label>
            <input type='text' name='regex' regex='regex' on='keyup keypress blur' required />
            <small class='help hide'>Help for regex regex</small>
        </div>

        <div class="field">

            <label for='creditcard'>Format Credit Card</label>
            <input type='text' name='creditcard' format='creditcard' on='keyup keypress blur' required />
            <small class='help hide'>Help for regex regex</small>
        </div>

        <div class='field'>

            <button name='submit'>Submit</button>
        </div>
    </form>

    <script>

        const self = this;

        self.mixin('actionForms');

        self.on('mount', () => {

            self.actionForm.bindForm(self.refs.testForm);

            self.refs.testForm.on('sample-data', () => {

                self.refs.testForm.elements['reqfield[test]'].value = 'testdata';
                self.refs.testForm.elements['notreqfield'].value = 'testdata';
                self.refs.testForm.elements['alphanum'].value = 'testdata';
                self.refs.testForm.elements['alphanum1'].value = 'testdata';
                self.refs.testForm.elements['alphanumspace'].value = 'testdata';
                self.refs.testForm.elements['name'].value = 'testdata';
                self.refs.testForm.elements['username'].value = 'testdata';
                self.refs.testForm.elements['fqdn'].value = 'testdata';
                self.refs.testForm.elements['tld'].value = 'testdata';
                self.refs.testForm.elements['phone'].value = '1234123412';
                self.refs.testForm.elements['email'].value = 'asd@asd.asd';
                self.refs.testForm.elements['equals1'].value = 'testdata';
                self.refs.testForm.elements['equals2'].value = 'testdata';
                self.refs.testForm.elements['regex'].value = 'testdataregex';
                self.refs.testForm.elements['creditcard'].value = '1234123412341234';
            });
        });

    </script>
</test-form>
