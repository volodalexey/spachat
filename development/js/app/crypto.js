define('crypto', [
        'extend_core',
        'event_core',
        'event_bus',
        //
        'lib_rsa',
        'lib_crypto_math',
        'lib_convert',
        'lib_biginteger'
    ],
    function(
        extend_core,
        event_core,
        event_bus,
        //
        lib_rsa,
        lib_crypto_math,
        lib_convert,
        lib_biginteger
    ) {

        /**
         * inspired by http://rubbingalcoholic.github.io/cowcrypt/demos/rsa.html
         */
        var crypto = function() {
            this.bindContexts();
            this.bit_length = 1024;
            this.n_length = this.bit_length * 2;
            this.e_pub = crypto_math.get_random_public_exponent();
            this.big_int = new BigInt();
        };

        crypto.prototype = {

            bindContexts: function() {
                var _this = this;
                _this.bindedon_worker_message = _this.on_worker_message.bind(_this);
            },

            unbindContext: function() {
                var _this = this;
                _this.bindedon_worker_message = null;
            },

            create_crypto_worker: function() {
                return new Worker('js/lib/crypto_math.js');
            },

            add_worker_event_listeners: function() {
                if (!this.worker) {
                    return;
                }
                this.remove_worker_event_listeners();
                this.worker.addEventListener('message', this.bindedon_worker_message, false);
            },

            remove_worker_event_listeners: function() {
                if (!this.worker) {
                    return;
                }
                this.worker.removeEventListener('message', this.bindedon_worker_message, false);
            },

            dispose_worker: function() {
                if (this.worker) {
                    this.worker.terminate();
                    this.remove_worker_event_listeners();
                    this.worker = null;
                }
            },

            generate_rsa_key: function() {
                this.dispose_worker();
                this.worker = this.create_crypto_worker();
                this.add_worker_event_listeners();
                this.get_worker_probable_prime(this.e_pub, this.n_length);
            },

            get_worker_probable_prime: function(e_pub, n_length, p) {
                if (!this.worker) {
                    return;
                }
                this.worker.postMessage({
                    cmd: 'get_probable_prime',
                    request: {
                        e: e_pub,
                        nlen: n_length,
                        p: p
                    }
                });
            },

            on_worker_message: function(event) {
                var data = event.data;

                switch (data.cmd) {
                    case 'get_csprng_random_values':
                        this.worker.postMessage({
                            cmd: 'put_csprng_random_values',
                            response: {
                                random_values: crypto_math.get_csprng_random_values(data.request.bits)
                            }
                        });
                        break;
                    case 'put_error':
                        console.error(data.error.msg);
                        this.worker.terminate();
                        break;
                    case 'put_console_log':
                        console.log(data.response.msg);
                        break;
                    case 'put_probable_prime':
                        if (!this.p) {
                            this.p = data.response.prime;
                            this.get_worker_probable_prime(this.e_pub, this.n_length, data.response.prime);
                        } else {
                            this.q = data.response.prime;
                            var inverse_data = crypto_math.compute_rsa_key_inverse_data(this.e_pub, this.p, this.q);
                            //this.rsa_key = {
                            //    e: this.big_int.bigInt2str(this.e_pub, 10),
                            //    p: this.big_int.bigInt2str(inverse_data.p, 10),
                            //    q: this.big_int.bigInt2str(inverse_data.q, 10),
                            //    n: this.big_int.bigInt2str(inverse_data.n, 10),
                            //    phi_n: this.big_int.bigInt2str(inverse_data.phi_n, 10),
                            //    d: this.big_int.bigInt2str(inverse_data.d, 10),
                            //    u: this.big_int.bigInt2str(inverse_data.u, 10)
                            //};
                            this._rsa_key = inverse_data;
                            this.dispose_worker();
                            this.rsa_encrypt({})
                        }
                        break;
                }
            },

            rsa_encrypt: function(options, callback) {
                if (!this._rsa_key) {
                    return;
                }
                this.dispose_worker();

                var _bigint			= new BigInt();
                var keylen			= _bigint.bitSize(this._rsa_key.n);
                var k				= Math.ceil(keylen / 8);
                var target_length	= k - options.plaintext.length - 3;

                if (plaintext.length > k - 11)
                    throw new Error('Message too long (limit for this key is '+(k-11)+' bytes lol');

                var rand = new Uint8Array(2*k);
                window.crypto.getRandomValues(rand);

                this.worker.postMessage({
                    cmd: 'get_rsa_encrypt',
                    request: {
                        n: this._rsa_key.n,
                        e: this.e_pub,
                        plaintext: "You could have it all. My empire of dirt. I will let you down. I will make you hurt."
                    }
                });
            }

        };

        extend_core.prototype.inherit(crypto, event_core);

        return new crypto();

    }
);