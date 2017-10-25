<test-form>

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

            this.actionForm.bindForm(this.refs.testForm);

            console.log(this.refs.testForm);
        });

    </script>
</test-form>
