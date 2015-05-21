define('login', [
        'overlay_core',
        'event_core'],
    function(overlay_core,
             event_core) {

        var login = function() {
        };

        login.prototype = {

            link: 'login',

            initialize: function() {
                var _this = this;
                _this.login_container = document.querySelector('[data-role="login_container_global"]');
                _this.main_container = document.querySelector('[data-role="main_container"]');
                _this.submit = _this.login_container.querySelector('[data-action="submit"]');
                return _this;
            },

            render: function() {
                var _this = this;
                _this.login_container.classList.remove("hidden_login");
                _this.addEventListeners();
                _this.toggleWaiter(true);
            },

            addEventListeners: function() {
                var _this = this;
                _this.removeEventListeners();
                _this.submit.addEventListener('click', _this.onSubmit.bind(_this), false);
            },

            removeEventListeners: function() {
                var _this = this;
                _this.submit.removeEventListener('click', _this.onSubmit.bind(_this), false);
            },

            onSubmit: function(event) {
                event.preventDefault();
                history.pushState({"name": "chat"}, null, 'chat');
                window.history.go(0);
            }
        };

        extend(login, overlay_core);
        extend(login, event_core);

        return (new login()).initialize();

    }
);