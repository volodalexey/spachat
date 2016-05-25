webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(45);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _total = __webpack_require__(175);

	var _total2 = _interopRequireDefault(_total);

	var _index = __webpack_require__(218);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_reactDom2.default.render(_react2.default.createElement(_index2.default, null), document.getElementById('app'));

/***/ },

/***/ 175:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 218:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(219);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _login = __webpack_require__(292);

	var _login2 = _interopRequireDefault(_login);

	var _chat_app = __webpack_require__(307);

	var _chat_app2 = _interopRequireDefault(_chat_app);

	var _register = __webpack_require__(343);

	var _register2 = _interopRequireDefault(_register);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var requireAuth = function requireAuth(nextState, replace) {
	  _users_bus2.default.checkLoginState();
	  if (!_users_bus2.default.getUserId()) {
	    redirectToLogin(nextState, replace);
	  }
	},
	    noMatchRedirect = function noMatchRedirect(nextState, replace) {
	  _users_bus2.default.checkLoginState();
	  if (_users_bus2.default.getUserId()) {
	    replace('/chat');
	  } else {
	    replace('/login');
	  }
	},
	    redirectToLogin = function redirectToLogin(nextState, replace) {
	  if (nextState.location.search) {
	    _reactRouter.browserHistory.desired_path = nextState.location.pathname;
	    _reactRouter.browserHistory.desired_search = nextState.location.search;
	  }
	  replace('/login');
	},
	    Index = _react2.default.createClass({
	  displayName: 'Index',
	  componentWillMount: function componentWillMount() {
	    var language = localStorage.getItem('language');
	    if (language && _localization2.default.lang !== language) {
	      _localization2.default.setLanguage(language);
	    }
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      _reactRouter.Router,
	      { history: _reactRouter.browserHistory },
	      _react2.default.createElement(_reactRouter.Route, { path: '/', onEnter: noMatchRedirect }),
	      _react2.default.createElement(
	        _reactRouter.Route,
	        { path: '/' },
	        _react2.default.createElement(_reactRouter.Route, { path: 'login', component: _login2.default }),
	        _react2.default.createElement(_reactRouter.Route, { path: 'register', component: _register2.default }),
	        _react2.default.createElement(_reactRouter.Route, { path: 'chat', component: _chat_app2.default, onEnter: requireAuth })
	      ),
	      _react2.default.createElement(_reactRouter.Route, { path: '*', onEnter: noMatchRedirect })
	    );
	  }
	});

	exports.default = Index;

/***/ },

/***/ 280:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var localization_config = __webpack_require__(281);


	var Localization = function Localization(lang) {
	  this.lang = lang;
	};

	Localization.prototype = {
	  changeLanguage: function changeLanguage(lang, component) {
	    this.lang = lang;
	    var language = localStorage.getItem('language');
	    if (!language || language !== lang) {
	      localStorage.setItem('language', lang);
	    }
	    component.forceUpdate();
	  },
	  setLanguage: function setLanguage(lang) {
	    this.lang = lang;
	  },
	  transferText: function transferText(_text) {
	    return typeof _text === 'number' ? this.getLocText(_text) : _text;
	  },
	  getLocText: function getLocText(id) {
	    var _this = this;

	    var text;
	    localization_config.every(function (_config) {
	      if (_config.id === id) {
	        text = _config[_this.lang];
	      }
	      return !text;
	    });
	    return text;
	  }
	};

	exports.default = new Localization("en");

/***/ },

/***/ 281:
/***/ function(module, exports) {

	module.exports = [
		{
			"id": 1,
			"en": "Create chat",
			"ru": "Создать чат"
		},
		{
			"id": 2,
			"en": "Create chat with provided methods",
			"ru": "Создать чат одним из предложенных вариантов"
		},
		{
			"id": 3,
			"en": "Auto handshake",
			"ru": "Автоматическое создание"
		},
		{
			"id": 4,
			"en": "Manual handshake",
			"ru": "Ручное создание"
		},
		{
			"id": 5,
			"en": "Chat id: ",
			"ru": "Id чата: "
		},
		{
			"id": 6,
			"en": "Join chat by chat id",
			"ru": "Присоединить чат по Id"
		},
		{
			"id": 7,
			"en": "Remote offer",
			"ru": "Удаленное предложение"
		},
		{
			"id": 8,
			"en": "Join chat by sdp",
			"ru": "Присоединить чат по sdp"
		},
		{
			"id": 9,
			"en": "User id: ",
			"ru": "Id контакта: "
		},
		{
			"id": 10,
			"en": "Show chat",
			"ru": "Показать чат"
		},
		{
			"id": 11,
			"en": "Go to",
			"ru": "Перейти на"
		},
		{
			"id": 12,
			"en": "Off Scroll",
			"ru": "Выключить прокрутку"
		},
		{
			"id": 13,
			"en": "Connections",
			"ru": "Подключения"
		},
		{
			"id": 14,
			"en": "Format",
			"ru": "Форматирование"
		},
		{
			"id": 15,
			"en": "Show formatting toolbar",
			"ru": "Отобразить панель форматирования"
		},
		{
			"id": 16,
			"en": "Send",
			"ru": "Отправить"
		},
		{
			"id": 17,
			"en": "Send message",
			"ru": "Отправить сообщение"
		},
		{
			"id": 18,
			"en": "Clear",
			"ru": "Очистить"
		},
		{
			"id": 19,
			"en": "Show per page",
			"ru": "Показать на странице"
		},
		{
			"id": 20,
			"en": "Close",
			"ru": "Закрыть"
		},
		{
			"id": 21,
			"en": "Close chat",
			"ru": "Закрыть чат"
		},
		{
			"id": 22,
			"en": "Setting",
			"ru": "Настройки"
		},
		{
			"id": 23,
			"en": "Display settings Chat",
			"ru": "Отобразить настройки чата"
		},
		{
			"id": 24,
			"en": "ContactList",
			"ru": "Контакты"
		},
		{
			"id": 25,
			"en": "Display a contacts list",
			"ru": "Отобразить список контактов"
		},
		{
			"id": 26,
			"en": "Filter",
			"ru": "Фильтр"
		},
		{
			"id": 27,
			"en": "Display filter",
			"ru": "Отобразить фильтры"
		},
		{
			"id": 28,
			"en": "Enable pagination",
			"ru": "Включить нумерацию страниц"
		},
		{
			"id": 29,
			"en": "Join chat",
			"ru": "Присоединить чат"
		},
		{
			"id": 30,
			"en": "Chats list",
			"ru": "Список чатов"
		},
		{
			"id": 31,
			"en": "Display my chats",
			"ru": "Отобразить список чатов"
		},
		{
			"id": 32,
			"en": "My users",
			"ru": "Мои контакты"
		},
		{
			"id": 33,
			"en": "User info",
			"ru": "Данные пользователя"
		},
		{
			"id": 34,
			"en": "Console log",
			"ru": "Системные сообщения"
		},
		{
			"id": 35,
			"en": "Send Enter",
			"ru": "Отправлять по Enter"
		},
		{
			"id": 36,
			"en": "User name: ",
			"ru": "Имя контакта: "
		},
		{
			"id": 37,
			"en": "Change",
			"ru": "Изменить"
		},
		{
			"id": 38,
			"en": "Logout",
			"ru": "Выйти"
		},
		{
			"id": 39,
			"en": "Old password",
			"ru": "Старый пароль"
		},
		{
			"id": 40,
			"en": "New password",
			"ru": "Новый пароль"
		},
		{
			"id": 41,
			"en": "Confirm password",
			"ru": "Подтверждение пароля"
		},
		{
			"id": 42,
			"en": "Cancel",
			"ru": "Отменить"
		},
		{
			"id": 43,
			"en": "Save",
			"ru": "Сохранить"
		},
		{
			"id": 44,
			"en": "From date",
			"ru": "С"
		},
		{
			"id": 45,
			"en": "to date",
			"ru": "по"
		},
		{
			"id": 46,
			"en": "Control panel contacts, chats, blogs",
			"ru": "Панель управления контактами, чатами, блогами"
		},
		{
			"id": 47,
			"en": "Panel settings of user data, connections",
			"ru": "Панель настроек данных пользователя, подключений"
		},
		{
			"id": 48,
			"en": "Register new user",
			"ru": "Зарегистрироваться"
		},
		{
			"id": 49,
			"en": "User name:",
			"ru": "Имя пользователя:"
		},
		{
			"id": 50,
			"en": "User password:",
			"ru": "Пароль пользователя:"
		},
		{
			"id": 51,
			"en": "Login",
			"ru": "Войти"
		},
		{
			"id": 52,
			"en": "To login page",
			"ru": "Вернуться на страницу авторизации"
		},
		{
			"id": 53,
			"en": "Register",
			"ru": "Зарегистрировать"
		},
		{
			"id": 54,
			"en": "Go to the registration page",
			"ru": "Перейти на страницу регистрации"
		},
		{
			"id": 55,
			"en": "Register a new user",
			"ru": "Зарегистрировать нового пользователя"
		},
		{
			"id": 56,
			"en": "Save and close",
			"ru": "Сохранить и закрыть"
		},
		{
			"id": 57,
			"en": "Save setting and close",
			"ru": "Сохранить настройки и закрыть чат"
		},
		{
			"id": 58,
			"en": "Restore chat",
			"ru": "Восстановить чат"
		},
		{
			"id": 59,
			"en": "Chat Messages",
			"ru": "Чат сообщений"
		},
		{
			"id": 60,
			"en": "Web RTC Initialization",
			"ru": "Web RTC инициализация"
		},
		{
			"id": 61,
			"en": "Messages",
			"ru": "Сообщения"
		},
		{
			"id": 62,
			"en": "Show chat messages",
			"ru": "Показать сообщения чата"
		},
		{
			"id": 63,
			"en": "Create a blog",
			"ru": "Создать блог"
		},
		{
			"id": 64,
			"en": "Connect blog",
			"ru": "Подключиться к блогу"
		},
		{
			"id": 65,
			"en": "My blogs",
			"ru": "Мои блоги"
		},
		{
			"id": 66,
			"en": "Make friends",
			"ru": "Подружиться"
		},
		{
			"id": 67,
			"en": "User id",
			"ru": "Id пользователя"
		},
		{
			"id": 68,
			"en": "Send request",
			"ru": "Запросить дружбу"
		},
		{
			"id": 69,
			"en": "Ready for request",
			"ru": "Ожидать запрос"
		},
		{
			"id": 70,
			"en": "350 px",
			"ru": "350 px"
		},
		{
			"id": 71,
			"en": "700 px",
			"ru": "700 px"
		},
		{
			"id": 72,
			"en": "1050 px",
			"ru": "1050 px"
		},
		{
			"id": 73,
			"en": "Custom",
			"ru": "Пользовательская"
		},
		{
			"id": 74,
			"en": "Width chat",
			"ru": "Ширина чата"
		},
		{
			"id": 75,
			"en": "Save as a custom width",
			"ru": "Сохранить как пользователькую"
		},
		{
			"id": 76,
			"en": "Adjust width",
			"ru": "Настроить ширину"
		},
		{
			"id": 77,
			"en": "Request message",
			"ru": "Сообщение для запроса"
		},
		{
			"id": 78,
			"en": "Save setting",
			"ru": "Сохранить настройки"
		},
		{
			"id": 79,
			"en": "Ready for new chat users requests",
			"ru": "Ожидать новых пользователей"
		},
		{
			"id": 80,
			"en": "Confirm",
			"ru": "Подтверждение"
		},
		{
			"id": 81,
			"en": "Save settings this chat ?",
			"ru": "Сохранить текущие настройки данного чата ?"
		},
		{
			"id": 82,
			"en": "Save settings this chat and close it ?",
			"ru": "Сохранить текущие настройки данного чата и закрыть его ?"
		},
		{
			"id": 83,
			"en": "Close this chat ?",
			"ru": "Закрыть данный чат ?"
		},
		{
			"id": 84,
			"en": "Error",
			"ru": "Ошибка"
		},
		{
			"id": 85,
			"en": "Success",
			"ru": "Успех"
		},
		{
			"id": 86,
			"en": "Chat is not found in the database!",
			"ru": "Чат не найден в базе данных!"
		},
		{
			"id": 87,
			"en": "User with such username or password not found!",
			"ru": "Пользователь с таким именем и паролем не найден!"
		},
		{
			"id": 88,
			"en": "All fields are required!",
			"ru": "Все поля обязательны для заполнения!"
		},
		{
			"id": 89,
			"en": "Not enough information to make a request! User id and request message are required!",
			"ru": "Не достаточно информации, чтобы сделать запрос! Заполните идентификатор пользователя и сообщение запроса!"
		},
		{
			"id": 90,
			"en": "Not enough information to make a request! Chat id and request message are required!",
			"ru": "Не достаточно информации, чтобы сделать запрос! Заполните идентификатор чата и сообщение запроса!"
		},
		{
			"id": 91,
			"en": "Passwords don't match!",
			"ru": "Пароли не совпадают!"
		},
		{
			"id": 92,
			"en": "Invalid input options for render.",
			"ru": "Недопустимые опции ввода для визуализации."
		},
		{
			"id": 93,
			"en": "Chat is already opened!",
			"ru": "Чат уже открыт!"
		},
		{
			"id": 94,
			"en": "New password and confirm password do not match!",
			"ru": "Новый пароль и подтверждение пароля не совпадают!"
		},
		{
			"id": 95,
			"en": "Old password is not correct!",
			"ru": "Старый пароль введен неверно!"
		},
		{
			"id": 96,
			"en": "Registered",
			"ru": "Зарегистрирован"
		},
		{
			"id": 97,
			"en": "Submit",
			"ru": "Подтвердить"
		},
		{
			"id": 98,
			"en": "Undo without saving",
			"ru": "Отменить действие без сохранения данных"
		},
		{
			"id": 99,
			"en": "Confirm the action described in the message",
			"ru": "Подтвердить действие описанное в сообщении"
		},
		{
			"id": 100,
			"en": "Language:",
			"ru": "Язык:"
		},
		{
			"id": 101,
			"en": "Chats and panels will be closed without saving the data. Continue?",
			"ru": "Чаты и панели будут закрыты без сохранения данных. Продолжить?"
		},
		{
			"id": 102,
			"en": "User with such username is already exist!",
			"ru": "Пользователь с таким именем уже существует!"
		},
		{
			"id": 103,
			"en": "WebSocket connection abort",
			"ru": "Соединение по веб сокету прервано"
		},
		{
			"id": 104,
			"en": "Password is entered incorrectly",
			"ru": "Пароль введен неверно."
		},
		{
			"id": 105,
			"en": "Changes saved.",
			"ru": "Изменения сохранены."
		},
		{
			"id": 106,
			"en": "Do you really want to logout?",
			"ru": "Вы действительно желаете выйти?"
		},
		{
			"id": 107,
			"en": "Copy chat Id",
			"ru": "Копировать Id чата"
		},
		{
			"id": 108,
			"en": "Scroll Each Chat",
			"ru": "Скролл в каждом чате"
		},
		{
			"id": 109,
			"en": "Header and footer control",
			"ru": "Управление шапкой и футером"
		},
		{
			"id": 110,
			"en": "Hello. User, {userName}, wants to make you in their contact list.",
			"ru": "Здравствуйте. Пользователь, {userName}, хочет внести вас в свой список контактов."
		},
		{
			"id": 111,
			"en": "Invite by url",
			"ru": "Пригласить по url"
		},
		{
			"id": 112,
			"en": "Copy this line and send the user to whom you want to add to chat. ",
			"ru": "Скопируйте данную строку и отошлите пользователю, которого Вы хотите добавить в чат. "
		},
		{
			"id": 113,
			"en": "Hello. User, {userName}, wants to join your chat.",
			"ru": "Здравствуйте. Пользователь, {userName}, хочет присоединиться к Вашему чату."
		},
		{
			"id": 114,
			"en": "This chat already exists in your chat list. Do you want to open it?",
			"ru": "Указанный чат уже существует в Вашем списке чатов. Желаете его открыть?"
		},
		{
			"id": 115,
			"en": "Target connection is not found or not ready!",
			"ru": "Соединение с указанным пользователем не найдено или не готово!"
		},
		{
			"id": 116,
			"en": "Downloadable image is too large. Select another image.",
			"ru": "Загружаемое изображение превышает допустимый размер. Выберите другое изображение."
		},
		{
			"id": 117,
			"en": "Avatar",
			"ru": "Аватар"
		},
		{
			"id": 118,
			"en": "No data to save.",
			"ru": "Данных для сохранения нет."
		},
		{
			"id": 119,
			"en": "Default avatar",
			"ru": "Аватар по умолчанию"
		},
		{
			"id": 120,
			"en": "Synchronize messages",
			"ru": "Синхронизировать сообщения"
		},
		{
			"id": 121,
			"en": "There are no active contacts",
			"ru": "Нет активных контактов"
		},
		{
			"id": 122,
			"en": "Open chat with the original settings",
			"ru": "Открыть чат с первоначальными настройками"
		},
		{
			"id": 123,
			"en": "Open chat with the stored user settings",
			"ru": "Открыть чат с сохраненными пользовательскими настройками"
		},
		{
			"id": 124,
			"en": "Reconnect",
			"ru": "Переподключение"
		},
		{
			"id": 125,
			"en": "Of participants: ",
			"ru": "Участников: "
		},
		{
			"id": 126,
			"en": "Copy",
			"ru": "Копировать"
		}
	];

/***/ },

/***/ 282:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _cookie_core = __webpack_require__(284);

	var _cookie_core2 = _interopRequireDefault(_cookie_core);

	var _indexeddb = __webpack_require__(285);

	var _indexeddb2 = _interopRequireDefault(_indexeddb);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	var _websocket = __webpack_require__(290);

	var _websocket2 = _interopRequireDefault(_websocket);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Users_bus = function Users_bus() {
	  this.user_id = null;
	  // database for all user content
	  // db_name - depends from user id
	  this.userDatabaseDescription = {
	    "table_descriptions": [{
	      "table_name": 'users',
	      "table_indexes": [{
	        "indexName": 'user_ids',
	        "indexKeyPath": 'user_ids',
	        "indexParameter": { multiEntry: true }
	      }, {
	        "indexName": 'chat_ids',
	        "indexKeyPath": 'chat_ids',
	        "indexParameter": { multiEntry: true }
	      }],
	      "table_parameter": { "keyPath": "user_id" }
	    }, {
	      "table_name": 'information',
	      "table_indexes": [{
	        "indexName": 'user_ids',
	        "indexKeyPath": 'user_ids',
	        "indexParameter": { multiEntry: true }
	      }, {
	        "indexName": 'chat_ids',
	        "indexKeyPath": 'chat_ids',
	        "indexParameter": { multiEntry: true }
	      }],
	      "table_parameter": { "keyPath": "user_id" }
	    }]
	  };
	};

	Users_bus.prototype = {

	  checkLoginState: function checkLoginState() {
	    var user_id = this.getCookie('user_id');
	    if (user_id && !this.user_id) {
	      this.setUserId(user_id);
	    }
	  },

	  setUserId: function setUserId(user_id, skip_websocket) {
	    if (user_id) {
	      this.user_id = user_id;
	      if (!skip_websocket) {
	        _websocket2.default.createAndListen();
	      }
	      this.userDatabaseDescription.db_name = user_id;
	      _event_bus2.default.trigger('setUserId', user_id);
	      this.setCookie('user_id', user_id, { expires: 24 * 60 * 60 });
	    } else {
	      _event_bus2.default.trigger('setUserId', user_id);
	      this.user_id = user_id;
	      this.deleteCookie('user_id');
	      _websocket2.default.dispose();
	    }
	  },

	  getUserId: function getUserId() {
	    return this.user_id;
	  },

	  excludeUser: function excludeUser(options, user_ids) {
	    var _this = this;
	    var index = user_ids.indexOf(_this.getUserId());
	    if (index !== -1) {
	      user_ids.splice(index, 1);
	    }
	    return user_ids;
	  },

	  getContactsInfo: function getContactsInfo(options, user_ids, _callback) {
	    if (user_ids.length) {
	      _indexeddb2.default.getByKeysPath(this.userDatabaseDescription, 'users', user_ids, function (user_id) {
	        return {
	          user_id: user_id,
	          userName: '-//-//-//-'
	        };
	      }, function (getError, contactsInfo) {
	        if (getError) {
	          if (_callback) {
	            _callback(getError);
	          } else {
	            console.error(getError);
	          }
	          return;
	        }

	        if (_callback) {
	          _callback(null, contactsInfo, options);
	        }
	      });
	    } else {
	      _callback(null, null);
	    }
	  },

	  getMyInfo: function getMyInfo(options, _callback) {
	    var _this = this;
	    _indexeddb2.default.getByKeyPath(_this.userDatabaseDescription, 'information', _this.user_id, function (getError, userInfo) {
	      if (getError) {
	        if (_callback) {
	          _callback(getError);
	        } else {
	          console.error(getError);
	        }
	        return;
	      }

	      if (_callback) {
	        _callback(null, options, userInfo);
	      }
	    });
	  },

	  getUserDescription: function getUserDescription(options, callback) {
	    this.getMyInfo(options, function (error, _options, userInfo) {
	      if (error) {
	        if (callback) {
	          callback(error);
	        } else {
	          console.error(error);
	        }
	        return;
	      }

	      if (callback) {
	        callback(null, {
	          user_id: userInfo.user_id,
	          userName: userInfo.userName,
	          avatar_data: userInfo.avatar_data
	        });
	      }
	    });
	  },

	  getUserName: function getUserName(_user_id, user_ids) {
	    var user_name = void 0;
	    user_ids.every(function (_contactInfo) {
	      if (_contactInfo.user_id === _user_id) {
	        user_name = _contactInfo.userName;
	      }
	      return !user_name;
	    });

	    return user_name;
	  },


	  hasInArray: function hasInArray(_array, item) {
	    var found;
	    _array.every(function (_item) {
	      if (_item === item) {
	        found = _item;
	      }
	      return !found;
	    });
	    return found;
	  },

	  putItemIntoArray: function putItemIntoArray(arrayName, item, callback) {
	    var self = this;
	    self.getMyInfo({}, function (error, _options, userInfo) {
	      if (error) {
	        callback && callback(error);
	        return;
	      }

	      if (!self.hasInArray(userInfo[arrayName], item)) {
	        userInfo[arrayName].push(item);
	        self.saveMyInfo(userInfo, function (err) {
	          callback && callback(err, userInfo);
	        });
	      } else {
	        callback && callback(null, userInfo);
	      }
	    });
	  },

	  putUserIdAndSave: function putUserIdAndSave(user_id, callback) {
	    this.putItemIntoArray('user_ids', user_id, callback);
	  },

	  putChatIdAndSave: function putChatIdAndSave(chat_id, callback) {
	    this.putItemIntoArray('chat_ids', chat_id, callback);
	  },

	  saveMyInfo: function saveMyInfo(userInfo, _callback) {
	    _indexeddb2.default.addOrPutAll('put', this.userDatabaseDescription, 'information', [userInfo], _callback);
	  },

	  addNewUserToIndexedDB: function addNewUserToIndexedDB(user_description, callback) {
	    _indexeddb2.default.addOrPutAll('put', this.userDatabaseDescription, 'users', [user_description], function (error) {
	      if (error) {
	        callback(error);
	        return;
	      }

	      callback(null, user_description);
	    });
	  },

	  storeNewUser: function storeNewUser(user_id, userName, userPassword, avatar_data, lastModifyDatetime, callback) {
	    var self = this;
	    _indexeddb2.default.addGlobalUser(user_id, userName, userPassword, function (err) {
	      if (err) {
	        callback(err);
	        return;
	      }

	      // TODO use user model
	      var userInfo = {
	        user_id: user_id,
	        userName: userName,
	        userPassword: userPassword,
	        avatar_data: avatar_data,
	        lastChangeDatetime: lastModifyDatetime,
	        user_ids: [],
	        chat_ids: []
	      };

	      self.setUserId(user_id, true); // temp to store user
	      _indexeddb2.default.addOrPutAll('put', self.userDatabaseDescription, 'information', [userInfo], function (err) {
	        self.setUserId(null); // roll back temp
	        if (err) {
	          callback(err);
	          return;
	        }
	        callback(null, userInfo);
	      });
	    });
	  }
	};

	_extend_core2.default.prototype.inherit(Users_bus, _cookie_core2.default);

	exports.default = new Users_bus();

/***/ },

/***/ 283:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var extend_core = function extend_core() {};

	extend_core.prototype = {

	  __class_name: "extend_core",

	  extend: function extend(child, parent) {
	    var _this = this;
	    var keys = Object.keys(parent);
	    keys.forEach(function (key) {
	      if (_typeof(parent[key]) === 'object' && !Array.isArray(parent[key]) && parent[key] !== null) {
	        child[key] = {};
	        _this.extend(child[key], parent[key]);
	      } else {
	        child[key] = parent[key];
	      }
	    });
	  },

	  inherit: function inherit(Child, Parent) {
	    var F = function F() {};
	    F.prototype = Parent.prototype;
	    var f = new F();

	    for (var prop in Child.prototype) {
	      f[prop] = Child.prototype[prop];
	    }
	    Child.prototype = f;
	    Child.prototype[Parent.prototype.__class_name] = Parent.prototype;
	  }
	};

	exports.default = extend_core;

/***/ },

/***/ 284:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var cookie_core = function cookie_core() {};

	cookie_core.prototype = {

	  __class_name: "cookie_core",

	  getCookie: function getCookie(name) {
	    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	    return matches ? decodeURIComponent(matches[1]) : undefined;
	  },

	  setCookie: function setCookie(name, value, options) {
	    options = options || {};

	    var expires = options.expires;

	    if (typeof expires === "number" && expires) {
	      var d = new Date();
	      d.setTime(d.getTime() + expires * 1000);
	      expires = options.expires = d;
	    }
	    if (expires && expires.toUTCString) {
	      options.expires = expires.toUTCString();
	    }

	    value = encodeURIComponent(value);

	    var updatedCookie = name + "=" + value;

	    for (var propName in options) {
	      updatedCookie += "; " + propName;
	      var propValue = options[propName];
	      if (propValue !== true) {
	        updatedCookie += "=" + propValue;
	      }
	    }

	    document.cookie = updatedCookie;
	  },

	  deleteCookie: function deleteCookie(name) {
	    cookie_core.prototype.setCookie(name, "", {
	      expires: -1
	    });
	  }
	};

	exports.default = cookie_core;

/***/ },

/***/ 285:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _async_core = __webpack_require__(286);

	var _async_core2 = _interopRequireDefault(_async_core);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var globalUsersDatabaseDescription = __webpack_require__(289);

	var indexeddb = function (_AsyncCore) {
	  _inherits(indexeddb, _AsyncCore);

	  function indexeddb() {
	    _classCallCheck(this, indexeddb);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(indexeddb).call(this));

	    _this.defaultVersion = 1;
	    _this.STATES = {
	      READY: 1
	    };
	    _this.stateInfo = _this.STATES.READY;
	    _this.openDatabases = {};
	    _this.addEventListeners();
	    return _this;
	  }

	  _createClass(indexeddb, [{
	    key: 'onSetUserId',
	    value: function onSetUserId(user_id) {
	      this.user_id = user_id;
	    }
	  }, {
	    key: 'addEventListeners',
	    value: function addEventListeners() {
	      var self = this;
	      self.removeEventListeners();
	      _event_bus2.default.on('setUserId', self.onSetUserId, self);
	    }
	  }, {
	    key: 'removeEventListeners',
	    value: function removeEventListeners() {
	      var self = this;
	      _event_bus2.default.off('setUserId', self.onSetUserId);
	    }
	  }, {
	    key: 'isTableInTables',
	    value: function isTableInTables(db_name, table_name) {
	      var has = false;
	      if (this.openDatabases[db_name] && this.openDatabases[db_name].db) {
	        has = this.openDatabases[db_name].db.objectStoreNames.contains(table_name);
	      }
	      return has;
	    }
	  }, {
	    key: 'onOpenSuccess',
	    value: function onOpenSuccess(options, callback, event) {
	      if (!this.openDatabases[options.db_name]) {
	        this.openDatabases[options.db_name] = {};
	      }
	      if (event && event.target) {
	        this.openDatabases[options.db_name].db = event.target.result;
	      }
	      this.openDatabases[options.db_name].options = options;
	      callback(null);
	    }
	  }, {
	    key: 'onOpenError',
	    value: function onOpenError(options, callback, event) {
	      event.currentTarget.error.options = options;
	      callback(event.currentTarget.error);
	    }
	  }, {
	    key: 'onOpenUpgrade',
	    value: function onOpenUpgrade(options, callback, event) {
	      var db = event.target.result;

	      // only for provided tables !
	      options.table_descriptions.forEach(function (table_description) {
	        if (db.objectStoreNames.contains(table_description.table_name)) {
	          db.deleteObjectStore(table_description.table_name);
	        }
	        var objectStore = db.createObjectStore(table_description.table_name, table_description.table_parameter);
	        if (table_description.table_indexes) {
	          table_description.table_indexes.forEach(function (table_index) {
	            objectStore.createIndex(table_index.indexName, table_index.indexKeyPath, table_index.indexParameter);
	          });
	        }
	      });
	    }
	  }, {
	    key: 'onOpenBlocked',
	    value: function onOpenBlocked(options, callback, event) {
	      if (event.currentTarget.readyState) {
	        event.currentTarget.options = options;
	        callback(event.currentTarget);
	      }
	    }
	  }, {
	    key: '_proceedOpen',
	    value: function _proceedOpen(options, version, callback) {
	      var self = this,
	          openRequest;
	      try {
	        openRequest = indexedDB.open(options.db_name, version);
	      } catch (error) {
	        error.options = options;
	        callback(error);
	        return;
	      }
	      openRequest.onsuccess = self.onOpenSuccess.bind(self, options, callback);
	      openRequest.onerror = self.onOpenError.bind(self, options, callback);
	      openRequest.onupgradeneeded = self.onOpenUpgrade.bind(self, options, callback);
	      openRequest.onblocked = self.onOpenBlocked.bind(self, options, callback);
	    }
	  }, {
	    key: 'open',
	    value: function open(options, force, callback) {
	      var self = this;

	      if (self.canNotProceed(callback)) {
	        return;
	      }

	      if (options.db_name !== globalUsersDatabaseDescription.db_name) {
	        self.getGlobalUser(self.user_id, function (err, globalUserInfo) {
	          if (err) {
	            callback(err);
	            return;
	          }
	          if (self.canNotProceed(callback)) {
	            return;
	          }
	          var version = globalUserInfo.db_versions[options.db_name] ? globalUserInfo.db_versions[options.db_name] : self.defaultVersion;

	          if (self.openDatabases[options.db_name] && self.openDatabases[options.db_name].db) {
	            if (force) {
	              version = self.openDatabases[options.db_name].db.version + 1;
	              self.openDatabases[options.db_name].db.close();
	              delete self.openDatabases[options.db_name];
	              globalUserInfo.db_versions[options.db_name] = version;
	              // store new version in user credentials
	              self.saveGlobalUser(globalUserInfo, function (err) {
	                if (err) {
	                  callback(err);
	                } else if (self.canProceed(callback)) {
	                  self._proceedOpen(options, version, callback);
	                }
	              });
	            } else {
	              self.onOpenSuccess(options, callback);
	            }
	          } else {
	            self._proceedOpen(options, version, callback);
	          }
	        });
	      } else {
	        self._proceedOpen(options, self.defaultVersion, callback);
	      }
	    }
	  }, {
	    key: 'addOrPutAll',
	    value: function addOrPutAll(action, options, table_name, addOrPutItems, callback) {
	      var self = this,
	          cur_table_description;

	      if (self.canNotProceed(callback)) {
	        return;
	      }

	      cur_table_description = self.getCurrentTableDescription(options, table_name);

	      var executeAddOrPutAll = function executeAddOrPutAll() {
	        var trans,
	            store,
	            addOrPutCount = addOrPutItems.length;
	        try {
	          trans = self.openDatabases[options.db_name].db.transaction([cur_table_description.table_name], "readwrite");
	          store = trans.objectStore(cur_table_description.table_name);
	        } catch (error) {
	          error.options = options;
	          error.cur_table_description = cur_table_description;
	          callback(error);
	          return;
	        }
	        trans.oncomplete = function () {
	          callback(null);
	        };
	        trans.onerror = function (err) {
	          err.options = options;
	          err.cur_table_description = cur_table_description;
	          callback(err);
	        };

	        var i = 0,
	            putNext = function putNext() {
	          if (self.canProceed(callback)) {
	            if (i < addOrPutCount) {
	              store[action](addOrPutItems[i]).onsuccess = putNext;
	              ++i;
	            }
	          }
	        };
	        putNext();
	      };

	      var _isTableInTables = self.isTableInTables(options.db_name, cur_table_description.table_name);
	      if (_isTableInTables) {
	        executeAddOrPutAll();
	      } else {
	        self.open(options, !_isTableInTables, function (err, upgraded) {
	          if (err) {
	            callback(err, upgraded);
	          } else if (self.canProceed(callback)) {
	            executeAddOrPutAll();
	          }
	        });
	      }
	    }
	  }, {
	    key: 'getAll',
	    value: function getAll(options, table_name, callback) {
	      var self = this,
	          cur_table_description;

	      if (self.canNotProceed(callback)) {
	        return;
	      }

	      cur_table_description = self.getCurrentTableDescription(options, table_name);

	      var _isTableInTables = self.isTableInTables(options.db_name, cur_table_description.table_name);
	      if (_isTableInTables) {
	        self._executeGetAll(options, cur_table_description.table_name, callback);
	      } else {
	        self.open(options, !_isTableInTables, function (err, upgraded) {
	          if (err) {
	            callback(err, upgraded);
	          } else if (self.canProceed(callback)) {
	            self._executeGetAll(options, cur_table_description.table_name, callback);
	          }
	        });
	      }
	    }
	  }, {
	    key: '_executeGetAll',
	    value: function _executeGetAll(options, table_name, callback) {
	      var self = this,
	          trans,
	          store,
	          openRequest,
	          returnData = [];
	      try {
	        trans = self.openDatabases[options.db_name].db.transaction([table_name], "readonly");
	        store = trans.objectStore(table_name);
	        openRequest = store.openCursor();
	      } catch (error) {
	        error.options = options;
	        error.table_name = table_name;
	        callback(error);
	        return;
	      }
	      trans.oncomplete = function () {
	        callback(null, returnData);
	      };
	      trans.onerror = function (err) {
	        err.options = options;
	        err.cur_table_description = cur_table_description;
	        callback(err);
	      };

	      openRequest.onsuccess = function (e) {
	        var cursor = e.target.result;
	        if (cursor) {
	          returnData.push(cursor.value);
	          cursor.continue();
	        }
	      };
	    }

	    /**
	     * open indexedDB table and search through for requested key path
	     */

	  }, {
	    key: 'getByKeyPath',
	    value: function getByKeyPath(options, table_name, getValue, callback) {
	      var self = this,
	          cur_table_description;

	      if (self.canNotProceed(callback)) {
	        return;
	      }

	      cur_table_description = self.getCurrentTableDescription(options, table_name);

	      var executeGet = function executeGet() {
	        var trans, store, getCursor, result;
	        try {
	          trans = self.openDatabases[options.db_name].db.transaction([cur_table_description.table_name], "readonly");
	          store = trans.objectStore(cur_table_description.table_name);
	          getCursor = store.openCursor(IDBKeyRange.only(getValue));
	        } catch (error) {
	          error.options = options;
	          error.cur_table_description = cur_table_description;
	          callback(error);
	          return;
	        }
	        trans.oncomplete = function () {
	          callback(null, result);
	        };
	        trans.onerror = function (err) {
	          err.options = options;
	          err.cur_table_description = cur_table_description;
	          callback(err);
	        };

	        getCursor.onsuccess = function (event) {
	          if (event.target.result) {
	            result = event.target.result.value;
	          }
	        };
	      };

	      var _isTableInTables = self.isTableInTables(options.db_name, cur_table_description.table_name);
	      if (self.openDatabases[options.db_name] && _isTableInTables) {
	        executeGet();
	      } else {
	        self.open(options, !_isTableInTables, function (err, upgraded) {
	          if (err) {
	            callback(err, upgraded);
	          } else {
	            executeGet();
	          }
	        });
	      }
	    }
	  }, {
	    key: 'getByKeysPath',
	    value: function getByKeysPath(options, table_name, getValues, nullWrapper, callback) {
	      var self = this,
	          cur_table_description;

	      if (self.canNotProceed(callback)) {
	        return;
	      }

	      cur_table_description = self.getCurrentTableDescription(options, table_name);

	      var executeGet = function executeGet() {
	        var trans, store;
	        try {
	          trans = self.openDatabases[options.db_name].db.transaction([cur_table_description.table_name], "readonly");
	          store = trans.objectStore(cur_table_description.table_name);
	        } catch (error) {
	          error.options = options;
	          error.cur_table_description = cur_table_description;
	          callback(error);
	          return;
	        }

	        var getCursor;
	        var _array = [];
	        trans.oncomplete = function () {
	          callback(null, _array);
	        };
	        getValues.forEach(function (getValue) {
	          try {
	            getCursor = store.openCursor(IDBKeyRange.only(getValue));
	          } catch (error) {
	            callback(error);
	            return;
	          }
	          getCursor.onsuccess = function (event) {
	            var cursor = event.target.result;
	            if (!cursor) {
	              if (nullWrapper) {
	                _array.push(nullWrapper(getValue));
	              }
	              return;
	            }
	            _array.push(cursor.value);
	          };
	          getCursor.onerror = function (e) {
	            var err = e.currentTarget.error;
	            err.options = options;
	            err.cur_table_description = cur_table_description;
	            callback(err);
	          };
	        });
	      };

	      var _isTableInTables = self.isTableInTables(options.db_name, cur_table_description.table_name);
	      if (self.openDatabases[options.db_name] && _isTableInTables) {
	        executeGet();
	      } else {
	        self.open(options, !_isTableInTables, function (err, upgraded) {
	          if (err) {
	            callback(err, upgraded);
	          } else {
	            executeGet();
	          }
	        });
	      }
	    }
	  }, {
	    key: 'getCurrentTableDescription',
	    value: function getCurrentTableDescription(options, table_name) {
	      var found_table_description;
	      if (table_name) {
	        options.table_descriptions.every(function (table_description) {
	          if (table_description.table_name === table_name) {
	            found_table_description = table_description;
	          }
	          return !found_table_description;
	        });
	      }
	      return found_table_description ? found_table_description : options.table_descriptions[0];
	    }
	  }, {
	    key: 'canProceed',
	    value: function canProceed(callback) {
	      if (this.stateInfo !== this.STATES.READY) {
	        callback(new Error('ErrorState'));
	        return false;
	      }
	      return true;
	    }
	  }, {
	    key: 'canNotProceed',
	    value: function canNotProceed(callback) {
	      return !this.canProceed(callback);
	    }
	  }, {
	    key: 'getGlobalUserCredentials',
	    value: function getGlobalUserCredentials(userName, userPassword, callback) {
	      var self = this;
	      self.getAll(globalUsersDatabaseDescription, null, function (getAllErr, allUsers) {
	        if (getAllErr) {
	          callback(getAllErr);
	          return;
	        }

	        var userCredentials;
	        allUsers.every(function (_user) {
	          if (_user.userName === userName) {
	            if (userPassword && _user.userPassword === userPassword) {
	              userCredentials = _user;
	            } else {
	              userCredentials = _user;
	            }
	          }
	          return !userCredentials;
	        });

	        callback(null, userCredentials);
	      });
	    }
	  }, {
	    key: 'addGlobalUser',
	    value: function addGlobalUser(user_id, userName, userPassword, callback) {
	      var self = this;
	      self.getGlobalUserCredentials(userName, null, function (getAllErr, userCredentials) {
	        if (getAllErr) {
	          callback(getAllErr);
	          return;
	        }

	        if (userCredentials) {
	          callback(102);
	          return;
	        }

	        var accountCredentials = {
	          user_id: user_id,
	          userName: userName,
	          userPassword: userPassword,
	          db_versions: {}
	        };

	        self.saveGlobalUser(accountCredentials, callback);
	      });
	    }
	  }, {
	    key: 'putGlobalUserDBVersion',
	    value: function putGlobalUserDBVersion(user_id, db_name, db_version, callback) {
	      var self = this;
	      self.getGlobalUser(user_id, function (err, globalUserInfo) {
	        if (err) {
	          callback(err);
	          return;
	        }

	        globalUserInfo.db_versions[db_name] = db_version;
	        self.saveGlobalUser(globalUserInfo, callback);
	      });
	    }
	  }, {
	    key: 'getGlobalUser',
	    value: function getGlobalUser(user_id, callback) {
	      var self = this;
	      self.getByKeyPath(globalUsersDatabaseDescription, null, user_id, function (getError, globalUserInfo) {
	        if (getError) {
	          callback(getError);
	          return;
	        }

	        callback(null, globalUserInfo);
	      });
	    }
	  }, {
	    key: 'saveGlobalUser',
	    value: function saveGlobalUser(globalUserInfo, callback) {
	      var self = this;
	      self.addOrPutAll('put', globalUsersDatabaseDescription, null, [globalUserInfo], function (error) {
	        if (error) {
	          callback(error);
	          return;
	        }

	        callback(null);
	      });
	    }
	  }]);

	  return indexeddb;
	}(_async_core2.default);

	exports.default = new indexeddb();

/***/ },

/***/ 286:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var async_core = function async_core() {};

	async_core.prototype = {

	  __class_name: "async_core",

	  /**
	   * defines if the callback was already called
	   */
	  only_once: function only_once(root, fn) {
	    var called = false;
	    return function () {
	      if (called) throw new Error("Callback was already called.");
	      called = true;
	      fn.apply(root, arguments);
	    };
	  },

	  /**
	   * invoke all iterators almost simultaneously
	   */
	  async_each: function async_each(arr, iterator, callback) {
	    var _this = this;
	    callback = callback || function () {};
	    if (!arr.length) {
	      return callback();
	    }
	    var completed = 0;
	    arr.forEach(function (x) {
	      iterator(x, _this.only_once(_this, done));
	    });
	    function done(err) {
	      if (err) {
	        callback(err);
	        callback = function callback() {};
	      } else {
	        completed += 1;
	        if (completed >= arr.length) {
	          callback();
	        }
	      }
	    }
	  },

	  /**
	   * invoke all iterators one by one
	   */
	  async_eachSeries: function async_eachSeries(arr, iterator, callback) {
	    callback = callback || function () {};
	    if (!arr.length) {
	      return callback();
	    }
	    var completed = 0;
	    var detailData = [];
	    var iterate = function iterate() {
	      iterator(arr[completed], function (err, detail) {
	        if (err) {
	          callback(err, detail);
	          callback = function callback() {};
	          detailData = [];
	        } else {
	          completed += 1;
	          if (detail) {
	            detailData.push(detail);
	          }
	          if (completed >= arr.length) {
	            callback(null, detailData);
	          } else {
	            iterate();
	          }
	        }
	      });
	    };
	    iterate();
	  }
	};

	exports.default = async_core;

/***/ },

/***/ 287:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _event_core = __webpack_require__(288);

	var _event_core2 = _interopRequireDefault(_event_core);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Event_bus = function Event_bus() {};

	Event_bus.prototype = {

	  set_ws_device_id: function set_ws_device_id(ws_device_id) {
	    this.ws_device_id = ws_device_id;
	  },

	  get_ws_device_id: function get_ws_device_id() {
	    return this.ws_device_id;
	  }
	};

	_extend_core2.default.prototype.inherit(Event_bus, _event_core2.default);

	exports.default = new Event_bus();

/***/ },

/***/ 288:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Event_core = function Event_core() {};

	Event_core.prototype = {

	  __class_name: "event_core",

	  initializeListeners: function initializeListeners() {
	    if (!this.listeners) {
	      this.listeners = {};
	    }
	  },

	  on: function on(event, handler, context) {
	    this.initializeListeners();

	    if (this.listeners[event] === undefined) {
	      this.listeners[event] = [];
	    }

	    if (this.listeners[event].indexOf(handler) === -1) {
	      this.listeners[event].push({
	        handler: handler,
	        context: context || this
	      });
	    }
	    return this;
	  },

	  off: function off(event, handler) {
	    this.initializeListeners();
	    var idx;
	    if (!event) {
	      this.listeners = {};
	      return this;
	    }
	    if (!this.listeners[event]) {
	      return this;
	    }

	    if (!handler) {
	      delete this.listeners[event];
	    } else {
	      idx = this.listeners[event].map(function (listener) {
	        return listener.handler;
	      }).indexOf(handler);
	      if (idx !== -1) {
	        this.listeners[event].splice(idx, 1);
	      }
	    }
	    return this;
	  },

	  trigger: function trigger(name) {
	    this.initializeListeners();
	    var args = Array.prototype.slice.call(arguments, 1);
	    (this.listeners[name] || []).forEach(function (listener) {
	      listener.handler.apply(listener.context, args);
	    });
	    return this;
	  }
	};

	exports.default = Event_core;

/***/ },

/***/ 289:
/***/ function(module, exports) {

	module.exports = {
		"db_name": "global_users",
		"table_descriptions": [
			{
				"table_name": "global_users",
				"table_parameter": {
					"keyPath": "user_id"
				}
			}
		]
	};

/***/ },

/***/ 290:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _id_core = __webpack_require__(291);

	var _id_core2 = _interopRequireDefault(_id_core);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Websocket = function Websocket() {
	  this.bindContexts();
	  this.responseCallbacks = [];
	  this.protocol = window.location.origin.indexOf('https') >= 0 ? 'wss://' : 'ws://';
	};

	Websocket.prototype = {

	  port: ':8000',

	  bindContexts: function bindContexts() {
	    var self = this;
	    self.bindedOnOpen = self.onOpen.bind(self);
	    self.bindedOnClose = self.onClose.bind(self);
	    self.bindedOnMessage = self.onMessage.bind(self);
	    self.bindedOnError = self.onError.bind(self);
	  },

	  createAndListen: function createAndListen() {
	    this.create();
	    this.addSocketListeners();
	  },

	  create: function create() {
	    var url;
	    if (window.location.hostname.indexOf('localhost') >= 0 || window.location.hostname.indexOf('192.168.') >= 0) {
	      url = this.protocol + window.location.host;
	    } else {
	      url = this.protocol + window.location.hostname + this.port;
	    }
	    this.socket = new WebSocket(url);
	  },

	  dispose: function dispose() {
	    this.removeSocketListeners();
	    if (this.socket) {
	      this.socket.close();
	      this.socket = null;
	    }
	  },

	  addSocketListeners: function addSocketListeners() {
	    if (!this.socket) {
	      return;
	    }
	    var self = this;
	    self.removeSocketListeners();
	    self.socket.onopen = self.bindedOnOpen;
	    self.socket.onclose = self.bindedOnClose;
	    self.socket.onmessage = self.bindedOnMessage;
	    self.socket.onerror = self.bindedOnError;
	  },

	  removeSocketListeners: function removeSocketListeners() {
	    if (!this.socket) {
	      return;
	    }
	    var sels = this;
	    sels.socket.onopen = null;
	    sels.socket.onclose = null;
	    sels.socket.onmessage = null;
	    sels.socket.onerror = null;
	  },

	  onOpen: function onOpen(event) {
	    console.log('WebSocket connection established');
	  },

	  onClose: function onClose(event) {
	    var newState;
	    if (event.wasClean) {
	      console.warn('WebSocket connection closed');
	    } else {
	      _event_bus2.default.trigger("websocket_abortConnection", 103);
	    }
	    console.warn('Code: ' + event.code + ' reason: ' + event.reason);
	  },

	  onMessage: function onMessage(event) {
	    if (event.data) {
	      try {
	        var parsedMessageData = JSON.parse(event.data);
	      } catch (e) {
	        console.error(e);
	        return;
	      }
	    }
	    console.info('WebSocket received message data', parsedMessageData);
	    if (parsedMessageData.response_id) {
	      var depleted = [],
	          nowDatetime = Date.now();
	      this.responseCallbacks.forEach(function (callbDescr) {
	        if (callbDescr.request_id === parsedMessageData.response_id) {
	          callbDescr.responseCallback(null, parsedMessageData);
	          depleted.push(callbDescr);
	        } else if (nowDatetime - callbDescr.datetime > 50000) {
	          callbDescr.responseCallback(new Error('Timeout fro request'));
	          depleted.push(callbDescr);
	        }
	      });
	      while (depleted.length) {
	        var toRemoveCallbDescr = depleted.shift();
	        var removeIndex = this.responseCallbacks.indexOf(toRemoveCallbDescr);
	        if (removeIndex !== -1) {
	          this.responseCallbacks.splice(removeIndex, 1);
	        }
	      }
	    } else {
	      _event_bus2.default.trigger('web_socket_message', parsedMessageData);
	    }
	  },

	  onError: function onError(error) {
	    console.error(error);
	  },

	  sendMessage: function sendMessage(data) {
	    var senddata = data;
	    if (typeof data !== "string") {
	      try {
	        senddata = JSON.stringify(data);
	      } catch (e) {
	        console.error(e);
	        return;
	      }
	    }
	    this.socket.send(senddata);
	  },

	  wsRequest: function wsRequest(requestData, responseCallback) {
	    requestData.request_id = this.generateId();
	    this.responseCallbacks.push({
	      datetime: Date.now(),
	      request_id: requestData.request_id,
	      responseCallback: responseCallback
	    });
	    this.sendMessage(requestData);
	  }
	};
	_extend_core2.default.prototype.inherit(Websocket, _id_core2.default);

	exports.default = new Websocket();

/***/ },

/***/ 291:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var id_core = function id_core() {};

	id_core.prototype = {

	  __class_name: "id_core",

	  _s4: function _s4() {
	    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	  },

	  _get5Digits: function _get5Digits(digitsArray) {
	    var _5d = [];
	    var digit = digitsArray.pop();
	    while (_5d.length < 4) {
	      if (digit) {
	        _5d.unshift(digit);
	      } else {
	        _5d.unshift(0);
	      }
	      if (_5d.length < 4 && digit) {
	        digit = digitsArray.pop();
	      }
	    }
	    if (digitsArray.length) {
	      return [_5d.join('')].concat(this._get5Digits(digitsArray));
	    } else {
	      return [_5d.join('')];
	    }
	  },

	  _s4Date: function _s4Date() {
	    var D = Date.now();
	    return this._get5Digits(D.toString().split('')).reverse();
	  },

	  generateId: function generateId() {
	    return this._s4Date().concat([this._s4(), this._s4(), this._s4(), this._s4(), this._s4(), this._s4(), this._s4(), this._s4()]).join('-');
	  }
	};

	exports.default = id_core;

/***/ },

/***/ 292:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(219);

	var _location_wrapper = __webpack_require__(293);

	var _location_wrapper2 = _interopRequireDefault(_location_wrapper);

	var _description = __webpack_require__(302);

	var _description2 = _interopRequireDefault(_description);

	var _dialogError = __webpack_require__(304);

	var _dialogError2 = _interopRequireDefault(_dialogError);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _indexeddb = __webpack_require__(285);

	var _indexeddb2 = _interopRequireDefault(_indexeddb);

	var _overlay_core = __webpack_require__(306);

	var _overlay_core2 = _interopRequireDefault(_overlay_core);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Login = _react2.default.createClass({
	  displayName: 'Login',
	  getDefaultProps: function getDefaultProps() {
	    return {
	      mainContainer: {
	        "element": "div",
	        "config": {
	          "class": "flex-inner-container"
	        }
	      },
	      configs: [{
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-just-center",
	        "location": "language"
	      }, {
	        "element": "label",
	        "text": 100,
	        "class": "p-r-l-1em",
	        "location": "language",
	        "data": {
	          "role": "labelLanguage"
	        }
	      }, {
	        "element": "select",
	        "location": "language",
	        "select_options": [{
	          "text": "English",
	          "value": "en"
	        }, {
	          "text": "Русский",
	          "value": "ru"
	        }],
	        "data": {
	          "action": "changeLanguage",
	          "role": "selectLanguage"
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-around",
	        "location": "registerButton"
	      }, {
	        "element": "button",
	        "type": "button",
	        "location": "registerButton",
	        "link": "/register",
	        "text": 48,
	        "data": {
	          "description": 54,
	          "action": "clickRedirectToRegister",
	          "role": "registerNewUser"
	        },
	        "class": "button-inset"
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-around",
	        "location": "userName"
	      }, {
	        "element": "label",
	        "text": 49,
	        "class": "flex-item-w50p",
	        "location": "userName",
	        "data": {
	          "role": "labelUserName"
	        }
	      }, {
	        "element": "input",
	        "type": "text",
	        "class": "flex-item-w50p",
	        "location": "userName",
	        "name": "userName",
	        "data": {
	          "key": "userName"
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-between",
	        "location": "userPassword"
	      }, {
	        "element": "label",
	        "text": 50,
	        "class": "flex-item-w50p",
	        "location": "userPassword",
	        "data": {
	          "role": "labelUserPassword"
	        }
	      }, {
	        "element": "input",
	        "type": "password",
	        "class": "flex-item-w50p",
	        "location": "userPassword",
	        "name": "userPassword",
	        "data": {
	          "key": "userPassword"
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-around",
	        "location": "loginButton"
	      }, {
	        "element": "button",
	        "type": "submit",
	        "text": 51,
	        "location": "loginButton",
	        "data": {
	          "action": "submit",
	          "role": "loginButton"
	        },
	        "class": "button-inset"
	      }]
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      lang: _localization2.default.lang,
	      errorMessage: null
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    this.loginForm = document.querySelector('[data-role="loginForm"]');
	    this.loginForm.addEventListener('click', this.handleClick, true);
	    this.toggleWaiter();
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    this.loginForm = null;
	  },
	  handleClick: function handleClick(event) {
	    if (event.currentTarget.dataset.action === 'clickRedirectToRegister') {
	      this.clickRedirectToRegister(event);
	    }
	  },
	  handleDialogError: function handleDialogError() {
	    this.setState({ errorMessage: null });
	  },
	  handleChange: function handleChange(event) {
	    switch (event.target.dataset.action) {
	      case "changeLanguage":
	        _localization2.default.changeLanguage(event.target.value, this);
	        break;
	    }
	  },
	  handleSubmit: function handleSubmit(event) {
	    event.preventDefault();

	    var self = this,
	        userName = this.loginForm.elements.userName.value,
	        userPassword = this.loginForm.elements.userPassword.value;
	    if (userName && userPassword) {
	      self.toggleWaiter(true);
	      _indexeddb2.default.getGlobalUserCredentials(userName, userPassword, function (err, userCredentials) {
	        if (err) {
	          self.toggleWaiter();
	          self.setState({ errorMessage: err });
	          return;
	        }

	        if (userCredentials) {
	          _users_bus2.default.setUserId(userCredentials.user_id);
	          _users_bus2.default.getMyInfo(null, function (err, options, userInfo) {
	            if (userPassword === userInfo.userPassword) {
	              _users_bus2.default.checkLoginState();
	              if (_reactRouter.browserHistory.desired_path && _reactRouter.browserHistory.desired_search) {
	                _reactRouter.browserHistory.push(_reactRouter.browserHistory.desired_path + _reactRouter.browserHistory.desired_search);
	                _reactRouter.browserHistory.desired_path = null;
	                _reactRouter.browserHistory.desired_search = null;
	              } else {
	                _reactRouter.browserHistory.push('/chat');
	              }
	            } else {
	              self.toggleWaiter();
	              self.setState({ errorMessage: 104 });
	            }
	          });
	        } else {
	          self.toggleWaiter();
	          _users_bus2.default.setUserId(null);
	          self.setState({ errorMessage: 87 });
	        }
	      });
	    } else {
	      this.setState({ errorMessage: 88 });
	    }
	  },
	  clickRedirectToRegister: function clickRedirectToRegister(event) {
	    event.preventDefault();
	    event.stopPropagation();
	    if (_reactRouter.browserHistory.desired_path && _reactRouter.browserHistory.desired_search) {
	      _reactRouter.browserHistory.push(_reactRouter.browserHistory.desired_path + _reactRouter.browserHistory.desired_search);
	      location.replace('register?' + _reactRouter.browserHistory.desired_path + _reactRouter.browserHistory.desired_search);
	    } else {
	      location.replace('register');
	    }
	  },
	  handleEvents: function handleEvents(event) {
	    this.descriptionContext.showDescription(event);
	  },
	  render: function render() {
	    var _this = this;

	    var onEvent = {
	      onClick: this.handleClick,
	      onChange: this.handleChange
	    };
	    return _react2.default.createElement(
	      'div',
	      { onMouseDown: this.handleEvents,
	        onMouseMove: this.handleEvents,
	        onMouseUp: this.handleEvents,
	        onClick: this.handleEvents,
	        onTouchEnd: this.handleEvents,
	        onTouchMove: this.handleEvents,
	        onTouchStart: this.handleEvents },
	      _react2.default.createElement(
	        'div',
	        { 'data-role': 'main_container', className: 'w-100p h-100p p-abs' },
	        _react2.default.createElement(
	          'div',
	          { className: 'flex-outer-container p-fx' },
	          _react2.default.createElement(
	            'form',
	            { className: 'flex-inner-container form-small', 'data-role': 'loginForm', onSubmit: this.handleSubmit },
	            _react2.default.createElement(_location_wrapper2.default, { mainContainer: this.props.mainContainer, events: onEvent, configs: this.props.configs })
	          )
	        )
	      ),
	      _react2.default.createElement(_dialogError2.default, { show: this.state.errorMessage, message: this.state.errorMessage,
	        handleClick: this.handleDialogError }),
	      _react2.default.createElement(_description2.default, { ref: function ref(obj) {
	          return _this.descriptionContext = obj;
	        } })
	    );
	  }
	});
	_extend_core2.default.prototype.inherit(Login, _overlay_core2.default);

	exports.default = Login;

/***/ },

/***/ 293:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _element = __webpack_require__(294);

	var _triple_element = __webpack_require__(295);

	var _triple_element2 = _interopRequireDefault(_triple_element);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Location_Wrapper = _react2.default.createClass({
	  displayName: 'Location_Wrapper',
	  prepareConfig: function prepareConfig() {
	    var rawConfig = this.props.configs,
	        byDataLocation = {};
	    if (!rawConfig) return rawConfig;
	    rawConfig.forEach(function (_config) {
	      if (!_config.location) {
	        return;
	      }
	      if (!byDataLocation[_config.location]) {
	        byDataLocation[_config.location] = {
	          configs: []
	        };
	      }
	      if (!_config.role) {
	        byDataLocation[_config.location].configs.push(_config);
	      } else if (_config.role === 'locationWrapper') {
	        byDataLocation[_config.location].wrapperConfig = _config;
	      }
	    });
	    rawConfig.byDataLocation = byDataLocation;
	    return rawConfig;
	  },
	  wrapper: function wrapper(wrapperConfig, wrapperItems) {
	    return _react2.default.createElement(
	      'div',
	      _extends({ key: wrapperConfig.location }, _element.element.renderAttributes({ config: wrapperConfig })),
	      this.wrapperItems(wrapperItems)
	    );
	  },
	  wrapperItems: function wrapperItems(_wrapperItems) {
	    var _this = this;

	    var items = [],
	        hide = void 0,
	        self = this;
	    _wrapperItems.map(function (element_config, idx) {
	      if (element_config.data && element_config.data.action === "togglePanel" && self.props.hide) {
	        hide = true;
	      } else {
	        hide = false;
	      }
	      items.push(_react2.default.createElement(_triple_element2.default, { mode: _this.props.mode, events: _this.props.events, key: idx, config: element_config,
	        hide: hide, data: _this.props.data, calcDisplay: _this.props.calcDisplay }));
	    });
	    return items;
	  },
	  render: function render() {
	    var rawConfig = this.prepareConfig(),
	        elements = [];
	    if (Object.keys(rawConfig.byDataLocation).length === 0) {
	      elements.push(this.wrapperItems(rawConfig));
	    } else {
	      for (var key in rawConfig.byDataLocation) {
	        var wrapperConfig = rawConfig.byDataLocation[key].wrapperConfig;
	        var wrapperItems = rawConfig.byDataLocation[key].configs;
	        elements.push(this.wrapper(wrapperConfig, wrapperItems));
	      }
	    }
	    if (this.props.mainContainer) {
	      return _react2.default.createElement(
	        'div',
	        _element.element.renderAttributes(this.props.mainContainer),
	        elements
	      );
	    } else {
	      return _react2.default.createElement(
	        'div',
	        null,
	        elements
	      );
	    }
	  }
	});

	exports.default = Location_Wrapper;

/***/ },

/***/ 294:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.element = undefined;

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Element = function Element() {};

	Element.prototype = {

	  /**
	   * prepare data attribute for each provided data object key
	   */

	  renderDataAttributes: function renderDataAttributes(data_config, result) {
	    if (!result) {
	      result = {};
	    }
	    if (data_config.data) {
	      Object.keys(data_config.data).forEach(function (key) {
	        if (key === 'description' && typeof data_config.data[key] === 'number') {
	          result['data-' + key] = _localization2.default.getLocText(data_config.data[key]);
	        } else {
	          result['data-' + key] = data_config.data[key];
	        }
	      });
	    }
	    return result;
	  },


	  /**
	   * prepare attributes object fro react
	   */
	  renderAttributes: function renderAttributes(props, options) {
	    var params = {},
	        config = props.config,
	        display = void 0;
	    if (config.role) {
	      params['role'] = config.role;
	    }
	    if (config.autoComplete) {
	      params["autoComplete"] = config.autoComplete;
	    }
	    if (config.name) {
	      params["name"] = config.name;
	    }
	    if (config.type) {
	      params['type'] = config.type;
	    }
	    if (config.class || config.classList) {
	      params['className'] = this.renderClassName(config.class ? config.class : config.classList, props, options);
	    }

	    if (config.for) {
	      params["for"] = config.for;
	    }
	    if (props.id) {
	      params['id'] = config.id;
	    }
	    if (props.calcDisplay) {
	      display = props.calcDisplay(config);
	      if (display !== undefined && display !== true) {
	        params['style'] = { display: 'none' };
	      }
	    }
	    if (config.disabled === true) {
	      params['disabled'] = 'true';
	    }
	    if (config.onkeypress) {
	      params['onkeypress'] = config.onkeypress;
	    }

	    if (config.type === "checkbox" || config.type === "radio") {
	      if (config.data.key) {
	        if (props.data[props.config.data.key]) {
	          params['checked'] = 'true';
	        }
	      }
	    }

	    this.renderDataAttributes(config, params);
	    if (options) {
	      this.renderOptionsAttributes(options, params);
	    }
	    return params;
	  },
	  renderOptionsAttributes: function renderOptionsAttributes(options_config, result) {
	    if (!result) {
	      result = {};
	    }
	    Object.keys(options_config).forEach(function (key) {
	      if (key === 'classList') {
	        result['className'] = result.className + options_config[key];
	      } else {
	        result[key] = options_config[key];
	      }
	    });
	    return result;
	  },
	  renderHandlers: function renderHandlers(props) {
	    var handlers = {};
	    if (props.events) {
	      Object.keys(props.events).forEach(function (key) {
	        handlers[key] = props.events[key];
	      });
	    }
	    return handlers;
	  },
	  renderClassName: function renderClassName(classList, props, options) {
	    var _class = '';
	    _class = classList ? classList : '';
	    if (props.hide) {
	      _class = _class + ' hide ';
	    }
	    return _class;
	  }
	};

	var element = exports.element = new Element();
	exports.default = Element;

/***/ },

/***/ 295:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _button = __webpack_require__(296);

	var _button2 = _interopRequireDefault(_button);

	var _input = __webpack_require__(297);

	var _input2 = _interopRequireDefault(_input);

	var _label = __webpack_require__(298);

	var _label2 = _interopRequireDefault(_label);

	var _select = __webpack_require__(299);

	var _select2 = _interopRequireDefault(_select);

	var _textarea = __webpack_require__(300);

	var _textarea2 = _interopRequireDefault(_textarea);

	var _svg = __webpack_require__(301);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var TripleElement = _react2.default.createClass({
	  displayName: 'TripleElement',
	  definingElement: function definingElement() {
	    var _React$createElement;

	    switch (this.props.config.element) {
	      case "button":
	        return _react2.default.createElement(_button2.default, { mode: this.props.mode, events: this.props.events, config: this.props.config,
	          hide: this.props.hide, data: this.props.data, calcDisplay: this.props.calcDisplay });
	        break;
	      case "label":
	        return _react2.default.createElement(_label2.default, (_React$createElement = { events: this.props.events }, _defineProperty(_React$createElement, 'events', this.props.events), _defineProperty(_React$createElement, 'config', this.props.config), _defineProperty(_React$createElement, 'data', this.props.data), _defineProperty(_React$createElement, 'calcDisplay', this.props.calcDisplay), _React$createElement));
	        break;
	      case "input":
	        return _react2.default.createElement(_input2.default, { events: this.props.events, config: this.props.config, data: this.props.data,
	          calcDisplay: this.props.calcDisplay });
	        break;
	      case "select":
	        return _react2.default.createElement(_select2.default, { events: this.props.events, config: this.props.config, data: this.props.data });
	        break;
	      case "textarea":
	        return _react2.default.createElement(_textarea2.default, { events: this.props.events, config: this.props.config, data: this.props.data });
	        break;
	      case "svg":
	        return _react2.default.createElement(_svg2.default, { events: this.props.events, config: this.props.config, data: this.props.data });
	        break;
	      default:
	        return _react2.default.createElement('div', null);
	        break;
	    }
	  },
	  render: function render() {
	    return this.definingElement();
	  }
	});

	exports.default = TripleElement;

/***/ },

/***/ 296:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(219);

	var _element = __webpack_require__(294);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Button = _react2.default.createClass({
	  displayName: 'Button',
	  renderExtraAttributes: function renderExtraAttributes() {
	    var options = {},
	        config = this.props.config;
	    if (config.data && config.data.mode_to && config.data.mode_to === this.props.mode) {
	      options.classList = ' activeTollbar ';
	    }

	    return options;
	  },
	  renderContent: function renderContent() {
	    var content = [],
	        flag = void 0,
	        config = this.props.config,
	        data = this.props.config.data;
	    if (config.icon) {
	      if (this.props.data && data && this.props.data[data.key_disable]) {
	        flag = true;
	      }
	      if (this.flag) {
	        content.push(_react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'div',
	            { className: 'opacity-05 cursor-not-allowed' },
	            _react2.default.createElement('img', { src: this.src })
	          )
	        ));
	      } else {
	        content.push(_react2.default.createElement('img', { key: config.icon, 'data-onload': config.onload ? 'true' : '',
	          'data-role': config.data.role,
	          src: "/__build__/svg/" + config.icon + ".svg" }));
	      }
	    }
	    if (config.text) {
	      content.push(typeof config.text === "number" ? _localization2.default.getLocText(config.text) : config.text);
	    } else {
	      content.push("");
	    }
	    if (data && data.key) {
	      content.push(this.props.data[data.key]);
	    }
	    if (data && data.description) {
	      content.push(_react2.default.createElement('img', { key: "description", src: '/__build__/svg/description_icon.svg',
	        className: 'description_icon-position' }));
	    }
	    return content;
	  },
	  render: function render() {
	    var pureButton = _react2.default.createElement(
	      'button',
	      _extends({}, _element.element.renderAttributes(this.props, this.renderExtraAttributes()), _element.element.renderHandlers(this.props)),
	      this.renderContent(this.props)
	    );
	    return this.props.config.link ? _react2.default.createElement(
	      _reactRouter.Link,
	      { to: this.props.config.link },
	      pureButton
	    ) : pureButton;
	  }
	});

	exports.default = Button;

/***/ },

/***/ 297:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _element = __webpack_require__(294);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Input = _react2.default.createClass({
	  displayName: 'Input',
	  renderExtraAttributes: function renderExtraAttributes() {
	    var options = {},
	        config = this.props.config;
	    if (config.data && config.data.key === "page") {
	      options.value = this.props.data[config.data.key];
	    }
	    if (config.type === "text") {
	      if (config.data && config.data.key && this.props.data) {
	        if (this.props.data[config.data.key]) {
	          options.value = this.props.data[config.data.key];
	        }
	      }
	    }
	    if (config.name) {
	      options.id = this.props.config.id;
	      if (this.props.config.type === "radio" && this.props.data.index !== undefined) {
	        options.name = this.props.config.name + '_' + this.props.data.index;
	      }
	    }

	    return options;
	  },
	  renderContent: function renderContent() {
	    var content = void 0;
	    if (typeof this.props.config.text === "number") {
	      content = _localization2.default.getLocText(this.props.config.text);
	    } else {
	      content = this.props.config.text;
	    }
	    return { __html: content };
	  },
	  render: function render() {
	    var pureInput = _react2.default.createElement('input', _extends({}, _element.element.renderAttributes(this.props, this.renderExtraAttributes()), _element.element.renderHandlers(this.props)));
	    return this.props.config.text ? _react2.default.createElement(
	      'div',
	      { className: 'flex-item flex-wrap flex-align-c flex-item-auto' },
	      pureInput,
	      _react2.default.createElement('span', { dangerouslySetInnerHTML: this.renderContent() })
	    ) : pureInput;
	  }
	});

	exports.default = Input;

/***/ },

/***/ 298:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _element = __webpack_require__(294);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Label = _react2.default.createClass({
	  displayName: 'Label',
	  renderContent: function renderContent() {
	    var text = void 0,
	        config = this.props.config,
	        data = this.props.data;
	    if (config.text) {
	      text = typeof config.text === "number" ? _localization2.default.getLocText(config.text) : config.text;
	    } else {
	      text = '';
	    }

	    if (data && data.description) {
	      if (typeof data.description === 'number') {
	        text = _localization2.default.getLocText(data.description);
	      } else {
	        text = data.description;
	      }
	    }

	    if (config.data && config.data.key) {
	      text = data[config.data.key];
	    }
	    return text;
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      'label',
	      _extends({}, _element.element.renderAttributes(this.props), _element.element.renderHandlers(this.props)),
	      this.renderContent(this.props)
	    );
	  }
	});

	exports.default = Label;

/***/ },

/***/ 299:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _element = __webpack_require__(294);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Select = _react2.default.createClass({
	  displayName: 'Select',
	  render: function render() {
	    var defaultValue = void 0,
	        options = this.props.config.select_options.map(function (option, i) {
	      if (_localization2.default.lang === option.value) {
	        defaultValue = option.value;
	      }
	      return _react2.default.createElement(
	        'option',
	        { key: i, value: option.value },
	        option.text
	      );
	    });

	    return _react2.default.createElement(
	      'select',
	      _extends({
	        defaultValue: defaultValue }, _element.element.renderAttributes(this.props), _element.element.renderHandlers(this.props)),
	      options
	    );
	  }
	});

	exports.default = Select;

/***/ },

/***/ 300:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _element = __webpack_require__(294);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Textarea = _react2.default.createClass({
	  displayName: 'Textarea',
	  renderExtraAttributes: function renderExtraAttributes() {
	    var options = {},
	        config = this.props.config;
	    if (config.rows) {
	      options.rows = config.rows;
	    }
	    if (config.value !== "") {
	      options.value = config.value;
	    }

	    return options;
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      'textarea',
	      _element.element.renderAttributes(this.props, this.renderExtraAttributes()),
	      this.props.config.text
	    );
	  }
	});

	exports.default = Textarea;

/***/ },

/***/ 301:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Svg = _react2.default.createClass({
	  displayName: 'Svg',
	  render: function render() {
	    var className = 'transition-all ';
	    if (this.props.data && this.props.data.pointerRotate !== -1) {
	      className = className + 'rotate-90';
	    }
	    return _react2.default.createElement('img', { src: "/__build__/svg/" + this.props.config.icon, className: className,
	      'data-role': 'pointer' });
	  }
	});

	exports.default = Svg;

/***/ },

/***/ 302:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _dom_core = __webpack_require__(303);

	var _dom_core2 = _interopRequireDefault(_dom_core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Description = _react2.default.createClass({
	  displayName: 'Description',
	  getInitialState: function getInitialState() {
	    return {
	      left: '0px',
	      top: '0px',
	      show: false,
	      content: ''
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    this.descriptionContainer = document.querySelector('[data-role="description"]');
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    this.descriptionContainer = null;
	  },
	  showDescription: function showDescription(event) {
	    var description = this.descriptionContainer,
	        element = void 0,
	        target = void 0;
	    switch (event.type) {
	      case 'mousedown':
	      case 'touchstart':
	        if (event.type === 'touchstart' && event.changedTouches) {
	          element = this.getDataParameter(event.changedTouches[0].target, 'description');
	        } else {
	          element = this.getDataParameter(event.target, 'description');
	        }
	        if (element && element.dataset.description) {
	          this.curDescriptionElement = element;
	          this.checkReorderClientX = event.clientX;
	          this.checkReorderClientY = event.clientY;
	          if (event.type === 'touchstart') {
	            this.checkReorderClientX = event.changedTouches[0].clientX;
	            this.checkReorderClientY = event.changedTouches[0].clientY;
	          }
	        }
	        break;
	      case 'mousemove':
	      case 'touchmove':
	        if (this.curDescriptionElement) {
	          element = this.curDescriptionElement;
	          var clientX = event.clientX,
	              clientY = event.clientY;
	          if (event.type === 'touchmove' && event.changedTouches) {
	            clientX = event.changedTouches[0].clientX;
	            clientY = event.changedTouches[0].clientY;
	          }
	          var radius = 5,
	              deltaX = Math.abs(this.checkReorderClientX - clientX),
	              deltaY = Math.abs(this.checkReorderClientY - clientY),
	              current_radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
	          if (current_radius > radius && !this.descriptionShow) {
	            event.stopPropagation();
	            event.preventDefault();
	            this.descriptionShow = true;
	            description.innerHTML = element.dataset.description;
	            var result = this.getOffset(element),
	                positionFound = false,
	                checkLeft = void 0,
	                checkTop = void 0,
	                futureTop = result.offsetTop - description.offsetHeight,
	                futureLeft = result.offsetLeft + element.offsetWidth / 2 - description.offsetWidth / 2,
	                futureRight = result.offsetLeft + element.offsetWidth / 2 + description.offsetWidth / 2,
	                documentHeight = document.documentElement.clientHeight,
	                documentWidth = document.body.offsetWidth,
	                documentTop = document.body.offsetTop,
	                documentLeft = document.body.offsetLeft;

	            // if we have enough place on top of current target
	            if (documentTop < futureTop) {
	              checkLeft = futureLeft;
	              if (documentLeft < checkLeft) {
	                if (checkLeft + description.offsetWidth < documentWidth) {
	                  futureLeft = checkLeft;
	                  positionFound = true;
	                } else {
	                  // not found
	                }
	              }

	              if (result.offsetLeft + element.offsetWidth / 2 > documentWidth / 2) {
	                if (!positionFound) {
	                  checkLeft = documentWidth - 5 - element.offsetWidth;
	                  if (documentLeft < checkLeft) {
	                    if (checkLeft + description.offsetWidth < documentWidth) {
	                      futureLeft = checkLeft;
	                      positionFound = true;
	                    } else {
	                      // not found
	                    }
	                  }
	                }

	                if (!positionFound) {
	                  checkLeft = result.offsetLeft - description.offsetWidth;
	                  if (checkLeft + description.offsetWidth < documentWidth) {
	                    if (documentLeft < checkLeft) {
	                      futureLeft = checkLeft;
	                      positionFound = true;
	                    } else {
	                      // not found
	                    }
	                  }
	                }

	                if (!positionFound) {
	                  checkLeft = documentLeft + 5;
	                  if (checkLeft + description.offsetWidth < documentWidth) {
	                    if (documentLeft < checkLeft) {
	                      futureLeft = checkLeft;
	                      positionFound = true;
	                    } else {
	                      // not found
	                    }
	                  }
	                }
	              } else {
	                  if (!positionFound) {
	                    checkLeft = documentLeft + 5;
	                    if (checkLeft + description.offsetWidth < documentWidth) {
	                      if (documentLeft < checkLeft) {
	                        futureLeft = checkLeft;
	                        positionFound = true;
	                      } else {
	                        // not found
	                      }
	                    }
	                  }

	                  if (!positionFound) {
	                    checkLeft = documentWidth - 5 - description.offsetHeight;
	                    if (documentLeft < checkLeft) {
	                      if (checkLeft + description.offsetWidth < documentWidth) {
	                        futureLeft = checkLeft;
	                        positionFound = true;
	                      } else {
	                        // not found
	                      }
	                    }
	                  }
	                }
	            }

	            // if we have enough place on the left of current target
	            if (!positionFound) {
	              futureLeft = result.offsetLeft - description.offsetWidth;
	              futureTop = result.offsetTop + element.offsetHeight / 2 - description.offsetHeight / 2;
	              if (documentLeft < futureLeft) {
	                checkTop = futureTop;
	                if (documentTop < checkTop) {
	                  if (checkTop + description.offsetHeight < documentHeight) {
	                    futureTop = checkTop;
	                    positionFound = true;
	                  } else {
	                    // not found
	                  }
	                }

	                if (!positionFound) {
	                  checkTop = documentTop + 5;
	                  if (checkTop + description.offsetHeight < documentHeight) {
	                    if (documentTop < checkTop) {
	                      futureTop = checkTop;
	                      positionFound = true;
	                    } else {
	                      // not found
	                    }
	                  }
	                }

	                if (!positionFound) {
	                  checkTop = documentHeight - 5 - description.offsetHeight;
	                  if (documentTop < checkTop) {
	                    if (checkTop + description.offsetHeight < documentHeight) {
	                      futureTop = checkTop;
	                      positionFound = true;
	                    } else {
	                      // not found
	                    }
	                  }
	                }
	              }
	            }

	            // if we have enough place on the right of current target
	            if (!positionFound) {
	              futureRight = result.offsetLeft + element.offsetWidth + description.offsetWidth;
	              futureLeft = result.offsetLeft + element.offsetWidth;
	              futureTop = result.offsetTop + element.offsetHeight / 2 - description.offsetHeight / 2;
	              if (documentWidth > futureRight) {
	                checkTop = futureTop;
	                if (documentTop < checkTop) {
	                  if (checkTop + description.offsetHeight < documentHeight) {
	                    futureTop = checkTop;
	                    positionFound = true;
	                  } else {
	                    // not found
	                  }
	                }

	                if (!positionFound) {
	                  checkTop = result.offsetTop + 5;
	                  if (checkTop + description.offsetHeight < documentHeight) {
	                    if (documentTop < checkTop) {
	                      futureTop = checkTop;
	                      positionFound = true;
	                    } else {
	                      // not found
	                    }
	                  }
	                }
	              }
	            }

	            // if we have enough place on bottom of current target
	            if (documentTop > result.offsetTop - description.offsetHeight) {
	              if (!positionFound) {
	                checkTop = result.offsetTop + element.offsetHeight;
	                if (documentHeight > checkTop + description.offsetHeight) {
	                  futureTop = checkTop;
	                  if (documentWidth > result.offsetLeft + description.offsetWidth) {
	                    futureLeft = result.offsetLeft;
	                    positionFound = true;
	                  } else {
	                    if (documentWidth > description.offsetWidth) {
	                      futureLeft = 0;
	                      positionFound = true;
	                    } else {
	                      // not found
	                      futureLeft = result.offsetLeft + element.offsetWidth / 2 - description.offsetWidth / 2;
	                    }
	                  }
	                }
	              }
	            }

	            if (!positionFound) {
	              futureLeft = 0;
	              futureTop = result.offsetTop - description.offsetHeight;
	            }
	            this.setState({
	              left: futureLeft + "px",
	              top: futureTop + "px",
	              show: true,
	              content: description.innerHTML
	            });
	          }
	        }
	        break;
	      case 'click':
	        if (event.target !== description) {
	          this.releaseDescription(event, description, true);
	        }
	        this.curDescriptionElement = null;
	        break;
	      case 'touchend':
	        target = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
	        if (target !== description) {
	          this.releaseDescription(event, description, true);
	        }
	        this.curDescriptionElement = null;
	        break;
	      case 'mouseup':
	        target = document.elementFromPoint(event.clientX, event.clientY);
	        if (target !== description) {
	          this.releaseDescription(event, description, true);
	        }
	        this.curDescriptionElement = null;
	        break;
	    }
	  },
	  releaseDescription: function releaseDescription(event, description, prevent) {
	    if (this.descriptionShow) {
	      if (prevent) {
	        if (event.cancelable) {
	          event.preventDefault();
	        }
	        event.stopPropagation();
	      }
	      this.descriptionShow = false;
	      this.setState({
	        left: "0px",
	        top: "0px",
	        show: false,
	        content: ""
	      });
	    }
	  },
	  render: function render() {
	    var className = this.state.opacity_0 ? "description opacity-0" : "description";
	    return _react2.default.createElement(
	      'div',
	      { 'data-role': 'description', className: className,
	        style: { left: this.state.left, top: this.state.top } },
	      this.state.content
	    );
	  }
	});
	_extend_core2.default.prototype.inherit(Description, _dom_core2.default);

	exports.default = Description;

/***/ },

/***/ 303:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Dom_core = function Dom_core() {};

	Dom_core.prototype = {

	  __class_name: "dom_core",

	  /**
	   * find parent node with predefined dataset
	   */
	  traverseUpToDataset: function traverseUpToDataset(startElement, datasetKey, datasetValue) {
	    var parentNode = startElement.parentNode;
	    if (parentNode) {
	      if (parentNode.dataset && parentNode.dataset[datasetKey] === datasetValue) {
	        return parentNode;
	      } else {
	        return this.traverseUpToDataset(parentNode, datasetKey, datasetValue);
	      }
	    } else {
	      return null;
	    }
	  },

	  getDataParameter: function getDataParameter(element, param, _n) {
	    if (!element) {
	      return null;
	    }
	    if (element.disabled && param !== "description") {
	      return null;
	    }
	    var n = !(_n === undefined || _n === null) ? _n : 5;
	    if (n > 0) {
	      if (!element.dataset || !element.dataset[param]) {
	        return this.getDataParameter(element.parentNode, param, n - 1);
	      } else if (element.dataset[param]) {
	        return element;
	      }
	    }
	    return null;
	  },


	  getOffset: function getOffset(element) {
	    var offsetLeft = 0,
	        offsetTop = 0;
	    do {
	      offsetLeft += element.offsetLeft;
	      offsetTop += element.offsetTop;
	    } while (element = element.offsetParent);
	    return { offsetLeft: offsetLeft, offsetTop: offsetTop };
	  }

	};

	exports.default = Dom_core;

/***/ },

/***/ 304:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	var _dialog = __webpack_require__(305);

	var _dialog2 = _interopRequireDefault(_dialog);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var DialogError = _react2.default.createClass({
	  displayName: 'DialogError',
	  processingTitle: function processingTitle() {
	    var title = void 0;
	    if (this.props.title) {
	      title = this.props.title;
	      if (!title.textContent) {
	        title.textContent = 84;
	      }
	      if (title.addClass) {
	        title.addClass = ' error ' + title.addClass;
	      } else {
	        title.addClass = ' error ';
	      }
	    } else {
	      title = { textContent: 84, addClass: ' error' };
	    }

	    return title;
	  },
	  processingBody: function processingBody() {
	    var body = void 0;
	    if (this.props.body) {
	      body = this.props.body;
	      if (!body.textContent) {
	        body.textContent = this.props.message;
	      }
	    } else {
	      body = { textContent: this.props.message };
	    }

	    return body;
	  },
	  processingFooter: function processingFooter() {
	    var footer = void 0,
	        _class = 'flex-sp-around p-05em border-popup-footer ';
	    if (this.props.footer) {
	      footer = this.props.footer;
	      if (footer.content) {
	        return footer.content;
	      }
	      if (footer.className) {
	        _class = footer.className;
	      } else {
	        _class = footer.addClass ? _class + footer.addClass : _class;
	      }
	    }

	    return _react2.default.createElement(
	      'footer',
	      { className: _class },
	      _react2.default.createElement(
	        'button',
	        { className: 'border-radius-04em p-tb-03em-lr-1em', 'data-action': 'confirmCancel' },
	        this.props.close ? _localization2.default.transferText(this.props.close) : _localization2.default.getLocText(20)
	      )
	    );
	  },
	  render: function render() {
	    if (this.props.show) {
	      var title = this.processingTitle(),
	          body = this.processingBody(),
	          footer = this.processingFooter();

	      return _react2.default.createElement(_dialog2.default, { show: this.props.show, title: title, body: body, footer: footer,
	        handleClick: this.props.handleClick });
	    } else {
	      return _react2.default.createElement(_dialog2.default, { show: this.props.show });
	    }
	  }
	});

	exports.default = DialogError;

/***/ },

/***/ 305:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Dialog = _react2.default.createClass({
	  displayName: 'Dialog',
	  renderTitle: function renderTitle() {
	    var title = this.props.title;
	    if (title.content) {
	      return title.content;
	    } else {
	      var wrapperClass = void 0;
	      wrapperClass = title.className ? title.className : title.addClass ? 'text-line-center flex-just-center ' + title.addClass : 'text-line-center flex-just-center ';

	      return _react2.default.createElement(
	        'div',
	        { className: wrapperClass },
	        _react2.default.createElement(
	          'div',
	          { className: 'p-r-l-04em color title-popup' },
	          _react2.default.createElement(
	            'label',
	            { className: 'c-50 p-r-l-04em' },
	            _localization2.default.transferText(title.textContent)
	          )
	        )
	      );
	    }
	  },
	  renderBody: function renderBody() {
	    var body = this.props.body;
	    if (body.content) {
	      return body.content;
	    } else {
	      var wrapperClass = void 0;
	      wrapperClass = body.className ? body.className : body.addClass ? 'w-100p p-t-b flex-sp-between ' + body.addClass : 'w-100p p-t-b flex-sp-between ';

	      return _react2.default.createElement(
	        'content',
	        { className: wrapperClass },
	        _react2.default.createElement(
	          'label',
	          { className: 'p-b-1em p-r-l-1em' },
	          _localization2.default.transferText(body.textContent)
	        )
	      );
	    }
	  },
	  render: function render() {
	    return this.props.show ? _react2.default.createElement(
	      'div',
	      { 'data-role': 'popup_outer_container', className: 'flex-outer-container p-fx popup in' },
	      _react2.default.createElement(
	        'div',
	        { 'data-role': 'popup_inner_container', className: 'c-50 border-radius-05em min-width-350',
	          onClick: this.props.handleClick },
	        this.renderTitle(),
	        this.renderBody(),
	        this.props.footer
	      )
	    ) : _react2.default.createElement('div', { 'data-role': 'popup_outer_container', className: 'flex-outer-container p-fx popup hidden-popup' });
	  }
	});

	exports.default = Dialog;

/***/ },

/***/ 306:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var overlay_core = function overlay_core() {};

	overlay_core.prototype = {

	  __class_name: "overlay_core",

	  toggleWaiter: function toggleWaiter(show) {
	    var self = this;
	    self.waiter_outer_container = document.querySelector('[data-role="waiter_outer_container"]');
	    self.waiter_outer_container.classList[show === true ? 'remove' : 'add']('hide');
	  }
	};

	exports.default = overlay_core;

/***/ },

/***/ 307:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(219);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _overlay_core = __webpack_require__(306);

	var _overlay_core2 = _interopRequireDefault(_overlay_core);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	var _dom_core = __webpack_require__(303);

	var _dom_core2 = _interopRequireDefault(_dom_core);

	var _websocket = __webpack_require__(290);

	var _websocket2 = _interopRequireDefault(_websocket);

	var _panel = __webpack_require__(308);

	var _panel2 = _interopRequireDefault(_panel);

	var _chats_manager = __webpack_require__(334);

	var _chats_manager2 = _interopRequireDefault(_chats_manager);

	var _description = __webpack_require__(302);

	var _description2 = _interopRequireDefault(_description);

	var _chat_resize = __webpack_require__(342);

	var _chat_resize2 = _interopRequireDefault(_chat_resize);

	var _dialogError = __webpack_require__(304);

	var _dialogError2 = _interopRequireDefault(_dialogError);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ChatApp = _react2.default.createClass({
	  displayName: 'ChatApp',
	  getInitialState: function getInitialState() {
	    return {
	      windowWidth: window.innerWidth,
	      userInfo: {},
	      errorMessageAbortConnection: null,
	      scrollEachChat: true
	    };
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      LEFT: 'left',
	      RIGHT: 'right'
	    };
	  },
	  handleResize: function handleResize() {
	    this.setState({ windowWidth: window.innerWidth });
	  },
	  componentDidMount: function componentDidMount() {
	    _event_bus2.default.on('websocket_abortConnection', this.abortConnection, this);
	    _event_bus2.default.on('logout', this.logout, this);
	    _event_bus2.default.on('setUserId', this.logout, this);
	    _event_bus2.default.on('changeScrollEachChat', this.changeScrollEachChat, this);
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    _event_bus2.default.off('websocket_abortConnection', this.abortConnection, this);
	    _event_bus2.default.off('logout', this.logout, this);
	    _event_bus2.default.off('setUserId', this.logout, this);
	    _event_bus2.default.off('changeScrollEachChat', this.changeScrollEachChat, this);
	  },
	  componentWillMount: function componentWillMount() {
	    var self = this,
	        userId = _users_bus2.default.getUserId();
	    if (!userId) {
	      _reactRouter.browserHistory.push('/login');
	    } else {
	      _users_bus2.default.getMyInfo(null, function (error, _options, userInfo) {
	        self.setState({ userInfo: userInfo, locationQuery: self.props.location.query });
	        self.toggleWaiter();
	      });
	    }
	  },
	  changeLanguage: function changeLanguage(lang) {
	    _localization2.default.changeLanguage(lang, this);
	  },
	  abortConnection: function abortConnection(message) {
	    this.setState({ errorMessageAbortConnection: message });
	  },
	  handleDialogAbortConnection: function handleDialogAbortConnection(event) {
	    var element = this.getDataParameter(event.target, 'action');
	    if (element) {
	      switch (element.dataset.action) {
	        case 'confirmCancel':
	          this.setState({ errorMessageAbortConnection: null });
	          break;
	        case 'confirmOk':
	          this.setState({ errorMessageAbortConnection: null });
	          _websocket2.default.createAndListen();
	          break;
	      }
	    }
	  },
	  changeScrollEachChat: function changeScrollEachChat(element) {
	    this.setState({ scrollEachChat: element.checked });
	  },
	  logout: function logout(user_id) {
	    var _this = this;

	    var self = this;
	    if (!user_id) {
	      (function () {
	        var panelDescription = {};
	        _this.toggleWaiter(true);
	        _event_bus2.default.trigger('getPanelDescription', function (description, location) {
	          panelDescription[location] = description;
	        });
	        _this.savePanelStates(panelDescription, function () {
	          self.toggleWaiter();
	          _reactRouter.browserHistory.push('/login');
	        });
	      })();
	    }
	  },
	  savePanelStates: function savePanelStates(panelDescription, callback) {
	    var self = this;
	    _users_bus2.default.getMyInfo(null, function (error, options, userInfo) {
	      if (error) return callback(error);

	      panelDescription.left.joinUser_ListOptions.readyForRequest = false;
	      self.extend(userInfo, panelDescription);
	      _users_bus2.default.saveMyInfo(userInfo, function (err) {
	        if (err) return callback(err);

	        callback();
	      });
	    });
	  },
	  handleEvents: function handleEvents(event) {
	    this.descriptionContext.showDescription(event);

	    if (event.type === 'mouseup' || event.type === 'touchend') {
	      _event_bus2.default.trigger('onMouseUp', event);
	    }
	  },
	  render: function render() {
	    var _this2 = this;

	    if (this.state.userInfo && this.state.userInfo.hasOwnProperty('user_id')) {
	      var handleEvent = {
	        changeLanguage: this.changeLanguage
	      };
	      return _react2.default.createElement(
	        'div',
	        { onMouseDown: this.handleEvents,
	          onMouseMove: this.handleEvents,
	          onMouseUp: this.handleEvents,
	          onClick: this.handleEvents,
	          onTouchEnd: this.handleEvents,
	          onTouchMove: this.handleEvents,
	          onTouchStart: this.handleEvents },
	        _react2.default.createElement(_panel2.default, { location: this.props.LEFT, locationQuery: this.state.locationQuery, userInfo: this.state.userInfo }),
	        _react2.default.createElement(
	          'div',
	          { 'data-role': 'main_container',
	            className: this.state.scrollEachChat ? "w-100p h-100p p-abs" : "w-100p p-abs" },
	          _react2.default.createElement(_chats_manager2.default, { scrollEachChat: this.state.scrollEachChat })
	        ),
	        _react2.default.createElement(_panel2.default, { location: this.props.RIGHT, userInfo: this.state.userInfo, data: this.state,
	          handleEvent: handleEvent }),
	        _react2.default.createElement(_dialogError2.default, { show: this.state.errorMessageAbortConnection, message: this.state.errorMessageAbortConnection,
	          handleClick: this.handleDialogAbortConnection, footer: { content: _react2.default.createElement(
	              'div',
	              { className: 'flex-sp-around p-05em border-popup-footer' },
	              _react2.default.createElement(
	                'button',
	                { className: 'border-radius-04em p-tb-03em-lr-1em', 'data-action': 'confirmCancel' },
	                _localization2.default.getLocText(20)
	              ),
	              _react2.default.createElement(
	                'button',
	                { className: 'border-radius-04em p-tb-03em-lr-1em', 'data-action': 'confirmOk' },
	                _localization2.default.getLocText(124)
	              )
	            ) } }),
	        _react2.default.createElement(_description2.default, { ref: function ref(obj) {
	            return _this2.descriptionContext = obj;
	          } }),
	        _react2.default.createElement(_chat_resize2.default, null)
	      );
	    } else {
	      return _react2.default.createElement('div', null);
	    }
	  }
	});

	_extend_core2.default.prototype.inherit(ChatApp, _overlay_core2.default);
	_extend_core2.default.prototype.inherit(ChatApp, _extend_core2.default);
	_extend_core2.default.prototype.inherit(ChatApp, _dom_core2.default);

	exports.default = ChatApp;

/***/ },

/***/ 308:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _overlay_core = __webpack_require__(306);

	var _overlay_core2 = _interopRequireDefault(_overlay_core);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _dom_core = __webpack_require__(303);

	var _dom_core2 = _interopRequireDefault(_dom_core);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	var _chats_bus = __webpack_require__(309);

	var _chats_bus2 = _interopRequireDefault(_chats_bus);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _switcher_core = __webpack_require__(310);

	var _switcher_core2 = _interopRequireDefault(_switcher_core);

	var _websocket = __webpack_require__(290);

	var _websocket2 = _interopRequireDefault(_websocket);

	var _webrtc = __webpack_require__(311);

	var _webrtc2 = _interopRequireDefault(_webrtc);

	var _triple_element = __webpack_require__(295);

	var _triple_element2 = _interopRequireDefault(_triple_element);

	var _extra_toolbar = __webpack_require__(313);

	var _extra_toolbar2 = _interopRequireDefault(_extra_toolbar);

	var _filter = __webpack_require__(314);

	var _filter2 = _interopRequireDefault(_filter);

	var _panel_toolbar = __webpack_require__(315);

	var _panel_toolbar2 = _interopRequireDefault(_panel_toolbar);

	var _body = __webpack_require__(316);

	var _body2 = _interopRequireDefault(_body);

	var _pagination = __webpack_require__(332);

	var _pagination2 = _interopRequireDefault(_pagination);

	var _go_to = __webpack_require__(333);

	var _go_to2 = _interopRequireDefault(_go_to);

	var _dialogConfirm = __webpack_require__(326);

	var _dialogConfirm2 = _interopRequireDefault(_dialogConfirm);

	var _dialogError = __webpack_require__(304);

	var _dialogError2 = _interopRequireDefault(_dialogError);

	var _dialogSuccess = __webpack_require__(331);

	var _dialogSuccess2 = _interopRequireDefault(_dialogSuccess);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var z_index = 80;

	var MODE = {
	  CREATE_CHAT: 'CREATE_CHAT',
	  JOIN_CHAT: 'JOIN_CHAT',
	  CHATS: 'CHATS',
	  USERS: 'USERS',
	  JOIN_USER: 'JOIN_USER',

	  USER_INFO_EDIT: 'USER_INFO_EDIT',
	  USER_INFO_SHOW: 'USER_INFO_SHOW',
	  DETAIL_VIEW: 'DETAIL_VIEW',

	  CONNECTIONS: 'CONNECTIONS',
	  SETTINGS_GLOBAL: 'SETTINGS_GLOBAL',

	  CREATE_BLOG: 'CREATE_BLOG',
	  JOIN_BLOG: 'JOIN_BLOG',
	  BLOGS: 'BLOGS',

	  PAGINATION: "PAGINATION",
	  GO_TO: "GO_TO",
	  FILTER: 'FILTER'
	};

	var Panel = _react2.default.createClass({
	  displayName: 'Panel',
	  getDefaultProps: function getDefaultProps() {
	    return {
	      mainContainer: {
	        "element": "div",
	        "config": {
	          "class": "flex-inner-container"
	        }
	      },
	      leftBtnConfig: {
	        "element": "button",
	        "icon": "notepad_icon",
	        "data": {
	          "action": "togglePanel",
	          "role": "mainButtonLeftPanel",
	          "description": 46
	        },
	        onload: true,
	        "class": "panel-button left-panel-button "
	      },
	      rightBtnConfig: {
	        "element": "button",
	        "icon": "folder_icon",
	        "data": {
	          "action": "togglePanel",
	          "role": "mainButtonRightPanel",
	          "description": 47
	        },
	        onload: true,
	        "class": "panel-button right-panel-button "
	      },
	      z_index: 80
	    };
	  },
	  getInitialState: function getInitialState() {
	    if (this.props.location === 'left') {
	      return {
	        openChatsInfoArray: [],
	        closingChatsInfoArray: [],
	        chat_ids: [],
	        openChats: {},
	        openedState: false,
	        left: '-700px',
	        toggleElemHide: false,
	        toggleToolbarElemHide: true,
	        bodyMode: "CREATE_CHAT",
	        avatarMode: "SHOW",
	        avatarData: '',
	        avatarPrevious: '',

	        errorMessage: null,
	        confirmMessageShowRemoteFriendshipRequest: null,
	        confirmDialog_messageData: null,

	        chats_GoToOptions: {
	          text: "chats_GoToOptions",
	          show: false,
	          rteChoicePage: true,
	          mode_change: "rte",
	          page: null,
	          pageShow: 1
	        },
	        chats_PaginationOptions: {
	          text: "chats_PaginationOptions",
	          show: false,
	          mode_change: "rte",
	          currentPage: null,
	          firstPage: 1,
	          lastPage: null,
	          showEnablePagination: false,
	          showChoicePerPage: false,
	          perPageValue: 1,
	          perPageValueShow: 1,
	          perPageValueNull: false,
	          rtePerPage: true,
	          disableBack: false,
	          disableFirst: false,
	          disableLast: false,
	          disableForward: false
	        },
	        chats_ExtraToolbarOptions: {
	          show: true
	        },
	        chats_FilterOptions: {
	          text: "chats_FilterOptions",
	          show: false
	        },
	        chats_ListOptions: {
	          text: "chats_ListOptions",
	          start: 0,
	          last: null,
	          previousStart: 0,
	          previousFinal: 0,
	          restore: false,
	          data_download: false,
	          final: null
	        },

	        users_ExtraToolbarOptions: {
	          show: true
	        },
	        users_FilterOptions: {
	          text: "users_FilterOptions",
	          show: false
	        },
	        users_GoToOptions: {
	          text: "users_GoToOptions",
	          show: false,
	          rteChoicePage: true,
	          mode_change: "rte",
	          page: null,
	          pageShow: 1
	        },
	        users_PaginationOptions: {
	          text: "users_PaginationOptions",
	          show: false,
	          mode_change: "rte",
	          currentPage: null,
	          firstPage: 1,
	          lastPage: null,
	          showEnablePagination: false,
	          showChoicePerPage: false,
	          perPageValue: 15,
	          perPageValueShow: 15,
	          perPageValueNull: false,
	          rtePerPage: true,
	          disableBack: false,
	          disableFirst: false,
	          disableLast: false,
	          disableForward: false
	        },
	        users_ListOptions: {
	          text: "users_ListOptions",
	          start: 0,
	          last: null,
	          previousStart: 0,
	          previousFinal: 0,
	          restore: false,
	          data_download: false
	        },

	        joinUser_ExtraToolbarOptions: {
	          show: false
	        },
	        joinUser_FilterOptions: {
	          show: false
	        },
	        joinUser_PaginationOptions: {
	          show: false
	        },
	        joinUser_GoToOptions: {
	          text: "joinUser_GoToOptions",
	          show: false,
	          rteChoicePage: true,
	          mode_change: "rte",
	          page: null,
	          pageShow: 1
	        },
	        joinUser_ListOptions: {
	          text: "joinUser_ListOptions",
	          readyForRequest: false,
	          userId: null,
	          messageRequest: null
	        },

	        createChat_ExtraToolbarOptions: {
	          show: false
	        },
	        createChat_FilterOptions: {
	          show: false
	        },
	        createChat_PaginationOptions: {
	          show: false
	        },
	        createChat_GoToOptions: {
	          text: "createChat_GoToOptions",
	          show: false,
	          rteChoicePage: true,
	          mode_change: "rte",
	          page: null,
	          pageShow: 1
	        },

	        joinChat_ExtraToolbarOptions: {
	          show: false
	        },
	        joinChat_FilterOptions: {
	          show: false
	        },
	        joinChat_PaginationOptions: {
	          show: false
	        },
	        joinChat_GoToOptions: {
	          text: "joinChat_GoToOptions",
	          show: false,
	          rteChoicePage: true,
	          mode_change: "rte",
	          page: null,
	          pageShow: 1
	        },
	        joinChat_ListOptions: {
	          text: "joinChat_ListOptions",
	          chatId: null,
	          messageRequest: null
	        },
	        createBlog_ExtraToolbarOptions: {
	          show: false
	        },
	        createBlog_FilterOptions: {
	          show: false
	        },
	        createBlog_PaginationOptions: {
	          show: false
	        },
	        createBlog_GoToOptions: {
	          text: "createBlog_GoToOptions",
	          show: false,
	          rteChoicePage: true,
	          mode_change: "rte",
	          page: null,
	          pageShow: 1
	        },

	        joinBlog_ExtraToolbarOptions: {
	          show: false
	        },
	        joinBlog_FilterOptions: {
	          show: false
	        },
	        joinBlog_PaginationOptions: {
	          show: false
	        },
	        joinBlog_GoToOptions: {
	          text: "joinBlog_GoToOptions",
	          show: false,
	          rteChoicePage: true,
	          mode_change: "rte",
	          page: null,
	          pageShow: 1
	        },

	        blogs_ExtraToolbarOptions: {
	          show: false
	        },
	        blogs_FilterOptions: {
	          show: false
	        },
	        blogs_PaginationOptions: {
	          show: false
	        },
	        blogs_GoToOptions: {
	          text: "blogs_GoToOptions",
	          show: false,
	          rteChoicePage: true,
	          mode_change: "rte",
	          page: null,
	          pageShow: 1
	        },
	        blogs_ListOptions: {
	          text: "blogs_ListOptions",
	          start: 0,
	          last: null,
	          previousStart: 0,
	          previousFinal: 0,
	          restore: false,
	          data_download: false
	        }
	      };
	    }
	    if (this.props.location === 'right') {
	      var _ref;

	      return _ref = {
	        openChatsInfoArray: [],
	        closingChatsInfoArray: [],
	        chat_ids: [],
	        openChats: {},
	        openedState: false,
	        right: '-700px',
	        toggleElemHide: false,
	        toggleToolbarElemHide: true,
	        bodyMode: "USER_INFO_SHOW",
	        avatarMode: "SHOW",
	        scrollEachChat: true,

	        errorMessage: null,
	        errorMessageWrongOldPassword: null,
	        errorMessagePasswordsNotMatch: null,
	        successMessageSaveChangeUserInfo: null,
	        confirmMessageLogout: null,
	        confirmDialog_messageData: null,

	        connections_ExtraToolbarOptions: {
	          show: false
	        },
	        connections_GoToOptions: {
	          show: false
	        },
	        connections_PaginationOptions: {
	          show: false
	        }
	      }, _defineProperty(_ref, 'connections_GoToOptions', {
	        show: false,
	        rteChoicePage: true,
	        mode_change: "rte"
	      }), _defineProperty(_ref, 'connections_ListOptions', {
	        text: "connections_ListOptions",
	        start: 0,
	        last: null,
	        previousStart: 0,
	        previousFinal: 0,
	        restore: false,
	        data_download: false
	      }), _defineProperty(_ref, 'userInfoEdit_ExtraToolbarOptions', {
	        show: false
	      }), _defineProperty(_ref, 'userInfoEdit_FilterOptions', {
	        show: false
	      }), _defineProperty(_ref, 'userInfoEdit_PaginationOptions', {
	        show: false
	      }), _defineProperty(_ref, 'userInfoEdit_GoToOptions', {
	        show: false,
	        rteChoicePage: true,
	        mode_change: "rte"
	      }), _defineProperty(_ref, 'userInfoShow_ExtraToolbarOptions', {
	        show: false
	      }), _defineProperty(_ref, 'userInfoShow_FilterOptions', {
	        show: false
	      }), _defineProperty(_ref, 'userInfoShow_PaginationOptions', {
	        show: false
	      }), _defineProperty(_ref, 'userInfoShow_GoToOptions', {
	        show: false,
	        rteChoicePage: true,
	        mode_change: "rte"
	      }), _ref;
	    }
	  },
	  componentWillMount: function componentWillMount() {
	    if (this.props.userInfo[this.props.location]) {
	      this.setState(this.props.userInfo[this.props.location]);
	      if (this.props.location === "left") {
	        this.setState({ 'left': '-700px', 'openedState': false });
	        return;
	      }
	      if (this.props.location === "right") {
	        this.setState({ 'right': '-700px', 'openedState': false });
	      }
	    } else {
	      this.setState({ userInfo: this.props.userInfo });
	    }
	  },
	  componentDidMount: function componentDidMount() {
	    document.addEventListener('load', this.handleLoad, true);
	    window.addEventListener('resize', this.resizePanel, false);
	    _event_bus2.default.on('getPanelDescription', this.getPanelDescription);
	    if (this.props.location === "left") {
	      _event_bus2.default.on('AddedNewChat', this.toggleListOptions);
	      _event_bus2.default.on('changeOpenChats', this.getInfoForBody);
	      _event_bus2.default.on('changeMyUsers', this.changeMyUsers);
	      _event_bus2.default.on('web_socket_message', this.onPanelMessageRouter);
	      _event_bus2.default.on('makeFriends', this.onForceMakeFriends);
	      this.outerContainer = document.querySelector('[data-role="left_panel_outer_container"]');
	      this.inner_container = document.querySelector('[data-role="left_panel_inner_container"]');
	      this.outerContainer.style.right = '100vw';
	    }
	    if (this.props.location === "right") {
	      _event_bus2.default.on('changeConnection', this.changeConnection, this);
	      _event_bus2.default.on('changeUsersConnections', this.changeConnection, this);
	      _event_bus2.default.on('updateUserAvatar', this.updateUserAvatar, this);
	      this.outerContainer = document.querySelector('[data-role="right_panel_outer_container"]');
	      this.inner_container = document.querySelector('[data-role="right_panel_inner_container"]');
	      this.outerContainer.style.left = '100vw';
	    }
	    this.togglePanelElement = this.outerContainer.querySelector('[data-action="togglePanel"]');
	    this.togglePanelElementToolbar = this.outerContainer.querySelector('[data-role="togglePanelToolbar"]');
	    this.panelBody = this.outerContainer.querySelector('[data-role="panel_body"]');

	    this.outerContainer.classList.remove("hide");
	    this.outerContainer.style.maxWidth = window.innerWidth + 'px';
	    this.outerContainer.style.zIndex = this.props.z_index;

	    this.outerContainer.addEventListener('transitionend', this.handleTransitionEnd);
	    if (this.props.location === "left" && this.props.locationQuery && this.props.locationQuery.join_chat_id) {
	      var options = {
	        chatId: this.props.locationQuery.join_chat_id,
	        bodyMode: MODE.JOIN_CHAT,
	        messageRequest: 113,
	        force: true
	      };
	      this.togglePanel(null, options);
	    }
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    document.removeEventListener('load', this.handleLoad);
	    window.removeEventListener('resize', this.resizePanel);
	    _event_bus2.default.off('getPanelDescription', this.getPanelDescription);
	    if (this.props.location === "left") {
	      _event_bus2.default.off('AddedNewChat', this.toggleListOptions);
	      _event_bus2.default.off('changeOpenChats', this.getInfoForBody);
	      _event_bus2.default.off('changeMyUsers', this.changeMyUsers);
	      _event_bus2.default.off('web_socket_message', this.onPanelMessageRouter);
	    } else if (this.props.location === "right") {
	      _event_bus2.default.off('changeConnection', this.changeConnection, this);
	      _event_bus2.default.off('changeUsersConnections', this.changeConnection, this);
	      _event_bus2.default.off('updateUserAvatar', this.updateUserAvatar, this);
	    }

	    this.outerContainer = null;
	    this.inner_container = null;
	    this.togglePanelElement = null;
	    this.togglePanelElementToolbar = null;
	    this.panelBody = null;
	    this.userName = null;
	    this.oldPassword = null;
	    this.newPassword = null;
	    this.confirmPassword = null;
	  },
	  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	    this.resizePanel();
	    if (this.state.bodyMode === MODE.USER_INFO_EDIT) {
	      this.userName = this.panelBody.querySelector('[data-main="user_name_input"]');
	      this.oldPassword = this.panelBody.querySelector('[data-role="passwordOld"]');
	      this.newPassword = this.panelBody.querySelector('[data-role="passwordNew"]');
	      this.confirmPassword = this.panelBody.querySelector('[data-role="passwordConfirm"]');
	    }
	    if (!this.state.userInfo) {
	      this.setState({ userInfo: this.props.userInfo });
	    }
	  },
	  handleClick: function handleClick(event) {
	    var element = this.getDataParameter(event.currentTarget, 'action'),
	        currentOptions = void 0,
	        gto = void 0,
	        po = void 0,
	        self = this;
	    if (element) {
	      switch (element.dataset.action) {
	        case 'togglePanel':
	          this.togglePanel(false);
	          break;
	        case 'show_more_info':
	          this.showMoreInfo(element);
	          break;
	        case 'switchPanelMode':
	          this.switchPanelMode(element);
	          break;
	        case 'changeMode':
	          this.changeMode(element);
	          break;
	        case 'changeRTE':
	          currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
	          currentOptions = _filter2.default.prototype.changeRTE(element, currentOptions);
	          if (currentOptions.paginationOptions.rtePerPage) {
	            _pagination2.default.prototype.countPagination(currentOptions, null, this.state.bodyMode, null, function (_newState) {
	              self.setState(_newState);
	            });
	          } else {
	            this.setState(currentOptions);
	          }
	          break;
	        case 'showPerPage':
	          currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
	          currentOptions.paginationOptions.currentPage = null;
	          if (currentOptions.paginationOptions.showEnablePagination) {
	            _pagination2.default.prototype.countPagination(currentOptions, null, this.state.bodyMode, null, function (_newState) {
	              self.setState(_newState);
	            });
	          }
	          break;
	        case 'changeRTE_goTo':
	          currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
	          currentOptions = _go_to2.default.prototype.changeRTE(element, currentOptions);
	          if (currentOptions.goToOptions.rteChoicePage) {
	            _pagination2.default.prototype.countPagination(currentOptions, null, this.state.bodyMode, null, function (_newState) {
	              self.setState(_newState);
	            });
	          } else {
	            this.setState(currentOptions);
	          }
	          break;
	        case "switchPage":
	          currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
	          gto = currentOptions.goToOptions;
	          po = currentOptions.paginationOptions;
	          if (gto.page) {
	            po.currentPage = gto.page;
	          }
	          _pagination2.default.prototype.countPagination(currentOptions, null, this.state.bodyMode, null, function (_newState) {
	            self.setState(_newState);
	          });
	          break;
	        case 'changeUserInfo':
	          this.changeUserInfo();
	          break;
	        case 'cancelChangeUserInfo':
	          this.cancelChangeUserInfo();
	          break;
	        case 'saveChangeUserInfo':
	          this.saveChangeUserInfo();
	          break;
	        case 'logout':
	          this.logout();
	          break;
	        case 'requestChatByChatId':
	          this.requestChatByChatId();
	          break;
	        case 'showChat':
	          _event_bus2.default.trigger('showChat', element);
	          break;
	        case 'addNewChatAuto':
	          if (this.props.location !== "left") return;
	          _event_bus2.default.trigger('addNewChatAuto', event);
	          break;
	        case 'closeChat':
	          if (this.props.location !== "left") return;
	          this.closeChat(element);
	          break;
	        case 'requestFriendByUserId':
	          if (this.props.location !== "left") return;
	          this.requestFriendByUserId(element);
	          break;
	        case 'copyUserId':
	          this.copyUserId();
	          break;
	      }
	    }
	  },
	  handleLoad: function handleLoad(event) {
	    if (!this.togglePanelElement) return;
	    if (this.props.location === "left" && event.target.dataset.onload && event.target.dataset.role === 'mainButtonLeftPanel') {
	      this.togglePanelElement_clientWidth = this.togglePanelElement.clientWidth;
	    }
	    if (this.props.location === "right" && event.target.dataset.onload && event.target.dataset.role === 'mainButtonRightPanel') {
	      this.togglePanelElement_clientWidth = this.togglePanelElement.clientWidth;
	    }
	    this.resizePanel();
	  },
	  changeMyUsers: function changeMyUsers() {
	    this.getInfoForBody();
	  },
	  copyUserId: function copyUserId() {
	    var input = this.inner_container.querySelector('[data-role="user_id"]');
	    input.disabled = false;
	    input.focus();
	    input.select();
	    try {
	      var successful = document.execCommand('copy'),
	          msg = successful ? 'successful' : 'unsuccessful';
	      console.log('Copy userId was ' + msg);
	    } catch (err) {
	      console.log('Oops, unable to copy');
	    }
	    input.disabled = true;
	  },
	  onInput: function onInput() {},
	  handleChange: function handleChange(event) {
	    var currentOptions = void 0,
	        self = this;
	    switch (event.target.dataset.role) {
	      case 'selectLanguage':
	        this.onChangeLanguage(event);
	        break;
	      case 'userName':
	        this.state.userInfo.userName = event.target.value;
	        this.setState({ userName: this.state.userInfo });
	        break;
	    }
	    var element = this.getDataParameter(event.currentTarget, 'action');
	    if (element) {
	      switch (element.dataset.action) {
	        case 'changePerPage':
	          currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
	          currentOptions = _filter2.default.prototype.changePerPage(element, currentOptions);
	          if (currentOptions.paginationOptions.show && currentOptions.paginationOptions.rtePerPage) {
	            _pagination2.default.prototype.countPagination(currentOptions, null, this.state.bodyMode, null, function (_newState) {
	              self.setState(_newState);
	            });
	          } else {
	            self.setState({ currentOptions: currentOptions });
	          }
	          break;
	        case 'changePage':
	          currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
	          currentOptions = _pagination2.default.prototype.changePage(element, currentOptions);
	          _pagination2.default.prototype.countPagination(currentOptions, null, this.state.bodyMode, null, function (_newState) {
	            self.setState(_newState);
	          });
	          break;
	        case 'scrollEachChat':
	          if (this.props.location !== "right") return;
	          _event_bus2.default.trigger('changeScrollEachChat', element);
	          this.setState({ scrollEachChat: element.checked });
	          break;
	        case 'readyForFriendRequest':
	          if (this.props.location !== "left") return;
	          this.readyForFriendRequest(element);
	          break;
	      }
	    }
	  },
	  handleDialogError: function handleDialogError() {
	    this.setState({ errorMessage: null });
	  },
	  handleDialogWrongOldPassword: function handleDialogWrongOldPassword() {
	    this.oldPassword.value = '';
	    this.newPassword.value = '';
	    this.confirmPassword.value = '';
	    this.setState({ errorMessageWrongOldPassword: null });
	  },
	  handleDialogPasswordsNotMatch: function handleDialogPasswordsNotMatch() {
	    this.newPassword.value = '';
	    this.confirmPassword.value = '';
	    this.setState({ errorMessagePasswordsNotMatch: null });
	  },
	  handleDialogSaveChangeUserInfo: function handleDialogSaveChangeUserInfo() {
	    this.setState({ bodyMode: MODE.USER_INFO_SHOW, successMessageSaveChangeUserInfo: null });
	    this.previous_UserInfo_Mode = MODE.USER_INFO_SHOW;
	    this.user = null;
	  },
	  handleDialogLogout: function handleDialogLogout(event) {
	    var element = this.getDataParameter(event.target, 'action');
	    if (element) {
	      switch (element.dataset.action) {
	        case 'confirmCancel':
	          break;
	        case 'confirmOk':
	          _users_bus2.default.setUserId(null);
	          _event_bus2.default.trigger("chatsDestroy");
	          break;
	      }
	      this.setState({ confirmMessageLogout: null });
	    }
	  },
	  handleDialogShowRemoteFriendshipRequest: function handleDialogShowRemoteFriendshipRequest(event) {
	    var element = this.getDataParameter(event.target, 'action');
	    if (element) {
	      switch (element.dataset.action) {
	        case 'confirmCancel':
	          break;
	        case 'confirmOk':
	          var messageData = this.state.confirmDialog_messageData;
	          this.listenWebRTCConnection(messageData.from_user_id);
	          this.listenNotifyUser(messageData.from_user_id);
	          _websocket2.default.sendMessage({
	            type: "friendship_confirmed",
	            from_user_id: _users_bus2.default.getUserId(),
	            to_user_id: messageData.from_user_id,
	            request_body: messageData.request_body
	          });
	          console.log('handleConnectedDevices', messageData.user_wscs_descrs);
	          _webrtc2.default.handleConnectedDevices(messageData.user_wscs_descrs);
	          break;
	      }
	      this.setState({ confirmMessageShowRemoteFriendshipRequest: null, confirmDialog_messageData: null });
	    }
	  },
	  handleTransitionEnd: function handleTransitionEnd(event) {
	    if (event.target.dataset && event.target.dataset.role === 'detail_view_container') {
	      var chatIdValue = event.target.dataset.chat_id;
	      var resultClosing = this.state.closingChatsInfoArray.indexOf(chatIdValue);
	      if (resultClosing !== -1) {
	        this.state.closingChatsInfoArray.splice(this.state.closingChatsInfoArray.indexOf(chatIdValue), 1);
	        this.setState({
	          closingChatsInfoArray: this.state.closingChatsInfoArray
	        });
	      }
	    }
	  },
	  closeChat: function closeChat(element) {
	    if (this.props.location === "left") {
	      var parentElement = this.traverseUpToDataset(element, 'role', 'chatWrapper');
	      var chatId = parentElement.dataset.chat_id;
	      _event_bus2.default.trigger('toCloseChat', element.dataset.role, chatId);
	    }
	  },
	  logout: function logout() {
	    this.setState({ confirmMessageLogout: 106 });
	  },
	  requestChatByChatId: function requestChatByChatId() {
	    var chat_id_input = this.inner_container.querySelector('[data-role="chat_id_input"]'),
	        chat_message_input = this.inner_container.querySelector('[data-role="chat_message_input"]'),
	        requestButton = this.inner_container.querySelector('[data-action="requestChatByChatId"]'),
	        newState = void 0;

	    if (requestButton && chat_id_input && chat_id_input.value && chat_message_input && chat_message_input.value) {
	      _event_bus2.default.trigger('requestChatByChatId', chat_id_input.value, chat_message_input.value);
	    } else {
	      this.setState({ errorMessage: 90 });
	    }
	  },
	  togglePanel: function togglePanel(forceClose, options) {
	    this.openOrClosePanel(this.outerContainer.clientWidth + this.togglePanelElement.clientWidth > document.body.clientWidth, forceClose, options);
	  },
	  openOrClosePanel: function openOrClosePanel(bigMode, forceClose, options) {
	    if (this.props.location === 'left' && this.outerContainer.style.right === '100vw') {
	      this.outerContainer.style.right = '';
	    }
	    if (this.props.location === 'right' && this.outerContainer.style.left === '100vw') {
	      this.outerContainer.style.left = '';
	    }

	    if (!forceClose && !this.state.openedState) {
	      this.previous_z_index = this.outerContainer.style.zIndex;
	      this.outerContainer.style.zIndex = ++z_index;
	      this.inner_container.style.maxWidth = this.calcMaxWidth();
	      this.setState(_defineProperty({
	        openedState: true
	      }, this.props.location, '0px'));
	      this.getInfoForBody(this.state.bodyMode, options);
	    } else {
	      z_index--;
	      this.setState(_defineProperty({
	        openedState: false
	      }, this.props.location, -this.outerContainer.offsetWidth + 'px'));
	      this.outerContainer.style.zIndex = this.previous_z_index;
	      if (bigMode === true) {
	        this.setState({
	          toggleElemHide: false,
	          toggleToolbarElemHide: true
	        });
	      } else {
	        this.setState({
	          toggleElemHide: false
	        });
	      }
	    }
	  },
	  switchPanelMode: function switchPanelMode(element, options) {
	    if (element.dataset.mode_to === MODE.USER_INFO_SHOW && this.previous_UserInfo_Mode) {
	      this.setState({ bodyMode: this.previous_UserInfo_Mode });
	    } else {
	      this.setState({ bodyMode: element.dataset.mode_to });
	    }
	    this.previous_Filter_Options = false;
	    this.previous_BodyMode = this.state.bodyMode;

	    if (this.state.bodyMode === MODE.USER_INFO_SHOW) {
	      this.previous_UserInfo_Mode = MODE.USER_INFO_SHOW;
	    }
	    this.getInfoForBody(element.dataset.mode_to, options);
	  },
	  getInfoForBody: function getInfoForBody(mode, options) {
	    var self = this,
	        currentOptions = void 0;
	    if (options && options.bodyMode) {
	      mode = options.bodyMode;
	    }
	    if (!mode) {
	      mode = this.state.bodyMode;
	    }
	    if (mode === MODE.USERS) {
	      _users_bus2.default.getMyInfo(null, function (error, options, userInfo) {
	        _users_bus2.default.getContactsInfo(error, userInfo.user_ids, function (_error, contactsInfo) {
	          if (_error) {
	            console.error(_error);
	            return;
	          }
	          currentOptions = self.optionsDefinition(self.state, mode);
	          if (currentOptions.paginationOptions.show && currentOptions.paginationOptions.rtePerPage) {
	            _pagination2.default.prototype.countPagination(currentOptions, null, mode, null, function (_newState) {
	              self.setState({ _newState: _newState, "userInfo": userInfo, "contactsInfo": contactsInfo });
	            });
	          } else {
	            self.setState({ "userInfo": userInfo, "contactsInfo": contactsInfo });
	          }
	        });
	      });
	    }
	    if (mode === MODE.CHATS && this.props.location === 'left') {
	      _chats_bus2.default.getAllChats(null, function (error, chatsArray) {
	        if (error) {
	          console.error(error);
	          return;
	        }
	        _event_bus2.default.trigger("getOpenChats", function (openChats) {
	          currentOptions = self.optionsDefinition(self.state, mode);
	          if (currentOptions.paginationOptions.show && currentOptions.paginationOptions.rtePerPage) {
	            _pagination2.default.prototype.countPagination(currentOptions, null, mode, null, function (_newState) {
	              self.setState({ _newState: _newState, "chat_ids": chatsArray, "openChats": openChats });
	            });
	          } else {
	            self.setState({ "chat_ids": chatsArray, "openChats": openChats });
	          }
	        });
	      });
	    }
	    if (mode === MODE.JOIN_USER && this.props.location === 'left') {
	      if (options && options.userId) {
	        if (options.force) {
	          this.state.joinUser_ListOptions.userId = options.userId;
	          this.state.joinUser_ListOptions.messageRequest = options.messageRequest;
	          this.setState({
	            joinUser_ListOptions: this.state.joinUser_ListOptions,
	            bodyMode: options.bodyMode
	          });
	        }
	      } else {
	        this.state.joinUser_ListOptions.userId = null;
	        this.state.joinUser_ListOptions.messageRequest = null;
	        this.setState({ joinUser_ListOptions: this.state.joinUser_ListOptions });
	      }
	    }
	    if (mode === MODE.JOIN_CHAT && this.props.location === 'left') {
	      if (options && options.chatId) {
	        if (options.force) {
	          this.state.joinChat_ListOptions.chatId = options.chatId;
	          this.state.joinChat_ListOptions.messageRequest = options.messageRequest;
	          this.setState({
	            joinChat_ListOptions: this.state.joinChat_ListOptions,
	            bodyMode: options.bodyMode
	          });
	        }
	      } else {
	        this.state.joinChat_ListOptions.chatId = null;
	        this.state.joinChat_ListOptions.messageRequest = null;
	        this.setState({ joinChat_ListOptions: this.state.joinChat_ListOptions });
	      }
	    }
	  },
	  setUserInfo: function setUserInfo(userInfo) {
	    this.setState({ userInfo: userInfo });
	  },
	  calcMaxWidth: function calcMaxWidth() {
	    return document.body.offsetWidth + 'px';
	  },
	  showMoreInfo: function showMoreInfo(element) {
	    var chatIdValue = element.dataset.chat_id,
	        detailView = element.querySelector('[data-role="detail_view_container"]'),
	        pointer = element.querySelector('[data-role="pointer"]'),
	        resultClosing = this.state.closingChatsInfoArray.indexOf(chatIdValue);
	    if (resultClosing !== -1) return;
	    if (detailView.dataset.state) {
	      this.state.openChatsInfoArray.splice(this.state.openChatsInfoArray.indexOf(chatIdValue), 1);
	      this.state.closingChatsInfoArray.push(chatIdValue);
	      this.setState({
	        closingChatsInfoArray: this.state.closingChatsInfoArray,
	        openChatsInfoArray: this.state.openChatsInfoArray
	      });
	      return;
	    }

	    if (element) {
	      this.state.openChatsInfoArray.push(chatIdValue);
	      this.setState({
	        openChatsInfoArray: this.state.openChatsInfoArray
	      });
	    }
	  },
	  changeMode: function changeMode(element) {
	    if (!element || !element.dataset) return;
	    var chat_part = element.dataset.chat_part,
	        newMode = element.dataset.mode_to,
	        currentOptions = void 0,
	        po = void 0,
	        fo = void 0,
	        self = this;
	    switch (chat_part) {
	      case "filter":
	        switch (newMode) {
	          case "CHATS_FILTER":
	          case "USERS_FILTER":
	            currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
	            fo = currentOptions.filterOptions;
	            fo.show = fo.show.toString() !== "true";
	            this.setState(_defineProperty({}, fo.text, fo));
	            break;
	        }
	        break;
	      case "pagination":
	        switch (newMode) {
	          case "PAGINATION":
	            switch (this.state.bodyMode) {
	              case "CHATS":
	              case "USERS":
	                currentOptions = this.optionsDefinition(this.state, this.state.bodyMode);
	                po = currentOptions.paginationOptions;
	                po.show = element.checked;
	                po.showEnablePagination = element.checked;
	                if (!po.showEnablePagination) {
	                  po.start = 0;
	                  po.final = null;
	                } else {
	                  _pagination2.default.prototype.countPagination(currentOptions, null, self.state.bodyMode, { chat_id: self.state.chat_id }, function (_newState) {
	                    self.setState(_newState);
	                  });
	                }
	                this.setState(_defineProperty({}, po.text, po));
	                break;
	            }
	            break;
	          case "GO_TO":
	            break;
	        }
	        break;
	    }
	  },
	  changeUserInfo: function changeUserInfo() {
	    this.setState({ bodyMode: MODE.USER_INFO_EDIT });
	    this.previous_UserInfo_Mode = MODE.USER_INFO_EDIT;
	  },
	  cancelChangeUserInfo: function cancelChangeUserInfo() {
	    this.setState({ bodyMode: MODE.USER_INFO_SHOW });
	    this.previous_UserInfo_Mode = MODE.USER_INFO_SHOW;
	  },
	  saveChangeUserInfo: function saveChangeUserInfo() {
	    var self = this;
	    if (this.userName.value && this.oldPassword.value && this.newPassword.value && this.confirmPassword.value) {
	      if (this.oldPassword.value === this.state.userInfo.userPassword) {
	        if (this.newPassword.value === this.confirmPassword.value) {
	          this.updateUserInfo(function () {
	            self.setState({ successMessageSaveChangeUserInfo: 105 });
	          });
	        } else {
	          this.setState({ errorMessagePasswordsNotMatch: 94 });
	        }
	      } else {

	        this.setState({ errorMessageWrongOldPassword: 95 });
	      }
	    } else {
	      this.setState({ errorMessage: 88 });
	    }
	  },
	  updateUserInfo: function updateUserInfo(callback) {
	    var self = this;
	    _users_bus2.default.getMyInfo(null, function (err, options, userInfo) {
	      userInfo.userPassword = self.newPassword.value;
	      userInfo.userName = self.userName.value;
	      _users_bus2.default.saveMyInfo(userInfo, callback);
	    });
	  },
	  updateUserAvatar: function updateUserAvatar() {
	    var self = this;
	    _users_bus2.default.getMyInfo(null, function (_err, options, userInfo) {
	      self.setState({ userInfo: userInfo });
	    });
	  },
	  getPanelDescription: function getPanelDescription(callback) {
	    if (callback) {
	      this.state.chat_ids = [];
	      this.state.openChats = [];
	      this.state.avatarMode = "SHOW";
	      this.state.confirmMessageLogout = null;
	      callback(this.state, this.props.location);
	    }
	  },
	  changeConnection: function changeConnection() {
	    if (this.state.openedState) {
	      _event_bus2.default.trigger('changeConnectionList');
	    }
	  },
	  resizePanel: function resizePanel() {
	    if (this.state.openedState && this.outerContainer) {
	      if (this.outerContainer.clientWidth + this.togglePanelElement_clientWidth > document.body.clientWidth) {
	        this.inner_container.style.maxWidth = this.calcMaxWidth();

	        if (!this.state.toggleElemHide) {
	          this.setState({
	            toggleElemHide: true
	          });
	        }
	        if (this.togglePanelElementToolbar) {
	          if (this.state.toggleToolbarElemHide) {
	            this.setState({
	              toggleToolbarElemHide: false
	            });
	          }
	        }
	      } else {
	        if (this.state.toggleElemHide) {
	          this.setState({
	            toggleElemHide: false
	          });
	        }
	        if (this.togglePanelElementToolbar) {
	          if (!this.state.toggleToolbarElemHide) {
	            this.setState({
	              toggleToolbarElemHide: true
	            });
	          }
	        }
	      }
	    } else {
	      if (this.state.toggleElemHide) {
	        this.setState({
	          toggleElemHide: false
	        });
	      }
	    }
	  },
	  onChangeLanguage: function onChangeLanguage(event) {
	    this.props.handleEvent.changeLanguage(event.target.value);
	  },
	  toggleListOptions: function toggleListOptions(chatsLength) {
	    if (this.props.location === "left") {
	      this.state.chats_ListOptions.final = chatsLength;
	      this.setState({ chats_ListOptions: this.state.chats_ListOptions });
	    }
	  },
	  changeState: function changeState(newState) {
	    this.setState(newState);
	  },
	  renderHandlers: function renderHandlers(events) {
	    var handlers = {};
	    if (events) {
	      for (var dataKey in events) {
	        handlers[dataKey] = events[dataKey];
	      }
	    }
	    return handlers;
	  },
	  onForceMakeFriends: function onForceMakeFriends(userId, element) {
	    var options = {
	      userId: userId,
	      bodyMode: MODE.JOIN_USER,
	      messageRequest: 110,
	      force: true
	    };
	    if (this.state.openedState) {
	      this.switchPanelMode(element, options);
	    } else {
	      this.togglePanel(null, options);
	    }
	  },
	  requestFriendByUserId: function requestFriendByUserId() {
	    var user_id_input = this.inner_container.querySelector('[data-role="user_id_input"]'),
	        user_message_input = this.inner_container.querySelector('[data-role="user_message_input"]'),
	        requestButton = this.inner_container.querySelector('[data-action="requestFriendByUserId"]');

	    if (requestButton && user_id_input && user_id_input.value && user_message_input && user_message_input.value) {
	      _websocket2.default.sendMessage({
	        type: "user_add",
	        from_user_id: _users_bus2.default.getUserId(),
	        avatar_data: this.state.userInfo.avatar_data,
	        to_user_id: user_id_input.value,
	        request_body: {
	          message: user_message_input.value
	        }
	      });
	    } else {
	      this.setState({ errorMessage: 89 });
	    }
	  },
	  readyForFriendRequest: function readyForFriendRequest(element) {
	    this.state.joinUser_ListOptions.readyForRequest = element.checked;
	    this.setState({ joinUser_ListOptions: this.state.joinUser_ListOptions });
	    _websocket2.default.sendMessage({
	      type: "user_toggle_ready",
	      from_user_id: _users_bus2.default.getUserId(),
	      ready_state: element.checked
	    });
	  },


	  /**
	   * handle message from web-socket (if it is connected with chats some how)
	   */
	  onPanelMessageRouter: function onPanelMessageRouter(messageData) {
	    if (this.props.location !== "left") {
	      return;
	    }
	    switch (messageData.type) {
	      case 'user_add':
	        if (this.state.bodyMode === MODE.JOIN_USER) {
	          this.showRemoteFriendshipRequest(messageData);
	        }
	        break;
	      case 'user_add_sent':
	        if (this.state.bodyMode === MODE.JOIN_USER) {
	          _event_bus2.default.set_ws_device_id(messageData.from_ws_device_id);
	          this.listenNotifyUser(messageData.to_user_id);
	        }
	        break;
	      case 'friendship_confirmed':
	        if (messageData.user_wscs_descrs) {
	          this.listenWebRTCConnection(messageData.from_user_id);
	          console.log('handleConnectedDevices', messageData.user_wscs_descrs);
	          _webrtc2.default.handleConnectedDevices(messageData.user_wscs_descrs);
	        }
	        break;
	      case 'device_toggled_ready':
	        _event_bus2.default.set_ws_device_id(messageData.from_ws_device_id);
	        break;
	      case 'error':
	        switch (messageData.request_type) {
	          case 'user_add_sent':
	            this.setState({ errorMessage: 115 });
	            break;
	        }
	        break;
	    }
	  },
	  onNotifyUser: function onNotifyUser(user_id, messageData) {
	    var self = this;
	    console.log('onNotifyUser', user_id);
	    _users_bus2.default.addNewUserToIndexedDB(messageData.user_description, function (error, user_description) {
	      if (error) {
	        console.error(error);
	        return;
	      }

	      _users_bus2.default.putUserIdAndSave(user_id, function (_err) {
	        if (_err) {
	          return console.error(_err);
	        }

	        _event_bus2.default.trigger('changeMyUsers');
	        if (self.state.bodyMode === MODE.USERS) {
	          self.getInfoForBody(self.state.bodyMode);
	        }
	      });
	      console.log('putUserIdAndSave', user_id);
	      self.notListenNotifyUser();
	    });
	  },
	  webRTCConnectionReady: function webRTCConnectionReady(user_id, triggerConnection) {
	    var _this = this;
	    console.log('webRTCConnectionReady', triggerConnection.hasUserId(user_id), user_id);
	    if (triggerConnection.hasUserId(user_id)) {
	      // if connection for user friendship
	      _this.notListenWebRTCConnection();
	      _users_bus2.default.getUserDescription({}, function (error, user_description) {
	        if (error) {
	          console.error(error);
	          return;
	        }
	        var messageData = {
	          type: "notifyUser",
	          user_description: user_description
	        };
	        if (triggerConnection.isActive()) {
	          triggerConnection.dataChannel.send(JSON.stringify(messageData));
	        } else {
	          console.warn('No friendship data channel!');
	        }
	      });
	    }
	  },
	  notListenWebRTCConnection: function notListenWebRTCConnection() {
	    if (this.bindedWebRTCConnectionReady) {
	      _webrtc2.default.off('webrtc_connection_established', this.bindedWebRTCConnectionReady);
	    }
	  },
	  listenWebRTCConnection: function listenWebRTCConnection(user_id) {
	    this.notListenWebRTCConnection();
	    this.bindedWebRTCConnectionReady = this.webRTCConnectionReady.bind(this, user_id);
	    _webrtc2.default.on('webrtc_connection_established', this.bindedWebRTCConnectionReady);
	  },
	  notListenNotifyUser: function notListenNotifyUser() {
	    if (this.bindedOnNotifyUser) {
	      _event_bus2.default.off('notifyUser', this.bindedOnNotifyUser);
	    }
	  },
	  listenNotifyUser: function listenNotifyUser(user_id) {
	    console.log('listenNotifyUser', user_id);
	    this.notListenNotifyUser();
	    this.bindedOnNotifyUser = this.onNotifyUser.bind(this, user_id);
	    _event_bus2.default.on('notifyUser', this.bindedOnNotifyUser);
	  },
	  showRemoteFriendshipRequest: function showRemoteFriendshipRequest(messageData) {
	    _event_bus2.default.set_ws_device_id(messageData.target_ws_device_id);
	    if (!messageData.user_wscs_descrs) {
	      return;
	    }

	    this.setState({
	      confirmMessageShowRemoteFriendshipRequest: messageData.request_body.message,
	      confirmDialog_messageData: messageData
	    });
	  },
	  render: function render() {
	    var handleEvent = {
	      changeState: this.changeState
	    };
	    var onEvent = {
	      onClick: this.handleClick,
	      onChange: this.handleChange,
	      onTransitionEnd: this.handleTransitionEnd
	    };

	    var location = this.props.location;
	    var btnConfig = location === 'left' ? this.props.leftBtnConfig : this.props.rightBtnConfig;
	    var panel_toolbar_class = location === 'left' ? 'w-100p flex-dir-col flex-item-auto c-200' : 'w-100p flex-dir-col c-200';
	    var style = _defineProperty({}, location, this.state[location]);
	    return _react2.default.createElement(
	      'div',
	      { 'data-role': location + '_panel' },
	      _react2.default.createElement(_dialogError2.default, { show: this.state.errorMessage, message: this.state.errorMessage,
	        handleClick: this.handleDialogError }),
	      _react2.default.createElement(_dialogError2.default, { show: this.state.errorMessageWrongOldPassword,
	        message: this.state.errorMessageWrongOldPassword,
	        handleClick: this.handleDialogWrongOldPassword }),
	      _react2.default.createElement(_dialogError2.default, { show: this.state.errorMessagePasswordsNotMatch,
	        message: this.state.errorMessagePasswordsNotMatch,
	        handleClick: this.handleDialogPasswordsNotMatch }),
	      _react2.default.createElement(_dialogSuccess2.default, { show: this.state.successMessageSaveChangeUserInfo,
	        message: this.state.successMessageSaveChangeUserInfo,
	        handleClick: this.handleDialogSaveChangeUserInfo }),
	      _react2.default.createElement(_dialogConfirm2.default, { show: this.state.confirmMessageLogout,
	        message: this.state.confirmMessageLogout,
	        handleClick: this.handleDialogLogout }),
	      _react2.default.createElement(_dialogConfirm2.default, { show: this.state.confirmMessageShowRemoteFriendshipRequest,
	        message: this.state.confirmMessageShowRemoteFriendshipRequest,
	        handleClick: this.handleDialogShowRemoteFriendshipRequest }),
	      _react2.default.createElement(
	        'section',
	        { style: style, 'data-role': location + '_panel_outer_container',
	          className: location + '-panel hide p-fx panel animate c-100' },
	        _react2.default.createElement(
	          'div',
	          { className: 'p-rel h-100p flex-dir-col' },
	          _react2.default.createElement(_triple_element2.default, { events: onEvent, config: btnConfig, hide: this.state.toggleElemHide }),
	          _react2.default.createElement(
	            'div',
	            { 'data-role': location + '_panel_inner_container',
	              className: 'min-width-350 flex-item-1-auto clear flex-dir-col h-100p' },
	            _react2.default.createElement(
	              'header',
	              { id: location, 'data-role': location + '_panel_toolbar', className: panel_toolbar_class },
	              _react2.default.createElement(_panel_toolbar2.default, { location: location, mode: this.state.bodyMode, events: onEvent,
	                hide: this.state.toggleToolbarElemHide })
	            ),
	            _react2.default.createElement(
	              'div',
	              { 'data-role': location + '_extra_toolbar_container',
	                className: 'flex-sp-around flex-item-auto c-200' },
	              _react2.default.createElement(_extra_toolbar2.default, { mode: this.state.bodyMode, data: this.state, events: onEvent })
	            ),
	            _react2.default.createElement(
	              'div',
	              { 'data-role': location + '_filter_container', className: 'flex wrap flex-item-auto c-200' },
	              _react2.default.createElement(_filter2.default, { mode: this.state.bodyMode, data: this.state, events: onEvent })
	            ),
	            _react2.default.createElement(
	              'div',
	              { 'data-role': 'panel_body', className: 'overflow-a flex-item-1-auto p-t', onTransitionend: this.transitionEnd },
	              _react2.default.createElement(_body2.default, { mode: this.state.bodyMode, data: this.state, options: this.props.data, events: onEvent,
	                userInfo: this.state.userInfo ? this.state.userInfo : this.props.userInfo,
	                handleEvent: handleEvent })
	            ),
	            _react2.default.createElement(
	              'footer',
	              { className: 'flex-item-auto' },
	              _react2.default.createElement(
	                'div',
	                { 'data-role': location + '_go_to_container', className: 'c-200' },
	                _react2.default.createElement(_go_to2.default, { mode: this.state.bodyMode, data: this.state, events: onEvent })
	              ),
	              _react2.default.createElement(
	                'div',
	                { 'data-role': location + '_pagination_containe',
	                  className: 'flex filter_container justContent c-200' },
	                _react2.default.createElement(_pagination2.default, { mode: this.state.bodyMode, data: this.state, events: onEvent,
	                  handleEvent: handleEvent })
	              )
	            )
	          )
	        )
	      )
	    );
	  }
	});

	_extend_core2.default.prototype.inherit(Panel, _overlay_core2.default);
	_extend_core2.default.prototype.inherit(Panel, _dom_core2.default);
	_extend_core2.default.prototype.inherit(Panel, _extend_core2.default);
	_extend_core2.default.prototype.inherit(Panel, _switcher_core2.default);

	exports.default = Panel;

/***/ },

/***/ 309:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _indexeddb = __webpack_require__(285);

	var _indexeddb2 = _interopRequireDefault(_indexeddb);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Chats_bus = function Chats_bus() {
	  // db_name - depends from user id
	  this.collectionDescription = {
	    "table_descriptions": [{
	      "table_name": 'chats',
	      "table_parameter": { "keyPath": "chat_id" }
	    }]
	  };
	  this.addEventListeners();
	};

	Chats_bus.prototype = {

	  onSetUserId: function onSetUserId(user_id) {
	    this.collectionDescription.db_name = user_id;
	  },

	  addEventListeners: function addEventListeners() {
	    var _this = this;
	    _this.removeEventListeners();
	    _event_bus2.default.on('setUserId', _this.onSetUserId, _this);
	  },

	  removeEventListeners: function removeEventListeners() {
	    var _this = this;
	    _event_bus2.default.off('setUserId', _this.onSetUserId);
	  },

	  getChats: function getChats(getError, options, chat_ids, _callback) {
	    if (chat_ids && chat_ids.length) {
	      _indexeddb2.default.getByKeysPath(this.collectionDescription, null, chat_ids, null, function (getError, chatsInfo) {
	        if (getError) {
	          if (_callback) {
	            _callback(getError);
	          } else {
	            console.error(getError);
	          }
	          return;
	        }

	        if (_callback) {
	          _callback(null, options, chatsInfo);
	        }
	      });
	    } else {
	      _callback(null, options, null);
	    }
	  },

	  getAllChats: function getAllChats(getError, _callback) {
	    _indexeddb2.default.getAll(this.collectionDescription, "chats", function (_err, allChats) {
	      if (_err) {
	        console.error(_err);
	        return;
	      }
	      if (_callback) {
	        _callback(getError, allChats);
	      }
	    });
	  },


	  getChatContacts: function getChatContacts(chat_id, callback) {
	    var _this = this;
	    _this.findChatDescriptionById(chat_id, function (error, chat_description) {
	      if (error) {
	        callback(error);
	        return;
	      }

	      chat_description.user_ids = _users_bus2.default.excludeUser(null, chat_description.user_ids);
	      _users_bus2.default.getContactsInfo(null, chat_description.user_ids, callback);
	    });
	  },

	  findChatDescriptionById: function findChatDescriptionById(chat_id, callback) {
	    var _this = this;
	    _indexeddb2.default.getByKeyPath(_this.collectionDescription, null, chat_id, function (getError, chat_description) {
	      if (getError) {
	        callback(getError);
	        return;
	      }

	      if (!chat_description) {
	        callback(new Error('Chat description not found'));
	        return;
	      }

	      callback(null, chat_description);
	    });
	  },

	  putChatToIndexedDB: function putChatToIndexedDB(chat_description, callback) {
	    _indexeddb2.default.addOrPutAll('put', this.collectionDescription, null, [chat_description], function (error) {
	      if (error) {
	        callback(error);
	        return;
	      }

	      callback(null, chat_description);
	    });
	  },

	  updateChatField: function updateChatField(chat_id, chat_field_name, chat_field_value, callback) {
	    var _this = this;
	    _this.findChatDescriptionById(chat_id, function (error, chat_description) {
	      if (error) {
	        callback(error);
	        return;
	      }

	      chat_description[chat_field_name] = chat_field_value;
	      _this.putChatToIndexedDB(chat_description, callback);
	    });
	  }
	};

	exports.default = new Chats_bus();

/***/ },

/***/ 310:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Switcher_core = function Switcher_core() {};

	Switcher_core.prototype = {

	  __class_name: "switcher_core",

	  optionsDefinition: function optionsDefinition(state, mode) {
	    var currentOptions = {};
	    switch (mode) {
	      case "CHATS":
	        currentOptions['paginationOptions'] = state.chats_PaginationOptions;
	        currentOptions['goToOptions'] = state.chats_GoToOptions;
	        currentOptions['filterOptions'] = state.chats_FilterOptions;
	        currentOptions['listOptions'] = state.chats_ListOptions;
	        break;
	      case "CREATE_CHAT":
	        currentOptions['paginationOptions'] = state.createChat_PaginationOptions;
	        currentOptions['goToOptions'] = state.createChat_GoToOptions;
	        currentOptions['filterOptions'] = state.createChat_FilterOptions;
	        break;
	      case "JOIN_CHAT":
	        currentOptions['paginationOptions'] = state.joinChat_PaginationOptions;
	        currentOptions['goToOptions'] = state.joinChat_GoToOptions;
	        currentOptions['filterOptions'] = state.joinChat_FilterOptions;
	        break;
	      case "BLOGS":
	        currentOptions['paginationOptions'] = state.blogs_PaginationOptions;
	        currentOptions['goToOptions'] = state.blogs_GoToOptions;
	        currentOptions['filterOptions'] = state.blogs_FilterOptions;
	        currentOptions['listOptions'] = state.blogs_ListOptions;
	        break;
	      case "CREATE_BLOG":
	        currentOptions['paginationOptions'] = state.createBlog_PaginationOptions;
	        currentOptions['goToOptions'] = state.createBlog_GoToOptions;
	        currentOptions['filterOptions'] = state.createBlog_FilterOptions;
	        break;
	      case "JOIN_BLOG":
	        currentOptions['paginationOptions'] = state.joinBlog_PaginationOptions;
	        currentOptions['goToOptions'] = state.joinBlog_GoToOptions;
	        currentOptions['filterOptions'] = state.joinBlog_FilterOptions;
	        break;
	      case "USERS":
	        currentOptions['paginationOptions'] = state.users_PaginationOptions;
	        currentOptions['goToOptions'] = state.users_GoToOptions;
	        currentOptions['filterOptions'] = state.users_FilterOptions;
	        currentOptions['listOptions'] = state.users_ListOptions;
	        break;
	      case "JOIN_USER":
	        currentOptions['paginationOptions'] = state.joinUser_PaginationOptions;
	        currentOptions['goToOptions'] = state.joinUser_GoToOptions;
	        currentOptions['filterOptions'] = state.joinUser_FilterOptions;
	        currentOptions['listOptions'] = state.joinUser_ListOptions;
	        break;
	      case "USER_INFO_EDIT":
	        currentOptions['paginationOptions'] = state.userInfoEdit_PaginationOptions;
	        currentOptions['goToOptions'] = state.userInfoEdit_GoToOptions;
	        currentOptions['filterOptions'] = state.userInfoEdit_FilterOptions;
	        break;
	      case "USER_INFO_SHOW":
	        currentOptions['paginationOptions'] = state.userInfoShow_PaginationOptions;
	        currentOptions['goToOptions'] = state.userInfoShow_GoToOptions;
	        currentOptions['filterOptions'] = state.userInfoShow_FilterOptions;
	        break;
	      case "CONNECTIONS":
	        currentOptions['paginationOptions'] = state.connections_PaginationOptions;
	        currentOptions['goToOptions'] = state.connections_GoToOptions;
	        currentOptions['filterOptions'] = state.connections_GoToOptions;
	        currentOptions['listOptions'] = state.connections_ListOptions;
	        break;
	      case "MESSAGES":
	        currentOptions['paginationOptions'] = state.messages_PaginationOptions;
	        currentOptions['goToOptions'] = state.messages_GoToOptions;
	        currentOptions['filterOptions'] = state.messages_FilterOptions;
	        currentOptions['listOptions'] = state.messages_ListOptions;
	        break;
	      case "CONTACT_LIST":
	        currentOptions['paginationOptions'] = state.contactList_PaginationOptions;
	        currentOptions['goToOptions'] = state.contactList_GoToOptions;
	        currentOptions['filterOptions'] = state.contactList_FilterOptions;
	        currentOptions['listOptions'] = state.contactList_ListOptions;
	        break;
	      case "LOGGER":
	        currentOptions['paginationOptions'] = state.logger_PaginationOptions;
	        currentOptions['goToOptions'] = state.logger_GoToOptions;
	        currentOptions['filterOptions'] = state.logger_PaginationOptions;
	        currentOptions['listOptions'] = state.logger_ListOptions;
	        break;
	      case "SETTINGS":
	        currentOptions['paginationOptions'] = state.settings_PaginationOptions;
	        currentOptions['goToOptions'] = state.settings_GoToOptions;
	        currentOptions['filterOptions'] = state.settings_FilterOptions;
	        currentOptions['listOptions'] = state.settings_ListOptions;
	        break;
	    }
	    return currentOptions;
	  },


	  tableDefinition: function tableDefinition(mode) {
	    var table_name = void 0;
	    switch (mode) {
	      case "MESSAGES":
	        table_name = ['messages'];
	        break;
	      case "LOGGER":
	        table_name = ['log_messages'];
	        break;
	    }
	    return table_name;
	  }

	};

	exports.default = Switcher_core;

/***/ },

/***/ 311:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _websocket = __webpack_require__(290);

	var _websocket2 = _interopRequireDefault(_websocket);

	var _event_core = __webpack_require__(288);

	var _event_core2 = _interopRequireDefault(_event_core);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _connection2 = __webpack_require__(312);

	var _connection3 = _interopRequireDefault(_connection2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var WebRTC = function WebRTC() {
	  this.configuration = {
	    RTC: {
	      "iceServers": [{ "url": "stun:23.21.150.121" }]
	    },
	    constraints: {
	      "optional": [{ "DtlsSrtpKeyAgreement": true }]
	    }
	  };
	  this.connections = [];
	  this.addEventListeners();
	};

	WebRTC.prototype = {

	  addEventListeners: function addEventListeners() {
	    this.removeEventListeners();
	    _event_bus2.default.on('chatDestroyed', this.destroyConnectionChat, this);
	    _event_bus2.default.on('connectionDestroyed', this.onConnectionDestroyed, this);
	    _event_bus2.default.on('web_socket_message', this.onWebSocketMessage, this);
	  },

	  removeEventListeners: function removeEventListeners() {
	    _event_bus2.default.off('chatDestroyed', this.destroyConnectionChat);
	    _event_bus2.default.off('connectionDestroyed', this.onConnectionDestroyed);
	    _event_bus2.default.off('web_socket_message', this.onWebSocketMessage);
	  },

	  createConnection: function createConnection(options) {
	    var connection = new _connection3.default(options);
	    this.connections.push(connection);
	    _event_bus2.default.trigger('changeConnection');
	    return connection;
	  },

	  getConnection: function getConnection(ws_device_id) {
	    var connection;
	    this.connections.every(function (_connection) {
	      if (_connection.ws_device_id === ws_device_id) {
	        connection = _connection;
	      }
	      return !connection;
	    });

	    return connection;
	  },

	  getAllConnections: function getAllConnections() {
	    return this.connections;
	  },

	  /**
	   * this function is invoked when chat was created or joined
	   */
	  handleConnectedDevices: function handleConnectedDevices(wscs_descrs) {
	    var self = this;
	    if (!wscs_descrs && !Array.isArray(wscs_descrs)) {
	      return;
	    }
	    wscs_descrs.forEach(function (ws_descr) {
	      self.handleDeviceActive(ws_descr);
	    });
	  },

	  handleDeviceActive: function handleDeviceActive(ws_descr) {
	    var self = this;
	    if (_event_bus2.default.ws_device_id === ws_descr.ws_device_id) {
	      console.warn('the information about myself');
	      return;
	    }

	    var connection = self.getConnection(ws_descr.ws_device_id);
	    if (connection && connection.canApplyNextState() === false) {
	      connection.storeContext(ws_descr);
	      self.trigger('webrtc_connection_established', connection);
	      return;
	    }
	    if (!connection) {
	      // if connection with such ws_device_id not found create offer for this connection
	      connection = self.createConnection({
	        ws_device_id: ws_descr.ws_device_id
	      });
	    }
	    // change readyState for existing connection
	    connection.active.readyState = _connection3.default.prototype.readyStates.WILL_CREATE_OFFER;
	    connection.storeContext(ws_descr);
	    self.onActiveChangeState(connection);
	  },

	  /**
	   * server stored local offer for current chat
	   * need to join this offer of wait for connections if current user is creator
	   */
	  handleDevicePassive: function handleDevicePassive(messageData) {
	    var self = this;
	    if (_event_bus2.default.get_ws_device_id() === messageData.from_ws_device_id) {
	      console.warn('the information about myself');
	      return;
	    }
	    var connection = self.getConnection(messageData.from_ws_device_id);
	    if (connection && connection.canApplyNextState() === false) {
	      connection.storeContext(messageData);
	      return;
	    }

	    if (!connection) {
	      // if connection with such ws_device_id not found create answer for offer
	      connection = self.createConnection({
	        ws_device_id: messageData.from_ws_device_id
	      });
	    }
	    // change readyState for existing connection
	    connection.passive.readyState = _connection3.default.prototype.readyStates.WILL_CREATE_ANSWER;
	    connection.passive.remoteOfferDescription = messageData.offerDescription;
	    connection.storeContext(messageData);
	    self.onPassiveChangeState(connection);
	  },

	  handleDeviceAnswer: function handleDeviceAnswer(messageData) {
	    var _this = this;
	    // I am NOT the creator of server stored answer
	    if (_event_bus2.default.get_ws_device_id() === messageData.from_ws_device_id) {
	      console.warn('the information about myself');
	      return;
	    }

	    var connection = _this.getConnection(messageData.from_ws_device_id);
	    if (connection && connection.canApplyNextState() === false) {
	      connection.storeContext(messageData);
	      return;
	    } else if (!connection) {
	      console.error(new Error('Answer for connection thet is not exist!'));
	    }

	    if (_event_bus2.default.get_ws_device_id() === messageData.to_ws_device_id) {
	      // Accept answer if I am the offer creator
	      connection.active.readyState = _connection3.default.prototype.readyStates.WILL_ACCEPT_ANSWER;
	      connection.active.remoteAnswerDescription = messageData.answerDescription;
	      connection.storeContext(messageData);
	      _this.onActiveChangeState(connection);
	    }
	  },

	  extractSDPDeviceId: function extractSDPDeviceId(RTCSessionDescription) {
	    return RTCSessionDescription.sdp.match(/a=fingerprint:sha-256\s*(.+)/)[1];
	  },

	  onActiveICECandidate: function onActiveICECandidate(curConnection, result) {
	    if (!curConnection.active) {
	      curConnection.log('error', { message: "Aborted create offer! Connection doesn't have active " });
	      return;
	    }

	    curConnection.active.readyState = _connection3.default.prototype.readyStates.WAITING;
	    curConnection.sendToWebSocket({
	      type: 'webrtc_offer',
	      from_user_id: _users_bus2.default.getUserId(),
	      from_ws_device_id: _event_bus2.default.get_ws_device_id(),
	      to_ws_device_id: curConnection.getWSDeviceId(),
	      offerDescription: result.peerConnection.localDescription
	    });
	  },

	  onLocalOfferCreated: function onLocalOfferCreated(curConnection, createError, result) {
	    if (createError) {
	      curConnection.log('error', { message: createError });
	      return;
	    }
	    if (!curConnection.active) {
	      curConnection.log('error', { message: "Aborted create offer! Connection doesn't have active " });
	      return;
	    }

	    curConnection.active.peerConnection = result.peerConnection;
	    curConnection.active.dataChannel = result.dataChannel;
	    curConnection.log('log', { message: 'done: createLocalOfferAuto' });
	  },

	  onAcceptedRemoteAnswer: function onAcceptedRemoteAnswer(curConnection, createError) {
	    if (createError) {
	      curConnection.log('error', { message: createError });
	      return;
	    }
	    if (!curConnection.active) {
	      curConnection.log('error', { message: "Aborted accept answer! Connection doesn't have active " });
	      return;
	    }

	    curConnection.sendToWebSocket({
	      type: 'webrtc_accept',
	      from_user_id: _users_bus2.default.getUserId(),
	      from_ws_device_id: _event_bus2.default.get_ws_device_id(),
	      to_ws_device_id: curConnection.getWSDeviceId()
	    });
	  },

	  onActiveChangeState: function onActiveChangeState(curConnection) {
	    var _this = this;
	    switch (curConnection.active.readyState) {
	      case _connection3.default.prototype.readyStates.WILL_CREATE_OFFER:
	        curConnection.active.readyState = _connection3.default.prototype.readyStates.CREATING_OFFER;
	        _this.createLocalOfferAuto(curConnection, _this.onActiveICECandidate.bind(_this, curConnection), _this.onLocalOfferCreated.bind(_this, curConnection));
	        break;
	      case _connection3.default.prototype.readyStates.WILL_ACCEPT_ANSWER:
	        curConnection.active.readyState = _connection3.default.prototype.readyStates.ACCEPTING_ANSWER;
	        _this.acceptRemoteAnswerAuto(curConnection, _this.onAcceptedRemoteAnswer.bind(_this, curConnection));
	        break;
	    }
	  },

	  onPassiveICECandidate: function onPassiveICECandidate(curConnection, result) {
	    var _this = this;
	    if (!curConnection.passive) {
	      curConnection.log('error', { message: "Aborted create offer! Connection doesn't have passive " });
	      return;
	    }

	    //curConnection.passive.peerConnection.ondatachannel = _this.onReceivedDataChannel.bind(_this, curConnection);
	    curConnection.passive.readyState = _connection3.default.prototype.readyStates.WAITING;
	    curConnection.sendToWebSocket({
	      type: 'webrtc_answer',
	      from_user_id: _users_bus2.default.getUserId(),
	      from_ws_device_id: _event_bus2.default.get_ws_device_id(),
	      to_ws_device_id: curConnection.getWSDeviceId(),
	      answerDescription: result.peerConnection.localDescription
	    });
	  },

	  onLocalAnswerCreated: function onLocalAnswerCreated(curConnection, createError, result) {
	    if (createError) {
	      curConnection.log('error', { message: createError });
	      return;
	    }
	    if (!curConnection.passive) {
	      curConnection.log('error', { message: "Aborted create offer! Connection doesn't have passive " });
	      return;
	    }

	    curConnection.passive.peerConnection = result.peerConnection;
	    curConnection.log('log', { message: 'done: createLocalAnswerAuto' });
	  },

	  onPassiveChangeState: function onPassiveChangeState(curConnection) {
	    var _this = this;
	    switch (curConnection.passive.readyState) {
	      case _connection3.default.prototype.readyStates.WILL_CREATE_ANSWER:
	        curConnection.passive.readyState = _connection3.default.prototype.readyStates.CREATING_ANSWER;
	        _this.createLocalAnswerAuto(curConnection, _this.onPassiveICECandidate.bind(_this, curConnection), _this.onLocalAnswerCreated.bind(_this, curConnection));
	        break;
	    }
	  },

	  /**
	   * create offer session description protocol (sdp)
	   * when internet connection will be established
	   * sdp will be sent to the server
	   */
	  createLocalOfferAuto: function createLocalOfferAuto(curConnection, onICECandidate, callback) {
	    var _this = this;
	    _this.createRTCPeerConnection(curConnection, onICECandidate, function (createError, peerConnection) {
	      if (createError) {
	        callback(createError);
	        return;
	      }

	      _this.createLocalOffer(curConnection, peerConnection, callback);
	    });
	  },

	  /**
	   * create answer session description protocol
	   * when internet connection will be established
	   * sdp will be sent to the server
	   */
	  createLocalAnswerAuto: function createLocalAnswerAuto(curConnection, onICECandidate, callback) {
	    var _this = this;
	    _this.createRTCPeerConnection(curConnection, onICECandidate, function (createError, peerConnection) {
	      if (createError) {
	        callback(createError);
	        return;
	      }

	      _this.createLocalAnswer(curConnection, peerConnection, callback);
	    });
	  },

	  acceptRemoteAnswerAuto: function acceptRemoteAnswerAuto(curConnection, callback) {
	    var _this = this;
	    curConnection.log('log', { message: 'try: acceptRemoteAnswerAuto:setRemoteDescription' });
	    try {
	      var _RTCSessionDescription = window.webkitRTCSessionDescription || window.mozRTCSessionDescription || window.RTCSessionDescription;
	      var remoteAnswerDescription = new _RTCSessionDescription(curConnection.active.remoteAnswerDescription);
	      curConnection.active.peerConnection.setRemoteDescription(remoteAnswerDescription);
	    } catch (error) {
	      if (callback) {
	        callback(error);
	      }
	      return;
	    }

	    curConnection.log('log', { message: 'done: acceptRemoteAnswerAuto:setRemoteDescription' });
	    if (callback) {
	      callback(null);
	    }
	  },

	  /**
	   * each time client tries to define its address
	   */
	  _onICECandidate: function _onICECandidate(curConnection, peerConnection, onICECandidate, event) {
	    if (event.candidate == null) {
	      curConnection.log('log', { message: 'done: ICE candidate' });
	      if (onICECandidate) {
	        onICECandidate({
	          peerConnection: peerConnection
	        });
	      }
	    } else {
	      curConnection.log('log', { message: 'next: ICE candidate' });
	    }
	  },

	  _onReceivedDataChannel: function _onReceivedDataChannel(curConnection, event) {
	    curConnection.log('log', { message: 'Data Channel received' });
	    if (!curConnection.passive) {
	      this._removeDataChannelListeners(event.channel);
	      return;
	    }
	    curConnection.passive.dataChannel = event.channel;
	    this._addDataChannelListeners(curConnection.passive.dataChannel, curConnection, 'passive');
	  },

	  _onICEConnectionStateChange: function _onICEConnectionStateChange(curConnection, event) {
	    if (event.target.iceConnectionState === 'disconnected') {
	      console.warn('Peer connection was disconnected', event);
	      curConnection.destroy();
	    } else {
	      console.log('oniceconnectionstatechange', event.target.iceConnectionState);
	    }
	  },

	  _addPeerConnectionListeners: function _addPeerConnectionListeners(peerConnection, curConnection, onICECandidate) {
	    if (!peerConnection) {
	      return;
	    }
	    var _this = this;
	    _this._removePeerConnectionListeners(peerConnection);

	    peerConnection.ondatachannel = _this._onReceivedDataChannel.bind(_this, curConnection);
	    peerConnection.onicecandidate = _this._onICECandidate.bind(_this, curConnection, peerConnection, onICECandidate);
	    peerConnection.oniceconnectionstatechange = _this._onICEConnectionStateChange.bind(_this, curConnection);
	    //peerConnection.onnegotiationneeded = function(ev) { console.log('onnegotiationneeded', ev); };
	    peerConnection.onsignalingstatechange = function (ev) {
	      console.log('onsignalingstatechange', ev.target.signalingState);
	    };
	  },

	  _removePeerConnectionListeners: function _removePeerConnectionListeners(peerConnection) {
	    if (!peerConnection) {
	      return;
	    }
	    var _this = this;

	    peerConnection.ondatachannel = null;
	    peerConnection.onicecandidate = null;
	    peerConnection.oniceconnectionstatechange = null;
	    //peerConnection.onnegotiationneeded = null;
	    peerConnection.onsignalingstatechange = null;
	  },

	  /**
	   * create peer connection and pass it to the device id state
	   */
	  createRTCPeerConnection: function createRTCPeerConnection(curConnection, onICECandidate, callback) {
	    var _this = this;
	    curConnection.log('log', { message: 'try: createRTCPeerConnection' });
	    try {
	      var _peerConnection = window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCPeerConnection || window.PeerConnection;
	      var peerConnection = new _peerConnection(_this.configuration.RTC, _this.configuration.constraints);
	    } catch (error) {
	      if (callback) {
	        callback(error);
	      }
	      return;
	    }

	    _this._addPeerConnectionListeners(peerConnection, curConnection, onICECandidate);

	    curConnection.log('log', { message: 'done: createRTCPeerConnection' });
	    if (callback) {
	      callback(null, peerConnection);
	    }
	  },

	  notMode: function notMode(mode) {
	    if (mode === 'active') {
	      return 'passive';
	    } else if (mode === 'passive') {
	      return 'active';
	    }
	  },

	  onDataChannelOpen: function onDataChannelOpen(curConnection, activeOrPassive) {
	    if (curConnection[activeOrPassive]) {
	      curConnection.log('log', { message: 'Data channel connection opened!' });
	      curConnection.dataChannel = curConnection[activeOrPassive].dataChannel;
	      curConnection.peerConnection = curConnection[activeOrPassive].peerConnection;
	      var notMode = this.notMode(activeOrPassive);
	      this._removePeerConnectionListeners(curConnection[notMode].peerConnection);
	      this._removeDataChannelListeners(curConnection[notMode].dataChannel);
	      curConnection.setDefaultActive();
	      curConnection.setDefaultPassive();
	      this.trigger('webrtc_connection_established', curConnection);
	    } else {
	      curConnection.log('log', { message: 'fail to set data channel for ' + activeOrPassive });
	    }
	  },

	  onDataChannelMessage: function onDataChannelMessage(curConnection, event) {
	    try {
	      var messageData = JSON.parse(event.data);
	    } catch (e) {
	      console.error(e);
	      return;
	    }
	    var self = this;

	    if (messageData.lastModifyDatetime) {
	      _users_bus2.default.getContactsInfo(messageData, [messageData.message.createdByUserId], function (_err, contactsInfo, messageData) {

	        if (_err) return console.error(_err);

	        contactsInfo = contactsInfo[0];
	        if (!contactsInfo.lastModifyDatetime || contactsInfo.lastModifyDatetime < messageData.lastModifyDatetime) {
	          var _messageData = {
	            type: 'syncRequestUserData',
	            userId: contactsInfo.user_id,
	            chat_description: {
	              chat_id: messageData.chat_description.chat_id
	            }
	          };
	          self.broadcastChatMessage(messageData.chat_description.chat_id, JSON.stringify(_messageData));
	        }
	      });
	    }

	    if (messageData.type === 'notifyChat') {
	      _event_bus2.default.trigger('notifyChat', messageData);
	    } else if (messageData.type === 'notifyUser') {
	      _event_bus2.default.trigger('notifyUser', messageData);
	    } else if (messageData.type === 'chatJoinApproved') {
	      _event_bus2.default.trigger('chatJoinApproved', messageData);
	    } else if (messageData.type === 'syncRequestChatMessages') {
	      _event_bus2.default.trigger('getSynchronizeChatMessages', messageData);
	    } else if (messageData.type === 'syncResponseChatMessages') {
	      _event_bus2.default.trigger('syncResponseChatMessages', messageData);
	    } else if (messageData.type === 'syncRequestUserData') {
	      this.requestUserInfo(messageData);
	    } else if (messageData.type === 'syncResponseUserData') {
	      _users_bus2.default.getContactsInfo(messageData, [messageData.userId], function (_err, userInfo, messageData) {
	        if (_err) return console.error(_err);
	        userInfo[0].lastModifyDatetime = messageData.updateInfo.lastModifyDatetime;
	        userInfo[0].avatar_data = messageData.updateInfo.avatar_data;
	        _users_bus2.default.addNewUserToIndexedDB(userInfo[0], function (_err, user_description) {
	          if (_err) return console.error(_err);
	          _event_bus2.default.trigger('changeMyUsers', messageData.userId);
	        });
	      });
	    }
	  },

	  onDataChannelClose: function onDataChannelClose(curConnection, event) {
	    this._removeDataChannelListeners(curConnection.dataChannel);
	    this.connections.splice(this.connections.indexOf(curConnection), 1);
	    _event_bus2.default.trigger('changeConnection');
	    console.warn('Data channel was closed', event);
	  },

	  onDataChannelError: function onDataChannelError(curConnection, event) {
	    console.error('Data channel error', event);
	  },

	  _addDataChannelListeners: function _addDataChannelListeners(dataChannel, curConnection, activeOrPassive) {
	    var _this = this;
	    if (!dataChannel) {
	      console.error(new Error('Data channel is not provided!'));
	      return;
	    }
	    _this._removeDataChannelListeners(dataChannel);

	    dataChannel.onopen = _this.onDataChannelOpen.bind(_this, curConnection, activeOrPassive);
	    dataChannel.onmessage = _this.onDataChannelMessage.bind(_this, curConnection);
	    dataChannel.onclose = _this.onDataChannelClose.bind(_this, curConnection);
	    dataChannel.onerror = _this.onDataChannelError.bind(_this, curConnection);
	  },

	  _removeDataChannelListeners: function _removeDataChannelListeners(dataChannel) {
	    if (!dataChannel) {
	      return;
	    }

	    dataChannel.onopen = null;
	    dataChannel.onmessage = null;
	    dataChannel.onclose = null;
	    dataChannel.onerror = null;
	  },

	  requestUserInfo: function requestUserInfo(messageData) {
	    var self = this;
	    _users_bus2.default.getMyInfo(messageData, function (_err, options, userInfo) {
	      var messageData = {
	        type: 'syncResponseUserData',
	        userId: userInfo.user_id,
	        updateInfo: {
	          avatar_data: userInfo.avatar_data,
	          lastModifyDatetime: userInfo.lastModifyDatetime
	        }
	      };
	      self.broadcastChatMessage(options.chat_description.chat_id, JSON.stringify(messageData));
	    });
	  },


	  /**
	   * create data channel with channel id equal to chat id
	   */
	  _createDataChannel: function _createDataChannel(curConnection, peerConnection, onDataChannelCreated, callback) {
	    var _this = this;

	    try {
	      var dataChannel = peerConnection.createDataChannel(curConnection.getWSDeviceId(), { reliable: true });
	    } catch (error) {
	      if (onDataChannelCreated) {
	        onDataChannelCreated(error, null, null, null, callback);
	      }
	      return;
	    }

	    _this._addDataChannelListeners(dataChannel, curConnection, 'active');
	    if (onDataChannelCreated) {
	      onDataChannelCreated(null, curConnection, peerConnection, dataChannel, callback);
	    }
	  },

	  _onCreateOfferSuccess: function _onCreateOfferSuccess(curConnection, peerConnection, dataChannel, callback, localDescription) {
	    curConnection.log('log', { message: 'done: createLocalOffer:createOffer' });
	    curConnection.log('log', { message: 'try: createLocalOffer:setLocalDescription' });
	    peerConnection.setLocalDescription(localDescription, function () {
	      curConnection.log('log', { message: 'done: createLocalOffer:setLocalDescription' });
	      if (callback) {
	        callback(null, {
	          peerConnection: peerConnection,
	          dataChannel: dataChannel
	        });
	      }
	    }, function (error) {
	      if (callback) {
	        callback(error);
	      }
	    });
	  },

	  _onCreateOfferError: function _onCreateOfferError(curConnection, callback, error) {
	    if (callback) {
	      callback(error);
	    }
	  },

	  _onDataChannelCreated: function _onDataChannelCreated(createError, curConnection, peerConnection, dataChannel, callback) {
	    var _this = this;
	    if (createError) {
	      if (callback) {
	        callback(createError);
	      }
	      return;
	    }
	    curConnection.log('log', { message: 'done: createLocalOffer:setupDataChannel' });
	    curConnection.log('log', { message: 'try: createLocalOffer:createOffer' });

	    peerConnection.createOffer(_this._onCreateOfferSuccess.bind(_this, curConnection, peerConnection, dataChannel, callback), _this._onCreateOfferError.bind(_this, curConnection, callback)
	    //,{ mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true }}
	    );
	  },

	  createLocalOffer: function createLocalOffer(curConnection, peerConnection, callback) {
	    var _this = this;
	    curConnection.log('log', { message: 'try: createLocalOffer' });
	    if (!peerConnection) {
	      var err = new Error('No peer connection');
	      if (callback) {
	        callback(err);
	      } else {
	        console.error(err);
	      }
	      return;
	    }

	    curConnection.log('log', { message: 'try: createLocalOffer:setupDataChannel' });
	    _this._createDataChannel(curConnection, peerConnection, _this._onDataChannelCreated.bind(_this), callback);
	  },

	  _onCreateAnswerSuccess: function _onCreateAnswerSuccess(curConnection, peerConnection, callback, localDescription) {
	    curConnection.log('log', { message: 'done: createLocalAnswer:createAnswer' });
	    curConnection.log('log', { message: 'try: createLocalAnswer:setLocalDescription' });
	    peerConnection.setLocalDescription(localDescription, function () {
	      curConnection.log('log', { message: 'done: createLocalAnswer:setLocalDescription' });
	      if (callback) {
	        callback(null, {
	          peerConnection: peerConnection
	        });
	      }
	    }, function (error) {
	      if (callback) {
	        callback(error);
	      }
	    });
	  },

	  _onCreateAnswerError: function _onCreateAnswerError(curConnection, callback, error) {
	    if (callback) {
	      callback(error);
	    }
	  },

	  createLocalAnswer: function createLocalAnswer(curConnection, peerConnection, callback) {
	    var _this = this;
	    curConnection.log('log', { message: 'try: createLocalAnswer' });
	    if (!peerConnection) {
	      var err = new Error('No peer connection');
	      if (callback) {
	        callback(err);
	      } else {
	        console.error(err);
	      }
	      return;
	    }

	    curConnection.log('log', { message: 'try: createLocalAnswer:setRemoteDescription' });
	    try {
	      var _RTCSessionDescription = window.webkitRTCSessionDescription || window.mozRTCSessionDescription || window.RTCSessionDescription;
	      var remoteOfferDescription = new _RTCSessionDescription(curConnection.passive.remoteOfferDescription);
	      peerConnection.setRemoteDescription(remoteOfferDescription);
	    } catch (error) {
	      if (callback) {
	        callback(error);
	      }
	      return;
	    }
	    curConnection.log('log', { message: 'done: createLocalAnswer:setRemoteDescription' });
	    curConnection.log('log', { message: 'try: createLocalAnswer:createAnswer' });

	    peerConnection.createAnswer(_this._onCreateAnswerSuccess.bind(_this, curConnection, peerConnection, callback), _this._onCreateAnswerError.bind(_this, curConnection, callback)
	    //,{ mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true }}
	    );
	  },

	  destroy: function destroy() {
	    var _this = this;
	    _this.connections.forEach(function (connection) {
	      connection.destroy();
	    });
	    _this.connections = [];
	  },

	  /**
	   * broadcast for all connections data channels
	   */
	  broadcastMessage: function broadcastMessage(connections, broadcastData) {
	    var _this = this,
	        unused = [];
	    connections.forEach(function (_connection) {
	      if (_connection.isActive()) {
	        _connection.dataChannel.send(broadcastData);
	      } else if (_connection.dataChannel) {
	        unused.push(_connection);
	      }
	    });
	    while (unused.length) {
	      var toRemoveConnection = unused.shift();
	      var removeIndex = connections.indexOf(toRemoveConnection);
	      if (removeIndex === -1) {
	        console.log('removed old client connection', 'ws_device_id => ', connections[removeIndex].ws_device_id);
	        connections.splice(removeIndex, 1);
	      }
	    }
	  },

	  getChatConnections: function getChatConnections(connections, chat_id, active) {
	    var webrtc_chat_connections = [];
	    connections.forEach(function (webrtc_connection) {
	      if (!active || webrtc_connection.isActive()) {
	        if (webrtc_connection.hasChatId(chat_id)) {
	          webrtc_chat_connections.push(webrtc_connection);
	        }
	      }
	    });
	    return webrtc_chat_connections;
	  },

	  broadcastChatMessage: function broadcastChatMessage(chat_id, broadcastData) {
	    this.broadcastMessage(this.getChatConnections(this.connections, chat_id), broadcastData);
	  },

	  destroyConnectionChat: function destroyConnectionChat(chat_id) {
	    var _this = this;
	    _this.connections.forEach(function (connetion) {
	      connetion.removeChatId(chat_id);
	    });
	    _websocket2.default.sendMessage({
	      type: "chat_leave",
	      from_user_id: _users_bus2.default.getUserId(),
	      chat_description: {
	        chat_id: chat_id
	      }
	    });
	  },

	  onConnectionDestroyed: function onConnectionDestroyed(connection) {
	    var _this = this;
	    _this._removeDataChannelListeners(connection.dataChannel);
	    _this._removePeerConnectionListeners(connection.peerConnection);
	    connection.dataChannel.close();
	    _this.connections.splice(_this.connections.indexOf(connection), 1);
	  },

	  onWebSocketMessage: function onWebSocketMessage(messageData) {
	    var _this = this;

	    switch (messageData.type) {
	      case 'notify_webrtc':
	        if (_this[messageData.notify_data]) {
	          _this[messageData.notify_data](messageData);
	        }
	        break;
	    }
	  }
	};
	_extend_core2.default.prototype.inherit(WebRTC, _event_core2.default);

	exports.default = new WebRTC();

/***/ },

/***/ 312:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _websocket = __webpack_require__(290);

	var _websocket2 = _interopRequireDefault(_websocket);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Connection = function Connection(options) {
	  this.chats_ids = [];
	  this.users_ids = [];
	  this.ws_device_id = options.ws_device_id;
	  this.setDefaultActive();
	  this.setDefaultPassive();
	};

	Connection.prototype = {

	  setDefaultActive: function setDefaultActive() {
	    this.active = {
	      readyState: this.readyStates.WAITING
	    };
	  },

	  setDefaultPassive: function setDefaultPassive() {
	    this.passive = {
	      readyState: this.readyStates.WAITING
	    };
	  },

	  readyStates: {
	    WAITING: 'WAITING',
	    CREATING_OFFER: 'CREATING_OFFER',
	    WILL_CREATE_OFFER: 'WILL_CREATE_OFFER',
	    CREATING_ANSWER: 'CREATING_ANSWER',
	    WILL_CREATE_ANSWER: 'WILL_CREATE_ANSWER',
	    ACCEPTING_ANSWER: 'ACCEPTING_ANSWER',
	    WILL_ACCEPT_ANSWER: 'WILL_ACCEPT_ANSWER'
	  },

	  setWSDeviceId: function setWSDeviceId(ws_device_id) {
	    this.ws_device_id = ws_device_id;
	  },

	  getWSDeviceId: function getWSDeviceId() {
	    return this.ws_device_id;
	  },

	  canApplyNextState: function canApplyNextState() {
	    if (this.dataChannel && this.dataChannel.readyState === "open") {
	      // connection with this device is already established
	      return false;
	    } else if (this.active && this.active.readyState === Connection.prototype.readyStates.ACCEPTING_ANSWER) {
	      // connection with this device is establishing through p2p
	      return false;
	    }
	    return true;
	  },

	  removeChatId: function removeChatId(chat_id) {
	    if (this.hasChatId(chat_id)) {
	      var index = this.chats_ids.indexOf(chat_id);
	      if (index > -1) {
	        this.chats_ids.splice(index, 1);
	      }
	    }
	    if (!this.chats_ids.length) {
	      this.destroy();
	    }
	  },

	  hasUserId: function hasUserId(user_id) {
	    var foundUserId = false;
	    this.users_ids.every(function (_user_id) {
	      if (_user_id === user_id) {
	        foundUserId = _user_id;
	      }
	      return !foundUserId;
	    });
	    return foundUserId;
	  },

	  hasChatId: function hasChatId(chat_id) {
	    var foundChatId = false;
	    this.chats_ids.every(function (_chat_id) {
	      if (_chat_id === chat_id) {
	        foundChatId = _chat_id;
	      }
	      return !foundChatId;
	    });
	    return foundChatId;
	  },

	  putUserId: function putUserId(user_id) {
	    if (this.hasUserId(user_id) === false) {
	      this.users_ids.push(user_id);
	      _event_bus2.default.trigger('changeUsersConnections');
	    }
	  },

	  putChatId: function putChatId(chat_id) {
	    if (this.hasChatId(chat_id) === false) {
	      this.chats_ids.push(chat_id);
	    }
	  },

	  storeContext: function storeContext(ws_descr) {
	    console.log('storeContext', this, ws_descr);
	    if (ws_descr.chat_id) {
	      this.putChatId(ws_descr.chat_id);
	    } else if (ws_descr.user_id || ws_descr.from_user_id) {
	      this.putUserId(ws_descr.user_id || ws_descr.from_user_id);
	    }
	  },

	  getContextDescription: function getContextDescription() {
	    return {
	      chats_ids: chats_ids,
	      users_ids: users_ids
	    };
	  },

	  log: function log(type, messageObject) {
	    if (console[type]) {
	      console[type](messageObject.message);
	    } else {
	      console.log(type, messageObject.message);
	    }
	  },

	  sendToWebSocket: function sendToWebSocket(messageData) {
	    //messageData.context_description = this.getContextDescription();
	    _websocket2.default.sendMessage(messageData);
	  },

	  handleAnyContexts: function handleAnyContexts() {
	    return this.chats_ids.length || this.users_ids.length;
	  },

	  destroy: function destroy() {
	    this.chats_ids = [];
	    this.users_ids = [];
	    _event_bus2.default.trigger('connectionDestroyed', this);
	  },

	  isActive: function isActive() {
	    return this.dataChannel && this.dataChannel.readyState === "open";
	  }
	};

	exports.default = Connection;

/***/ },

/***/ 313:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _triple_element = __webpack_require__(295);

	var _triple_element2 = _interopRequireDefault(_triple_element);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ExtraToolbar = _react2.default.createClass({
	  displayName: 'ExtraToolbar',
	  getDefaultProps: function getDefaultProps() {
	    return {
	      usersExtraToolbarConfig: [{
	        "element": "button",
	        "icon": "filter_users_icon",
	        "text": 26,
	        "class": "button-inset-square",
	        "data": {
	          "action": "changeMode",
	          "description": 27,
	          "role": "btn_Filter",
	          "toggle": true,
	          "chat_part": "filter",
	          "mode_to": "USERS_FILTER"
	        },
	        "name": "",
	        "disabled": false
	      }],
	      chatsExtraToolbarConfig: [{
	        "element": "button",
	        "icon": "filter_chats_icon",
	        "text": 26,
	        "class": "button-inset-square",
	        "data": {
	          "action": "changeMode",
	          "role": "btn_Filter",
	          "toggle": true,
	          "chat_part": "filter",
	          "mode_to": "CHATS_FILTER"
	        },
	        "name": "",
	        "disabled": false
	      }],
	      messagesExtraToolbarConfig: [{
	        "element": "button",
	        "icon": "filter_messages_icon",
	        "text": 26,
	        "class": "button-inset-square",
	        "data": {
	          "action": "changeMode",
	          "role": "btn_Filter",
	          "toggle": true,
	          "chat_part": "filter",
	          "mode_to": "MESSAGES_FILTER"
	        },
	        "name": "",
	        "disabled": false
	      }, {
	        "element": "button",
	        "icon": "",
	        "text": 120,
	        "class": "button-inset-square",
	        "data": {
	          "action": "synchronizeMessages",
	          "role": "synchronizeMessages"
	        },
	        "disabled": false
	      }],
	      contactListExtraToolbarConfig: [{
	        "element": "button",
	        "icon": "filter_users_icon",
	        "text": 26,
	        "class": "button-inset-square",
	        "data": {
	          "throw": "true",
	          "action": "changeMode",
	          "role": "btn_Filter",
	          "toggle": true,
	          "chat_part": "filter",
	          "mode_to": "CONTACT_LIST_FILTER"
	        },
	        "name": "",
	        "disabled": false
	      }],
	      loggerExtraToolbarConfig: [{
	        "element": "button",
	        "icon": "filter_log_messages_icon",
	        "text": 26,
	        "class": "button-inset-square",
	        "data": {
	          "throw": "true",
	          "action": "changeMode",
	          "role": "btn_Filter",
	          "toggle": true,
	          "chat_part": "filter",
	          "mode_to": "MESSAGES_FILTER"
	        },
	        "name": "",
	        "disabled": false
	      }]
	    };
	  },
	  defineConfig: function defineConfig(mode) {
	    switch (mode) {
	      case 'CHATS':
	        return this.props.chatsExtraToolbarConfig;
	        break;
	      case 'USERS':
	        return this.props.usersExtraToolbarConfig;
	        break;
	      case 'MESSAGES':
	        return this.props.messagesExtraToolbarConfig;
	        break;
	      case 'CONTACT_LIST':
	        return this.props.contactListExtraToolbarConfig;
	        break;
	      case 'LOGGER':
	        return this.props.loggerExtraToolbarConfig;
	        break;
	    }
	  },
	  defineOptions: function defineOptions(mode) {
	    switch (mode) {
	      case 'CREATE_CHAT':
	        return this.props.data.createChat_ExtraToolbarOptions;
	        break;
	      case 'CHATS':
	        return this.props.data.chats_ExtraToolbarOptions;
	        break;
	      case 'USERS':
	        return this.props.data.users_ExtraToolbarOptions;
	        break;
	      case 'MESSAGES':
	        return this.props.data.messages_ExtraToolbarOptions;
	        break;
	      case 'CONTACT_LIST':
	        return this.props.data.contactList_ExtraToolbarOptions;
	        break;
	      case 'LOGGER':
	        return this.props.data.logger_ExtraToolbarOptions;
	        break;
	    }
	  },
	  calcDisplay: function calcDisplay(_config) {
	    if (!_config.data) return true;
	    if (_config.data.role === 'synchronizeMessages') {
	      var index = this.props.data.user_ids.indexOf(_users_bus2.default.getUserId());
	      return index !== -1 && this.props.data.user_ids.length > 1 || index === -1 && this.props.data.user_ids.length > 0;
	    }
	  },
	  render: function render() {
	    var options = this.defineOptions(this.props.mode);
	    if (options && options.show) {
	      var configs = this.defineConfig(this.props.mode);
	      if (!configs) {
	        return _react2.default.createElement('div', null);
	      }

	      return _react2.default.createElement(
	        'div',
	        null,
	        configs.map(function (config, i) {
	          return _react2.default.createElement(_triple_element2.default, { key: i, events: this.props.events, config: config, calcDisplay: this.calcDisplay });
	        }, this)
	      );
	    } else {
	      return _react2.default.createElement('div', null);
	    }
	  }
	});

	exports.default = ExtraToolbar;

/***/ },

/***/ 314:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _switcher_core = __webpack_require__(310);

	var _switcher_core2 = _interopRequireDefault(_switcher_core);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _location_wrapper = __webpack_require__(293);

	var _location_wrapper2 = _interopRequireDefault(_location_wrapper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Filter = _react2.default.createClass({
	  displayName: 'Filter',


	  MODE: {
	    BLOGS_FILTER: 'BLOGS_FILTER',
	    CHATS_FILTER: 'CHATS_FILTER',
	    USERS_FILTER: 'USERS_FILTER',
	    MESSAGES_FILTER: 'MESSAGES_FILTER',
	    CONTACT_LIST_FILTER: 'CONTACT_LIST_FILTER',
	    LOGGER_FILTER: 'LOGGER',
	    CONNECTIONS_FILTER: 'CONNECTIONS_FILTER'
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      usersFilterConfig: [{
	        "role": "locationWrapper",
	        "classList": "elements flex-align-c flex-item-auto",
	        "location": "pagination"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "class": "check-box-size",
	        "data": {
	          "throw": "true",
	          "role": "enablePagination",
	          "action": "changeMode",
	          "mode_to": "PAGINATION",
	          "chat_part": "pagination",
	          "key": "showEnablePagination"
	        },
	        "location": "pagination"
	      }, {
	        "element": "label",
	        "text": 28,
	        "location": "pagination"
	      }, {
	        "role": "locationWrapper",
	        "classList": "elements flex-align-c flex-item-auto",
	        "location": "per_page"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "class": "check-box-size",
	        "data": {
	          "throw": "true",
	          "role": "rteShowPerPage",
	          "action": "changeRTE",
	          "key": "rtePerPage"
	        },
	        "location": "per_page",
	        "redraw_mode": "rte"
	      }, {
	        "element": "label",
	        "text": 19,
	        "htmlFor": "show_per_page",
	        "location": "per_page",
	        "redraw_mode": "rte"
	      }, {
	        "element": "input",
	        "type": "text",
	        "class": "inputWidth",
	        "data": {
	          "role": "perPageValue",
	          "action": "changePerPage",
	          "key": "perPageValue"
	        },
	        "id": "show_per_page",
	        "onkeypress": "if((event.keyCode < 48)||(event.keyCode > 57)) event.returnValue=false",
	        "location": "per_page",
	        "redraw_mode": "rte"
	      }, {
	        "element": "label",
	        "data": {
	          "role": "icon_show_per_page"
	        },
	        "location": "per_page",
	        "redraw_mode": "nrte"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "class": "check-box-size",
	        "data": {
	          "throw": "true",
	          "role": "rteChoicePerPage",
	          "action": "changeRTE",
	          "key": "rtePerPage"
	        },
	        "location": "per_page",
	        "redraw_mode": "nrte"
	      }, {
	        "element": "button",
	        "text": 19,
	        "class": "button-inset-white",
	        "data": {
	          "role": "show_per_page",
	          "action": "showPerPage"
	        },
	        "htmlFor": "show_per_page",
	        "location": "per_page",
	        "redraw_mode": "nrte"
	      }, {
	        "element": "input",
	        "type": "text",
	        "class": "inputWidth",
	        "data": {
	          "role": "perPageValue",
	          "action": "changePerPage",
	          "key": "perPageValue"
	        },
	        "id": "show_per_page",
	        "onkeypress": "if((event.keyCode < 48)||(event.keyCode > 57)) event.returnValue=false",
	        "location": "per_page",
	        "redraw_mode": "nrte"
	      }],
	      chatsFilterConfig: [{
	        "role": "locationWrapper",
	        "classList": "elements flex-align-c flex-item-auto",
	        "location": "pagination"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "class": "check-box-size",
	        "data": {
	          "throw": "true",
	          "role": "enablePagination",
	          "action": "changeMode",
	          "mode_to": "PAGINATION",
	          "chat_part": "pagination",
	          "key": "showEnablePagination"
	        },
	        "location": "pagination"
	      }, {
	        "element": "label",
	        "text": 28,
	        "location": "pagination"
	      }, {
	        "role": "locationWrapper",
	        "classList": "elements flex-align-c flex-item-auto",
	        "location": "per_page"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "class": "check-box-size",
	        "data": {
	          "throw": "true",
	          "role": "rteShowPerPage",
	          "action": "changeRTE",
	          "key": "rtePerPage"
	        },
	        "location": "per_page",
	        "redraw_mode": "rte"
	      }, {
	        "element": "label",
	        "text": 19,
	        "htmlFor": "show_per_page",
	        "location": "per_page",
	        "redraw_mode": "rte"
	      }, {
	        "element": "input",
	        "type": "text",
	        "class": "inputWidth ooo",
	        "data": {
	          "role": "perPageValue",
	          "action": "changePerPage",
	          "key": "perPageValue"
	        },
	        "id": "show_per_page",
	        "onKeyPress": "if((event.keyCode < 48)||(event.keyCode > 57)) event.returnValue=false",
	        "location": "per_page",

	        "redraw_mode": "rte"
	      }, {
	        "element": "label",
	        "data": {
	          "role": "icon_show_per_page"
	        },
	        "location": "per_page",
	        "redraw_mode": "nrte"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "class": "check-box-size",
	        "data": {
	          "throw": "true",
	          "role": "rteChoicePerPage",
	          "action": "changeRTE",
	          "key": "rtePerPage"
	        },
	        "location": "per_page",
	        "redraw_mode": "nrte"
	      }, {
	        "element": "button",
	        "text": 19,
	        "class": "button-inset-white",
	        "data": {
	          "role": "show_per_page",
	          "action": "showPerPage"
	        },
	        "htmlFor": "show_per_page",
	        "location": "per_page",
	        "redraw_mode": "nrte"
	      }, {
	        "element": "input",
	        "type": "text",
	        "class": "inputWidth",
	        "data": {
	          "role": "perPageValue",
	          "action": "changePerPage",
	          "key": "perPageValue"
	        },
	        "id": "show_per_page",
	        "onKeyPress": "if((event.keyCode < 48)||(event.keyCode > 57)) event.returnValue=false",
	        "location": "per_page",
	        "redraw_mode": "nrte"
	      }],
	      messagesFilterConfig: [
	      /*        {
	                "role": "locationWrapper",
	                "classList": "flex-item flex-wrap elements",
	                "location": "date_filter"
	              },
	              {
	                "element": "label",
	                "text": 44,
	                "location": "date_filter",
	                "sort": 2
	              },
	              {
	                "element": "input",
	                "class": "inputWidth",
	                "location": "date_filter",
	                "sort": 3
	              },
	              {
	                "element": "button",
	                "text": 18,
	                "class": "button-inset-white",
	                "location": "date_filter",
	                "sort": 4
	              },
	              {
	                "element": "label",
	                "text": 45,
	                "location": "date_filter",
	                "sort": 2
	              },
	              {
	                "element": "input",
	                "class": "inputWidth",
	                "location": "date_filter",
	                "sort": 3
	              },
	              {
	                "element": "button",
	                "text": 18,
	                "class": "button-inset-white",
	                "location": "date_filter",
	                "sort": 4
	              },*/

	      {
	        "role": "locationWrapper",
	        "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
	        "location": "pagination"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "text": "",
	        "class": "check-box-size",
	        "data": {
	          "throw": "true",
	          "role": "enablePagination",
	          "action": "changeMode",
	          "mode_to": "PAGINATION",
	          "chat_part": "pagination",
	          "key": "showEnablePagination"
	        },
	        "location": "pagination",
	        "sort": 3
	      }, {
	        "element": "label",
	        "text": 28,
	        "location": "pagination",
	        "sort": 2
	      }, {
	        "role": "locationWrapper",
	        "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
	        "location": "per_page"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "class": "check-box-size",
	        "data": {
	          "throw": "true",
	          "role": "rteShowPerPage",
	          "action": "changeRTE",
	          "key": "rtePerPage"
	        },
	        "location": "per_page",
	        "sort": 4,
	        "redraw_mode": "rte"
	      }, {
	        "element": "label",
	        "text": 19,
	        "location": "per_page",
	        "sort": 2,
	        "redraw_mode": "rte"
	      }, {
	        "element": "input",
	        "type": "text",
	        "class": "inputWidth",
	        "data": {
	          "role": "perPageValue",
	          "action": "changePerPage",
	          "key": "perPageValue"
	        },
	        "name": "",
	        "onKeyPress": "if((event.keyCode < 48)||(event.keyCode > 57)) event.returnValue=false",
	        "location": "per_page",
	        "sort": 3,
	        "redraw_mode": "rte"
	      }, {
	        "element": "label",
	        "data": {
	          "role": "icon_show_per_page"
	        },
	        "location": "per_page",
	        "sort": 1,
	        "redraw_mode": "nrte"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "class": "check-box-size",
	        "data": {
	          "throw": "true",
	          "role": "rteChoicePerPage",
	          "action": "changeRTE",
	          "key": "rtePerPage"
	        },
	        "location": "per_page",
	        "sort": 4,
	        "redraw_mode": "nrte"
	      }, {
	        "element": "button",
	        "text": 19,
	        "class": "button-inset-white",
	        "data": {
	          "throw": "true",
	          "role": "show_per_page",
	          "action": "showPerPage"
	        },
	        "location": "per_page",
	        "sort": 2,
	        "redraw_mode": "nrte"
	      }, {
	        "element": "input",
	        "type": "text",
	        "class": "inputWidth",
	        "data": {
	          "role": "perPageValue",
	          "action": "changePerPage",
	          "key": "perPageValue"
	        },
	        "onKeyPress": "if((event.keyCode < 48)||(event.keyCode > 57)) event.returnValue=false",
	        "location": "per_page",
	        "sort": 3,
	        "redraw_mode": "nrte"
	      }]
	    };
	  },
	  defineConfig: function defineConfig(mode) {
	    switch (mode) {
	      case 'CHATS':
	        return this.props.chatsFilterConfig;
	        break;
	      case 'USERS':
	        return this.props.usersFilterConfig;
	        break;
	      case 'MESSAGES':
	        return this.props.messagesFilterConfig;
	        break;
	      case 'CONTACT_LIST':
	        return this.props.chatsFilterConfig;
	        break;
	    }
	  },
	  prepareConfig: function prepareConfig(config, mode) {
	    config = config.filter(function (obj) {
	      if (!obj.redraw_mode) {
	        return obj;
	      } else {
	        return obj.redraw_mode === mode;
	      }
	    });
	    return config;
	  },
	  defineOptions: function defineOptions(mode) {
	    var options = {};
	    switch (mode) {
	      case 'CREATE_CHAT':
	        options['filterOptions'] = this.props.data.createChat_FilterOptions;
	        options['paginationOptions'] = this.props.data.createChat_PaginationOptions;
	        break;
	      case 'CHATS':
	        options['filterOptions'] = this.props.data.chats_FilterOptions;
	        options['paginationOptions'] = this.props.data.chats_PaginationOptions;
	        break;
	      case 'USERS':
	        options['filterOptions'] = this.props.data.users_FilterOptions;
	        options['paginationOptions'] = this.props.data.users_PaginationOptions;
	        break;
	      case 'MESSAGES':
	        options['filterOptions'] = this.props.data.messages_FilterOptions;
	        options['paginationOptions'] = this.props.data.messages_PaginationOptions;
	        break;
	      case 'CONTACT_LIST':
	        options['filterOptions'] = this.props.data.contactList_FilterOptions;
	        options['paginationOptions'] = this.props.data.contactList_PaginationOptions;
	        break;
	      case 'LOGGER':
	        options['filterOptions'] = this.props.data.logger_FilterOptions;
	        options['paginationOptions'] = this.props.data.logger_PaginationOptions;
	        break;
	      default:
	        options = null;
	        break;
	    }
	    return options;
	  },
	  changeRTE: function changeRTE(element, currentOptions) {
	    var po = currentOptions.paginationOptions;
	    if (element.checked) {
	      po.mode_change = "rte";
	      po.rtePerPage = true;
	      po.currentPage = null;
	    } else {
	      po.mode_change = "nrte";
	      po.rtePerPage = false;
	    }
	    return currentOptions;
	  },
	  changePerPage: function changePerPage(element, currentOptions) {
	    var value = parseInt(element.value, 10),
	        po = currentOptions.paginationOptions;
	    po.perPageValueShow = element.value;
	    if (!(value === 0 || Number.isNaN(value))) {
	      po.perPageValue = value;
	      if (po.rtePerPage) {
	        po.currentPage = null;
	      }
	    }

	    return currentOptions;
	  },
	  render: function render() {
	    var options = this.defineOptions(this.props.mode);
	    if (options && options.filterOptions.show) {
	      var configs = this.defineConfig(this.props.mode);
	      if (!configs) {
	        return _react2.default.createElement('div', null);
	      }

	      configs = this.prepareConfig(configs, options.paginationOptions.mode_change);
	      var mainContainer = {
	        "element": "div",
	        "config": {
	          "class": "flex-item flex-wrap"
	        }
	      };
	      var data = {
	        "perPageValue": options.paginationOptions.perPageValueShow,
	        "showEnablePagination": options.paginationOptions.showEnablePagination,
	        "rtePerPage": options.paginationOptions.rtePerPage,
	        "mode_change": options.paginationOptions.mode_change
	      };
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_location_wrapper2.default, { events: this.props.events, data: data, mainContainer: mainContainer, configs: configs })
	      );
	    } else {
	      return _react2.default.createElement('div', null);
	    }
	  }
	});

	_extend_core2.default.prototype.inherit(Filter, _switcher_core2.default);

	exports.default = Filter;

/***/ },

/***/ 315:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _location_wrapper = __webpack_require__(293);

	var _location_wrapper2 = _interopRequireDefault(_location_wrapper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var PanelToolbar = _react2.default.createClass({
	  displayName: 'PanelToolbar',
	  getDefaultProps: function getDefaultProps() {
	    return {
	      panelLeftToolbarConfig: [{
	        "role": "locationWrapper",
	        "classList": "flex",
	        "location": "users"
	      }, {
	        "element": "button",
	        "icon": "add_user_icon",
	        "text": 66,
	        "class": "flex-item-1-0p",
	        "location": "users",
	        "data": {
	          "role": "btnToolbar",
	          "action": "switchPanelMode",
	          "mode_to": "JOIN_USER"
	        },
	        "disable": false
	      }, {
	        "element": "button",
	        "icon": "users_icon",
	        "text": 32,
	        "class": "flex-item-1-0p",
	        "location": "users",
	        "data": {
	          "role": "btnToolbar",
	          "action": "switchPanelMode",
	          "mode_to": "USERS"
	        },
	        "disable": false
	      }, {
	        "element": "button",
	        "icon": "notepad_icon",
	        "data": {
	          "action": "togglePanel",
	          "role": "togglePanelToolbar",
	          "description": 46
	        },
	        "location": "users",
	        "class": "flex-item-1-0p c-50 border-c300 min-height-2-6em "
	      },

	      /*        {
	                "role": "locationWrapper",
	                "classList": "flex",
	                "location": "blogs"
	              },
	              {
	                "element": "button",
	                "icon": "new_blog_icon",
	                "text": 63,
	                "class": "flex-item-1-0p",
	                "location": "blogs",
	                "data": {
	                  "role": "btnToolbar",
	                  "action": "switchPanelMode",
	                  "mode_to": "CREATE_BLOG"
	                },
	                "disable": false
	              },
	              {
	                "element": "button",
	                "icon": "add_blog_icon",
	                "text": 64,
	                "class": "flex-item-1-0p",
	                "location": "blogs",
	                "data": {
	                  "role": "btnToolbar",
	                  "action": "switchPanelMode",
	                  "mode_to": "JOIN_BLOG"
	                },
	                "disable": false
	              },
	              {
	                "element": "button",
	                "icon": "blogs_icon",
	                "text": 65,
	                "class": "flex-item-1-0p",
	                "location": "blogs",
	                "data": {
	                  "role": "btnToolbar",
	                  "action": "switchPanelMode",
	                  "mode_to": "BLOGS"
	                },
	                "disable": false
	              },*/

	      {
	        "role": "locationWrapper",
	        "classList": "flex",
	        "location": "chats"
	      }, {
	        "element": "button",
	        "icon": "new_chat_icon",
	        "text": 1,
	        "class": "flex-item-1-0p",
	        "location": "chats",
	        "data": {
	          "description": 2,
	          "role": "btnToolbar",
	          "action": "switchPanelMode",
	          "mode_to": "CREATE_CHAT"
	        },
	        "disable": false
	      }, {
	        "element": "button",
	        "icon": "add_chat_icon",
	        "text": 29,
	        "class": "flex-item-1-0p",
	        "location": "chats",
	        "data": {
	          "role": "btnToolbar",
	          "action": "switchPanelMode",
	          "mode_to": "JOIN_CHAT"
	        },
	        "disable": false
	      }, {
	        "element": "button",
	        "icon": "chats_icon",
	        "text": 30,
	        "class": "flex-item-1-0p",
	        "location": "chats",
	        "data": {
	          "description": 31,
	          "role": "btnToolbar",
	          "action": "switchPanelMode",
	          "mode_to": "CHATS"
	        },
	        "disable": false
	      }],
	      panelRightToolbarConfig: [{
	        "role": "locationWrapper",
	        "classList": "flex-wrap",
	        "location": "buttons"
	      }, {
	        "element": "button",
	        "icon": "folder_icon",
	        "location": "buttons",
	        "data": {
	          "action": "togglePanel",
	          "role": "togglePanelToolbar",
	          "description": 47
	        },
	        "class": "flex-item-1-0p c-50 border-c300 min-height-2-6em "
	      }, {
	        "element": "button",
	        "icon": "user_icon",
	        "text": 33,
	        "class": "floatR flex-item-1-0p",
	        "location": "buttons",
	        "data": {
	          "role": "btnToolbar",
	          "action": "switchPanelMode",
	          "mode_to": "USER_INFO_SHOW"
	        },
	        "disable": false
	      }, {
	        "element": "button",
	        "icon": "connections_icon",
	        "text": 13,
	        "class": "floatR flex-item-1-0p",
	        "location": "buttons",
	        "data": {
	          "role": "btnToolbar",
	          "action": "switchPanelMode",
	          "mode_to": "CONNECTIONS"
	        },
	        "disable": false
	      }, {
	        "element": "button",
	        "icon": "settings_panel",
	        "text": 22,
	        "class": "floatR flex-item-1-0p",
	        "location": "buttons",
	        "data": {
	          "role": "btnToolbar",
	          "action": "switchPanelMode",
	          "mode_to": "SETTINGS_GLOBAL"
	        },
	        "disable": false
	      }]
	    };
	  },
	  defineConfig: function defineConfig(location) {
	    switch (location) {
	      case 'left':
	        return this.props.panelLeftToolbarConfig;
	        break;
	      case 'right':
	        return this.props.panelRightToolbarConfig;
	        break;
	    }
	  },
	  render: function render() {
	    var configs = this.defineConfig(this.props.location),
	        mode = this.props.mode;
	    if (!configs) {
	      return _react2.default.createElement('div', null);
	    }
	    if (mode === 'USER_INFO_EDIT') {
	      mode = 'USER_INFO_SHOW';
	    }

	    return _react2.default.createElement(_location_wrapper2.default, { events: this.props.events, configs: configs, mode: mode, hide: this.props.hide });
	  }
	});

	exports.default = PanelToolbar;

/***/ },

/***/ 316:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _switcher_core = __webpack_require__(310);

	var _switcher_core2 = _interopRequireDefault(_switcher_core);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	var _utils = __webpack_require__(317);

	var _utils2 = _interopRequireDefault(_utils);

	var _location_wrapper = __webpack_require__(293);

	var _location_wrapper2 = _interopRequireDefault(_location_wrapper);

	var _panel_users = __webpack_require__(318);

	var _panel_users2 = _interopRequireDefault(_panel_users);

	var _panel_chats = __webpack_require__(319);

	var _panel_chats2 = _interopRequireDefault(_panel_chats);

	var _message = __webpack_require__(320);

	var _message2 = _interopRequireDefault(_message);

	var _setting = __webpack_require__(325);

	var _setting2 = _interopRequireDefault(_setting);

	var _contact_list = __webpack_require__(327);

	var _contact_list2 = _interopRequireDefault(_contact_list);

	var _connections = __webpack_require__(328);

	var _connections2 = _interopRequireDefault(_connections);

	var _user_avarat = __webpack_require__(329);

	var _user_avarat2 = _interopRequireDefault(_user_avarat);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Body = _react2.default.createClass({
	  displayName: 'Body',

	  MODE: {
	    SETTINGS: 'SETTINGS',
	    MESSAGES: 'MESSAGES',
	    CONTACT_LIST: 'CONTACT_LIST',
	    LOGGER: 'LOGGER',

	    CREATE_CHAT: 'CREATE_CHAT',
	    JOIN_CHAT: 'JOIN_CHAT',
	    CHATS: 'CHATS',
	    USERS: 'USERS',
	    JOIN_USER: 'JOIN_USER',

	    USER_INFO_EDIT: 'USER_INFO_EDIT',
	    USER_INFO_SHOW: 'USER_INFO_SHOW',
	    DETAIL_VIEW: 'DETAIL_VIEW',

	    CONNECTIONS: 'CONNECTIONS',
	    SETTINGS_GLOBAL: 'SETTINGS_GLOBAL',

	    CREATE_BLOG: 'CREATE_BLOG',
	    JOIN_BLOG: 'JOIN_BLOG',
	    BLOGS: 'BLOGS',

	    PAGINATION: "PAGINATION",
	    GO_TO: "GO_TO",
	    FILTER: 'FILTER'
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      user_info_edit_config: [{
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-between",
	        "location": "user_name"
	      }, {
	        "element": "label",
	        "icon": "",
	        "text": 36,
	        "class": "",
	        "location": "user_name",
	        "data": {
	          "role": "user_name_label"
	        },
	        "htmlFor": "user_name",
	        "name": "",
	        "sort": 1,
	        "disable": false,
	        "mode": "USER_INFO_EDIT"
	      }, {
	        "element": "input",
	        "type": "text",
	        "icon": "",
	        "text": "",
	        "class": "",
	        "location": "user_name",
	        "data": {
	          "role": "userName",
	          "input": true,
	          "main": "user_name_input",
	          "key": "userName"
	        },
	        "name": "",
	        "id": "user_name",
	        "disabled": false,
	        "sort": 2,
	        "mode": "USER_INFO_EDIT"
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-between",
	        "location": "old_password"
	      }, {
	        "element": "label",
	        "icon": "",
	        "text": 39,
	        "class": "",
	        "location": "old_password",
	        "data": {
	          "role": "user_old_password_label"
	        },
	        "htmlFor": "user_old_password",
	        "name": "",
	        "sort": 3,
	        "disable": false,
	        "mode": "USER_INFO_EDIT"
	      }, {
	        "element": "input",
	        "type": "password",
	        "icon": "",
	        "text": "",
	        "class": "",
	        "location": "old_password",
	        "data": {
	          "role": "passwordOld",
	          "input": true,
	          "key": "passwordOld"
	        },
	        "name": "",
	        "id": "user_old_password",
	        "disabled": false,
	        "sort": 4,
	        "mode": "USER_INFO_EDIT"
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-between",
	        "location": "new_password"
	      }, {
	        "element": "label",
	        "icon": "",
	        "text": 40,
	        "class": "",
	        "location": "new_password",
	        "data": {
	          "role": "user_new_password_label"
	        },
	        "htmlFor": "user_new_password",
	        "name": "",
	        "sort": 5,
	        "disable": false,
	        "mode": "USER_INFO_EDIT"
	      }, {
	        "element": "input",
	        "type": "password",
	        "icon": "",
	        "text": "",
	        "class": "",
	        "location": "new_password",
	        "data": {
	          "role": "passwordNew",
	          "input": true,
	          "key": "passwordNew"
	        },
	        "name": "",
	        "id": "user_new_password",
	        "disabled": false,
	        "sort": 6,
	        "mode": "USER_INFO_EDIT"
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-between",
	        "location": "confirm_password"
	      }, {
	        "element": "label",
	        "icon": "",
	        "text": 41,
	        "class": "",
	        "location": "confirm_password",
	        "data": {
	          "role": "user_confirm_password_label"
	        },
	        "htmlFor": "user_confirm_password",
	        "name": "",
	        "sort": 7,
	        "disable": false,
	        "mode": "USER_INFO_EDIT"
	      }, {
	        "element": "input",
	        "type": "password",
	        "icon": "",
	        "text": "",
	        "class": "",
	        "location": "confirm_password",
	        "data": {
	          "role": "passwordConfirm",
	          "input": true,
	          "key": "passwordConfirm"
	        },
	        "name": "",
	        "id": "user_confirm_password",
	        "disabled": false,
	        "sort": 8,
	        "mode": "USER_INFO_EDIT"
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-around c-200",
	        "location": "navbar"
	      }, {
	        "element": "button",
	        "icon": "cancel_icon",
	        "text": 42,
	        "class": "button-convex",
	        "location": "navbar",
	        "data": {
	          "role": "",
	          "action": "cancelChangeUserInfo"
	        },
	        "name": "",
	        "disable": false,
	        "sort": 9,
	        "mode": "USER_INFO_EDIT"
	      }, {
	        "element": "button",
	        "icon": "ok_icon",
	        "text": 43,
	        "class": "button-convex",
	        "location": "navbar",
	        "data": {
	          "role": "",
	          "action": "saveChangeUserInfo"
	        },
	        "name": "",
	        "disable": false,
	        "sort": 10,
	        "mode": "USER_INFO_EDIT"
	      }],
	      user_info_show_config: [{
	        "role": "locationWrapper",
	        "classList": "w-100p flex",
	        "location": "user_id"
	      }, {
	        "element": "label",
	        "icon": "",
	        "text": 9,
	        "class": "",
	        "location": "user_id",
	        "data": {
	          "role": "user_id_label"
	        },
	        "htmlFor": "user_id",
	        "name": "",
	        "sort": 1,
	        "disable": false,
	        "mode": "USER_INFO_SHOW"
	      }, {
	        "element": "input",
	        "type": "text",
	        "icon": "",
	        "text": "",
	        "class": "flex-grow_1",
	        "location": "user_id",
	        "data": {
	          "role": "user_id",
	          "key": "user_id"
	        },
	        "name": "",
	        "id": "user_id",
	        "disabled": true,
	        "sort": 2,
	        "mode": "USER_INFO_SHOW"
	      }, {
	        "element": "button",
	        "text": 126,
	        "class": "button-convex",
	        "location": "user_id",
	        "data": {
	          "action": "copyUserId"
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p flex",
	        "location": "user_name"
	      }, {
	        "element": "label",
	        "icon": "",
	        "text": 36,
	        "class": "",
	        "location": "user_name",
	        "data": {
	          "role": "user_name_label"
	        },
	        "htmlFor": "user_name",
	        "name": "",
	        "sort": 3,
	        "disable": false,
	        "mode": "USER_INFO_SHOW"
	      }, {
	        "element": "input",
	        "type": "text",
	        "icon": "",
	        "text": "",
	        "class": "flex-grow_1",
	        "location": "user_name",
	        "data": {
	          "key": "userName",
	          "role": "userName"
	        },
	        "name": "",
	        "id": "user_name",
	        "disabled": true,
	        "sort": 4,
	        "mode": "USER_INFO_SHOW"
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-around c-200",
	        "location": "navbar"
	      }, {
	        "element": "button",
	        "icon": "change_user_info_icon",
	        "text": 37,
	        "class": "button-convex",
	        "location": "navbar",
	        "data": {
	          "role": "",
	          "action": "changeUserInfo"
	        },
	        "name": "",
	        "disable": false,
	        "sort": 5,
	        "mode": "USER_INFO_SHOW"
	      }, {
	        "element": "button",
	        "icon": "exit_icon",
	        "text": 38,
	        "class": "button-convex",
	        "location": "navbar",
	        "data": {
	          "role": "",
	          "throw": "true",
	          "action": "logout"
	        },
	        "name": "",
	        "disable": false,
	        "sort": 6,
	        "mode": "USER_INFO_SHOW"
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-start",
	        "location": "language"
	      }, {
	        "element": "label",
	        "text": 100,
	        "class": "p-r-l-1em",
	        "location": "language",
	        "data": {
	          "role": "labelLanguage"
	        }
	      }, {
	        "element": "select",
	        "location": "language",
	        "select_options": [{
	          "text": "English",
	          "value": "en"
	        }, {
	          "text": "Русский",
	          "value": "ru"
	        }],
	        "data": {
	          "action": "changeLanguage",
	          "role": "selectLanguage",
	          "warn": true
	        }
	      }],
	      create_chat_config: [{
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-around",
	        "location": "chatAuto"
	      }, {
	        "element": "button",
	        "text": 3,
	        "class": "button-inset-square",
	        "location": "chatAuto",
	        "data": {
	          "throw": "true",
	          "action": "addNewChatAuto",
	          "mode": "CREATE_CHAT"
	        },
	        "disable": false
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-around",
	        "location": "chatManual"
	      }, {
	        "element": "button",
	        "text": 4,
	        "class": "button-inset-square",
	        "location": "chatManual",
	        "data": {
	          "throw": "true",
	          "action": "addNewChatManual",
	          "mode": "CREATE_CHAT"
	        },
	        "disable": false
	      }],
	      join_chat_config: [{
	        "role": "locationWrapper",
	        "classList": "w-100p flex-sp-between",
	        "location": "chat_id_input"
	      }, {
	        "element": "label",
	        "text": 5,
	        "location": "chat_id_input",
	        "htmlFor": "chat_id_input"
	      }, {
	        "element": "input",
	        "type": "text",
	        "class": "flex-item-w50p",
	        "location": "chat_id_input",
	        "data": {
	          "role": "chat_id_input",
	          "key": "chatId"
	        },
	        "id": "chat_id_input"
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p flex-sp-between",
	        "location": "chat_message_input"
	      }, {
	        "element": "label",
	        "text": 77,
	        "location": "chat_message_input",
	        "htmlFor": "chat_message_input"
	      }, {
	        "element": "input",
	        "type": "text",
	        "class": "flex-item-w50p",
	        "location": "chat_message_input",
	        "data": {
	          "role": "chat_message_input",
	          "key": "messageRequest"
	        },
	        "id": "chat_message_input"
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p flex-sp-around",
	        "location": "chat_id_btn"
	      }, {
	        "element": "button",
	        "text": 6,
	        "class": "button-inset-square",
	        "location": "chat_id_btn",
	        "data": {
	          "throw": "true",
	          "action": "requestChatByChatId",
	          "mode": "JOIN_CHAT"
	        },
	        "disable": false
	      }],
	      detail_view_config: [{
	        "role": "locationWrapper",
	        "classList": "w-100p flex-sp-around",
	        "location": "navbar"
	      }, {
	        "element": "button",
	        "icon": "save_open_icon",
	        "text": 10,
	        "class": "button-convex",
	        "location": "navbar",
	        "data": {
	          "throw": "true",
	          "restore_chat_state": true,
	          "action": "showChat",
	          "mode": "DETAIL_VIEW",
	          "description": 123
	        },
	        "disable": false
	      }, {
	        "element": "button",
	        "icon": "open_icon",
	        "text": 58,
	        "class": "button-convex",
	        "location": "navbar",
	        "data": {
	          "throw": "true",
	          "action": "showChat",
	          "mode": "DETAIL_VIEW",
	          "description": 122
	        },
	        "disable": false
	      }, {
	        "element": "button",
	        "icon": "exit_icon",
	        "text": 20,
	        "location": "navbar",
	        "data": {
	          "role": "closeChat",
	          "action": "closeChat",
	          "mode": "DETAIL_VIEW"
	        },
	        "class": "button-convex",
	        "name": "CloseChat"
	      }, {
	        "element": "button",
	        "icon": "save_not_exit_icon",
	        "text": 43,
	        "location": "navbar",
	        "data": {
	          "role": "saveStatesChat",
	          "action": "closeChat",
	          "description": 78,
	          "mode": "DETAIL_VIEW"
	        },
	        "class": "button-convex",
	        "name": "saveStatesChat"
	      }, {
	        "element": "button",
	        "icon": "save_exit_icon",
	        "location": "navbar",
	        "text": 56,
	        "data": {
	          "role": "saveAndCloseChat",
	          "action": "closeChat",
	          "mode": "DETAIL_VIEW",
	          "description": 57
	        },
	        "class": "button-convex",
	        "name": "SaveCloseChat"
	      }],
	      chats_info_config: [{
	        "element": "svg",
	        "icon": "pointer_icon.svg",
	        "data": {
	          "mode": "CHATS"
	        }
	      }, {
	        "element": "label",
	        "type": "text",
	        "data": {
	          "role": "my_chat_id_label",
	          "key": "chat_id",
	          "mode": "CHATS"
	        },
	        "disabled": false
	      }],
	      users_info_config: [{
	        "role": "locationWrapper",
	        "classList": "w-100p flex-sp-between",
	        "location": "user_id"
	      }, {
	        "element": "label",
	        "icon": "",
	        "text": 67,
	        "class": "",
	        "location": "user_id",
	        "data": {
	          "role": "user_id_label"
	        },
	        "htmlFor": "user_id",
	        "name": "",
	        "disable": false
	      }, {
	        "element": "input",
	        "type": "text",
	        "icon": "",
	        "text": "",
	        "class": "flex-item-w50p",
	        "location": "user_id",
	        "data": {
	          "role": "user_id_input",
	          "key": 'userId'
	        },
	        "name": "",
	        "id": "user_id",
	        "disabled": false
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p flex-sp-between",
	        "location": "user_message"
	      }, {
	        "element": "label",
	        "icon": "",
	        "text": 77,
	        "class": "",
	        "location": "user_message",
	        "data": {
	          "role": "user_message_label"
	        },
	        "htmlFor": "user_message",
	        "name": ""
	      }, {
	        "element": "input",
	        "type": "text",
	        "icon": "",
	        "text": "",
	        "class": "flex-item-w50p",
	        "location": "user_message",
	        "data": {
	          "role": "user_message_input",
	          "key": "messageRequest"
	        },
	        "name": "",
	        "id": "user_message"
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p flex-sp-around",
	        "location": "user_id_btn"
	      }, {
	        "element": "button",
	        "icon": "",
	        "text": 68,
	        "class": "button-inset-square",
	        "location": "user_id_btn",
	        "data": {
	          "throw": "true",
	          "action": "requestFriendByUserId",
	          "mode": "JOIN_USER"
	        },
	        "name": "",
	        "disable": false
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p",
	        "location": "user_id_apply"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "text": 69,
	        "class": "check-box-size",
	        "location": "user_id_apply",
	        "data": {
	          "key": "readyForFriendRequest",
	          "role": "btnEdit",
	          "action": "readyForFriendRequest",
	          "name": ""
	        }
	      }],
	      settings_config: [{
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-between",
	        "location": "chat_id_container"
	      }, {
	        "element": "label",
	        "icon": "",
	        "text": 5,
	        "class": "",
	        "location": "chat_id_container"
	      }, {
	        "element": "input",
	        "type": "text",
	        "location": "chat_id_container",
	        "data": {
	          "key": "chat_id"
	        },
	        "disabled": true
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-between",
	        "location": "logger_massage"
	      }, {
	        "element": "button",
	        "text": 34,
	        "location": "logger_massage",
	        "data": {
	          "throw": "true",
	          "action": "changeMode",
	          "chat_part": "body",
	          "mode_to": "LOGGER"
	        },
	        "disable": true
	      }, {
	        "role": "locationWrapper",
	        "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
	        "location": "chat_users_apply"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "text": 79,
	        "class": "check-box-size",
	        "location": "chat_users_apply",
	        "data": {
	          "action": "toggleChatUsersFriendship"
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
	        "location": "send_enter"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "text": 35,
	        "class": "check-box-size",
	        "location": "send_enter",
	        "data": {
	          "key": "sendEnter",
	          "role": "btnEdit",
	          "action": "changeSendEnter",
	          "name": ""
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
	        "location": "size_container"
	      }, {
	        "element": "label",
	        "text": 74,
	        "class": "",
	        "location": "size_container",
	        "data": {
	          "role": ""
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
	        "location": "size"
	      }, {
	        "element": "input",
	        "type": "radio",
	        "text": 70,
	        "class": "check-box-size",
	        "location": "size",
	        "name": "size",
	        "data": {
	          "key": "size_350",
	          "value": 350,
	          "role": "sizeChatButton",
	          "action": "changeChatSize"
	        }
	      }, {
	        "element": "input",
	        "type": "radio",
	        "text": 71,
	        "class": "check-box-size",
	        "location": "size",
	        "name": "size",
	        "data": {
	          "key": "size_700",
	          "value": 700,
	          "role": "sizeChatButton",
	          "action": "changeChatSize"
	        }
	      }, {
	        "element": "input",
	        "type": "radio",
	        "text": 72,
	        "class": "check-box-size",
	        "location": "size",
	        "name": "size",
	        "data": {
	          "key": "size_1050",
	          "value": 1050,
	          "role": "sizeChatButton",
	          "action": "changeChatSize"
	        }
	      }, {
	        "element": "input",
	        "type": "radio",
	        "text": 73,
	        "class": "check-box-size",
	        "location": "size",
	        "name": "size",
	        "data": {
	          "key": "size_custom",
	          "role": "sizeChatButton",
	          "action": "changeChatSize"
	        }
	      }, {
	        "element": "button",
	        "icon": "",
	        "text": 75,
	        "location": "size",
	        "data": {
	          "action": "saveAsCustomWidth",
	          "role": "saveAsCustomWidth"
	        },
	        "class": "hide",
	        "name": "saveAsCustomWidth"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "class": "check-box-size hide",
	        "location": "size",
	        "name": "size",
	        "data": {
	          "key": "adjust_width",
	          "role": "adjust_width",
	          "action": "changeAdjustWidth"
	        }
	      }, {
	        "element": "label",
	        "text": 76,
	        "location": "size",
	        "class": "hide",
	        "sort": 2,
	        "data": {
	          "role": "adjust_width_label"
	        }
	      }],
	      settings_global_config: [{
	        "role": "locationWrapper",
	        "classList": "w-100p",
	        "location": "scrollEachChat"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "text": 108,
	        "class": "check-box-size",
	        "location": "scrollEachChat",
	        "data": {
	          "key": "scrollEachChat",
	          "action": "scrollEachChat"
	        }
	      }]
	    };
	  },
	  defineConfigs: function defineConfigs(mode) {
	    switch (mode) {
	      case this.MODE.CHATS:
	        return {
	          chats_info_config: this.props.chats_info_config,
	          detail_view_config: this.props.detail_view_config
	        };
	        break;
	      case this.MODE.CREATE_CHAT:
	        return this.props.create_chat_config;
	        break;
	      case this.MODE.JOIN_CHAT:
	        return this.props.join_chat_config;
	        break;
	      case this.MODE.DETAIL_VIEW:
	        return this.props.detail_view_config;
	        break;
	      case this.MODE.USERS:
	      case this.MODE.JOIN_USER:
	        return this.props.users_info_config;
	        break;
	      case this.MODE.CREATE_BLOG:
	      case this.MODE.JOIN_BLOG:
	      case this.MODE.BLOGS:
	        return null;
	        break;

	      case this.MODE.USER_INFO_SHOW:
	        return this.props.user_info_show_config;
	        break;
	      case this.MODE.USER_INFO_EDIT:
	        return this.props.user_info_edit_config;
	        break;
	      case this.MODE.SETTINGS_GLOBAL:
	        return this.props.settings_global_config;
	        break;

	      case this.MODE.CONNECTIONS:
	      case this.MODE.MESSAGES:
	      case this.MODE.LOGGER:
	      case this.MODE.SETTINGS:
	      case this.MODE.CONTACT_LIST:
	        return {};
	        break;

	      default:
	        return null;
	        break;
	    }
	  },
	  defineComponents: function defineComponents(mode, configs) {
	    var items = [],
	        data = void 0,
	        self = this;
	    switch (mode) {
	      case this.MODE.USERS:
	        var contactsInfo = this.props.data.contactsInfo;
	        if (this.props.data.users_PaginationOptions.show) {
	          contactsInfo = this.limitationQuantityRecords(contactsInfo, this.props.data, this.props.mode);
	        }
	        return _react2.default.createElement(_panel_users2.default, { data: contactsInfo });
	        break;
	      case this.MODE.JOIN_USER:
	        data = {
	          "readyForFriendRequest": this.props.data.joinUser_ListOptions.readyForRequest,
	          "userId": this.props.data.joinUser_ListOptions.userId,
	          "messageRequest": this.props.data.joinUser_ListOptions.messageRequest,
	          "userName": this.props.data.userInfo.userName
	        };
	        if (this.props.data.joinUser_ListOptions.messageRequest) {
	          data.messageRequest = this.transformationData(data, this.props.data.joinUser_ListOptions.messageRequest);
	        }
	        items.push(_react2.default.createElement(_location_wrapper2.default, { key: 1, events: this.props.events, configs: configs, data: data }));
	        return items;
	        break;
	      case this.MODE.CHATS:
	        var chat_ids = this.props.data.chat_ids;
	        if (this.props.data.chats_PaginationOptions.show) {
	          chat_ids = this.limitationQuantityRecords(chat_ids, this.props.data, this.props.mode);
	        }
	        data = {
	          "chat_ids": chat_ids,
	          "openChatsInfoArray": this.props.data.openChatsInfoArray,
	          "closingChatsInfoArray": this.props.data.closingChatsInfoArray,
	          "openChats": this.props.data.openChats,
	          "myId": this.props.userInfo.user_id,
	          "myName": this.props.userInfo.userName
	        };
	        return _react2.default.createElement(_panel_chats2.default, { events: this.props.events, data: data, configs: configs });
	        break;
	      case this.MODE.JOIN_CHAT:
	        data = {
	          "chatId": this.props.data.joinChat_ListOptions.chatId,
	          "messageRequest": this.props.data.joinChat_ListOptions.messageRequest,
	          "userName": this.props.data.userInfo.userName
	        };
	        if (this.props.data.joinChat_ListOptions.messageRequest) {
	          data.messageRequest = this.transformationData(data, this.props.data.joinChat_ListOptions.messageRequest);
	        }
	        items.push(_react2.default.createElement(_location_wrapper2.default, { key: 1, events: this.props.events, configs: configs, data: data }));
	        return items;
	        break;
	      case this.MODE.USER_INFO_SHOW:
	        data = this.props.userInfo;
	        items.push(_react2.default.createElement(_location_wrapper2.default, { key: 'info', events: this.props.events, configs: configs, data: data }));
	        items.push(_react2.default.createElement(_user_avarat2.default, { key: 'avatar', events: this.props.events, configs: configs, data: this.props.data,
	          handleEvent: this.props.handleEvent }));
	        return items;
	        break;
	      case this.MODE.USER_INFO_EDIT:
	        items.push(_react2.default.createElement(_location_wrapper2.default, { key: 1, events: this.props.events, configs: configs, data: this.props.userInfo,
	          mode: this.MODE.USER_INFO_SHOW }));
	        return items;
	        break;

	      case this.MODE.MESSAGES:
	        return _react2.default.createElement(_message2.default, { data: this.props.data, handleEvent: this.props.handleEvent });
	        break;
	      case this.MODE.SETTINGS:
	        return _react2.default.createElement(_setting2.default, { data: this.props.data, handleEvent: this.props.handleEvent });
	        break;
	      case this.MODE.CONTACT_LIST:
	        return _react2.default.createElement(_contact_list2.default, { data: this.props.data, handleEvent: this.props.handleEvent });
	        break;
	      case this.MODE.CONNECTIONS:
	        return _react2.default.createElement(_connections2.default, { data: this.props.data });
	        break;
	      default:
	        items.push(_react2.default.createElement(_location_wrapper2.default, { key: 1, events: this.props.events, configs: configs,
	          data: this.props.data }));
	        break;
	    }
	    return items;
	  },
	  transformationData: function transformationData(_data, _transform_value) {
	    var transform_value = _localization2.default.getLocText(_transform_value);
	    transform_value = _utils2.default.objectToUrl(_data, transform_value);
	    return transform_value;
	  },
	  limitationQuantityRecords: function limitationQuantityRecords(data, state, mode) {
	    if (data && data.length) {
	      var currentOptions = this.optionsDefinition(state, mode);
	      if (currentOptions.listOptions.final > data.length || !currentOptions.listOptions.final) {
	        currentOptions.listOptions.final = data.length;
	      }
	      data = data.slice(currentOptions.listOptions.start, currentOptions.listOptions.final);
	    }
	    return data;
	  },
	  render: function render() {
	    var configs = this.defineConfigs(this.props.mode);
	    if (!configs) {
	      return _react2.default.createElement('div', null);
	    } else {
	      return _react2.default.createElement(
	        'div',
	        null,
	        this.defineComponents(this.props.mode, configs)
	      );
	    }
	  }
	});
	_extend_core2.default.prototype.inherit(Body, _switcher_core2.default);

	exports.default = Body;

/***/ },

/***/ 317:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Utils = function Utils() {};

	Utils.prototype = {

	  /**
	   * prepare url by input object
	   */

	  objectToUrl: function objectToUrl(objectData, initial_url) {
	    var url = initial_url;
	    Object.keys(objectData).forEach(function (key) {
	      var str_key = '{' + key + '}';
	      if (url.indexOf(str_key) >= 0) {
	        url = url.replace(str_key, objectData[key]);
	      }
	    });
	    return url;
	  }
	};

	exports.default = new Utils();

/***/ },

/***/ 318:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var PanelUsers = _react2.default.createClass({
	  displayName: "PanelUsers",
	  renderItems: function renderItems() {
	    var items = [];
	    this.props.data.forEach(function (user) {
	      items.push(_react2.default.createElement(
	        "div",
	        { className: "flex-sp-start margin-t-b", key: user.user_id },
	        _react2.default.createElement(
	          "div",
	          { className: "width-40px flex-just-center" },
	          _react2.default.createElement("img", { src: user.avatar_data, width: "35px", height: "35px", className: "border-radius-5" })
	        ),
	        _react2.default.createElement(
	          "div",
	          { className: "message flex-item-1-auto flex-dir-col flex-sp-between" },
	          _react2.default.createElement(
	            "div",
	            null,
	            "User name: ",
	            user.userName
	          ),
	          _react2.default.createElement(
	            "div",
	            null,
	            "User id: ",
	            user.user_id
	          )
	        )
	      ));
	    });
	    return items;
	  },
	  render: function render() {
	    if (this.props.data && this.props.data.length) {
	      return _react2.default.createElement(
	        "div",
	        null,
	        this.renderItems()
	      );
	    } else {
	      return _react2.default.createElement("div", null);
	    }
	  }
	});

	exports.default = PanelUsers;

/***/ },

/***/ 319:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _location_wrapper = __webpack_require__(293);

	var _location_wrapper2 = _interopRequireDefault(_location_wrapper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var PanelChats = _react2.default.createClass({
	  displayName: 'PanelChats',
	  getInitialState: function getInitialState() {
	    return {
	      usersInfo: {}
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    this.state.usersInfo[this.props.data.myId] = this.props.data.myName;
	    this.setState({ usersInfo: this.state.usersInfo });
	  },
	  renderItems: function renderItems() {
	    var items = [],
	        self = this,
	        usersList = void 0;
	    this.props.data.chat_ids.forEach(function (chat) {
	      var _this = this;

	      var result = this.props.data.openChatsInfoArray.indexOf(chat.chat_id);
	      chat['pointerRotate'] = result;
	      var calcDisplay = function calcDisplay(config) {
	        if (self.props.data && self.props.data.openChats && config.data) {
	          if (self.props.data.openChats[chat.chat_id]) {
	            if (config.data.action === 'showChat') {
	              return false;
	            }
	          } else {
	            if (config.data.action === 'closeChat') {
	              return false;
	            }
	          }
	        }
	        return true;
	      };
	      var usersNameList = [],
	          newUserName = [];
	      if (result !== -1) {
	        chat.user_ids.forEach(function (user, index, array) {
	          if (self.state.usersInfo[user]) {
	            usersNameList.push(self.state.usersInfo[user]);
	            if (index !== array.length - 1) {
	              usersNameList.push(', ');
	            }
	          } else {
	            newUserName.push(user);
	          }
	        });
	        if (newUserName.length) {
	          _users_bus2.default.getContactsInfo(null, newUserName, function (_error, usersInfo) {
	            if (_error) {
	              console.error(_error);
	              return;
	            }
	            usersInfo.forEach(function (_user) {
	              if (!self.state.usersInfo[_user.user_id]) {
	                self.state.usersInfo[_user.user_id] = _user.userName;
	                self.setState({ usersInfo: self.state.usersInfo });
	              }
	            });
	          });
	        }
	      }

	      usersList = _react2.default.createElement(
	        'div',
	        null,
	        usersNameList
	      );
	      items.push(_react2.default.createElement(
	        'div',
	        { 'data-action': 'show_more_info', 'data-role': 'chatWrapper',
	          'data-chat_id': chat.chat_id, key: chat.chat_id, className: 'margin-b-em' },
	        _react2.default.createElement(_location_wrapper2.default, { key: 1, data: chat, events: this.props.events,
	          configs: this.props.configs.chats_info_config }),
	        _react2.default.createElement(
	          'label',
	          null,
	          _localization2.default.getLocText(125),
	          ' ',
	          chat.user_ids.length
	        ),
	        function () {
	          var resultClosing = _this.props.data.closingChatsInfoArray.indexOf(chat.chat_id);
	          if (resultClosing !== -1) {
	            return _react2.default.createElement(
	              'div',
	              { 'data-role': 'detail_view_container', style: { maxHeight: '0em' },
	                className: 'max-height-0', 'data-state': 'expanded', 'data-chat_id': chat.chat_id },
	              usersList,
	              _react2.default.createElement(_location_wrapper2.default, { key: chat.chat_id, data: chat, events: _this.props.events,
	                configs: _this.props.configs.detail_view_config,
	                calcDisplay: calcDisplay })
	            );
	          } else {
	            if (result !== -1) {
	              return _react2.default.createElement(
	                'div',
	                { 'data-role': 'detail_view_container', style: { maxHeight: '15em' },
	                  className: 'max-height-auto max-height-0',
	                  'data-state': 'expanded', 'data-chat_id': chat.chat_id },
	                usersList,
	                _react2.default.createElement(_location_wrapper2.default, { key: chat.chat_id, data: chat, events: _this.props.events,
	                  configs: _this.props.configs.detail_view_config,
	                  calcDisplay: calcDisplay })
	              );
	            } else {
	              return _react2.default.createElement('div', { 'data-role': 'detail_view_container', style: { maxHeight: '0em' }, className: 'max-height-0',
	                'data-chat_id': chat.chat_id });
	            }
	          }
	        }()
	      ));
	    }, this);
	    return items;
	  },
	  render: function render() {
	    if (this.props.data && this.props.data.chat_ids) {
	      return _react2.default.createElement(
	        'div',
	        null,
	        this.renderItems()
	      );
	    } else {
	      return _react2.default.createElement('div', null);
	    }
	  }
	});

	exports.default = PanelChats;

/***/ },

/***/ 320:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _html_message = __webpack_require__(321);

	var _html_message2 = _interopRequireDefault(_html_message);

	var _messages = __webpack_require__(323);

	var _messages2 = _interopRequireDefault(_messages);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _switcher_core = __webpack_require__(310);

	var _switcher_core2 = _interopRequireDefault(_switcher_core);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	var _body = __webpack_require__(316);

	var _body2 = _interopRequireDefault(_body);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Messages = _react2.default.createClass({
	  displayName: 'Messages',

	  avatar_url: '',

	  getInitialState: function getInitialState() {
	    return {
	      messages: [],
	      userInfo: [],
	      previousStart: 0,
	      previousFinal: 0
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    if (!this.props.data.userInfo) return;
	    var user = this.renderAvatarUrl([this.props.data.userInfo])[0];
	    this.setState({ amICreator: user });
	    _event_bus2.default.on('changeMyUserInfo', this.changeMyUserInfo, this);
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    _event_bus2.default.off('changeMyUserInfo', this.changeMyUserInfo, this);
	  },
	  componentDidUpdate: function componentDidUpdate(prevProps) {
	    if (prevProps.data.userInfo !== this.props.data.userInfo) {
	      if (!this.props.data.userInfo) return;
	      var user = this.renderAvatarUrl([this.props.data.userInfo])[0];
	      this.setState({ amICreator: user });
	    }
	  },
	  changeMyUserInfo: function changeMyUserInfo(userId, chatId) {
	    var _this = this;

	    if (chatId === this.props.data.chat_id) {
	      (function () {
	        var self = _this;
	        _users_bus2.default.getContactsInfo(null, [userId], function (_err, userInfo) {
	          if (_err) return console.error(_err);
	          self.state.userInfo.forEach(function (_user) {
	            if (_user.user_id === userInfo.user_id) {
	              _user.avatar_data = userInfo.avatar_data;
	              _user = self.renderAvatarUrl([_user])[0];
	            }
	          });
	          self.setState({ userInfo: self.state.userInfo });
	        });
	      })();
	    }
	  },
	  getMessages: function getMessages() {
	    var self = this;
	    _messages2.default.prototype.getAllMessages(this.props.data.chat_id, this.props.data.bodyOptions.mode, function (err, messages) {
	      var currentOptions = self.optionsDefinition(self.props.data, self.props.data.bodyOptions.mode),
	          po = currentOptions.paginationOptions,
	          lo = currentOptions.listOptions;
	      if (po.showEnablePagination) {
	        messages = _body2.default.prototype.limitationQuantityRecords(messages, self.props.data, self.props.data.bodyOptions.mode);
	        if (lo.start !== self.state.previousStart || lo.final !== self.state.previousFinal) {
	          self.setState({ messages: messages, previousStart: lo.start, previousFinal: lo.final });
	          self.getDataUsers(messages);
	        }
	      } else {
	        if (messages && messages.length !== self.state.messages.length) {
	          self.getDataUsers(messages);
	          self.setState({ messages: messages, previousStart: 0, previousFinal: 0 });
	        }
	      }
	    });
	  },
	  b64toBlob: function b64toBlob(b64Data, contentType, sliceSize) {
	    contentType = contentType || '';
	    sliceSize = sliceSize || 512;
	    var byteCharacters = window.atob(b64Data),
	        byteArrays = [];
	    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
	      var slice = byteCharacters.slice(offset, offset + sliceSize),
	          byteNumbers = new Array(slice.length);
	      for (var i = 0; i < slice.length; i++) {
	        byteNumbers[i] = slice.charCodeAt(i);
	      }
	      var byteArray = new Uint8Array(byteNumbers);
	      byteArrays.push(byteArray);
	    }

	    return new Blob(byteArrays, { type: contentType });
	  },
	  base64MimeType: function base64MimeType(encoded) {
	    var result = null;
	    if (typeof encoded !== 'string') {
	      return result;
	    }
	    var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
	    if (mime && mime.length) {
	      result = mime[1];
	    }

	    return result;
	  },
	  getDataUsers: function getDataUsers(messages) {
	    var usersId = {},
	        self = this;
	    usersId[_users_bus2.default.getUserId()] = true;
	    messages.forEach(function (_message) {
	      usersId[_message.createdByUserId] = true;
	    });
	    var ids = Object.keys(usersId);
	    _users_bus2.default.getContactsInfo(null, Object.keys(usersId), function (_error, userInfo) {
	      if (_error) return console.error(_error);

	      userInfo = self.renderAvatarUrl(userInfo);
	      self.setState({ userInfo: userInfo });
	    });
	  },
	  renderAvatarUrl: function renderAvatarUrl(usersInfo) {
	    var URL = window.URL || window.webkitURL,
	        self = this;
	    usersInfo.forEach(function (_user) {
	      if (URL && _user.avatar_data) {
	        var contentType = self.base64MimeType(_user.avatar_data);
	        if (!contentType) return;

	        var b64Data = _user.avatar_data.split(',')[1],
	            blob = self.b64toBlob(b64Data, contentType);
	        _user.avatar_url = URL.createObjectURL(blob);
	      }
	    });

	    return usersInfo;
	  },
	  getUserParam: function getUserParam(_userId, attribut) {
	    var value = void 0;
	    if (!this.state.userInfo.length) return;
	    this.state.userInfo.every(function (_userInfo) {
	      if (_userInfo.user_id === _userId) {
	        value = _userInfo[attribut];
	      }
	      return !value;
	    });

	    return value;
	  },
	  renderItems: function renderItems() {
	    var self = this,
	        items = [];
	    self.state.messages.forEach(function (_message) {
	      items.push(self.renderItem(_message));
	    });
	    return items;
	  },


	  renderItem: function renderItem(message) {
	    var self = this;
	    if (message.createdDatetime) {
	      var timeCreated = new Date(message.createdDatetime);
	      timeCreated = timeCreated.toISOString();
	    }
	    if (_html_message2.default.prototype.amICreator(message)) {
	      return _react2.default.createElement(
	        'div',
	        { className: 'flex-sp-start margin-t-b', key: message.messageId },
	        _react2.default.createElement(
	          'div',
	          { className: 'message myMessage flex-item-1-auto flex-dir-col flex-sp-between' },
	          _react2.default.createElement('div', { className: 'message-container', dangerouslySetInnerHTML: { __html: message.innerHTML } }),
	          _react2.default.createElement(
	            'div',
	            { className: 'date-format' },
	            timeCreated
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'width-40px flex-just-center flex-dir-col' },
	          _react2.default.createElement('img', { src: this.state.amICreator.avatar_url, width: '35px', height: '35px',
	            className: 'border-radius-5 flex-item-auto' }),
	          _react2.default.createElement(
	            'div',
	            { className: 'user-info flex-item-1-auto c-01' },
	            this.state.amICreator.userName
	          )
	        )
	      );
	    } else {
	      if (message.receivedDatetime) {
	        var timeReceived = new Date(message.receivedDatetime);
	        timeReceived = timeReceived.toISOString();
	      }
	      return _react2.default.createElement(
	        'div',
	        { className: 'flex-sp-start margin-t-b', key: message.messageId },
	        _react2.default.createElement(
	          'div',
	          { className: 'width-40px flex-just-center flex-dir-col' },
	          _react2.default.createElement('img', { src: this.getUserParam(message.createdByUserId, 'avatar_url'), width: '35px', height: '35px',
	            className: 'border-radius-5 flex-item-auto' }),
	          _react2.default.createElement(
	            'div',
	            { className: 'user-info c-50' },
	            this.getUserParam(message.createdByUserId, 'userName')
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'message flex-item-1-auto flex-dir-col flex-sp-between' },
	          _react2.default.createElement('div', { className: 'message-container', dangerouslySetInnerHTML: { __html: message.innerHTML } }),
	          _react2.default.createElement(
	            'div',
	            { className: 'date-format' },
	            timeCreated
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'date-format' },
	            timeReceived
	          )
	        )
	      );
	    }
	  },

	  render: function render() {
	    this.getMessages();
	    return _react2.default.createElement(
	      'div',
	      null,
	      this.renderItems(this.state.messages)
	    );
	  }
	});

	_extend_core2.default.prototype.inherit(Messages, _switcher_core2.default);

	exports.default = Messages;

/***/ },

/***/ 321:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _id_core = __webpack_require__(291);

	var _id_core2 = _interopRequireDefault(_id_core);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	var _model_core = __webpack_require__(322);

	var _model_core2 = _interopRequireDefault(_model_core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var defaultOptions = {
	  innerHTML: ""
	};
	/**
	 * HTML_message model
	 * @param options - options to override basic parameters
	 */
	var HTML_message = function HTML_message(options) {
	  if (!options.messageId) {
	    this.messageId = this.generateId();
	  }
	  this.extend(this, defaultOptions);
	  this.extend(this, options);

	  this.setCreator();
	  this.addMyUserId();
	};

	HTML_message.prototype = {

	  toJSON: function toJSON() {
	    return {
	      createdDatetime: this.createdDatetime,
	      createdByUserId: this.createdByUserId,
	      receivedDatetime: this.receivedDatetime,
	      messageId: this.messageId,
	      user_ids: this.user_ids,
	      innerHTML: this.innerHTML
	    };
	  }

	};

	_extend_core2.default.prototype.inherit(HTML_message, _id_core2.default);
	_extend_core2.default.prototype.inherit(HTML_message, _extend_core2.default);
	_extend_core2.default.prototype.inherit(HTML_message, _model_core2.default);

	exports.default = HTML_message;

/***/ },

/***/ 322:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Model_core = function Model_core() {};

	Model_core.prototype = {

	  __class_name: "model_core",

	  setCreator: function setCreator(_instance) {
	    var instance = _instance ? _instance : this;
	    if (!instance.createdByUserId) {
	      instance.createdByUserId = _users_bus2.default.getUserId();
	      instance.createdDatetime = Date.now();
	    } else {
	      instance.receivedDatetime = Date.now();
	    }
	  },

	  isInUsers: function isInUsers(_instance, user_id) {
	    var instance = _instance ? _instance : this;
	    var check_user_id = user_id ? user_id : _users_bus2.default.getUserId();
	    var inUsers;
	    if (instance.user_ids) {
	      instance.user_ids.every(function (_user_id) {
	        if (_user_id === check_user_id) {
	          inUsers = _user_id;
	        }
	        return !inUsers;
	      });
	    }

	    return inUsers;
	  },

	  addMyUserId: function addMyUserId(_instance) {
	    var instance = _instance ? _instance : this;
	    if (!instance.user_ids) {
	      instance.user_ids = [];
	    }
	    if (!Model_core.prototype.isInUsers(instance)) {
	      instance.user_ids.push(_users_bus2.default.getUserId());
	    }
	  },

	  amICreator: function amICreator(_instance) {
	    var instance = _instance ? _instance : this;
	    return instance.createdByUserId === _users_bus2.default.getUserId();
	  }
	};

	exports.default = Model_core;

/***/ },

/***/ 323:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _indexeddb = __webpack_require__(285);

	var _indexeddb2 = _interopRequireDefault(_indexeddb);

	var _id_core = __webpack_require__(291);

	var _id_core2 = _interopRequireDefault(_id_core);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _switcher_core = __webpack_require__(310);

	var _switcher_core2 = _interopRequireDefault(_switcher_core);

	var _html_log_message = __webpack_require__(324);

	var _html_log_message2 = _interopRequireDefault(_html_log_message);

	var _html_message = __webpack_require__(321);

	var _html_message2 = _interopRequireDefault(_html_message);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _webrtc = __webpack_require__(311);

	var _webrtc2 = _interopRequireDefault(_webrtc);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Messages = function Messages() {};

	Messages.prototype = {
	  setCollectionDescription: function setCollectionDescription(chatId) {
	    return {
	      "db_name": _users_bus2.default.getUserId(),
	      "table_descriptions": [{
	        "table_name": chatId + '_messages',
	        "table_indexes": [{
	          "indexName": 'user_ids',
	          "indexKeyPath": 'user_ids',
	          "indexParameter": { multiEntry: true }
	        }],
	        "table_parameter": { autoIncrement: true, keyPath: "id" }
	      }, {
	        "table_name": chatId + '_log_messages',
	        "table_parameter": { keyPath: "id" }
	      }]
	    };
	  },
	  getMessageConstructor: function getMessageConstructor(mode) {
	    var Constructor;

	    switch (mode) {
	      case "MESSAGES":
	        Constructor = _html_message2.default;
	        break;
	      case "LOGGER":
	        Constructor = _html_log_message2.default;
	        break;
	    }
	    return Constructor;
	  },
	  getAllMessages: function getAllMessages(chatId, mode, callback) {
	    var description = this.setCollectionDescription(chatId),
	        table = this.tableDefinition(mode);
	    _indexeddb2.default.getAll(description, table, function (err, messages) {
	      if (err) {
	        callback(err);
	      } else {
	        callback(null, messages);
	      }
	    });
	  },
	  getLastMessage: function getLastMessage(chatId, mode, callback) {
	    this.getAllMessages(chatId, mode, function (_err, messages) {
	      if (_err) {
	        callback(_err);
	        return;
	      }
	      if (messages.length) {
	        callback(null, messages[messages.length - 1]);
	      } else {
	        callback(null, null);
	      }
	    });
	  },


	  /**
	   * add message to the database
	   */
	  addMessage: function addMessage(mode, message, chatId, lastModifyDatetime, callback) {
	    var self = this,
	        Message = this.getMessageConstructor(mode),
	        newMessage = new Message({ innerHTML: message }).toJSON();
	    this.getLastMessage(chatId, mode, function (_err, lastMessage) {
	      if (_err) return console.log(_err);

	      newMessage = self.addMessageData(lastMessage, [newMessage], false)[0];
	      _indexeddb2.default.addOrPutAll('put', self.setCollectionDescription(chatId), self.tableDefinition(mode), [newMessage], function (error) {
	        if (error) {
	          if (callback) {
	            callback(error);
	          } else {
	            console.error(error);
	          }
	          return;
	        }

	        var messageData = {
	          type: "notifyChat",
	          chat_type: "chat_message",
	          message: newMessage,
	          chat_description: {
	            chat_id: chatId
	          },
	          lastModifyDatetime: lastModifyDatetime
	        };
	        _webrtc2.default.broadcastChatMessage(chatId, JSON.stringify(messageData));

	        callback && callback(error, lastMessage);
	      });
	    });
	  },


	  addRemoteMessage: function addRemoteMessage(remoteMessage, mode, chatId, callback) {
	    var self = this;
	    this.getLastMessage(chatId, mode, function (_err, lastMessage) {
	      if (_err) return console.log(_err);

	      remoteMessage = self.addMessageData(lastMessage, [remoteMessage], true)[0];
	      _indexeddb2.default.addOrPutAll('add', self.setCollectionDescription(chatId), self.tableDefinition(mode), [remoteMessage], function (error) {
	        if (error) {
	          if (callback) {
	            callback(error);
	          } else {
	            console.error(error);
	          }
	          return;
	        }

	        if (callback) {
	          callback(error);
	        }
	      });
	    });
	  },

	  addAllRemoteMessages: function addAllRemoteMessages(remoteMessages, mode, chatId, callback) {
	    _indexeddb2.default.addOrPutAll('add', this.setCollectionDescription(chatId), this.tableDefinition(mode), remoteMessages, function (error) {
	      if (error) {
	        if (callback) {
	          callback(error);
	        } else {
	          console.error(error);
	        }
	        return;
	      }

	      if (callback) {
	        callback(error);
	      }
	    });
	  },

	  addMessageData: function addMessageData(lastMessage, newMessages, remote) {
	    var messagesArray = [];
	    newMessages.forEach(function (_newMessage) {
	      if (remote) {
	        _newMessage = new _html_message2.default(_newMessage).toJSON();
	      }
	      if (lastMessage === null) {
	        _newMessage.followed_by = {
	          user_id: null,
	          message_id: null
	        };
	      } else {
	        _newMessage.followed_by = {
	          user_id: lastMessage.createdByUserId,
	          message_id: lastMessage.messageId
	        };
	      }
	      messagesArray.push(_newMessage);
	    });

	    return messagesArray;
	  },


	  getSynchronizeChatMessages: function getSynchronizeChatMessages(_messageData) {
	    this.getAllMessages(_messageData.chat_description.chat_id, "MESSAGES", function (_err, messages) {
	      var messageData = {
	        type: 'syncResponseChatMessages',
	        from_user_id: _users_bus2.default.getUserId(),
	        chat_description: {
	          chat_id: _messageData.chat_description.chat_id
	        },
	        owner_request: _messageData.owner_request,
	        messages: messages
	      };
	      _webrtc2.default.broadcastChatMessage(messageData.chat_description.chat_id, JSON.stringify(messageData));
	    });
	  }

	};

	_extend_core2.default.prototype.inherit(Messages, _id_core2.default);
	_extend_core2.default.prototype.inherit(Messages, _switcher_core2.default);

	exports.default = Messages;

/***/ },

/***/ 324:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var defaultOptions = {
	  innerHTML: ""
	};
	/**
	 * HTML_log_message model
	 * @param options - options to override basic parameters
	 */
	var HTML_log_message = function HTML_log_message(options) {
	  if (!options.id) {
	    this.id = Date.now();
	  }
	  this.extend(this, defaultOptions);
	  this.extend(this, options);
	};

	HTML_log_message.prototype = {

	  toJSON: function toJSON() {
	    return {
	      id: this.id,
	      innerHTML: this.innerHTML
	    };
	  }

	};

	_extend_core2.default.prototype.inherit(HTML_log_message, _extend_core2.default);

	exports.default = HTML_log_message;

/***/ },

/***/ 325:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(45);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _dom_core = __webpack_require__(303);

	var _dom_core2 = _interopRequireDefault(_dom_core);

	var _websocket = __webpack_require__(290);

	var _websocket2 = _interopRequireDefault(_websocket);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	var _location_wrapper = __webpack_require__(293);

	var _location_wrapper2 = _interopRequireDefault(_location_wrapper);

	var _dialogConfirm = __webpack_require__(326);

	var _dialogConfirm2 = _interopRequireDefault(_dialogConfirm);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var Settings = _react2.default.createClass({
	  displayName: 'Settings',
	  getDefaultProps: function getDefaultProps() {
	    return {
	      size_container_config: [{
	        "role": "locationWrapper",
	        "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
	        "location": "size_container"
	      }, {
	        "element": "label",
	        "text": 74,
	        "class": "",
	        "location": "size_container",
	        "data": {
	          "role": ""
	        }
	      }],
	      size_config: [{
	        "role": "locationWrapper",
	        "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
	        "location": "size"
	      }, {
	        "element": "input",
	        "type": "radio",
	        "text": 70,
	        "class": "check-box-size",
	        "location": "size",
	        "name": "size",
	        "default_size": true,
	        "data": {
	          "key": "small_size",
	          "value": 350,
	          "role": "sizeChatButton",
	          "action": "changeChatSize"
	        }
	      }, {
	        "element": "input",
	        "type": "radio",
	        "text": 71,
	        "class": "check-box-size",
	        "location": "size",
	        "name": "size",
	        "data": {
	          "key": "medium_size",
	          "value": 700,
	          "role": "sizeChatButton",
	          "action": "changeChatSize"
	        }
	      }, {
	        "element": "input",
	        "type": "radio",
	        "text": 72,
	        "class": "check-box-size",
	        "location": "size",
	        "name": "size",
	        "data": {
	          "key": "large_size",
	          "value": 1050,
	          "role": "sizeChatButton",
	          "action": "changeChatSize"
	        }
	      }, {
	        "element": "input",
	        "type": "radio",
	        "text": 73,
	        "class": "check-box-size",
	        "location": "size",
	        "name": "size",
	        "data": {
	          "key": "custom_size",
	          "role": "sizeChatButton",
	          "action": "changeChatSize"
	        }
	      }, {
	        "element": "button",
	        "icon": "",
	        "text": 75,
	        "location": "size",
	        "data": {
	          "action": "saveAsCustomWidth",
	          "role": "saveAsCustomWidth"
	        },
	        "class": "",
	        "name": "saveAsCustomWidth"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "class": "check-box-size",
	        "location": "size",
	        "name": "size",
	        "data": {
	          "key": "adjust_width",
	          "role": "adjust_width",
	          "action": "changeAdjustWidth"
	        }
	      }, {
	        "element": "label",
	        "text": 76,
	        "location": "size",
	        "class": "",
	        "sort": 2,
	        "data": {
	          "role": "adjust_width_label"
	        }
	      }],
	      setting_config_creator: [{
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-between",
	        "location": "chat_id_container"
	      }, {
	        "element": "label",
	        "icon": "",
	        "text": 5,
	        "class": "",
	        "location": "chat_id_container"
	      }, {
	        "element": "input",
	        "type": "text",
	        "location": "chat_id_container",
	        "class": "flex-item-1-auto",
	        "data": {
	          "key": "chat_id",
	          "role": "chat_id"
	        },
	        "disabled": true
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-between",
	        "location": "chat_id_controls"
	      }, {
	        "element": "button",
	        "text": 107,
	        "location": "chat_id_controls",
	        "data": {
	          "action": "copyChatId"
	        },
	        "disable": false
	      }, {
	        "element": "button",
	        "text": 111,
	        "location": "chat_id_controls",
	        "data": {
	          "action": "inviteByUrl"
	        },
	        "disable": false
	      }, {
	        "role": "locationWrapper",
	        "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
	        "location": "chat_users_apply"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "text": 79,
	        "class": "check-box-size",
	        "location": "chat_users_apply",
	        "data": {
	          "action": "toggleChatUsersFriendship",
	          "key": "toggleChatUsersFriendship"
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
	        "location": "send_enter"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "text": 35,
	        "class": "check-box-size",
	        "location": "send_enter",
	        "data": {
	          "key": "sendEnter",
	          "role": "btnEdit",
	          "action": "changeSendEnter",
	          "name": ""
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
	        "location": "toggle_parts_chat"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "text": 109,
	        "class": "check-box-size",
	        "location": "toggle_parts_chat",
	        "data": {
	          "key": "headerFooterControl",
	          "action": "toggleHeaderFooter"
	        }
	      }],
	      setting_config: [{
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-between",
	        "location": "chat_id_container"
	      }, {
	        "element": "label",
	        "icon": "",
	        "text": 5,
	        "class": "",
	        "location": "chat_id_container"
	      }, {
	        "element": "input",
	        "type": "text",
	        "location": "chat_id_container",
	        "class": "flex-item-1-auto",
	        "data": {
	          "key": "chat_id",
	          "role": "chat_id"
	        },
	        "disabled": true
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-between",
	        "location": "chat_id_controls"
	      }, {
	        "element": "button",
	        "text": 107,
	        "location": "chat_id_controls",
	        "data": {
	          "action": "copyChatId"
	        },
	        "disable": false
	      }, {
	        "role": "locationWrapper",
	        "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
	        "location": "chat_users_apply"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "text": 79,
	        "class": "check-box-size",
	        "location": "chat_users_apply",
	        "data": {
	          "action": "toggleChatUsersFriendship",
	          "key": "toggleChatUsersFriendship"
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
	        "location": "send_enter"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "text": 35,
	        "class": "check-box-size",
	        "location": "send_enter",
	        "data": {
	          "key": "sendEnter",
	          "role": "btnEdit",
	          "action": "changeSendEnter",
	          "name": ""
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "flex-item flex-wrap flex-align-c flex-item-auto",
	        "location": "toggle_parts_chat"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "text": 109,
	        "class": "check-box-size",
	        "location": "toggle_parts_chat",
	        "data": {
	          "key": "headerFooterControl",
	          "action": "toggleHeaderFooter"
	        }
	      }]
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      confirmMessage: null,
	      inviteByUrl: null
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    this.props.data.settings_ListOptions.current_data_key = this.defineDefaultSizeConfig(this.props.size_config, this.props.data.settings_ListOptions.current_data_key).data.key;
	    this.props.handleEvent.changeState({ settings_ListOptions: this.props.data.settings_ListOptions });
	  },
	  componentDidMount: function componentDidMount() {
	    this.body = _reactDom2.default.findDOMNode(this);
	    this.chatId = this.body.querySelector('[data-role="chat_id"]');
	  },
	  handleClick: function handleClick(event) {
	    var element = this.getDataParameter(event.currentTarget, 'action');
	    if (element) {
	      switch (element.dataset.action) {
	        case 'changeSendEnter':
	          this.changeSendEnter(element);
	          break;
	        case 'changeChatSize':
	          this.changeChatSize(element);
	          break;
	        case 'saveAsCustomWidth':
	          this.saveAsCustomWidth();
	          break;
	        case 'changeAdjustWidth':
	          this.changeAdjustWidth(element);
	          break;
	        case 'toggleChatUsersFriendship':
	          this.toggleChatUsersFriendship(element);
	          break;
	        case 'copyChatId':
	          this.copyChatId();
	          break;
	        case 'toggleHeaderFooter':
	          this.toggleHeaderFooter(element);
	          break;
	        case 'inviteByUrl':
	          this.inviteByUrl(element);
	          break;
	      }
	    }
	  },
	  handleChange: function handleChange() {},
	  changeSendEnter: function changeSendEnter(element) {
	    if (!element) return;
	    this.props.data.formatOptions.sendEnter = element.checked;
	    this.props.handleEvent.changeState({ formatOptions: this.props.data.formatOptions });
	  },
	  toggleHeaderFooter: function toggleHeaderFooter(element) {
	    if (!element) return;
	    this.props.data.headerFooterControl = element.checked;
	    this.props.handleEvent.changeState({ headerFooterControl: this.props.data.headerFooterControl });
	  },
	  copyChatId: function copyChatId() {
	    this.chatId.disabled = false;
	    this.chatId.focus();
	    this.chatId.select();
	    try {
	      var successful = document.execCommand('copy'),
	          msg = successful ? 'successful' : 'unsuccessful';
	      console.log('Copy chatId was ' + msg);
	    } catch (err) {
	      console.log('Oops, unable to copy');
	    }
	    this.chatId.disabled = true;
	  },
	  inviteByUrl: function inviteByUrl() {
	    var newState = void 0,
	        self = this,
	        url = window.location.protocol + "//" + window.location.host + "/chat?join_chat_id=" + this.props.data.chat_id;
	    console.log(url);
	    this.setState({ confirmMessage: 112, inviteByUrl: url });
	  },
	  handleDialogInviteByUrl: function handleDialogInviteByUrl(event) {
	    var element = this.getDataParameter(event.target, 'action');
	    if (element) {
	      switch (element.dataset.action) {
	        case 'confirmCancel':
	          break;
	        case 'confirmOk':
	          if (!this.props.data.toggleChatUsersFriendship) {
	            this.toggleChatUsersFriendship(null, true);
	          }
	          break;
	      }
	      this.setState({ confirmMessage: null, inviteByUrl: null });
	    }
	  },
	  toggleChatUsersFriendship: function toggleChatUsersFriendship(element, forceChecked) {
	    var self = this;
	    if (!element) {
	      element = this.body.querySelector('[data-action="toggleChatUsersFriendship"]');
	    }

	    this.props.data.toggleChatUsersFriendship = forceChecked ? forceChecked : element.checked;
	    this.props.handleEvent.changeState({ toggleChatUsersFriendship: this.props.data.toggleChatUsersFriendship });
	    _websocket2.default.sendMessage({
	      type: "chat_toggle_ready",
	      chat_description: {
	        chat_id: self.props.data.chat_id
	      },
	      from_user_id: _users_bus2.default.getUserId(),
	      ready_state: this.props.data.toggleChatUsersFriendship
	    });
	  },
	  changeChatSize: function changeChatSize(element) {
	    if (element.dataset.value) {
	      this.props.data.settings_ListOptions.size_current = element.dataset.value + 'px';
	    }
	    if (element.dataset.key) {
	      var current_size_config = this.defineDefaultSizeConfig(this.props.size_config, element.dataset.key);
	      this.props.data.settings_ListOptions.current_data_key = current_size_config.data.key;
	      if (current_size_config.data.key === 'custom_size') {
	        this.props.data.settings_ListOptions.size_current = this.props.data.settings_ListOptions.size_custom_value;
	      }
	      this.props.handleEvent.changeState({ settings_ListOptions: this.props.data.settings_ListOptions });
	    }
	  },
	  saveAsCustomWidth: function saveAsCustomWidth() {
	    this.props.data.settings_ListOptions.size_custom_value = this.props.data.settings_ListOptions.size_current;
	    this.props.handleEvent.changeState({ settings_ListOptions: this.props.data.settings_ListOptions });
	  },
	  changeAdjustWidth: function changeAdjustWidth(element) {
	    this.props.data.settings_ListOptions.adjust_width = element.checked;
	    this.props.handleEvent.changeState({ settings_ListOptions: this.props.data.settings_ListOptions });
	  },
	  defineDefaultSizeConfig: function defineDefaultSizeConfig(all_size_configs, current_data_key) {
	    var current_size_config = null;
	    if (current_data_key) {
	      all_size_configs.every(function (size_config) {
	        if (size_config.data && size_config.data.key === current_data_key) {
	          current_size_config = size_config;
	        }
	        return !current_size_config;
	      });
	    }
	    if (current_size_config === null) {
	      all_size_configs.every(function (size_config) {
	        if (size_config.default_size) {
	          current_size_config = size_config;
	        }
	        return !current_size_config;
	      });
	    }
	    return current_size_config;
	  },
	  getSizeData: function getSizeData(all_size_configs, current_data_key) {
	    var returnObj = {},
	        current_size_config = this.defineDefaultSizeConfig(all_size_configs, current_data_key);
	    all_size_configs.forEach(function (size_config) {
	      if (!size_config.data) return;
	      var key = size_config.data.key;
	      if (key === "adjust_width") return;
	      returnObj[key] = size_config === current_size_config;
	    });
	    return returnObj;
	  },
	  calcDisplay: function calcDisplay(_config) {
	    if (!_config.data) return true;
	    if (this.props.data.settings_ListOptions.current_data_key === "custom_size") {
	      if (_config.data.role === 'adjust_width' || _config.data.role === 'adjust_width_label') {
	        return true;
	      }
	      if (_config.data.role === 'saveAsCustomWidth') {
	        return false;
	      }
	    } else {
	      if (_config.data.role === 'adjust_width' || _config.data.role === 'adjust_width_label') {
	        return false;
	      }
	      if (_config.data.role === 'saveAsCustomWidth') {
	        return true;
	      }
	    }
	  },
	  renderItems: function renderItems(configs) {
	    var _React$createElement;

	    var items = [],
	        data = {
	      "chat_id": this.props.data.chat_id,
	      "sendEnter": this.props.data.formatOptions.sendEnter,
	      "index": this.props.data.index,
	      "adjust_width": this.props.data.settings_ListOptions.adjust_width,
	      "headerFooterControl": this.props.data.headerFooterControl,
	      "toggleChatUsersFriendship": this.props.data.toggleChatUsersFriendship
	    };
	    var onEvent = {
	      onClick: this.handleClick,
	      onChange: this.handleChange
	    };
	    Object.assign(data, this.getSizeData(this.props.size_config, this.props.data.settings_ListOptions.current_data_key));

	    items.push(_react2.default.createElement(_location_wrapper2.default, (_React$createElement = { key: 1, events: this.props.events, configs: configs, data: data
	    }, _defineProperty(_React$createElement, 'events', onEvent), _defineProperty(_React$createElement, 'calcDisplay', this.calcDisplay), _React$createElement)));
	    return items;
	  },
	  render: function render() {
	    var config = this.props.data.createdByUserId === _users_bus2.default.getUserId() ? this.props.setting_config_creator : this.props.setting_config;
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(_dialogConfirm2.default, { show: this.state.confirmMessage, message: this.state.confirmMessage,
	        handleClick: this.handleDialogInviteByUrl,
	        body: { content: _react2.default.createElement(
	            'div',
	            { className: 'w-100p p-t-b flex-sp-between' },
	            _react2.default.createElement(
	              'div',
	              { className: 'p-b-1em p-r-l-1em' },
	              _localization2.default.transferText(112),
	              ' ',
	              _react2.default.createElement('br', null),
	              _react2.default.createElement(
	                'a',
	                { href: this.state.inviteByUrl },
	                this.state.inviteByUrl
	              )
	            )
	          ) } }),
	      this.renderItems(config),
	      _react2.default.createElement(
	        'div',
	        { className: 'textbox' },
	        _react2.default.createElement(
	          'div',
	          { className: 'title c-100' },
	          this.renderItems(this.props.size_container_config)
	        ),
	        this.renderItems(this.props.size_config)
	      )
	    );
	  }
	});

	_extend_core2.default.prototype.inherit(Settings, _dom_core2.default);

	exports.default = Settings;

/***/ },

/***/ 326:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	var _dialog = __webpack_require__(305);

	var _dialog2 = _interopRequireDefault(_dialog);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var DialogConfirm = _react2.default.createClass({
	  displayName: 'DialogConfirm',
	  processingTitle: function processingTitle() {
	    var title = void 0;
	    if (this.props.title) {
	      title = this.props.title;
	      if (!title.textContent) {
	        title.textContent = 80;
	      }
	      if (title.addClass) {
	        title.addClass = ' confirm ' + title.addClass;
	      } else {
	        title.addClass = ' confirm ';
	      }
	    } else {
	      title = { textContent: 80, addClass: ' confirm' };
	    }

	    return title;
	  },
	  processingBody: function processingBody() {
	    var body = void 0;
	    if (this.props.body) {
	      body = this.props.body;
	      if (!body.textContent) {
	        body.textContent = this.props.message;
	      }
	    } else {
	      body = { textContent: this.props.message };
	    }

	    return body;
	  },
	  processingFooter: function processingFooter() {
	    var footer = void 0,
	        _class = 'flex-sp-around p-05em border-popup-footer ';
	    if (this.props.footer) {
	      footer = this.props.footer;
	      if (footer.content) {
	        return footer.content;
	      }
	      if (footer.className) {
	        _class = footer.className;
	      } else {
	        _class = footer.addClass ? _class + footer.addClass : _class;
	      }
	    }

	    return _react2.default.createElement(
	      'footer',
	      { className: _class },
	      _react2.default.createElement(
	        'button',
	        { className: 'border-radius-04em p-tb-03em-lr-1em', 'data-action': 'confirmCancel' },
	        this.props.no ? _localization2.default.transferText(this.props.no) : _localization2.default.getLocText(42)
	      ),
	      _react2.default.createElement(
	        'button',
	        { className: 'border-radius-04em p-tb-03em-lr-1em', 'data-action': 'confirmOk' },
	        this.props.yes ? _localization2.default.transferText(this.props.yes) : _localization2.default.getLocText(97)
	      )
	    );
	  },
	  render: function render() {
	    if (this.props.show) {
	      var title = this.processingTitle(),
	          body = this.processingBody(),
	          footer = this.processingFooter();

	      return _react2.default.createElement(_dialog2.default, { show: this.props.show, title: title, body: body, footer: footer,
	        handleClick: this.props.handleClick });
	    } else {
	      return _react2.default.createElement(_dialog2.default, { show: this.props.show });
	    }
	  }
	});

	exports.default = DialogConfirm;

/***/ },

/***/ 327:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	var _chats_bus = __webpack_require__(309);

	var _chats_bus2 = _interopRequireDefault(_chats_bus);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _dom_core = __webpack_require__(303);

	var _dom_core2 = _interopRequireDefault(_dom_core);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	var _body = __webpack_require__(316);

	var _body2 = _interopRequireDefault(_body);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ContactList = _react2.default.createClass({
	  displayName: 'ContactList',
	  getInitialState: function getInitialState() {
	    return {
	      users: []
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    this.getContacts();
	  },
	  componentDidMount: function componentDidMount() {
	    _event_bus2.default.on('changeUsersConnections', this.getContacts, this);
	    _event_bus2.default.on('changeMyUsers', this.getContacts, this);
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    _event_bus2.default.off('changeUsersConnections', this.getContacts, this);
	    _event_bus2.default.off('changeMyUsers', this.getContacts, this);
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (nextProps.data.user_ids !== this.initialUsers_ids) {
	      this.getContacts();
	    }
	  },
	  getContacts: function getContacts() {
	    var self = this;
	    _chats_bus2.default.getChatContacts(this.props.data.chat_id, function (error, contactsInfo) {
	      self.initialUsers_ids = self.props.data.user_ids;
	      if (error) {
	        console.error(error);
	        return;
	      }

	      if (contactsInfo) {
	        if (self.props.data.contactList_PaginationOptions.show) {
	          contactsInfo = _body2.default.prototype.limitationQuantityRecords(contactsInfo, self.props.data, self.props.data.bodyOptions.mode);
	          self.setState({ users: contactsInfo });
	        }
	        self.setState({ users: contactsInfo });
	      }
	    });
	  },
	  handleClick: function handleClick(event) {
	    var element = this.getDataParameter(event.currentTarget, 'action');
	    if (element) {
	      switch (element.dataset.action) {
	        case 'makeFriends':
	          this.makeFriends(element);
	          break;
	      }
	    }
	  },
	  makeFriends: function makeFriends(element) {
	    var userId = element.dataset.key;
	    if (userId) {
	      _event_bus2.default.trigger('makeFriends', userId, element);
	    } else {
	      console.error('Unable to get UserId');
	    }
	  },
	  renderItems: function renderItems() {
	    var items = [],
	        self = this;
	    this.state.users.forEach(function (_user) {
	      items.push(_react2.default.createElement(
	        'div',
	        { key: _user.user_id, className: 'flex-sp-start margin-t-b' },
	        _react2.default.createElement(
	          'div',
	          { className: 'width-40px flex-just-center' },
	          _react2.default.createElement('img', { src: _user.avatar_data, width: '35px', height: '35px', className: 'border-radius-5' })
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'message flex-item-1-auto flex-dir-col flex-sp-between' },
	          _react2.default.createElement(
	            'div',
	            { className: 'text-bold' },
	            _user.userName
	          ),
	          _react2.default.createElement(
	            'div',
	            null,
	            _user.user_id
	          ),
	          function () {
	            if (_user.userName === '-//-//-//-') {
	              return _react2.default.createElement(
	                'div',
	                { className: 'flex-just-center' },
	                _react2.default.createElement(
	                  'button',
	                  { 'data-key': _user.user_id, 'data-action': 'makeFriends', onClick: self.handleClick },
	                  _localization2.default.getLocText(66)
	                )
	              );
	            }
	          }()
	        )
	      ));
	    });
	    return items;
	  },
	  render: function render() {
	    if (this.state.users.length) {
	      var items = this.renderItems();
	      return _react2.default.createElement(
	        'div',
	        null,
	        items
	      );
	    } else {
	      return _react2.default.createElement('div', null);
	    }
	  }
	});
	_extend_core2.default.prototype.inherit(ContactList, _dom_core2.default);

	exports.default = ContactList;

/***/ },

/***/ 328:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _webrtc = __webpack_require__(311);

	var _webrtc2 = _interopRequireDefault(_webrtc);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Connections = _react2.default.createClass({
	  displayName: 'Connections',
	  getInitialState: function getInitialState() {
	    return {
	      connections: [],
	      contactsInfo: []
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    this.getConnections();
	  },
	  componentDidMount: function componentDidMount() {
	    _event_bus2.default.on('changeConnectionList', this.getConnections, this);
	    _event_bus2.default.on('changeMyUsers', this.getConnections, this);
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    _event_bus2.default.off('changeConnectionList', this.getConnections, this);
	    _event_bus2.default.off('changeMyUsers', this.getConnections, this);
	  },
	  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
	    if (!this.props.data.openedState && !nextProps.data.openedState) {
	      return false;
	    } else {
	      return true;
	    }
	  },
	  getConnections: function getConnections() {
	    var connections = _webrtc2.default.getAllConnections(),
	        self = this,
	        user_ids = [];
	    connections.forEach(function (_connection) {
	      if (_connection.users_ids.length) {
	        _connection.users_ids.forEach(function (_user_id) {
	          user_ids.push(_user_id);
	        });
	      }
	    });
	    if (user_ids.length) {
	      _users_bus2.default.getContactsInfo(null, user_ids, function (_error, contactsInfo) {
	        if (_error) {
	          console.error(_error);
	          return;
	        }
	        self.setState({ connections: connections, contactsInfo: contactsInfo });
	      });
	    } else {
	      this.setState({ connections: connections });
	    }
	  },
	  renderItems: function renderItems() {
	    var items = [],
	        self = this;

	    this.state.connections.forEach(function (_connection) {
	      var user_ids = [];
	      _connection.users_ids.forEach(function (_user_id) {
	        user_ids.push(_react2.default.createElement(
	          'ol',
	          { style: { 'listStyleType': 'circle' }, key: _user_id },
	          _react2.default.createElement(
	            'li',
	            null,
	            _react2.default.createElement(
	              'div',
	              null,
	              _users_bus2.default.getUserName(_user_id, this.state.contactsInfo)
	            ),
	            _react2.default.createElement(
	              'div',
	              null,
	              _user_id
	            )
	          )
	        ));
	      });

	      items.push(_react2.default.createElement(
	        'div',
	        { key: _connection.ws_device_id },
	        _react2.default.createElement(
	          'ol',
	          { style: { 'listStyleType': 'square' } },
	          _react2.default.createElement(
	            'li',
	            null,
	            _connection.ws_device_id
	          ),
	          user_ids
	        )
	      ));
	    });
	    return items;
	  },
	  render: function render() {
	    var items = this.renderItems();
	    return _react2.default.createElement(
	      'div',
	      null,
	      items
	    );
	  }
	});

	exports.default = Connections;

/***/ },

/***/ 329:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(45);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _dom_core = __webpack_require__(303);

	var _dom_core2 = _interopRequireDefault(_dom_core);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	var _jdenticon = __webpack_require__(330);

	var _jdenticon2 = _interopRequireDefault(_jdenticon);

	var _dialogSuccess = __webpack_require__(331);

	var _dialogSuccess2 = _interopRequireDefault(_dialogSuccess);

	var _dialogError = __webpack_require__(304);

	var _dialogError2 = _interopRequireDefault(_dialogError);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var size_file = 2000000,
	    mode = {
	  SHOW: "SHOW",
	  EDIT: "EDIT"
	};
	var UserAvatar = _react2.default.createClass({
	  displayName: 'UserAvatar',


	  canvas_elem_width: 225,
	  canvas_elem_height: 225,

	  getInitialState: function getInitialState() {
	    return {
	      errorMessage: null,
	      successMessage: null
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    var self = this;
	    this.img = new Image();
	    _users_bus2.default.getMyInfo(null, function (err, options, userInfo) {
	      if (err) return console.error(err);
	      if (userInfo.avatar_data) {
	        self.img.src = userInfo.avatar_data;
	        if (self.props.data.avatarData !== '' && self.props.data.avatarData !== undefined) {
	          self.img.src = self.props.data.avatarData;
	          if (self.props.data.avatarPrevious !== '') {
	            self._change_avatar = true;
	            self.previous_src = self.props.data.avatarPrevious;
	          }
	          self.props.handleEvent.changeState({ avatarData: '', avatarPrevious: '' });
	        }
	        self.updateAvatar();
	      }
	    });
	  },
	  componentDidMount: function componentDidMount() {
	    this.avatarContainer = _reactDom2.default.findDOMNode(this);
	    this.form = this.avatarContainer.querySelector('form');
	    this.input_file_elem = this.avatarContainer.querySelector('[name="avatar"]');
	    this.canvas_elem = this.avatarContainer.querySelector('[data-role="preview_avatar"]');
	    this.canvas_elem_ctx = this.canvas_elem.getContext('2d');

	    this.input_file_elem.addEventListener('change', this.previewFile);
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    if (this.img.src !== '') {
	      this.props.handleEvent.changeState({ avatarData: this.img.src, avatarPrevious: this.previous_src });
	    }
	    this.input_file_elem.removeEventListener('change', this.previewFile);
	  },
	  previewFile: function previewFile() {
	    var self = this,
	        reader = new FileReader();
	    reader.onloadend = function (event) {
	      self.img.src = reader.result;
	      self.canvas_elem_ctx.drawImage(self.img, 0, 0, self.canvas_elem_width, self.canvas_elem_height);
	      self._change_avatar = true;
	    };

	    if (this.input_file_elem.files[0]) {
	      if (this.input_file_elem.files[0].size <= size_file) {
	        reader.readAsDataURL(this.input_file_elem.files[0]);
	      } else {
	        this.form.reset();
	        this.setState({ errorMessage: 116 });
	      }
	    } else {
	      this.form.reset();
	      this.img.src = '';
	      this.canvas_elem.width = this.canvas_elem.width;
	    }
	  },
	  handleClick: function handleClick(event) {
	    var element = this.getDataParameter(event.currentTarget, 'action');
	    if (element) {
	      switch (element.dataset.action) {
	        case 'saveAvatar':
	          this.saveAvatar(element);
	          break;
	        case 'changeAvatar':
	          this.changeAvatar(element);
	          break;
	        case 'closeChangeAvatar':
	          this.closeChangeAvatar(element);
	          break;
	        case 'resetAvatar':
	          this.resetAvatar(element);
	          break;
	      }
	    }
	  },
	  handleDialogError: function handleDialogError() {
	    this.setState({ errorMessage: null });
	  },
	  handleDialogConfirm: function handleDialogConfirm() {
	    this.setState({ confirmMessage: null });
	  },
	  updateAvatar: function updateAvatar() {
	    if (!this.canvas_elem_ctx) return;
	    if (this.img.src && this.img.src !== '') {
	      this.form.reset();
	      this.canvas_elem.width = this.canvas_elem.width;
	      this.canvas_elem_ctx.drawImage(this.img, 0, 0, this.canvas_elem_width, this.canvas_elem_height);
	    }
	  },
	  resetAvatar: function resetAvatar() {
	    var self = this;
	    _jdenticon2.default.jdenticon(_users_bus2.default.getUserId(), function (avatar_data) {
	      self._change_avatar = true;
	      self.img.src = avatar_data;
	      self.updateAvatar();
	    });
	  },
	  saveAvatar: function saveAvatar() {
	    var self = this;
	    if (this._change_avatar) {
	      if (this.img.src !== '') {
	        _users_bus2.default.getMyInfo(null, function (err, options, userInfo) {
	          if (err) return console.error(err);

	          userInfo.avatar_data = self.img.src;
	          userInfo.lastModifyDatetime = Date.now();
	          _users_bus2.default.saveMyInfo(userInfo, function () {
	            self.props.handleEvent.changeState({ avatarMode: mode.SHOW });
	            _event_bus2.default.trigger('updateUserAvatar');
	            self._change_avatar = false;
	            self.form.reset();
	            self.setState({ confirmMessage: 105 });
	          });
	        });
	      }
	    } else {
	      self.props.handleEvent.changeState({ avatarMode: mode.SHOW });
	      self._change_avatar = false;
	      self.setState({ confirmMessage: 118 });
	    }
	  },
	  changeAvatar: function changeAvatar() {
	    this.props.handleEvent.changeState({ avatarMode: mode.EDIT });
	    this._change_avatar = false;
	    this.previous_src = this.img.src;
	  },
	  closeChangeAvatar: function closeChangeAvatar() {
	    if (this._change_avatar) {
	      this.img.src = this.previous_src;
	      this.canvas_elem.width = this.canvas_elem.width;
	      this.canvas_elem_ctx.drawImage(this.img, 0, 0, this.canvas_elem_width, this.canvas_elem_height);
	    }
	    this.form.reset();
	    this.props.handleEvent.changeState({ avatarMode: mode.SHOW });
	  },
	  render: function render() {
	    var _this = this;

	    var self = this;
	    return _react2.default.createElement(
	      'div',
	      { className: 'textbox' },
	      _react2.default.createElement(_dialogError2.default, { show: this.state.errorMessage, message: this.state.errorMessage,
	        handleClick: this.handleDialogError }),
	      _react2.default.createElement(_dialogSuccess2.default, { show: this.state.confirmMessage, message: this.state.confirmMessage,
	        handleClick: this.handleDialogConfirm }),
	      _react2.default.createElement(
	        'div',
	        { className: 'title c-100' },
	        _react2.default.createElement(
	          'div',
	          { className: 'flex-item flex-wrap flex-align-c flex-item-auto' },
	          _react2.default.createElement(
	            'label',
	            null,
	            _localization2.default.getLocText(117)
	          )
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        { className: 'flex-item flex-wrap flex-align-c flex-item-auto flex-dir-col' },
	        _react2.default.createElement('canvas', { 'data-role': 'preview_avatar', width: this.canvas_elem_width, height: this.canvas_elem_height, className: 'margin-b-em' }),
	        _react2.default.createElement(
	          'form',
	          { enctype: 'multipart/form-data', method: 'post', className: self.props.data.avatarMode === mode.SHOW ? 'hide' : '' },
	          _react2.default.createElement(
	            'p',
	            null,
	            _react2.default.createElement('input', { type: 'file', name: 'avatar', accept: 'image/jpeg,image/png' })
	          )
	        ),
	        function () {
	          if (self.props.data.avatarMode === mode.SHOW) {
	            return _react2.default.createElement(
	              'div',
	              { className: 'w-100p p-t-b flex-sp-around c-200' },
	              _react2.default.createElement(
	                'button',
	                { 'data-action': 'changeAvatar', className: 'button-convex', onClick: _this.handleClick },
	                _localization2.default.getLocText(37)
	              )
	            );
	          } else if (self.props.data.avatarMode === mode.EDIT) {
	            return _react2.default.createElement(
	              'div',
	              { className: 'w-100p p-t-b flex-sp-around c-200' },
	              _react2.default.createElement(
	                'button',
	                { 'data-action': 'resetAvatar', className: 'button-convex', onClick: _this.handleClick },
	                _localization2.default.getLocText(119)
	              ),
	              _react2.default.createElement(
	                'button',
	                { 'data-action': 'closeChangeAvatar', className: 'button-convex', onClick: _this.handleClick },
	                _localization2.default.getLocText(42)
	              ),
	              _react2.default.createElement(
	                'button',
	                { 'data-action': 'saveAvatar', className: 'button-convex', onClick: _this.handleClick },
	                _localization2.default.getLocText(43)
	              )
	            );
	          }
	        }()
	      )
	    );
	  }
	});

	_extend_core2.default.prototype.inherit(UserAvatar, _dom_core2.default);

	exports.default = UserAvatar;

/***/ },

/***/ 330:
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Jdenticon 1.3.2
	 * http://jdenticon.com
	 *
	 * Built: 2015-10-10T11:55:57.451Z
	 *
	 * Copyright (c) 2014-2015 Daniel Mester Pirttijärvi
	 *
	 * This software is provided 'as-is', without any express or implied
	 * warranty.  In no event will the authors be held liable for any damages
	 * arising from the use of this software.
	 *
	 * Permission is granted to anyone to use this software for any purpose,
	 * including commercial applications, and to alter it and redistribute it
	 * freely, subject to the following restrictions:
	 *
	 * 1. The origin of this software must not be misrepresented; you must not
	 *    claim that you wrote the original software. If you use this software
	 *    in a product, an acknowledgment in the product documentation would be
	 *    appreciated but is not required.
	 *
	 * 2. Altered source versions must be plainly marked as such, and must not be
	 *    misrepresented as being the original software.
	 *
	 * 3. This notice may not be removed or altered from any source distribution.
	 *
	 */

	var Jdenticon = function Jdenticon() {};

	Jdenticon.prototype = {
	  Point: function Point(x, y) {
	    this.x = x;
	    this.y = y;
	  },

	  decToHex: function decToHex(v) {
	    v |= 0; // Ensure integer value
	    return v < 0 ? "00" : v < 16 ? "0" + v.toString(16) : v < 256 ? v.toString(16) : "ff";
	  },

	  hueToRgb: function hueToRgb(m1, m2, h) {
	    h = h < 0 ? h + 6 : h > 6 ? h - 6 : h;
	    return this.decToHex(255 * (h < 1 ? m1 + (m2 - m1) * h : h < 3 ? m2 : h < 4 ? m1 + (m2 - m1) * (4 - h) : m1));
	  },

	  /**
	   * Gets a set of identicon color candidates for a specified hue and config.
	   */
	  colorTheme: function colorTheme(hue, config) {
	    return [
	    // Dark gray
	    color.hsl(0, 0, config.grayscaleLightness(0)),
	    // Mid color
	    color.correctedHsl(hue, config.saturation, config.colorLightness(0.5)),
	    // Light gray
	    color.hsl(0, 0, config.grayscaleLightness(1)),
	    // Light color
	    color.correctedHsl(hue, config.saturation, config.colorLightness(1)),
	    // Dark color
	    color.correctedHsl(hue, config.saturation, config.colorLightness(0))];
	  },

	  /**
	   * Draws an identicon to a specified renderer.
	   */
	  iconGenerator: function iconGenerator(renderer, hash, x, y, size, padding, config, callback) {
	    var undefined;

	    // Calculate padding
	    padding = size * (padding === undefined ? 0.08 : padding) | 0;
	    size -= padding * 2;

	    // Sizes smaller than 30 px are not supported. If really needed, apply a scaling transformation
	    // to the context before passing it to this function.
	    if (size < 30) {
	      throw new Error("Jdenticon cannot render identicons smaller than 30 pixels.");
	    }
	    if (!/^[0-9a-f,-]{11,}$/i.test(hash)) {
	      throw new Error("Invalid hash passed to Jdenticon.");
	    }

	    var graphics = new Graphics(renderer);

	    // Calculate cell size and ensure it is an integer
	    var cell = 0 | size / 4;

	    // Since the cell size is integer based, the actual icon will be slightly smaller than specified => center icon
	    x += 0 | padding + size / 2 - cell * 2;
	    y += 0 | padding + size / 2 - cell * 2;

	    function renderShape(colorIndex, shapes, index, rotationIndex, positions) {
	      var r = rotationIndex ? parseInt(hash.charAt(rotationIndex), 16) : 0,
	          shape = shapes[parseInt(hash.charAt(index), 16) % shapes.length],
	          i;

	      renderer.beginShape(availableColors[selectedColorIndexes[colorIndex]]);

	      for (i = 0; i < positions.length; i++) {
	        graphics._transform = new Transform(x + positions[i][0] * cell, y + positions[i][1] * cell, cell, r++ % 4);
	        shape(graphics, cell, i);
	      }

	      renderer.endShape();
	    }

	    // AVAILABLE COLORS
	    var hue = parseInt(hash.substr(-4) + hash.substr(-8, 3), 16) / 0xfffffff,


	    // Available colors for this icon
	    availableColors = this.colorTheme(hue, config),


	    // The index of the selected colors
	    selectedColorIndexes = [],
	        index;

	    function isDuplicate(values) {
	      if (values.indexOf(index) >= 0) {
	        for (var i = 0; i < values.length; i++) {
	          if (selectedColorIndexes.indexOf(values[i]) >= 0) {
	            return true;
	          }
	        }
	      }
	    }

	    for (var i = 0; i < 3; i++) {
	      index = parseInt(hash.charAt(55 + i), 16) % availableColors.length;
	      if (isDuplicate([0, 4]) || // Disallow dark gray and dark color combo
	      isDuplicate([2, 3])) {
	        // Disallow light gray and light color combo
	        index = 1;
	      }
	      selectedColorIndexes.push(index);
	    }

	    // ACTUAL RENDERING
	    // Sides
	    renderShape(0, shapes.outer, 57, 3, [[1, 0], [2, 0], [2, 3], [1, 3], [0, 1], [3, 1], [3, 2], [0, 2]]);
	    // Corners
	    renderShape(1, shapes.outer, 58, 5, [[0, 0], [3, 0], [3, 3], [0, 3]]);
	    // Center
	    renderShape(2, shapes.center, 56, null, [[1, 1], [2, 1], [2, 2], [1, 2]]);
	    var data_avatar = renderer._ctx.canvas.toDataURL();
	    if (callback) {
	      callback(data_avatar);
	    }
	  },

	  /**
	   * Gets the normalized current Jdenticon color configuration. Missing fields have default values.
	   */
	  getCurrentConfig: function getCurrentConfig() {
	    var configObject = this.jdenticon["config"] || global["jdenticon_config"] || {},
	        lightnessConfig = configObject["lightness"] || {},
	        saturation = configObject["saturation"];

	    /**
	     * Creates a lightness range.
	     */
	    function lightness(configName, defaultMin, defaultMax) {
	      var range = lightnessConfig[configName] instanceof Array ? lightnessConfig[configName] : [defaultMin, defaultMax];

	      /**
	       * Gets a lightness relative the specified value in the specified lightness range.
	       */
	      return function (value) {
	        value = range[0] + value * (range[1] - range[0]);
	        return value < 0 ? 0 : value > 1 ? 1 : value;
	      };
	    }

	    return {
	      saturation: typeof saturation == "number" ? saturation : 0.5,
	      colorLightness: lightness("color", 0.4, 0.8),
	      grayscaleLightness: lightness("grayscale", 0.3, 0.9)
	    };
	  },

	  /**
	   * Updates the identicon in the specified canvas elements.
	   * @param {string=} hash Optional hash to be rendered. If not specified, the hash specified by the data-jdenticon-hash is used.
	   * @param {number=} padding Optional padding in percents. Extra padding might be added to center the rendered identicon.
	   */
	  update: function update(el, hash, callback, padding) {
	    if (typeof el === "string") {
	      var element = document.createElement('canvas');
	      element.setAttribute('width', canvas_element_width);
	      element.setAttribute('height', canvas_element_height);
	      this.update(element, hash, callback, padding);
	      return;
	    }
	    if (!el || !el["tagName"]) {
	      // No element found
	      return;
	    }
	    hash = hash || el.getAttribute(HASH_ATTRIBUTE);
	    if (!hash) {
	      // No hash specified
	      return;
	    }

	    var isCanvas = el["tagName"].toLowerCase() == "canvas";

	    // Ensure we have a supported element
	    if (!(isCanvas && "getContext" in el)) {
	      return;
	    }

	    var width = Number(el.getAttribute("width")) || el.clientWidth || 0,
	        height = Number(el.getAttribute("height")) || el.clientHeight || 0,
	        renderer = new CanvasRenderer(el.getContext("2d"), width, height),
	        size = Math.min(width, height);

	    // Draw icon
	    this.iconGenerator(renderer, hash, 0, 0, size, padding, this.getCurrentConfig(), callback);
	  },

	  jdenticon: function jdenticon(hash, callback) {
	    if (supportsQuerySelectorAll) {
	      this.update("canvas[" + HASH_ATTRIBUTE + "]", hash, function (avatar_data) {
	        if (callback) {
	          callback(avatar_data);
	        }
	      });
	    }
	  }
	};

	var Transform = function Transform(x, y, size, rotation) {
	  this._x = x;
	  this._y = y;
	  this._size = size;
	  this._rotation = rotation;
	};
	Transform.prototype = {
	  /**
	   * Transforms the specified point based on the translation and rotation specification for this Transform.
	   * @param {number} x x-coordinate
	   * @param {number} y y-coordinate
	   * @param {number=} w The width of the transformed rectangle. If greater than 0, this will ensure the returned point is of the upper left corner of the transformed rectangle.
	   * @param {number=} h The height of the transformed rectangle. If greater than 0, this will ensure the returned point is of the upper left corner of the transformed rectangle.
	   */
	  transformPoint: function transformPoint(x, y, w, h) {
	    var right = this._x + this._size,
	        bottom = this._y + this._size;
	    return this._rotation === 1 ? new Jdenticon.prototype.Point(right - y - (h || 0), this._y + x) : this._rotation === 2 ? new Jdenticon.prototype.Point(right - x - (w || 0), bottom - y - (h || 0)) : this._rotation === 3 ? new Jdenticon.prototype.Point(this._x + y, bottom - x - (w || 0)) : new Jdenticon.prototype.Point(this._x + x, this._y + y);
	  }
	};
	Transform.noTransform = new Transform(0, 0, 0, 0);

	var Graphics = function Graphics(renderer) {
	  this._renderer = renderer;
	  this._transform = Transform.noTransform;
	};
	Graphics.prototype = {
	  /**
	   * Adds a polygon to the underlying renderer.
	   * @param {Array} points The points of the polygon clockwise on the format [ x0, y0, x1, y1, ..., xn, yn ]
	   * @param {boolean=} invert Specifies if the polygon will be inverted.
	   */
	  addPolygon: function addPolygon(points, invert) {
	    var di = invert ? -2 : 2,
	        transform = this._transform,
	        transformedPoints = [],
	        i;

	    for (i = invert ? points.length - 2 : 0; i < points.length && i >= 0; i += di) {
	      transformedPoints.push(transform.transformPoint(points[i], points[i + 1]));
	    }

	    this._renderer.addPolygon(transformedPoints);
	  },

	  /**
	   * Adds a polygon to the underlying renderer.
	   * Source: http://stackoverflow.com/a/2173084
	   * @param {number} x The x-coordinate of the upper left corner of the rectangle holding the entire ellipse.
	   * @param {number} y The y-coordinate of the upper left corner of the rectangle holding the entire ellipse.
	   * @param {number} size The size of the ellipse.
	   * @param {boolean=} invert Specifies if the ellipse will be inverted.
	   */
	  addCircle: function addCircle(x, y, size, invert) {
	    var p = this._transform.transformPoint(x, y, size, size);
	    this._renderer.addCircle(p, size, invert);
	  },

	  /**
	   * Adds a rectangle to the underlying renderer.
	   * @param {number} x The x-coordinate of the upper left corner of the rectangle.
	   * @param {number} y The y-coordinate of the upper left corner of the rectangle.
	   * @param {number} w The width of the rectangle.
	   * @param {number} h The height of the rectangle.
	   * @param {boolean=} invert Specifies if the rectangle will be inverted.
	   */
	  addRectangle: function addRectangle(x, y, w, h, invert) {
	    this.addPolygon([x, y, x + w, y, x + w, y + h, x, y + h], invert);
	  },

	  /**
	   * Adds a right triangle to the underlying renderer.
	   * @param {number} x The x-coordinate of the upper left corner of the rectangle holding the triangle.
	   * @param {number} y The y-coordinate of the upper left corner of the rectangle holding the triangle.
	   * @param {number} w The width of the triangle.
	   * @param {number} h The height of the triangle.
	   * @param {number} r The rotation of the triangle (clockwise). 0 = right corner of the triangle in the lower left corner of the bounding rectangle.
	   * @param {boolean=} invert Specifies if the triangle will be inverted.
	   */
	  addTriangle: function addTriangle(x, y, w, h, r, invert) {
	    var points = [x + w, y, x + w, y + h, x, y + h, x, y];
	    points.splice((r || 0) % 4 * 2, 2);
	    this.addPolygon(points, invert);
	  },

	  /**
	   * Adds a rhombus to the underlying renderer.
	   * @param {number} x The x-coordinate of the upper left corner of the rectangle holding the rhombus.
	   * @param {number} y The y-coordinate of the upper left corner of the rectangle holding the rhombus.
	   * @param {number} w The width of the rhombus.
	   * @param {number} h The height of the rhombus.
	   * @param {boolean=} invert Specifies if the rhombus will be inverted.
	   */
	  addRhombus: function addRhombus(x, y, w, h, invert) {
	    this.addPolygon([x + w / 2, y, x + w, y + h / 2, x + w / 2, y + h, x, y + h / 2], invert);
	  }
	};

	var shapes = {
	  center: [
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    var k = cell * 0.42;
	    g.addPolygon([0, 0, cell, 0, cell, cell - k * 2, cell - k, cell, 0, cell]);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    var w = 0 | cell * 0.5,
	        h = 0 | cell * 0.8;
	    g.addTriangle(cell - w, 0, w, h, 2);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    var s = 0 | cell / 3;
	    g.addRectangle(s, s, cell - s, cell - s);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    var inner = 0 | cell * 0.1,
	        outer = 0 | cell * 0.25;
	    g.addRectangle(outer, outer, cell - inner - outer, cell - inner - outer);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    var m = 0 | cell * 0.15,
	        s = 0 | cell * 0.5;
	    g.addCircle(cell - s - m, cell - s - m, s);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    var inner = cell * 0.1,
	        outer = inner * 4;

	    g.addRectangle(0, 0, cell, cell);
	    g.addPolygon([outer, outer, cell - inner, outer, outer + (cell - outer - inner) / 2, cell - inner], true);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    g.addPolygon([0, 0, cell, 0, cell, cell * 0.7, cell * 0.4, cell * 0.4, cell * 0.7, cell, 0, cell]);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    g.addTriangle(cell / 2, cell / 2, cell / 2, cell / 2, 3);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    g.addRectangle(0, 0, cell, cell / 2);
	    g.addRectangle(0, cell / 2, cell / 2, cell / 2);
	    g.addTriangle(cell / 2, cell / 2, cell / 2, cell / 2, 1);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    var inner = 0 | cell * 0.14,
	        outer = 0 | cell * 0.35;
	    g.addRectangle(0, 0, cell, cell);
	    g.addRectangle(outer, outer, cell - outer - inner, cell - outer - inner, true);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    var inner = cell * 0.12,
	        outer = inner * 3;

	    g.addRectangle(0, 0, cell, cell);
	    g.addCircle(outer, outer, cell - inner - outer, true);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    g.addTriangle(cell / 2, cell / 2, cell / 2, cell / 2, 3);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    var m = cell * 0.25;
	    g.addRectangle(0, 0, cell, cell);
	    g.addRhombus(m, m, cell - m, cell - m, true);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    var m = cell * 0.4,
	        s = cell * 1.2;
	    if (!index) {
	      g.addCircle(m, m, s);
	    }
	  }],

	  outer: [
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    g.addTriangle(0, 0, cell, cell, 0);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    g.addTriangle(0, cell / 2, cell, cell / 2, 0);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    g.addRhombus(0, 0, cell, cell);
	  },
	  /** @param {Graphics} g */
	  function (g, cell, index) {
	    var m = cell / 6;
	    g.addCircle(m, m, cell - 2 * m);
	  }]
	};

	/**
	 * Functions for converting colors to hex-rgb representations.
	 * @private
	 */
	var color = {
	  /**
	   * @param {number} r Red channel [0, 255]
	   * @param {number} g Green channel [0, 255]
	   * @param {number} b Blue channel [0, 255]
	   */
	  rgb: function rgb(r, g, b) {
	    return "#" + this.decToHex(r) + this.decToHex(g) + this.decToHex(b);
	  },
	  /**
	   * @param h Hue [0, 1]
	   * @param s Saturation [0, 1]
	   * @param l Lightness [0, 1]
	   */
	  hsl: function hsl(h, s, l) {
	    // Based on http://www.w3.org/TR/2011/REC-css3-color-20110607/#hsl-color
	    if (s == 0) {
	      var partialHex = Jdenticon.prototype.decToHex(l * 255);
	      return "#" + partialHex + partialHex + partialHex;
	    } else {
	      var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s,
	          m1 = l * 2 - m2;
	      return "#" + Jdenticon.prototype.hueToRgb(m1, m2, h * 6 + 2) + Jdenticon.prototype.hueToRgb(m1, m2, h * 6) + Jdenticon.prototype.hueToRgb(m1, m2, h * 6 - 2);
	    }
	  },
	  // This function will correct the lightness for the "dark" hues
	  correctedHsl: function correctedHsl(h, s, l) {
	    // The corrector specifies the perceived middle lightnesses for each hue
	    var correctors = [0.55, 0.5, 0.5, 0.46, 0.6, 0.55, 0.55],
	        corrector = correctors[h * 6 + 0.5 | 0];

	    // Adjust the input lightness relative to the corrector
	    l = l < 0.5 ? l * corrector * 2 : corrector + (l - 0.5) * (1 - corrector) * 2;

	    return color.hsl(h, s, l);
	  }
	};

	var CanvasRenderer = function CanvasRenderer(ctx, width, height) {
	  this._ctx = ctx;
	  ctx.clearRect(0, 0, width, height);
	};
	CanvasRenderer.prototype = {
	  /**
	   * Marks the beginning of a new shape of the specified color. Should be ended with a call to endShape.
	   * @param {string} color Fill color on format #xxxxxx.
	   */
	  beginShape: function beginShape(color) {
	    this._ctx.fillStyle = color;
	    this._ctx.beginPath();
	  },
	  /**
	   * Marks the end of the currently drawn shape. This causes the queued paths to be rendered on the canvas.
	   */
	  endShape: function endShape() {
	    this._ctx.fill();
	  },
	  /**
	   * Adds a polygon to the rendering queue.
	   * @param points An array of Point objects.
	   */
	  addPolygon: function addPolygon(points) {
	    var ctx = this._ctx,
	        i;
	    ctx.moveTo(points[0].x, points[0].y);
	    for (i = 1; i < points.length; i++) {
	      ctx.lineTo(points[i].x, points[i].y);
	    }
	    ctx.closePath();
	  },
	  /**
	   * Adds a circle to the rendering queue.
	   * @param {Point} point The upper left corner of the circle bounding box.
	   * @param {number} diameter The diameter of the circle.
	   * @param {boolean} counterClockwise True if the circle is drawn counter-clockwise (will result in a hole if rendered on a clockwise path).
	   */
	  addCircle: function addCircle(point, diameter, counterClockwise) {
	    var ctx = this._ctx,
	        radius = diameter / 2;
	    ctx.arc(point.x + radius, point.y + radius, radius, 0, Math.PI * 2, counterClockwise);
	    ctx.closePath();
	  }
	};

	var /** @const */
	HASH_ATTRIBUTE = "data-jdenticon-hash",
	    supportsQuerySelectorAll = "document" in global && "querySelectorAll" in document;

	var canvas_element_width = '225';
	var canvas_element_height = '225';

	exports.default = new Jdenticon();
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 331:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	var _dialog = __webpack_require__(305);

	var _dialog2 = _interopRequireDefault(_dialog);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var DialogSuccess = _react2.default.createClass({
	  displayName: 'DialogSuccess',
	  processingTitle: function processingTitle() {
	    var title = void 0;
	    if (this.props.title) {
	      title = this.props.title;
	      if (!title.textContent) {
	        title.textContent = 85;
	      }
	      if (title.addClass) {
	        title.addClass = ' success ' + title.addClass;
	      } else {
	        title.addClass = ' success ';
	      }
	    } else {
	      title = { textContent: 85, addClass: ' success' };
	    }

	    return title;
	  },
	  processingBody: function processingBody() {
	    var body = void 0;
	    if (this.props.body) {
	      body = this.props.body;
	      if (!body.textContent) {
	        body.textContent = this.props.message;
	      }
	    } else {
	      body = { textContent: this.props.message };
	    }

	    return body;
	  },
	  processingFooter: function processingFooter() {
	    var footer = void 0,
	        _class = 'flex-sp-around p-05em border-popup-footer ';
	    if (this.props.footer) {
	      footer = this.props.footer;
	      if (footer.content) {
	        return footer.content;
	      }
	      if (footer.className) {
	        _class = footer.className;
	      } else {
	        _class = footer.addClass ? _class + footer.addClass : _class;
	      }
	    }

	    return _react2.default.createElement(
	      'footer',
	      { className: _class },
	      _react2.default.createElement(
	        'button',
	        { className: 'border-radius-04em p-tb-03em-lr-1em', 'data-action': 'confirmCancel' },
	        this.props.close ? _localization2.default.transferText(this.props.close) : _localization2.default.getLocText(20)
	      )
	    );
	  },
	  render: function render() {
	    if (this.props.show) {
	      var title = this.processingTitle(),
	          body = this.processingBody(),
	          footer = this.processingFooter();

	      return _react2.default.createElement(_dialog2.default, { show: this.props.show, title: title, body: body, footer: footer,
	        handleClick: this.props.handleClick });
	    } else {
	      return _react2.default.createElement(_dialog2.default, { show: this.props.show });
	    }
	  }
	});

	exports.default = DialogSuccess;

/***/ },

/***/ 332:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _switcher_core = __webpack_require__(310);

	var _switcher_core2 = _interopRequireDefault(_switcher_core);

	var _chats_bus = __webpack_require__(309);

	var _chats_bus2 = _interopRequireDefault(_chats_bus);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _messages = __webpack_require__(323);

	var _messages2 = _interopRequireDefault(_messages);

	var _dom_core = __webpack_require__(303);

	var _dom_core2 = _interopRequireDefault(_dom_core);

	var _location_wrapper = __webpack_require__(293);

	var _location_wrapper2 = _interopRequireDefault(_location_wrapper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var Pagination = _react2.default.createClass({
	  displayName: 'Pagination',


	  MODE: {
	    "PAGINATION": 'PAGINATION',
	    "GO_TO": 'GO_TO'
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      mainContainer: {
	        "element": "div",
	        "config": {
	          "class": "flex "
	        }
	      },
	      configs: [{
	        "element": "button",
	        "icon": "back_arrow",
	        "text": "",
	        "class": "",
	        "data": {
	          "role": "back",
	          "action": "switchPage",
	          "key_disable": "disableBack"
	        },
	        "name": ""
	      }, {
	        "element": "button",
	        "icon": "",
	        "text": "",
	        "class": "",
	        "data": {
	          "role": "first",
	          "action": "switchPage",
	          "key": "firstPage",
	          "key_disable": "disableFirst"
	        },
	        "name": ""
	      }, {
	        "element": "button",
	        "icon": "",
	        "text": "...",
	        "class": "",
	        "data": {
	          "throw": "true",
	          "role": "choice",
	          "action": "changeMode",
	          "mode_to": "GO_TO",
	          "toggle": true,
	          "chat_part": "pagination",
	          "location": "left"
	        },
	        "name": ""
	      }, {
	        "element": "label",
	        "icon": "",
	        "text": "",
	        "class": "lblStyle",
	        "data": {
	          "role": "current",
	          "key": "currentPage"
	        },
	        "name": "",
	        "disable": false
	      }, {
	        "element": "button",
	        "icon": "",
	        "text": "...",
	        "class": "",
	        "data": {
	          "throw": "true",
	          "role": "choice",
	          "action": "changeMode",
	          "mode_to": "GO_TO",
	          "chat_part": "pagination",
	          "location": "right",
	          "toggle": true
	        },
	        "name": ""
	      }, {
	        "element": "button",
	        "icon": "",
	        "text": "",
	        "class": "",
	        "data": {
	          "role": "last",
	          "action": "switchPage",
	          "key": "lastPage",
	          "key_disable": "disableLast"
	        },
	        "name": ""
	      }, {
	        "element": "button",
	        "icon": "forward_arrow",
	        "text": "",
	        "class": "",
	        "data": {
	          "role": "forward",
	          "action": "switchPage",
	          "key_disable": "disableForward"
	        },
	        "name": ""
	      }]
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      currentOptions: {}
	    };
	  },
	  defineOptions: function defineOptions(mode) {
	    this.options = {};
	    switch (mode) {
	      case 'CHATS':
	        this.options['paginationOptions'] = this.props.data.chats_PaginationOptions;
	        break;
	      case 'USERS':
	        this.options['paginationOptions'] = this.props.data.users_PaginationOptions;
	        break;
	      default:
	        this.options = null;
	        break;
	    }
	  },
	  handleClick: function handleClick(event) {
	    var element = this.getDataParameter(event.currentTarget, 'action');
	    if (element) {
	      switch (element.dataset.action) {
	        case 'switchPage':
	          this.switchPage(element);
	          break;
	        case 'changeMode':
	          var mode = this.props.data.bodyMode ? this.props.data.bodyMode : this.props.data.bodyOptions.mode,
	              currentOptions = this.optionsDefinition(this.props.data, mode);
	          currentOptions.goToOptions.show = !currentOptions.goToOptions.show;
	          if (currentOptions.goToOptions.show && currentOptions.goToOptions.rteChoicePage) {
	            currentOptions.goToOptions.pageShow = currentOptions.paginationOptions.currentPage;
	            currentOptions.goToOptions.page = currentOptions.paginationOptions.currentPage;
	          }
	          this.props.handleEvent.changeState(_defineProperty({}, currentOptions.goToOptions.text, currentOptions.goToOptions));
	          break;
	      }
	    }
	  },
	  countPagination: function countPagination(currentOptions, state, mode, options, callback) {
	    if (!currentOptions) {
	      currentOptions = this.optionsDefinition(state, mode);
	    }
	    this.countQuantityPages(currentOptions, mode, options, function (_currentOptions) {
	      var po = _currentOptions.paginationOptions;
	      if (po.currentPage === po.firstPage) {
	        po.disableBack = true;
	        po.disableFirst = true;
	      } else {
	        po.disableBack = false;
	        po.disableFirst = false;
	      }
	      if (po.currentPage === po.lastPage) {
	        po.disableForward = true;
	        po.disableLast = true;
	      } else {
	        po.disableForward = false;
	        po.disableLast = false;
	      }
	      if (callback) {
	        var _callback;

	        callback((_callback = {}, _defineProperty(_callback, po.text, po), _defineProperty(_callback, _currentOptions.listOptions.text, _currentOptions.listOptions), _callback));
	      }
	    });
	  },
	  countQuantityPages: function countQuantityPages(currentOptions, mode, options, callback) {
	    var self = this;
	    if (currentOptions.listOptions.data_download) {
	      _messages2.default.prototype.getAllMessages(options.chat_id, mode, function (err, messages) {
	        self.handleCountPagination(messages, currentOptions, callback);
	      });
	    } else {
	      switch (mode) {
	        case "CHATS":
	          _users_bus2.default.getMyInfo(null, function (error, options, userInfo) {
	            if (!userInfo) return;
	            _chats_bus2.default.getChats(error, options, userInfo.chat_ids, function (error, options, chatsInfo) {
	              if (error) {
	                console.error(error);
	                return;
	              }
	              self.handleCountPagination(chatsInfo, currentOptions, callback);
	            });
	          });
	          break;
	        case "USERS":
	          _users_bus2.default.getMyInfo(null, function (error, options, userInfo) {
	            if (!userInfo) return;
	            _users_bus2.default.getContactsInfo(error, userInfo.user_ids, function (_error, contactsInfo) {
	              if (_error) {
	                console.error(_error);
	                return;
	              }
	              self.handleCountPagination(contactsInfo, currentOptions, callback);
	            });
	          });
	          break;
	        case "CONTACT_LIST":
	          _chats_bus2.default.getChatContacts(options.chat_id, function (error, contactsInfo) {
	            if (error) {
	              console.error(error);
	              return;
	            }
	            self.handleCountPagination(contactsInfo, currentOptions, callback);
	          });
	          break;
	      }
	    }
	  },
	  handleCountPagination: function handleCountPagination(data, currentOptions, callback) {
	    var quantityPages = void 0,
	        quantityData = void 0,
	        po = currentOptions.paginationOptions,
	        lo = currentOptions.listOptions;
	    if (!po || !lo) return;
	    if (data) {
	      quantityData = data.length;
	    } else {
	      quantityData = 0;
	    }
	    if (quantityData !== 0) {
	      quantityPages = Math.ceil(quantityData / currentOptions.paginationOptions.perPageValue);
	    } else {
	      quantityPages = 1;
	    }
	    if (po.currentPage === null) {
	      lo.start = quantityPages * po.perPageValue - po.perPageValue;
	      lo.final = quantityPages * po.perPageValue;
	      po.currentPage = quantityPages;
	    } else {
	      lo.start = (po.currentPage - 1) * po.perPageValue;
	      lo.final = (po.currentPage - 1) * po.perPageValue + po.perPageValue;
	    }
	    po.lastPage = quantityPages;
	    if (callback) {
	      callback(currentOptions);
	    }
	  },
	  switchPage: function switchPage(element) {
	    var self = this,
	        currentOptions = this.optionsDefinition(this.props.data, this.props.mode),
	        po = currentOptions.paginationOptions,
	        elementRole = element.dataset.role;
	    if (elementRole === "first" || elementRole === "last") {
	      po.currentPage = parseInt(element.dataset.value);
	    }
	    if (elementRole === "back") {
	      po.currentPage = parseInt(po.currentPage) - 1;
	    }
	    if (elementRole === "forward") {
	      po.currentPage = parseInt(po.currentPage) + 1;
	    }
	    this.countPagination(currentOptions, null, this.props.mode, { "chat_id": this.props.data.chat_id }, function (_newState) {
	      self.props.handleEvent.changeState(_newState);
	    });
	  },
	  changePage: function changePage(element, currentOptions) {
	    var value = parseInt(element.value, 10),
	        gto = currentOptions.goToOptions,
	        po = currentOptions.paginationOptions;
	    gto.pageShow = element.value;
	    if (!(value === 0 || Number.isNaN(value))) {
	      if (value > po.lastPage) {
	        gto.page = po.lastPage;
	      } else {
	        if (value < po.firstPage) {
	          gto.page = po.firstPage;
	        } else {
	          gto.page = value;
	        }
	      }
	      if (gto.rteChoicePage) {
	        if (value > po.lastPage) {
	          po.currentPage = po.lastPage;
	        } else {
	          if (value < po.firstPage) {
	            po.currentPage = po.firstPage;
	          } else {
	            po.currentPage = value;
	          }
	        }
	      }
	    }
	    return currentOptions;
	  },
	  render: function render() {
	    var onEvent = {
	      onClick: this.handleClick
	    },
	        currentOptions = this.optionsDefinition(this.props.data, this.props.mode),
	        po = currentOptions.paginationOptions;
	    if (po && po.show) {
	      var data = {
	        firstPage: po.firstPage,
	        currentPage: po.currentPage,
	        lastPage: po.lastPage,
	        disableBack: po.disableBack,
	        disableFirst: po.disableFirst,
	        disableLast: po.disableLast,
	        disableForward: po.disableForward
	      };
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_location_wrapper2.default, { events: onEvent, data: data, configs: this.props.configs,
	          mainContainer: this.props.mainContainer })
	      );
	    } else {
	      return _react2.default.createElement('div', null);
	    }
	  }
	});

	_extend_core2.default.prototype.inherit(Pagination, _switcher_core2.default);
	_extend_core2.default.prototype.inherit(Pagination, _dom_core2.default);

	exports.default = Pagination;

/***/ },

/***/ 333:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _switcher_core = __webpack_require__(310);

	var _switcher_core2 = _interopRequireDefault(_switcher_core);

	var _location_wrapper = __webpack_require__(293);

	var _location_wrapper2 = _interopRequireDefault(_location_wrapper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var GoTo = _react2.default.createClass({
	  displayName: 'GoTo',
	  getDefaultProps: function getDefaultProps() {
	    return {
	      configs: [{
	        "role": "locationWrapper",
	        "classList": "flex-align-c",
	        "location": "choice_page"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "class": "check-box-size",
	        "location": "choice_page",
	        "data": {
	          "role": "rte_choice_per_page",
	          "action": "changeRTE_goTo",
	          "key": "rteChoicePage"
	        },
	        "sort": 3,
	        "redraw_mode": "nrte"
	      }, {
	        "element": "button",
	        "text": 11,
	        "class": "w-50px button-inset-white",
	        "location": "choice_page",
	        "data": {
	          "role": "go_to_page",
	          "action": "switchPage"
	        },
	        "htmlFor": "per_page",
	        "sort": 1,
	        "redraw_mode": "nrte"
	      }, {
	        "element": "input",
	        "type": "number",
	        "class": "w-50px",
	        "location": "choice_page",
	        "data": {
	          "role": "choice_per_page",
	          "action": "changePage",
	          "key": "page"
	        },
	        "name": "",
	        "id": "per_page",
	        "sort": 2,
	        "redraw_mode": "nrte"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "class": "check-box-size",
	        "location": "choice_page",
	        "data": {
	          "role": "rte_choice_per_page",
	          "action": "changeRTE_goTo",
	          "key": "rteChoicePage"
	        },
	        "sort": 3,
	        "redraw_mode": "rte"
	      }, {
	        "element": "label",
	        "text": 11,
	        "location": "choice_page",
	        "data": {
	          "role": "go_to_page"
	        },
	        "name": "",
	        "htmlFor": "per_page",
	        "sort": 1,
	        "redraw_mode": "rte"
	      }, {
	        "element": "input",
	        "type": "number",
	        "location": "choice_page",
	        "data": {
	          "role": "choice_per_page",
	          "action": "changePage",
	          "key": "page"
	        },
	        "id": "per_page",
	        "sort": 2,
	        "redraw_mode": "rte"
	      }]
	    };
	  },
	  prepareConfig: function prepareConfig(config, mode) {
	    config = config.filter(function (obj) {
	      if (!obj.redraw_mode) {
	        return obj;
	      } else {
	        return obj.redraw_mode === mode;
	      }
	    });
	    return config;
	  },
	  changeRTE: function changeRTE(element, currentOptions) {
	    var gto = currentOptions.goToOptions;
	    if (element.checked) {
	      gto.mode_change = "rte";
	      gto.rteChoicePage = true;
	      currentOptions.paginationOptions.currentPage = gto.page;
	      return currentOptions;
	    } else {
	      gto.mode_change = "nrte";
	      gto.rteChoicePage = false;
	      return currentOptions;
	    }
	  },
	  render: function render() {
	    var currentOptions = this.optionsDefinition(this.props.data, this.props.mode),
	        gto = currentOptions.goToOptions;
	    if (gto && gto.show && currentOptions.paginationOptions && currentOptions.paginationOptions.show) {
	      var configs = this.prepareConfig(this.props.configs, gto.mode_change),
	          data = {
	        mode_change: gto.mode_change,
	        rteChoicePage: gto.rteChoicePage,
	        page: gto.pageShow
	      };
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(_location_wrapper2.default, { events: this.props.events, data: data, configs: configs })
	      );
	    } else {
	      return _react2.default.createElement('div', null);
	    }
	  }
	});

	_extend_core2.default.prototype.inherit(GoTo, _switcher_core2.default);

	exports.default = GoTo;

/***/ },

/***/ 334:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _dom_core = __webpack_require__(303);

	var _dom_core2 = _interopRequireDefault(_dom_core);

	var _indexeddb = __webpack_require__(285);

	var _indexeddb2 = _interopRequireDefault(_indexeddb);

	var _chats_bus = __webpack_require__(309);

	var _chats_bus2 = _interopRequireDefault(_chats_bus);

	var _ajax_core = __webpack_require__(335);

	var _ajax_core2 = _interopRequireDefault(_ajax_core);

	var _messages = __webpack_require__(323);

	var _messages2 = _interopRequireDefault(_messages);

	var _websocket = __webpack_require__(290);

	var _websocket2 = _interopRequireDefault(_websocket);

	var _webrtc = __webpack_require__(311);

	var _webrtc2 = _interopRequireDefault(_webrtc);

	var _model_core = __webpack_require__(322);

	var _model_core2 = _interopRequireDefault(_model_core);

	var _chat2 = __webpack_require__(336);

	var _chat3 = _interopRequireDefault(_chat2);

	var _dialogConfirm = __webpack_require__(326);

	var _dialogConfirm2 = _interopRequireDefault(_dialogConfirm);

	var _dialogError = __webpack_require__(304);

	var _dialogError2 = _interopRequireDefault(_dialogError);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var id_Generator = __webpack_require__(341);

	var ChatsManager = _react2.default.createClass({
	  displayName: 'ChatsManager',
	  getDefaultProps: function getDefaultProps() {
	    return {
	      minChatsWidth: 350,
	      minMove: 5,
	      UIElements: {},
	      withPanels: true
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      chatsArray: [],
	      errorMessage: null,
	      confirmMessageRequestChatByChatId: null,
	      confirmDialog_chatId: null,
	      confirmMessageCloseChat: null,
	      confirmDialog_description: null,
	      confirmDialog_tempChatId: null,
	      confirmMessageSaveChat: null,
	      confirmMessageSaveCloseChat: null
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    _event_bus2.default.on('showChat', this.showChat, this);
	    _event_bus2.default.on('addNewChatAuto', this.createNewChat, this);
	    _event_bus2.default.on('getOpenChats', this.getOpenChats, this);
	    _event_bus2.default.on('toCloseChat', this.toCloseChat, this);
	    _event_bus2.default.on('chatsDestroy', this.destroyChats);
	    _event_bus2.default.on('changeMyUsers', this.changeMyUsers);
	    _event_bus2.default.on('chatJoinApproved', this.chatCreateApproved);
	    _event_bus2.default.on('web_socket_message', this.onChatMessageRouter);
	    _event_bus2.default.on('notifyChat', this.onChatMessageRouter);
	    _event_bus2.default.on('syncResponseChatMessages', this.onChatMessageRouter);
	    _event_bus2.default.on('requestChatByChatId', this.requestChatByChatId);
	    _event_bus2.default.on('getSynchronizeChatMessages', this.getSynchronizeChatMessages);
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    _event_bus2.default.off('showChat', this.showChat);
	    _event_bus2.default.off('addNewChatAuto', this.createNewChat);
	    _event_bus2.default.off('getOpenChats', this.getOpenChats);
	    _event_bus2.default.off('toCloseChat', this.toCloseChat);
	    _event_bus2.default.off('chatsDestroy', this.destroyChats);
	    _event_bus2.default.off('changeMyUsers', this.changeMyUsers);
	    _event_bus2.default.off('chatJoinApproved', this.chatCreateApproved);
	    _event_bus2.default.off('web_socket_message', this.onChatMessageRouter);
	    _event_bus2.default.off('notifyChat', this.onChatMessageRouter);
	    _event_bus2.default.off('syncResponseChatMessages', this.onChatMessageRouter);
	    _event_bus2.default.off('requestChatByChatId', this.requestChatByChatId);
	    _event_bus2.default.off('getSynchronizeChatMessages', this.getSynchronizeChatMessages);
	  },
	  getOpenChats: function getOpenChats(callback) {
	    var openChats = {};
	    _chat3.default.prototype.chatsArray.forEach(function (chat) {
	      if (!chat.chat_description) return;
	      openChats[chat.chat_description.chat_id] = true;
	    });
	    callback(openChats);
	  },
	  showChat: function showChat(element, chat_id) {
	    var restoreOption = void 0,
	        parentElement = void 0;
	    if (element) {
	      parentElement = this.traverseUpToDataset(element, 'role', 'chatWrapper');
	      restoreOption = element.dataset.restore_chat_state;
	    }
	    if (!parentElement && !chat_id) {
	      console.error(new Error('Parent element not found!'));
	      return;
	    }

	    if (parentElement && !parentElement.dataset.chat_id && !chat_id) {
	      console.error(new Error('Chat wrapper does not have chat id!'));
	      return;
	    }

	    var chatId = parentElement ? parentElement.dataset.chat_id : chat_id;
	    if (this.isChatOpened(chatId)) {
	      this.setState({ errorMessage: 93 });
	      return;
	    }

	    this.createNewChat(null, true, restoreOption, chatId);
	  },
	  changeMyUsers: function changeMyUsers(userId) {
	    _chat3.default.prototype.chatsArray.forEach(function (_chat) {
	      if (_chat.chat_description.user_ids.indexOf(userId) !== -1) {
	        _event_bus2.default.trigger('changeMyUserInfo', userId, _chat.chat_description.chat_id);
	      }
	    });
	  },
	  getSynchronizeChatMessages: function getSynchronizeChatMessages(messageData) {
	    _messages2.default.prototype.getSynchronizeChatMessages(messageData);
	  },


	  /**
	   * chat whether requested chat by its id is opened or not
	   */
	  isChatOpened: function isChatOpened(chatId) {
	    var openedChat = void 0;
	    _chat3.default.prototype.chatsArray.every(function (_chat) {
	      if (_chat.chat_description && _chat.chat_description.chat_id === chatId || _chat.temp_chat_id === chatId) {
	        openedChat = _chat;
	      }
	      return !openedChat;
	    });

	    return openedChat;
	  },
	  getIndexCurrentChat: function getIndexCurrentChat(chatId) {
	    var _indexCurrentChat = void 0;
	    _chat3.default.prototype.chatsArray.every(function (_chat, index) {
	      if (_chat.chat_description && _chat.chat_description.chat_id === chatId || _chat.chat_id === chatId) {
	        _indexCurrentChat = index;
	      }
	      return !_indexCurrentChat;
	    });

	    return _indexCurrentChat;
	  },
	  handleChat: function handleChat(messageData, chat_description) {
	    _event_bus2.default.trigger("changeOpenChats", "CHATS");
	    if (messageData.chat_wscs_descrs) {
	      _webrtc2.default.handleConnectedDevices(messageData.chat_wscs_descrs);
	    } else {
	      _websocket2.default.wsRequest({
	        chat_id: chat_description.chat_id,
	        url: "/api/chat/websocketconnections"
	      }, function (err, response) {
	        if (err) {
	          console.error(err);
	          return;
	        }
	        _webrtc2.default.handleConnectedDevices(response.chat_wscs_descrs);
	      });
	    }
	    this.forceUpdate();
	  },
	  createNewChat: function createNewChat(event, show, restoreOption, chatId, message_request) {
	    if (!_websocket2.default) return;

	    var newRawChat = {};
	    newRawChat.mode = 'raw';
	    newRawChat.temp_chat_id = id_Generator.generateId();
	    if (show) {
	      newRawChat.show = show;
	      if (chatId) {
	        newRawChat.chat_id = chatId;
	      }
	      if (restoreOption) {
	        newRawChat.restoreOption = restoreOption;
	      }
	    }
	    if (message_request && chatId) {
	      newRawChat.chat_id = chatId;
	      newRawChat.message_request = message_request;
	    }
	    newRawChat.logMessages = [];
	    _chat3.default.prototype.chatsArray.push(newRawChat);
	    this.forceUpdate();
	  },
	  onChatMessageRouter: function onChatMessageRouter(messageData) {
	    switch (messageData.type) {
	      case 'chat_joined':
	        this.chatJoinApproved(messageData);
	        break;
	      case 'syncResponseChatMessages':
	        _chat3.default.prototype.chatsArray.forEach(function (_chat) {
	          if (_chat.chat_description && messageData.chat_description.chat_id === _chat.chat_description.chat_id && messageData.owner_request === _users_bus2.default.getUserId()) {
	            _event_bus2.default.trigger('workflowSynchronizeMessages', messageData);
	          }
	        });
	        break;
	      case 'notifyChat':
	        _chat3.default.prototype.chatsArray.forEach(function (_chat) {
	          if (_chat.chat_description && messageData.chat_description.chat_id === _chat.chat_description.chat_id) {
	            _event_bus2.default.trigger(messageData.chat_type, messageData);
	          }
	        });
	        break;
	      case 'error':
	        switch (messageData.request_type) {
	          case 'notifyChat':
	            if (messageData.chat_description && messageData.chat_description.temp_chat_id) {
	              _event_bus2.default.trigger('send_log_message', messageData.chat_description.temp_chat_id, { text: messageData.message, type: 'error' });
	            }
	            break;
	        }
	        break;
	    }
	  },
	  chatCreateApproved: function chatCreateApproved(event) {
	    if (event.from_ws_device_id) {
	      _event_bus2.default.set_ws_device_id(event.from_ws_device_id);
	    }
	    _event_bus2.default.trigger('send_log_message', event.chat_description.chat_id, { text: 'Adding chat to IndexedDB.', type: 'information' });
	    this.addNewChatToIndexedDB(event.chat_description, function (err, chat) {
	      if (err) {
	        console.error(err);
	        _event_bus2.default.trigger('send_log_message', chat.chat_id, { text: err, type: 'error' });
	        return;
	      }
	      _event_bus2.default.trigger('send_log_message', chat.chat_id, { text: 'Added chat to IndexedDB. Saving chat in List Chats users.', type: 'information' });
	      _users_bus2.default.putChatIdAndSave(chat.chat_id, function (err, userInfo) {
	        if (err) {
	          console.error(err);
	          _event_bus2.default.trigger('send_log_message', chat.chat_id, { text: err, type: 'error' });
	          return;
	        }
	        _event_bus2.default.trigger('AddedNewChat', userInfo.chat_ids.length);
	        _websocket2.default.sendMessage({
	          type: "chat_join",
	          from_user_id: _users_bus2.default.getUserId(),
	          chat_description: {
	            chat_id: chat.chat_id
	          }
	        });
	        _event_bus2.default.trigger('send_log_message', chat.chat_id, { text: 'Saved chat in List Chats users. Websocket sendMessage "Chat join".', type: 'information' });
	      });
	    });
	  },


	  /**
	   * join request for this chat was approved by the server
	   * make offer for each device for this chat
	   */
	  chatJoinApproved: function chatJoinApproved(event) {
	    var self = this,
	        index = void 0;
	    _event_bus2.default.set_ws_device_id(event.target_ws_device_id);
	    _event_bus2.default.trigger('send_log_message', event.chat_description.chat_id, { text: 'Chat join approved. Getting chat description.', type: 'information' });

	    _indexeddb2.default.getByKeyPath(_chats_bus2.default.collectionDescription, null, event.chat_description.chat_id, function (getError, chat_description) {
	      if (getError) {
	        console.error(getError);
	        return;
	      }

	      if (!chat_description) {
	        this.setState({ errorMessage: 86 });
	        return;
	      }

	      _event_bus2.default.trigger('send_log_message', chat_description.chat_id, {
	        text: 'Get chat description.',
	        type: 'information'
	      });
	      index = self.getIndexCurrentChat(chat_description.chat_id);
	      if (index === undefined) return;

	      if (_chat3.default.prototype.chatsArray[index].mode !== 'ready') {
	        _event_bus2.default.trigger('send_log_message', chat_description.chat_id, {
	          text: 'Upgrade to chat "ready".',
	          type: 'information'
	        });
	        _chat3.default.prototype.chatsArray[index].mode = 'ready';
	        if (!event.chat_description.restoreOption) {
	          _chat3.default.prototype.chatsArray[index].chat_description = {};
	          self.extend(_chat3.default.prototype.chatsArray[index].chat_description, {
	            chat_id: chat_description.chat_id,
	            createdByUserId: chat_description.createdByUserId,
	            createdDatetime: chat_description.createdDatetime,
	            user_ids: chat_description.user_ids
	          });
	          _chat3.default.prototype.chatsArray[index].chat_description.user_ids = chat_description.user_ids;
	        } else {
	          _chat3.default.prototype.chatsArray[index].chat_description = chat_description;
	        }
	        self.handleChat(event, chat_description);
	      } else if (_chat3.default.prototype.chatsArray[index].mode === 'ready' && event.chat_wscs_descrs) {
	        _event_bus2.default.trigger('send_log_message', chat_description.chat_id, { text: 'Webrtc handleConnectedDevices".', type: 'information' });
	        _webrtc2.default.handleConnectedDevices(event.chat_wscs_descrs);
	      }
	    });
	  },
	  addNewChatToIndexedDB: function addNewChatToIndexedDB(chat_description, callback) {
	    var newChat = _chat3.default.prototype.getInitialState();
	    if (chat_description) {
	      this.extend(newChat, chat_description);
	    }
	    this.setCreator(newChat);
	    this.addMyUserId(newChat);
	    _chats_bus2.default.putChatToIndexedDB(newChat, callback);
	  },
	  toCloseChat: function toCloseChat(saveStates, chatId, temp_chat_id) {
	    var self = this;
	    if (!chatId && temp_chat_id) {
	      self.closeChat(null, temp_chat_id);
	      return;
	    }
	    _event_bus2.default.trigger('getChatDescription', chatId, function (description) {
	      switch (saveStates) {
	        case 'closeChat':
	          self.closeChat(description);
	          break;
	        case 'saveStatesChat':
	          self.saveStatesChat(description);
	          break;
	        case 'saveAndCloseChat':
	          self.saveAndCloseChat(description);
	          break;
	      }
	    });
	  },
	  requestChatByChatId: function requestChatByChatId(chatId, requestMessage) {
	    var self = this;
	    _indexeddb2.default.getByKeyPath(_chats_bus2.default.collectionDescription, null, chatId, function (getError, chat_description) {
	      if (getError) {
	        console.error(getError);
	        return;
	      }

	      if (!chat_description) {
	        self.createNewChat(null, null, null, chatId, requestMessage);
	      } else {
	        if (self.isChatOpened(chatId)) {
	          this.setState({ errorMessage: 93 });
	        } else {
	          self.setState({ confirmMessageRequestChatByChatId: 114, confirmDialog_chatId: chatId });
	        }
	      }
	    });
	  },
	  closeChat: function closeChat(description, temp_chat_id) {
	    this.setState({ confirmMessageCloseChat: 83,
	      confirmDialog_description: description,
	      confirmDialog_tempChatId: temp_chat_id });
	  },
	  destroyChat: function destroyChat(description, temp_chat_id) {
	    var position = this.getDestroyChatPosition(!description && temp_chat_id ? temp_chat_id : description.chat_id);
	    if (description && !temp_chat_id) {
	      _event_bus2.default.trigger("chatDestroyed", description.chat_id);
	      _event_bus2.default.trigger("changeOpenChats");
	    }
	    _chat3.default.prototype.chatsArray.splice(position, 1);
	    this.forceUpdate();
	  },
	  destroyChats: function destroyChats() {
	    _chat3.default.prototype.chatsArray = [];
	  },
	  getDestroyChatPosition: function getDestroyChatPosition(chat_id) {
	    var destroyChatPosition = void 0;
	    _chat3.default.prototype.chatsArray.every(function (_chat, index) {
	      if (_chat.chat_description && _chat.chat_description.chat_id === chat_id || _chat.temp_chat_id === chat_id) {
	        destroyChatPosition = index;
	      }
	      return !destroyChatPosition;
	    });

	    return destroyChatPosition;
	  },
	  saveStatesChat: function saveStatesChat(description) {
	    this.setState({ confirmMessageSaveChat: 81, confirmDialog_description: description });
	  },
	  saveAndCloseChat: function saveAndCloseChat(description) {
	    this.setState({ confirmMessageSaveCloseChat: 82, confirmDialog_description: description });
	  },
	  handleDialogError: function handleDialogError() {
	    this.setState({ errorMessage: null });
	  },
	  handleDialogRequestChatByChatId: function handleDialogRequestChatByChatId(event) {
	    var element = this.getDataParameter(event.target, 'action');
	    if (element) {
	      switch (element.dataset.action) {
	        case 'confirmCancel':
	          break;
	        case 'confirmOk':
	          this.showChat(null, this.state.confirmDialog_chatId);
	          break;
	      }
	      this.setState({ confirmMessageRequestChatByChatId: null, confirmDialog_chatId: null });
	    }
	  },
	  handleDialogCloseChat: function handleDialogCloseChat(event) {
	    var element = this.getDataParameter(event.target, 'action');
	    if (element) {
	      switch (element.dataset.action) {
	        case 'confirmCancel':
	          break;
	        case 'confirmOk':
	          this.destroyChat(this.state.confirmDialog_description, this.state.confirmDialog_tempChatId);
	          break;
	      }
	      this.setState({ confirmMessageCloseChat: null,
	        confirmDialog_description: null,
	        confirmDialog_tempChatId: null });
	    }
	  },
	  handleDialogSaveChat: function handleDialogSaveChat(event) {
	    var element = this.getDataParameter(event.target, 'action');
	    if (element) {
	      switch (element.dataset.action) {
	        case 'confirmCancel':
	          break;
	        case 'confirmOk':
	          this.addNewChatToIndexedDB(this.state.confirmDialog_description, function (err) {
	            if (err) console.error(err);
	          });
	          break;
	      }
	      this.setState({ confirmMessageSaveChat: null, confirmDialog_description: null });
	    }
	  },
	  handleDialogSaveCloseChat: function handleDialogSaveCloseChat(event) {
	    var element = this.getDataParameter(event.target, 'action'),
	        self = this;
	    if (element) {
	      switch (element.dataset.action) {
	        case 'confirmCancel':
	          this.setState({ confirmMessageSaveCloseChat: null, confirmDialog_description: null });
	          break;
	        case 'confirmOk':
	          this.addNewChatToIndexedDB(this.state.confirmDialog_description, function (err) {
	            if (err) return console.error(err);

	            self.destroyChat(self.state.confirmDialog_description);
	            self.setState({ confirmMessageSaveCloseChat: null, confirmDialog_description: null });
	          });
	          break;
	      }
	    }
	  },
	  render: function render() {
	    var self = this,
	        items = [];
	    if (_chat3.default.prototype.chatsArray.length) {
	      _chat3.default.prototype.chatsArray.forEach(function (_chat, index) {
	        items.push(_react2.default.createElement(_chat3.default, { data: _chat,
	          key: _chat.chat_description && _chat.chat_description.chat_id ? _chat.chat_description.chat_id : _chat.temp_chat_id,
	          mode: _chat.mode, index: index, scrollEachChat: self.props.scrollEachChat }));
	      });
	    }
	    return _react2.default.createElement(
	      'div',
	      { className: 'h-100p' },
	      _react2.default.createElement(_dialogError2.default, { show: this.state.errorMessage, message: this.state.errorMessage,
	        handleClick: this.handleDialogError }),
	      _react2.default.createElement(_dialogConfirm2.default, { show: this.state.confirmMessageRequestChatByChatId,
	        message: this.state.confirmMessageRequestChatByChatId,
	        handleClick: this.handleDialogRequestChatByChatId }),
	      _react2.default.createElement(_dialogConfirm2.default, { show: this.state.confirmMessageCloseChat,
	        message: this.state.confirmMessageCloseChat,
	        handleClick: this.handleDialogCloseChat }),
	      _react2.default.createElement(_dialogConfirm2.default, { show: this.state.confirmMessageSaveChat,
	        message: this.state.confirmMessageSaveChat,
	        handleClick: this.handleDialogSaveChat }),
	      _react2.default.createElement(_dialogConfirm2.default, { show: this.state.confirmMessageSaveCloseChat,
	        message: this.state.confirmMessageSaveCloseChat,
	        handleClick: this.handleDialogSaveCloseChat }),
	      _react2.default.createElement(
	        'div',
	        { className: 'flex-outer-container align-start', 'data-role': 'chat_wrapper' },
	        items
	      )
	    );
	  }
	});

	_extend_core2.default.prototype.inherit(ChatsManager, _dom_core2.default);
	_extend_core2.default.prototype.inherit(ChatsManager, _ajax_core2.default);
	_extend_core2.default.prototype.inherit(ChatsManager, _extend_core2.default);
	_extend_core2.default.prototype.inherit(ChatsManager, _model_core2.default);

	exports.default = ChatsManager;

/***/ },

/***/ 335:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var ajax_core = function ajax_core() {};

	ajax_core.prototype = {

	  __class_name: "ajax_core",

	  objectToFormData: function objectToFormData(objectData) {
	    var formData = new FormData();
	    for (var key in objectData) {
	      formData.append(key, objectData[key]);
	    }
	    return formData;
	  },

	  sendRequest: function sendRequest(type, url, data, callback) {
	    var xhr = new XMLHttpRequest();
	    xhr.open(type, url, true);

	    xhr.onreadystatechange = function () {
	      if (xhr.readyState == 4) {
	        if (xhr.status >= 200 || xhr.status < 300 || xhr.status === 304) {
	          callback(null, xhr.responseText);
	        } else {
	          callback('Error (' + xhr.status + ') : ' + xhr.statusText + ' : ' + xhr.responseText);
	        }
	      }
	    };
	    xhr.send(data);
	  },

	  get_JSON_res: function get_JSON_res(url, callback) {
	    ajax_core.prototype.sendRequest('GET', url, null, function (err, res) {
	      if (err) {
	        callback(err);
	      } else {
	        try {
	          var parsed = JSON.parse(res);
	        } catch (e) {
	          callback(e);
	        }

	        callback(null, parsed);
	      }
	    });
	  },

	  getRequest: function getRequest(url, callback) {
	    ajax_core.prototype.sendRequest('GET', url, null, callback);
	  },

	  postRequest: function postRequest(url, objectData, callback) {
	    var formData = ajax_core.prototype.objectToFormData(objectData);
	    ajax_core.prototype.sendRequest('POST', url, formData, callback);
	  },

	  putRequest: function putRequest(url, objectData, callback) {
	    var formData = ajax_core.prototype.objectToFormData(objectData);
	    ajax_core.prototype.sendRequest('PUT', url, formData, callback);
	  },

	  deleteRequest: function deleteRequest(url, callback) {
	    ajax_core.prototype.sendRequest('DELETE', url, null, callback);
	  }
	};

	exports.default = ajax_core;

/***/ },

/***/ 336:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(45);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _switcher_core = __webpack_require__(310);

	var _switcher_core2 = _interopRequireDefault(_switcher_core);

	var _dom_core = __webpack_require__(303);

	var _dom_core2 = _interopRequireDefault(_dom_core);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	var _messages2 = __webpack_require__(323);

	var _messages3 = _interopRequireDefault(_messages2);

	var _webrtc = __webpack_require__(311);

	var _webrtc2 = _interopRequireDefault(_webrtc);

	var _websocket = __webpack_require__(290);

	var _websocket2 = _interopRequireDefault(_websocket);

	var _chats_bus = __webpack_require__(309);

	var _chats_bus2 = _interopRequireDefault(_chats_bus);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _model_core = __webpack_require__(322);

	var _model_core2 = _interopRequireDefault(_model_core);

	var _indexeddb = __webpack_require__(285);

	var _indexeddb2 = _interopRequireDefault(_indexeddb);

	var _header = __webpack_require__(337);

	var _header2 = _interopRequireDefault(_header);

	var _filter = __webpack_require__(314);

	var _filter2 = _interopRequireDefault(_filter);

	var _extra_toolbar = __webpack_require__(313);

	var _extra_toolbar2 = _interopRequireDefault(_extra_toolbar);

	var _body = __webpack_require__(316);

	var _body2 = _interopRequireDefault(_body);

	var _editor = __webpack_require__(338);

	var _editor2 = _interopRequireDefault(_editor);

	var _pagination = __webpack_require__(332);

	var _pagination2 = _interopRequireDefault(_pagination);

	var _go_to = __webpack_require__(333);

	var _go_to2 = _interopRequireDefault(_go_to);

	var _toggle_visible_chat_part = __webpack_require__(340);

	var _toggle_visible_chat_part2 = _interopRequireDefault(_toggle_visible_chat_part);

	var _dialogConfirm = __webpack_require__(326);

	var _dialogConfirm2 = _interopRequireDefault(_dialogConfirm);

	var _dialogError = __webpack_require__(304);

	var _dialogError2 = _interopRequireDefault(_dialogError);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var Chat = _react2.default.createClass({
	  displayName: 'Chat',

	  chatsArray: [],
	  syncMessageDataArray: [],
	  syncMessageDataFlag: false,
	  valueOfKeys: ['chat_id', 'createdByUserId', 'createdDatetime', 'user_ids'],

	  getDefaultProps: function getDefaultProps() {
	    return {
	      location: {
	        TOP: "TOP",
	        BOTTOM: "BOTTOM"
	      }
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      hideTopPart: false,
	      hideBottomPart: false,
	      headerFooterControl: false,
	      toggleTopButtonLeft: '0px',
	      toggleBottomButtonLeft: '0px',
	      toggleChatUsersFriendship: false,
	      errorMessage: null,
	      confirmMessage: null,
	      confirmMessageData: null,
	      padding: {
	        bottom: 5
	      },
	      headerOptions: {
	        show: true,
	        mode: _header2.default.prototype.MODE.TAB
	      },
	      filterOptions: {
	        show: false
	      },
	      bodyOptions: {
	        show: true,
	        mode: _body2.default.prototype.MODE.MESSAGES
	      },
	      editorOptions: {
	        show: true,
	        mode: _editor2.default.prototype.MODE.MAIN_PANEL
	      },
	      formatOptions: {
	        show: false,
	        offScroll: false,
	        sendEnter: true,
	        iSender: true
	      },
	      messages_GoToOptions: {
	        text: "messages_GoToOptions",
	        show: false,
	        rteChoicePage: true,
	        mode_change: "rte",
	        page: null,
	        pageShow: 1
	      },
	      messages_PaginationOptions: {
	        text: "messages_PaginationOptions",
	        show: false,
	        mode_change: "rte",
	        currentPage: null,
	        firstPage: 1,
	        lastPage: null,
	        showEnablePagination: false,
	        showChoicePerPage: false,
	        perPageValue: 1,
	        perPageValueShow: 1,
	        perPageValueNull: false,
	        rtePerPage: true,
	        disableBack: false,
	        disableFirst: false,
	        disableLast: false,
	        disableForward: false
	      },
	      messages_FilterOptions: {
	        text: "messages_FilterOptions",
	        show: false
	      },
	      messages_ExtraToolbarOptions: {
	        show: true
	      },
	      messages_ListOptions: {
	        text: "messages_ListOptions",
	        start: 0,
	        last: null,
	        previousStart: 0,
	        previousFinal: 0,
	        restore: false,
	        innerHTML: "",
	        data_download: true
	      },

	      logger_GoToOptions: {
	        text: '"logger_GoToOptions',
	        show: false,
	        rteChoicePage: true,
	        mode_change: "rte",
	        page: null,
	        pageShow: 1
	      },
	      logger_PaginationOptions: {
	        text: "logger_PaginationOptions",
	        show: false,
	        mode_change: "rte",
	        currentPage: null,
	        firstPage: 1,
	        lastPage: null,
	        showEnablePagination: false,
	        showChoicePerPage: false,
	        perPageValue: 25,
	        perPageValueShow: 25,
	        perPageValueNull: false,
	        rtePerPage: true,
	        disableBack: false,
	        disableFirst: false,
	        disableLast: false,
	        disableForward: false
	      },
	      logger_FilterOptions: {
	        show: false
	      },
	      logger_ExtraToolbarOptions: {
	        show: true
	      },
	      logger_ListOptions: {
	        text: "logger_ListOptions",
	        start: 0,
	        last: null,
	        previousStart: 0,
	        previousFinal: 0,
	        restore: false,
	        data_download: true
	      },

	      contactList_FilterOptions: {
	        text: "contactList_FilterOptions",
	        show: false
	      },
	      contactList_ExtraToolbarOptions: {
	        show: true
	      },
	      contactList_PaginationOptions: {
	        text: "contactList_PaginationOptions",
	        show: false,
	        mode_change: "rte",
	        currentPage: null,
	        firstPage: 1,
	        lastPage: null,
	        showEnablePagination: false,
	        showChoicePerPage: false,
	        perPageValue: 50,
	        perPageValueShow: 50,
	        perPageValueNull: false,
	        rtePerPage: true,
	        disableBack: false,
	        disableFirst: false,
	        disableLast: false,
	        disableForward: false
	      },
	      contactList_GoToOptions: {
	        text: "contactList_GoToOptions",
	        show: false,
	        rteChoicePage: true,
	        mode_change: "rte",
	        page: null,
	        pageShow: 1
	      },
	      contactList_ListOptions: {
	        text: "contactList_ListOptions",
	        start: 0,
	        last: null,
	        previousStart: 0,
	        previousFinal: 0,
	        restore: false,
	        data_download: false
	      },

	      settings_ExtraToolbarOptions: {
	        show: false
	      },
	      settings_FilterOptions: {
	        show: false
	      },
	      settings_PaginationOptions: {
	        show: false
	      },
	      settings_GoToOptions: {
	        text: "settings_GoToOptions",
	        show: false
	      },
	      settings_ListOptions: {
	        text: "settings_ListOptions",
	        current_data_key: null,
	        size_custom_value: '350px',
	        size_current: '350px',
	        adjust_width: false
	      }
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    var index = this.props.index,
	        self = this,
	        data = this.props.data;
	    if (this.props.data.mode && this.props.data.mode === 'raw') {
	      this.setState({
	        logMessages: this.props.data.logMessages,
	        temp_chat_id: this.props.data.temp_chat_id,
	        index: index
	      });
	    } else if (this.props.data.mode && this.props.data.mode === 'ready') {
	      if (!data.restoreOption) {
	        this.setState({
	          chat_id: data.chat_description.chat_id,
	          createdByUserId: data.chat_description.createdByUserId,
	          createdDatetime: data.chat_description.createdDatetime,
	          user_ids: data.chat_description.user_ids,
	          temp_chat_id: this.props.data.temp_chat_id,
	          index: index
	        });
	      } else {
	        data.chat_description.index = index;
	        data.chat_description.temp_chat_id = this.props.data.temp_chat_id;
	        this.setState(data.chat_description);
	        var currentOptions = this.optionsDefinition(data.chat_description, data.chat_description.bodyOptions.mode);
	        if (currentOptions.paginationOptions.showEnablePagination) {
	          _pagination2.default.prototype.countPagination(currentOptions, null, data.chat_description.bodyOptions.mode, { "chat_id": data.chat_description.chat_id }, function (_newState) {
	            self.setState(_newState);
	          });
	        }
	      }
	      this.updateUserAvatar();
	    }
	  },
	  componentDidMount: function componentDidMount() {
	    var _this = this;

	    if (this.props.data.mode === 'raw') {
	      (function () {
	        var self = _this;
	        self.state.logMessages.push({ text: 'Create raw chat.', type: 'information' });
	        _this.setState({
	          logMessages: _this.state.logMessages,
	          chat_mode: _this.props.data.mode
	        });
	        _event_bus2.default.on('web_socket_message', _this.onChatMessageRouter);
	        _event_bus2.default.on('send_log_message', _this.getLogMessage);
	        if (_this.props.data.show && _this.props.data.chat_id) {
	          self.state.logMessages.push({ text: 'Getting chat description.', type: 'information' });
	          _this.setState({ logMessages: _this.state.logMessages });
	          _indexeddb2.default.getByKeyPath(_chats_bus2.default.collectionDescription, null, _this.props.data.chat_id, function (getError, chatDescription) {
	            if (getError) {
	              return console.error(getError);
	            }

	            if (chatDescription) {
	              _websocket2.default.sendMessage({
	                type: "chat_join",
	                from_user_id: _users_bus2.default.getUserId(),
	                chat_description: {
	                  chat_id: chatDescription.chat_id,
	                  restoreOption: self.props.data.restoreOption
	                }
	              });
	              self.state.logMessages.push('Get chat description. Websocket sendMessage "Chat join".');
	              self.setState({ logMessages: self.state.logMessages });
	            } else {
	              console.error(new Error('Chat with such id not found in the database!'));
	            }
	          });
	        } else if (_this.props.data.message_request && _this.props.data.chat_id) {
	          self.state.logMessages.push({ text: 'Websocket sendMessage "Chat join request".', type: 'information' });
	          _this.setState({ logMessages: self.state.logMessages });
	          _websocket2.default.sendMessage({
	            type: "chat_join_request",
	            from_user_id: _users_bus2.default.getUserId(),
	            to_chat_id: _this.props.data.chat_id,
	            request_body: {
	              message: _this.props.data.message_request
	            },
	            chat_description: {
	              temp_chat_id: self.state.temp_chat_id
	            }
	          });
	        } else {
	          self.state.logMessages.push({ text: 'Websocket sendMessage "Chat create".', type: 'information' });
	          _this.setState({ logMessages: self.state.logMessages });
	          _websocket2.default.sendMessage({
	            type: "chat_create",
	            from_user_id: _users_bus2.default.getUserId(),
	            chat_description: {
	              temp_chat_id: self.state.temp_chat_id
	            }
	          });
	        }
	      })();
	    } else {
	      this.props.data.chat_description.chat_mode = this.props.data.mode;
	      this.setState(this.props.data.chat_description);
	      this.chat = _reactDom2.default.findDOMNode(this);
	      this.splitter_left = this.chat.querySelector('[data-splitteritem="left"]');
	      this.splitter_right = this.chat.querySelector('[data-splitteritem="right"]');

	      _event_bus2.default.on('changeMode', this.changeMode, this);
	      _event_bus2.default.on('getChatDescription', this.getChatDescription, this);
	      _event_bus2.default.on('chat_message', this.onChatMessage, this);
	      _event_bus2.default.on('chat_toggled_ready', this.onChatToggledReady, this);
	      _event_bus2.default.on('srv_chat_join_request', this.onChatJoinRequest, this);
	      _event_bus2.default.on('updateUserAvatar', this.updateUserAvatar, this);
	      _event_bus2.default.on('workflowSynchronizeMessages', this.workflowSynchronizeMessages, this);

	      this.splitter_left.addEventListener('mousedown', this.startResize);
	      this.splitter_left.addEventListener('touchstart', this.startResize);
	      this.splitter_left.addEventListener('touchmove', this.startResize);
	      this.splitter_left.addEventListener('touchend', this.startResize);

	      this.splitter_right.addEventListener('mousedown', this.startResize);
	      this.splitter_right.addEventListener('touchstart', this.startResize);
	      this.splitter_right.addEventListener('touchmove', this.startResize);
	      this.splitter_right.addEventListener('touchend', this.startResize);
	    }
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    if (this.state.chat_mode === 'raw') {
	      _event_bus2.default.off('web_socket_message', this.onChatMessageRouter);
	      _event_bus2.default.off('send_log_message', this.getLogMessage);
	    } else if (this.state.chat_mode === 'ready') {
	      _event_bus2.default.off('changeMode', this.changeMode, this);
	      _event_bus2.default.off('getChatDescription', this.getChatDescription, this);
	      _event_bus2.default.off('chat_message', this.onChatMessage, this);
	      _event_bus2.default.off('chat_toggled_ready', this.onChatToggledReady, this);
	      _event_bus2.default.off('srv_chat_join_request', this.onChatJoinRequest, this);
	      _event_bus2.default.off('updateUserAvatar', this.updateUserAvatar, this);
	      _event_bus2.default.off('workflowSynchronizeMessages', this.workflowSynchronizeMessages, this);

	      this.splitter_left.removeEventListener('mousedown', this.startResize);
	      this.splitter_left.removeEventListener('touchstart', this.startResize);
	      this.splitter_left.removeEventListener('touchmove', this.startResize);
	      this.splitter_left.removeEventListener('touchend', this.startResize);

	      this.splitter_right.removeEventListener('mousedown', this.startResize);
	      this.splitter_right.removeEventListener('touchstart', this.startResize);
	      this.splitter_right.removeEventListener('touchmove', this.startResize);
	      this.splitter_right.removeEventListener('touchend', this.startResize);

	      this.chat = null;
	      this.splitter_left = null;
	      this.splitter_right = null;
	    }
	  },
	  updateUserAvatar: function updateUserAvatar() {
	    var self = this;
	    _users_bus2.default.getMyInfo(null, function (_err, options, userInfo) {
	      self.setState({ userInfo: userInfo });
	    });
	  },
	  getLogMessage: function getLogMessage(chat_id, message) {
	    if (chat_id !== this.state.chat_id && chat_id !== this.state.temp_chat_id) return;
	    this.state.logMessages.push({ text: message.text, type: message.type });
	    this.setState({ logMessages: this.state.logMessages });
	  },
	  startResize: function startResize(event) {
	    event.stopPropagation();
	    event.preventDefault();
	    switch (event.type) {
	      case 'mousedown':
	      case 'touchstart':
	        _event_bus2.default.trigger('transformToResizeState', event, this);
	        break;
	      case 'touchmove':
	      case 'touchend':
	        _event_bus2.default.trigger('redirectResize', event, this);
	        break;
	    }
	  },
	  getChatDescription: function getChatDescription(chatId, _callback) {
	    if (this.state.chat_id === chatId) {
	      this.state.toggleChatUsersFriendship = false;
	      this.state.temp_chat_id = null;
	      if (_callback) {
	        _callback(this.state);
	      }
	    }
	  },
	  handleClick: function handleClick(event) {
	    var element = this.getDataParameter(event.currentTarget, 'action'),
	        self = this,
	        currentOptions = void 0,
	        gto = void 0,
	        po = void 0;
	    if (element) {
	      switch (element.dataset.action) {
	        case 'changeMode':
	          this.changeMode(element);
	          break;
	        case 'changeRTE':
	          currentOptions = this.optionsDefinition(this.state, this.state.bodyOptions.mode);
	          currentOptions = _filter2.default.prototype.changeRTE(element, currentOptions);
	          if (currentOptions.paginationOptions.rtePerPage) {
	            _pagination2.default.prototype.countPagination(currentOptions, null, this.state.bodyOptions.mode, { "chat_id": this.state.chat_id }, function (_newState) {
	              self.setState(_newState);
	            });
	          } else {
	            this.setState(currentOptions);
	          }
	          break;
	        case 'showPerPage':
	          currentOptions = this.optionsDefinition(this.state, this.state.bodyOptions.mode);
	          currentOptions.paginationOptions.currentPage = null;
	          if (currentOptions.paginationOptions.showEnablePagination) {
	            _pagination2.default.prototype.countPagination(currentOptions, null, this.state.bodyOptions.mode, { "chat_id": this.state.chat_id }, function (_newState) {
	              self.setState(_newState);
	            });
	          }
	          break;
	        case 'changeRTE_goTo':
	          currentOptions = this.optionsDefinition(this.state, this.state.bodyOptions.mode);
	          currentOptions = _go_to2.default.prototype.changeRTE(element, currentOptions);
	          if (currentOptions.goToOptions.rteChoicePage) {
	            _pagination2.default.prototype.countPagination(currentOptions, null, this.state.bodyMode, { "chat_id": this.state.chat_id }, function (_newState) {
	              self.setState(_newState);
	            });
	          } else {
	            this.setState(currentOptions);
	          }
	          break;
	        case "switchPage":
	          currentOptions = this.optionsDefinition(this.state, this.state.bodyOptions.mode);
	          gto = currentOptions.goToOptions;
	          po = currentOptions.paginationOptions;
	          if (gto.page) {
	            po.currentPage = gto.page;
	          }
	          _pagination2.default.prototype.countPagination(currentOptions, null, this.state.bodyOptions.mode, { "chat_id": this.state.chat_id }, function (_newState) {
	            self.setState(_newState);
	          });
	          break;
	        case 'closeChat':
	        case 'saveStatesChat':
	        case 'saveAndCloseChat':
	          _event_bus2.default.trigger('toCloseChat', element.dataset.action, this.state.chat_id);
	          break;
	        case "closeRawChat":
	          _event_bus2.default.trigger('toCloseChat', element.dataset.action, null, this.state.temp_chat_id);
	          break;
	        case 'hideTopPart':
	          this.setState({ hideTopPart: !this.state.hideTopPart });
	          break;
	        case 'hideBottomPart':
	          this.setState({ hideBottomPart: !this.state.hideBottomPart });
	          break;
	        case 'synchronizeMessages':
	          this.onSynchronizeMessages();
	          break;
	      }
	    }
	  },
	  handleChange: function handleChange(event) {
	    var element = this.getDataParameter(event.currentTarget, 'action'),
	        self = this,
	        currentOptions = void 0;
	    if (element) {
	      switch (element.dataset.action) {
	        case 'changePerPage':
	          currentOptions = this.optionsDefinition(this.state, this.state.bodyOptions.mode);
	          currentOptions = _filter2.default.prototype.changePerPage(element, currentOptions);
	          if (currentOptions.paginationOptions.show && currentOptions.paginationOptions.rtePerPage) {
	            _pagination2.default.prototype.countPagination(currentOptions, null, this.state.bodyOptions.mode, { "chat_id": this.state.chat_id }, function (_newState) {
	              self.setState(_newState);
	            });
	          } else {
	            this.setState(currentOptions);
	          }
	          break;
	        case 'changePage':
	          currentOptions = this.optionsDefinition(this.state, this.state.bodyOptions.mode);
	          currentOptions = _pagination2.default.prototype.changePage(element, currentOptions);
	          _pagination2.default.prototype.countPagination(currentOptions, null, this.state.bodyOptions.mode, { "chat_id": this.state.chat_id }, function (_newState) {
	            self.setState(_newState);
	          });
	          break;
	      }
	    }
	  },
	  changeMode: function changeMode(element, chat_id) {
	    if (chat_id && chat_id !== this.state.chat_id) return;
	    this.switchModes([{
	      chat_part: element.dataset.chat_part,
	      newMode: element.dataset.mode_to,
	      target: element
	    }]);
	  },
	  switchModes: function switchModes(_array) {
	    var self = this,
	        currentOptions = void 0,
	        po = void 0;
	    _array.forEach(function (_obj) {
	      switch (_obj.chat_part) {
	        case 'body':
	          switch (_obj.newMode) {
	            case _body2.default.prototype.MODE.SETTINGS:
	              self.state.bodyOptions.mode = _body2.default.prototype.MODE.SETTINGS;
	              self.state.editorOptions.show = false;
	              self.setState({ bodyOptions: self.state.bodyOptions, editorOptions: self.state.editorOptions });
	              break;
	            case 'CONTACT_LIST':
	              self.state.bodyOptions.mode = _body2.default.prototype.MODE.CONTACT_LIST;
	              self.state.editorOptions.show = false;
	              self.setState({ bodyOptions: self.state.bodyOptions, editorOptions: self.state.editorOptions });
	              break;
	            case _body2.default.prototype.MODE.MESSAGES:
	              self.state.bodyOptions.mode = _body2.default.prototype.MODE.MESSAGES;
	              self.state.editorOptions.show = true;
	              self.setState({ bodyOptions: self.state.bodyOptions, editorOptions: self.state.editorOptions });
	              break;
	            case _body2.default.prototype.MODE.LOGGER:
	              self.state.bodyOptions.mode = _body2.default.prototype.MODE.LOGGER;
	              self.state.editorOptions.show = false;
	              self.setState({ bodyOptions: self.state.bodyOptions, editorOptions: self.state.editorOptions });
	              break;
	          }
	          break;
	        case 'editor':
	          switch (_obj.newMode) {
	            case _editor2.default.prototype.MODE.MAIN_PANEL:
	              self.state.editorOptions.show = true;
	              self.setState({ editorOptions: self.state.editorOptions });
	              break;
	            case _editor2.default.prototype.MODE.FORMAT_PANEL:
	              self.state.formatOptions.show = !self.state.formatOptions.show;
	              self.setState({ formatOptions: self.state.formatOptions });
	              break;
	          }
	          break;
	        case 'pagination':
	          switch (_obj.newMode) {
	            case _pagination2.default.prototype.MODE.PAGINATION:
	              if (_obj.target) {
	                currentOptions = self.optionsDefinition(self.state, self.state.bodyOptions.mode);
	                po = currentOptions.paginationOptions;
	                po.show = _obj.target.checked;
	                po.showEnablePagination = _obj.target.checked;
	                self.setState(_defineProperty({}, po.text, po));
	                if (po.showEnablePagination) {
	                  _pagination2.default.prototype.countPagination(currentOptions, null, self.state.bodyOptions.mode, { chat_id: self.state.chat_id }, function (_newState) {
	                    self.setState(_newState);
	                  });
	                }
	              }
	              break;
	            case _pagination2.default.prototype.MODE.GO_TO:
	              break;
	          }
	          break;
	        case 'filter':
	          switch (_obj.newMode) {
	            case _filter2.default.prototype.MODE.MESSAGES_FILTER:
	            case _filter2.default.prototype.MODE.CONTACT_LIST_FILTER:
	              currentOptions = self.optionsDefinition(self.state, self.state.bodyOptions.mode);
	              currentOptions.filterOptions.show = !currentOptions.filterOptions.show;
	              self.setState(_defineProperty({}, currentOptions.filterOptions.text, currentOptions.filterOptions));
	              break;
	          }
	          break;
	      }
	    });
	  },
	  onSynchronizeMessages: function onSynchronizeMessages() {
	    var self = this,
	        index = self.state.user_ids.indexOf(_users_bus2.default.getUserId()),
	        messageData = void 0,
	        newState = void 0;
	    if (index !== -1 && self.state.user_ids.length > 1 || index === -1 && self.state.user_ids.length > 0) {
	      messageData = {
	        type: "syncRequestChatMessages",
	        chat_description: {
	          chat_id: self.state.chat_id
	        },
	        owner_request: _users_bus2.default.getUserId()
	      };
	      var active_connections = _webrtc2.default.getChatConnections(_webrtc2.default.connections, self.state.chat_id);
	      if (active_connections.length) {
	        _webrtc2.default.broadcastChatMessage(self.state.chat_id, JSON.stringify(messageData));
	      } else {
	        this.setState({ errorMessage: 121 });
	      }
	    }
	  },
	  onChatMessageRouter: function onChatMessageRouter(messageData) {
	    if (this.state.chat_id && this.state.chat_id !== messageData.chat_description.chat_id || messageData.chat_description && this.state.temp_chat_id !== messageData.chat_description.temp_chat_id) return;
	    switch (messageData.type) {
	      case 'chat_created':
	        this.state.logMessages.push({ text: 'get chatId: ' + messageData.chat_description.chat_id, type: 'information' });
	        this.setState({
	          logMessages: this.state.logMessages,
	          chat_id: messageData.chat_description.chat_id
	        });
	        var index = this.chatsArray.indexOf(this.props.data);
	        this.chatsArray[index].chat_description = this.state;
	        _event_bus2.default.trigger('chatJoinApproved', messageData);
	        break;
	    }
	  },
	  defineSplitterClass: function defineSplitterClass(className) {
	    if (!this.state.settings_ListOptions.adjust_width || this.state.settings_ListOptions.current_data_key !== "custom_size") {
	      className = className + 'hidden';
	    }
	    return className;
	  },
	  onChatToggledReady: function onChatToggledReady(eventData) {
	    this.chat_ready_state = eventData.ready_state;
	  },
	  onChatJoinRequest: function onChatJoinRequest(eventData) {
	    var self = this,
	        newState = void 0;
	    _event_bus2.default.set_ws_device_id(eventData.target_ws_device_id);
	    if (!this.chat_ready_state || !this.amICreator(this.state)) {
	      return;
	    }

	    this.setState({ confirmMessage: eventData.request_body.message, confirmMessageData: eventData });
	  },
	  handleDialogError: function handleDialogError() {
	    this.setState({ errorMessage: null });
	  },
	  handleDialogChatJoinRequest: function handleDialogChatJoinRequest(event) {
	    var element = this.getDataParameter(event.target, 'action');
	    if (element) {
	      switch (element.dataset.action) {
	        case 'confirmCancel':
	          break;
	        case 'confirmOk':
	          var data = this.state.confirmMessageData,
	              self = this;
	          if (!this.isInUsers(this.state, data.from_user_id)) {
	            // add user and save chat with this user
	            this.state.user_ids.push(data.from_user_id);
	            _chats_bus2.default.updateChatField(self.state.chat_id, 'user_ids', self.state.user_ids, function (error) {
	              if (error) return console.error(error);

	              self._listenWebRTCConnection();
	              _webrtc2.default.handleConnectedDevices(data.user_wscs_descrs);
	            });
	          } else {
	            self._listenWebRTCConnection();
	            _webrtc2.default.handleConnectedDevices(data.user_wscs_descrs);
	          }
	          break;
	      }
	    }
	    this.setState({ confirmMessage: null, confirmMessageData: null });
	  },
	  changeState: function changeState(newState) {
	    this.setState(newState);
	  },
	  valueOfChat: function valueOfChat() {
	    var toStringObject = {},
	        self = this;
	    self.valueOfKeys.forEach(function (key) {
	      toStringObject[key] = self.state[key];
	    });
	    return toStringObject;
	  },
	  _webRTCConnectionReady: function _webRTCConnectionReady(eventConnection) {
	    if (eventConnection.hasChatId(this.state.chat_id)) {
	      // if connection for chat join request
	      var messageData = {
	        type: "chatJoinApproved",
	        from_user_id: _users_bus2.default.getUserId(),
	        chat_description: this.valueOfChat()
	      };
	      if (eventConnection.isActive()) {
	        eventConnection.dataChannel.send(JSON.stringify(messageData));
	        this._notListenWebRTCConnection();
	      } else {
	        console.warn('No friendship data channel!');
	      }
	    }
	  },
	  _notListenWebRTCConnection: function _notListenWebRTCConnection() {
	    _webrtc2.default.off('webrtc_connection_established', this._webRTCConnectionReady);
	  },
	  _listenWebRTCConnection: function _listenWebRTCConnection() {
	    this._notListenWebRTCConnection();
	    _webrtc2.default.on('webrtc_connection_established', this._webRTCConnectionReady, this);
	  },
	  onChatMessage: function onChatMessage(eventData) {
	    if (this.state.chat_id !== eventData.chat_description.chat_id) return;
	    var self = this,
	        newState = this.state;
	    this.checkingUserInChat([eventData.message.createdByUserId], this.state.user_ids);
	    _messages3.default.prototype.addRemoteMessage(eventData.message, this.state.bodyOptions.mode, this.state.chat_id, function (err) {
	      if (err) {
	        console.error(err);
	        return;
	      }

	      if (newState.messages_PaginationOptions.showEnablePagination) {
	        newState.messages_PaginationOptions.currentPage = null;
	        _pagination2.default.prototype.countPagination(null, newState, newState.bodyOptions.mode, { "chat_id": newState.chat_id }, function (_newState) {
	          self.setState(_newState);
	        });
	      } else {
	        self.setState({ messages_PaginationOptions: newState.messages_PaginationOptions });
	      }
	    });
	  },
	  workflowSynchronizeMessages: function workflowSynchronizeMessages(messageData) {
	    if (!messageData.messages.length) return;
	    var self = this,
	        newState = this.state,
	        lastMessage = void 0;
	    if (self.syncMessageDataFlag) {
	      self.syncMessageDataArray.push(messageData);
	    } else {
	      self.syncMessageDataFlag = true;
	      _messages3.default.prototype.getAllMessages(self.state.chat_id, self.state.bodyOptions.mode, function (_err, _messages) {
	        if (_err) {
	          self.syncMessageDataFlag = false;
	          return console.error(_err);
	        }

	        var store = {},
	            remoteMessages = [],
	            usersToChecking = [];
	        if (_messages.length) {
	          var _iteratorNormalCompletion = true;
	          var _didIteratorError = false;
	          var _iteratorError = undefined;

	          try {
	            for (var _iterator = _messages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	              var message = _step.value;

	              store[message.messageId] = true;
	            }
	          } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	              }
	            } finally {
	              if (_didIteratorError) {
	                throw _iteratorError;
	              }
	            }
	          }

	          var _iteratorNormalCompletion2 = true;
	          var _didIteratorError2 = false;
	          var _iteratorError2 = undefined;

	          try {
	            for (var _iterator2 = messageData.messages[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	              var _syncMessage = _step2.value;

	              if (!store[_syncMessage.messageId]) {
	                remoteMessages.push(_syncMessage);
	                if (usersToChecking.indexOf(_syncMessage.createdByUserId) === -1) {
	                  usersToChecking.push(_syncMessage.createdByUserId);
	                }
	              }
	            }
	          } catch (err) {
	            _didIteratorError2 = true;
	            _iteratorError2 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                _iterator2.return();
	              }
	            } finally {
	              if (_didIteratorError2) {
	                throw _iteratorError2;
	              }
	            }
	          }

	          lastMessage = _messages[_messages.length - 1];
	        } else {
	          remoteMessages = messageData.messages;
	          lastMessage = null;
	        }
	        var _workflow = function _workflow() {
	          self.syncMessageDataFlag = false;
	          if (self.syncMessageDataArray.length) {
	            var _messageData = self.syncMessageDataArray.shift();
	            self.workflowSynchronizeMessages(_messageData);
	          } else {
	            if (newState.messages_PaginationOptions.showEnablePagination) {
	              newState.messages_PaginationOptions.currentPage = null;
	              _pagination2.default.prototype.countPagination(null, newState, newState.bodyOptions.mode, { "chat_id": newState.chat_id }, function (_newState) {
	                self.setState(_newState);
	              });
	            } else {
	              self.setState({ messages_PaginationOptions: newState.messages_PaginationOptions });
	            }
	          }
	        };
	        if (remoteMessages.length) {
	          self.checkingUserInChat(usersToChecking, self.state.user_ids);
	          remoteMessages = _messages3.default.prototype.addMessageData(lastMessage, remoteMessages, true);
	          _messages3.default.prototype.addAllRemoteMessages(remoteMessages, self.state.bodyOptions.mode, self.state.chat_id, function (_err) {
	            if (_err) return console.error(_err);
	            _workflow();
	          });
	        } else {
	          _workflow();
	        }
	      });
	    }
	  },
	  checkingUserInChat: function checkingUserInChat(usersToChecking, user_ids) {
	    var newUsers = [],
	        self = this;
	    usersToChecking.forEach(function (_user) {
	      if (user_ids.indexOf(_user) === -1) {
	        newUsers.push(_user);
	      }
	    });

	    if (newUsers.length) {
	      (function () {
	        var usersArray = newUsers.concat(user_ids);
	        _chats_bus2.default.updateChatField(self.state.chat_id, 'user_ids', usersArray, function (error) {
	          if (error) return console.error(error);

	          self.setState({ user_ids: usersArray });
	        });
	      })();
	    }
	  },
	  render: function render() {
	    var _this2 = this;

	    var handleEvent = {
	      changeState: this.changeState
	    };
	    var onEvent = {
	      onClick: this.handleClick,
	      onChange: this.handleChange
	    };
	    if (this.props.data.mode === 'raw') {
	      var _ret3 = function () {
	        var items = [],
	            className = void 0;
	        _this2.state.logMessages.forEach(function (_message, index) {
	          className = _message.type === 'error' ? "myMessage message margin-t-b color-red" : "myMessage message margin-t-b";
	          items.push(_react2.default.createElement(
	            'div',
	            { key: index,
	              className: className },
	            _message.text
	          ));
	        });
	        return {
	          v: _react2.default.createElement(
	            'section',
	            { className: 'modal' },
	            _react2.default.createElement(_header2.default, { data: _this2.state, chat_mode: _this2.props.data.mode, handleEvent: handleEvent, events: onEvent }),
	            _react2.default.createElement(
	              'div',
	              { className: 'modal-body overflow-y-scroll' },
	              items
	            )
	          )
	        };
	      }();

	      if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
	    } else {
	      return _react2.default.createElement(
	        'section',
	        { className: 'modal', 'data-chat_id': this.props.data.chat_description.chat_id,
	          style: { width: this.state.settings_ListOptions.size_current } },
	        _react2.default.createElement(_dialogError2.default, { show: this.state.errorMessage, message: this.state.errorMessage,
	          handleClick: this.handleDialogError }),
	        _react2.default.createElement(_dialogConfirm2.default, { show: this.state.confirmMessage, message: this.state.confirmMessage,
	          handleClick: this.handleDialogChatJoinRequest }),
	        _react2.default.createElement('div', { className: this.defineSplitterClass('chat-splitter-item '), 'data-role': 'splitter_item',
	          'data-splitteritem': 'left' }),
	        _react2.default.createElement('div', { className: this.defineSplitterClass('chat-splitter-item right '), 'data-role': 'splitter_item',
	          'data-splitteritem': 'right' }),
	        _react2.default.createElement(
	          'div',
	          { className: this.props.scrollEachChat ? 'w-inh ' : 'p-fx w-inh', style: { 'zIndex': 3 } },
	          _react2.default.createElement(
	            'div',
	            { className: this.state.hideTopPart ? "hide" : "" },
	            _react2.default.createElement(_header2.default, { data: this.state, chat_mode: this.props.data.mode, handleEvent: handleEvent, events: onEvent }),
	            _react2.default.createElement(
	              'div',
	              { 'data-role': 'extra_toolbar_container', className: 'flex-sp-around flex-shrink-0 c-200' },
	              _react2.default.createElement(_extra_toolbar2.default, { mode: this.state.bodyOptions.mode, data: this.state, events: onEvent })
	            ),
	            _react2.default.createElement(
	              'div',
	              { 'data-role': 'filter_container',
	                className: this.state.hideTopPart ? "flex wrap background-pink flex-shrink-0 c-200 hide" : "flex wrap background-pink flex-shrink-0 c-200" },
	              _react2.default.createElement(_filter2.default, { mode: this.state.bodyOptions.mode, data: this.state, handleEvent: handleEvent,
	                events: onEvent })
	            )
	          ),
	          _react2.default.createElement(_toggle_visible_chat_part2.default, { data: this.state, location: this.props.location.TOP, events: onEvent,
	            handleEvent: handleEvent })
	        ),
	        _react2.default.createElement(
	          'div',
	          { 'data-role': 'body_container',
	            className: this.props.scrollEachChat ? "modal-body overflow-y-scroll p-rel" : "modal-body p-rel",
	            'data-param_content': 'message' },
	          _react2.default.createElement(_body2.default, { mode: this.state.bodyOptions.mode, data: this.state, options: this.props.data, events: onEvent,
	            userInfo: null, handleEvent: handleEvent })
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: this.props.scrollEachChat ? 'w-inh' : 'p-fx w-inh', style: { 'zIndex': 4, 'bottom': 0 } },
	          _react2.default.createElement(_toggle_visible_chat_part2.default, { data: this.state, location: this.props.location.BOTTOM, events: onEvent,
	            handleEvent: handleEvent }),
	          _react2.default.createElement(
	            'footer',
	            { className: this.state.hideBottomPart ? "flex-item-auto hide" : "flex-item-auto" },
	            _react2.default.createElement(_editor2.default, { mode: this.state.bodyOptions.mode, data: this.state, events: onEvent, handleEvent: handleEvent }),
	            _react2.default.createElement(
	              'div',
	              { 'data-role': 'go_to_container', className: 'c-200' },
	              _react2.default.createElement(_go_to2.default, { mode: this.state.bodyOptions.mode, data: this.state, events: onEvent })
	            ),
	            _react2.default.createElement(
	              'div',
	              { 'data-role': 'pagination_container', className: 'flex filter_container justContent c-200' },
	              _react2.default.createElement(_pagination2.default, { mode: this.state.bodyOptions.mode, data: this.state, events: onEvent,
	                handleEvent: handleEvent })
	            )
	          )
	        )
	      );
	    }
	  }
	});

	_extend_core2.default.prototype.inherit(Chat, _dom_core2.default);
	_extend_core2.default.prototype.inherit(Chat, _switcher_core2.default);
	_extend_core2.default.prototype.inherit(Chat, _model_core2.default);
	_extend_core2.default.prototype.inherit(Chat, _extend_core2.default);

	exports.default = Chat;

/***/ },

/***/ 337:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _location_wrapper = __webpack_require__(293);

	var _location_wrapper2 = _interopRequireDefault(_location_wrapper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Header = _react2.default.createClass({
	  displayName: 'Header',


	  MODE: {
	    FILTER: 'FILTER',
	    TAB: 'TAB'
	  },

	  MODE_DESCRIPTION: {
	    TAB: 59
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      mainContainer: {
	        "element": "div",
	        "config": {
	          "data": {
	            "role": 'tabs_container'
	          }
	        }
	      },
	      configs: [{
	        "role": "locationWrapper",
	        "classList": "flex-just-center",
	        "location": "topPanel",
	        "data": {
	          "role": "topHeaderPanel"
	        }
	      }, {
	        "element": "button",
	        "icon": "exit_icon",
	        "text": null,
	        "location": "topPanel",
	        "data": {
	          "throw": "true",
	          "target": "event_bus",
	          "action": "closeChat",
	          "description": 21
	        },
	        "class": "button-margin-height min-width-4em",
	        "name": "CloseChat"
	      }, {
	        "element": "button",
	        "icon": "save_not_exit_icon",
	        "text": null,
	        "location": "topPanel",
	        "data": {
	          "throw": "true",
	          "target": "event_bus",
	          "action": "saveStatesChat",
	          "description": 78
	        },
	        "class": "button-margin-height min-width-4em",
	        "name": "SaveCloseChat"
	      }, {
	        "element": "button",
	        "icon": "save_exit_icon",
	        "text": null,
	        "location": "topPanel",
	        "data": {
	          "throw": "true",
	          "target": "event_bus",
	          "action": "saveAndCloseChat",
	          "description": 57
	        },
	        "class": "button-margin-height min-width-4em",
	        "name": "SaveCloseChat"
	      }, {
	        "role": "locationWrapper",
	        "classList": "",
	        "location": "description",
	        "data": {
	          "role": "header_description"
	        }
	      }, {
	        "element": "label",
	        "text": "",
	        "class": "",
	        "location": "description",
	        "data": {
	          "role": "labelUserPassword"
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "flex",
	        "location": "bottomPanel",
	        "data": {
	          "role": "btnHeaderPanel"
	        }
	      }, {
	        "element": "button",
	        "icon": "messages_icon",
	        "text": 61,
	        "location": "bottomPanel",
	        "data": {
	          "throw": "true",
	          "chat_part": "body",
	          "mode_to": "MESSAGES",
	          "action": "changeMode",
	          "role": "btnHeader",
	          "toggle_reset_header": false,
	          "description": 62
	        },
	        "class": "flex-item-1-0p",
	        "name": "Messages"
	      }, {
	        "element": "button",
	        "icon": "users_icon",
	        "text": 24,
	        "location": "bottomPanel",
	        "data": {
	          "throw": "true",
	          "mode_to": "CONTACT_LIST",
	          "chat_part": "body",
	          "action": "changeMode",
	          "role": "btnHeader",
	          "toggle_reset_header": true,
	          "description": 25
	        },
	        "class": "flex-item-1-0p",
	        "name": "ContactList"
	      }, {
	        "element": "button",
	        "icon": "settings_chat_icon",
	        "text": 22,
	        "location": "bottomPanel",
	        "data": {
	          "throw": "true",
	          "chat_part": "body",
	          "mode_to": "SETTINGS",
	          "action": "changeMode",
	          "role": "btnHeader",
	          "toggle_reset_header": true,
	          "description": 23
	        },
	        "class": "flex-item-1-0p",
	        "name": "Setting"
	      }],
	      configs_raw_chat: [{
	        "role": "locationWrapper",
	        "classList": "flex-just-center",
	        "location": "topPanel",
	        "data": {
	          "role": "topHeaderPanel"
	        }
	      }, {
	        "element": "button",
	        "icon": "exit_icon",
	        "text": null,
	        "location": "topPanel",
	        "data": {
	          "throw": "true",
	          "target": "event_bus",
	          "action": "closeRawChat",
	          "description": 21
	        },
	        "class": "button-margin-height min-width-4em",
	        "name": "CloseChat"
	      }]
	    };
	  },
	  defineOptions: function defineOptions(chat_mode) {
	    if (chat_mode !== "ready") return;
	    if (this.props.data.headerOptions.show) {
	      var options = {},
	          newState = this.props.data;
	      switch (this.props.data.headerOptions.mode) {
	        case this.MODE.TAB:
	          this.previousMode = this.MODE.TAB;
	          options.description = this.MODE_DESCRIPTION[this.MODE.TAB];
	          if (this.previousMode !== this.MODE.TAB) {
	            newState.headerOptions.mode = this.MODE.TAB;
	            this.props.handleEvent.changeState({ headerOptions: newState.headerOptions });
	          }
	          break;
	      }
	      return options;
	    }
	  },
	  defineConfig: function defineConfig(chat_mode) {
	    var config = void 0;
	    switch (chat_mode) {
	      case "raw":
	        return config = this.props.configs_raw_chat;
	        break;
	      case "ready":
	        return config = this.props.configs;
	        break;
	    }
	  },
	  render: function render() {
	    var options = this.defineOptions(this.props.chat_mode),
	        config = this.defineConfig(this.props.chat_mode);
	    return _react2.default.createElement(
	      'header',
	      { 'data-role': 'header_container', className: 'modal-header' },
	      _react2.default.createElement(_location_wrapper2.default, { events: this.props.events, data: options, mainContainer: this.props.mainContainer,
	        configs: config, mode: this.props.data.bodyOptions.mode })
	    );
	  }
	});

	exports.default = Header;

/***/ },

/***/ 338:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(45);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _dom_core = __webpack_require__(303);

	var _dom_core2 = _interopRequireDefault(_dom_core);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	var _messages = __webpack_require__(323);

	var _messages2 = _interopRequireDefault(_messages);

	var _location_wrapper = __webpack_require__(293);

	var _location_wrapper2 = _interopRequireDefault(_location_wrapper);

	var _format_panel = __webpack_require__(339);

	var _format_panel2 = _interopRequireDefault(_format_panel);

	var _pagination = __webpack_require__(332);

	var _pagination2 = _interopRequireDefault(_pagination);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var Editor = _react2.default.createClass({
	  displayName: 'Editor',


	  MODE: {
	    "MAIN_PANEL": 'MAIN_PANEL',
	    "FORMAT_PANEL": 'FORMAT_PANEL'
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      mainContainer: {
	        "element": "div",
	        "config": {
	          "class": "modal-main-btn"
	        }
	      },
	      configs: [{
	        "element": "button",
	        "icon": "send_icon",
	        "text": "",
	        "class": "button-small-not-padding",
	        "data": {
	          "throw": "true",
	          "action": "sendMessage",
	          "mode_to": "",
	          "chat_part": "",
	          "description": 17
	        },
	        "name": "",
	        "for": "",
	        "service_id": "",
	        "sort": 2,
	        "redraw_mode": ""
	      }, {
	        "element": "button",
	        "icon": "change_message_icon",
	        "text": "",
	        "class": "button-small-not-padding",
	        "data": {
	          "throw": "true",
	          "action": "changeMode",
	          "mode_to": "FORMAT_PANEL",
	          "chat_part": "editor",
	          "toggle": true,
	          "description": 15
	        },
	        "name": "",
	        "for": "",
	        "service_id": "",
	        "sort": 1,
	        "redraw_mode": ""
	      }]
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    this.__keyInnerHtml = Date.now();
	  },
	  componentDidMount: function componentDidMount() {
	    this.editorContainer = _reactDom2.default.findDOMNode(this);
	    if (this.editorContainer) {
	      this.messageInnerContainer = this.editorContainer.querySelector('[data-role="message_inner_container"]');
	    }
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    this.messageInnerContainer = null;
	  },
	  handleClick: function handleClick(event) {
	    var element = this.getDataParameter(event.currentTarget, 'action');
	    if (element) {
	      switch (element.dataset.action) {
	        case 'addEdit':
	          this.addEdit(element);
	          break;
	        case 'changeEdit':
	          this.changeEdit();
	          break;
	        case 'changeMode':
	          _event_bus2.default.trigger('changeMode', element, this.props.data.chat_id);
	          break;
	        case 'sendMessage':
	          this.sendMessage();
	          break;
	      }
	    }
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    this.editorContainer = _reactDom2.default.findDOMNode(this);
	    if (this.editorContainer) {
	      this.messageInnerContainer = this.editorContainer.querySelector('[data-role="message_inner_container"]');
	      this.messageInnerContainer.addEventListener('keypress', this.sendEnter);
	    }
	  },
	  workflowInnerHtml: function workflowInnerHtml(save) {
	    this.__keyInnerHtml = Date.now();
	    save && this.messageInnerContainer ? this.__innerHtml = this.messageInnerContainer.innerHTML : this.__innerHtml = "";
	  },
	  handleChange: function handleChange() {},
	  sendEnter: function sendEnter(event) {
	    if (event.keyCode === 13 && !event.shiftKey) {
	      if (this.props.data.formatOptions.sendEnter) {
	        this.sendMessage();
	      }
	    }
	  },
	  sendMessage: function sendMessage() {
	    var self = this,
	        newState = this.props.data;
	    if (!this.messageInnerContainer) {
	      return;
	    }

	    var pattern = /[^\s{0,}$|^$]/,
	        // empty message or \n only
	    message = this.messageInnerContainer.innerHTML;
	    if (pattern.test(message)) {
	      _messages2.default.prototype.addMessage(this.props.data.bodyOptions.mode, message, this.props.data.chat_id, this.props.data.userInfo.lastModifyDatetime, function (err) {
	        if (err) {
	          console.error(err);
	          return;
	        }

	        self.workflowInnerHtml();
	        if (newState.messages_PaginationOptions.showEnablePagination) {
	          newState.messages_PaginationOptions.currentPage = null;
	          _pagination2.default.prototype.countPagination(null, newState, newState.bodyOptions.mode, { "chat_id": newState.chat_id }, function (_newState) {
	            self.props.handleEvent.changeState(_newState);
	          });
	        } else {
	          self.props.handleEvent.changeState({ messages_PaginationOptions: newState.messages_PaginationOptions });
	        }
	      });
	    }
	  },
	  addEdit: function addEdit(element) {
	    var self = this,
	        command = element.dataset.name,
	        param = element.dataset.param;
	    self.messageInnerContainer.focus();
	    if (param) {
	      document.execCommand(command, false, "red");
	    } else {
	      document.execCommand(command, false, null);
	    }
	  },
	  changeEdit: function changeEdit() {
	    var newState = this.props.data;
	    if (this.messageInnerContainer.classList.contains("onScroll")) {
	      this.messageInnerContainer.classList.remove("onScroll");
	      newState.formatOptions.offScroll = false;
	      this.props.handleEvent.changeState({ formatOptions: newState.formatOptions });
	    } else {
	      this.messageInnerContainer.classList.add("onScroll");
	      newState.formatOptions.offScroll = true;
	      this.props.handleEvent.changeState({ formatOptions: newState.formatOptions });
	    }
	  },
	  render: function render() {
	    var onEvent = {
	      onClick: this.handleClick,
	      onChange: this.handleChange
	    };
	    if (this.props.data.editorOptions.show) {
	      var classMesContainer = this.props.data.formatOptions.offScroll ? 'container onScroll' : 'container';
	      return _react2.default.createElement(
	        'div',
	        { 'data-role': 'editor_container', className: 'c-200' },
	        _react2.default.createElement(
	          'div',
	          { className: 'flex' },
	          _react2.default.createElement(
	            'div',
	            { 'data-role': 'message_container', className: 'modal-controls message_container' },
	            _react2.default.createElement('div', { 'data-role': 'message_inner_container', className: classMesContainer, contentEditable: 'true',
	              dangerouslySetInnerHTML: { __html: this.__innerHtml }, key: this.__keyInnerHtml })
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'flex-wrap width-40px align-c', 'data-role': 'controls_container' },
	            _react2.default.createElement(_location_wrapper2.default, _defineProperty({ events: this.props.events, mainContainer: this.props.mainContainer,
	              configs: this.props.configs }, 'events', onEvent))
	          )
	        ),
	        _react2.default.createElement(_format_panel2.default, { data: this.props.data, events: onEvent })
	      );
	    } else {
	      this.workflowInnerHtml(true);
	      return null;
	    }
	  }
	});

	_extend_core2.default.prototype.inherit(Editor, _dom_core2.default);

	exports.default = Editor;

/***/ },

/***/ 339:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _location_wrapper = __webpack_require__(293);

	var _location_wrapper2 = _interopRequireDefault(_location_wrapper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var FormatPanel = _react2.default.createClass({
	  displayName: 'FormatPanel',
	  getDefaultProps: function getDefaultProps() {
	    return {
	      mainContainer: {
	        "element": "div",
	        "config": {
	          "class": "btnEditPanel flex-align-c ",
	          "data": {
	            "role": 'btnEditPanel'
	          }
	        }
	      },
	      configs: [{
	        "role": "locationWrapper",
	        "classList": "w-100p",
	        "location": "btn_format"
	      }, {
	        "element": "button",
	        "icon": "aling_left_icon",
	        "text": "",
	        "class": "button-margin",
	        "location": "btn_format",
	        "data": {
	          "role": "btnEdit",
	          "action": "addEdit",
	          "name": "JustifyLeft"
	        }
	      }, {
	        "element": "button",
	        "icon": "aling_center_icon",
	        "text": "",
	        "class": "button-margin",
	        "location": "btn_format",
	        "data": {
	          "role": "btnEdit",
	          "action": "addEdit",
	          "name": "JustifyCenter"
	        }
	      }, {
	        "element": "button",
	        "icon": "aling_right_icon",
	        "text": "",
	        "class": "button-margin",
	        "location": "btn_format",
	        "data": {
	          "role": "btnEdit",
	          "action": "addEdit",
	          "name": "JustifyRight"
	        }
	      }, {
	        "element": "button",
	        "icon": "bold_icon",
	        "text": "",
	        "class": "button-margin",
	        "location": "btn_format",
	        "data": {
	          "role": "btnEdit",
	          "action": "addEdit",
	          "name": "Bold"
	        }
	      }, {
	        "element": "button",
	        "icon": "italic_icon",
	        "text": "",
	        "class": "button-margin",
	        "location": "btn_format",
	        "data": {
	          "role": "btnEdit",
	          "action": "addEdit",
	          "name": "Italic"
	        }
	      }, {
	        "element": "button",
	        "icon": "color_text_icon",
	        "text": "",
	        "class": "button-margin",
	        "location": "btn_format",
	        "data": {
	          "role": "btnEdit",
	          "name": "ForeColor",
	          "action": "addEdit",
	          "param": true
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p flex-item flex-align-c flex-item-auto",
	        "location": "toggle_scroll"
	      }, {
	        "element": "input",
	        "type": "checkbox",
	        "text": 12,
	        "class": "check-box-size",
	        "location": "toggle_scroll",
	        "data": {
	          "key": "offScroll",
	          "role": "btnEdit",
	          "action": "changeEdit",
	          "name": "ControlScrollMessage"
	        }
	      }]
	    };
	  },
	  render: function render() {
	    if (this.props.data.formatOptions.show) {
	      return _react2.default.createElement(_location_wrapper2.default, { events: this.props.events, mainContainer: this.props.mainContainer,
	        data: this.props.data.formatOptions, configs: this.props.configs });
	    } else {
	      return _react2.default.createElement('div', { 'data-role': 'btnEditPanel', className: 'btnEditPanel flex-align-c' });
	    }
	  }
	});

	exports.default = FormatPanel;

/***/ },

/***/ 340:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(45);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _dom_core = __webpack_require__(303);

	var _dom_core2 = _interopRequireDefault(_dom_core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ToggleVisibleChatPart = _react2.default.createClass({
	  displayName: 'ToggleVisibleChatPart',
	  getDefaultProps: function getDefaultProps() {
	    return {
	      min_move: 5,
	      padding: 4
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      position_btn: 0,
	      resizeMouseDown: false,
	      btnWidth: null
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    if (this.props.location === 'TOP') {
	      this.setState({ left: this.props.data.toggleTopButtonLeft });
	    } else if (this.props.location === 'BOTTOM') {
	      this.setState({ left: this.props.data.toggleBottomButtonLeft });
	    }
	  },
	  componentDidMount: function componentDidMount() {
	    this.toggle_container = _reactDom2.default.findDOMNode(this);
	    this.toggleButton = this.toggle_container.querySelector('[data-role="toggleButton"]');
	    _event_bus2.default.on('onMouseUp', this.handleResize, this);
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    _event_bus2.default.off('onMouseUp', this.handleResize, this);
	  },
	  startResize: function startResize(event) {
	    switch (event.type) {
	      case 'mousedown':
	      case 'touchstart':
	        this.transformToResizeState(event);
	        break;
	      case 'touchmove':
	      case 'touchend':
	        this.handleResize(event);
	        break;
	    }
	  },
	  transformToResizeState: function transformToResizeState(event) {
	    var toggle_btn = void 0;
	    if (event.type === 'touchstart' && event.changedTouches) {
	      toggle_btn = event.changedTouches[0].clientX + 'px';
	    } else {
	      toggle_btn = event.clientX + 'px';
	    }
	    this.setState({
	      resizeMouseDown: true,
	      position_btn: toggle_btn,
	      btnWidth: this.toggleButton.clientWidth
	    });
	  },
	  handleResize: function handleResize(event) {
	    switch (event.type) {
	      case 'mousemove':
	      case 'touchmove':
	        if (this.state.resizeMouseDown) {
	          var clientX = event.clientX,
	              toggle_btn = void 0,
	              size_container = parseInt(this.props.data.settings_ListOptions.size_current, 10);
	          if (event.type === 'touchmove' && event.changedTouches) {
	            clientX = event.changedTouches[0].clientX;
	          }
	          if (!this.resizeClientX_absolue) {
	            this.resizeClientX_absolue = clientX;
	          }
	          if (!this.resizeClientX) {
	            this.resizeClientX = clientX;
	          } else {
	            var deltaX = clientX - this.resizeClientX;
	            this.absoluteDeltaX = this.resizeClientX_absolue - clientX;
	            if (Math.abs(this.absoluteDeltaX - deltaX) > this.props.min_move) {
	              this.redraw_toggle_btn = true;
	              this.backlight = true;
	              if (deltaX < 0 && this.toggleButton.offsetLeft + deltaX >= 0 || deltaX > 0 && this.toggleButton.offsetLeft + this.state.btnWidth + this.props.padding < size_container) {
	                this.resizeClientX = clientX;
	                this.left = this.toggleButton.offsetLeft + deltaX + 'px';
	              }
	              if (parseInt(this.left) + this.state.btnWidth >= size_container) {
	                this.left = size_container - this.state.btnWidth - this.props.padding + 'px';
	              }
	              this.setState({ left: this.left });
	            }
	          }
	        }
	        break;
	      case 'mouseup':
	      case 'touchend':
	        if (this.state.resizeMouseDown) {
	          if (event.type === 'touchend') {
	            this.redraw_toggle_btn = false;
	          }
	          this.setState({
	            resizeMouseDown: false,
	            position_btn: 0,
	            positionSplitterItem: '',
	            btnWidth: null,
	            left: this.left
	          });
	          if (this.props.location === 'TOP') {
	            this.props.handleEvent.changeState({ toggleTopButtonLeft: this.left });
	          } else if (this.props.location === 'BOTTOM') {
	            this.props.handleEvent.changeState({ toggleBottomButtonLeft: this.left });
	          }
	          delete this.resizeClientX;
	          delete this.resizeClientX_absolue;
	          delete this.backlight;
	          break;
	        }
	    }
	  },
	  handleClick: function handleClick(event) {
	    if (this.redraw_toggle_btn) {
	      event.stopPropagation();
	      event.preventDefault();
	      this.redraw_toggle_btn = false;
	    } else {
	      this.props.events.onClick(event);
	    }
	  },
	  defineClassName: function defineClassName(bodyMode, location) {
	    var className = "p-abs w-100p ";
	    if (location === "BOTTOM" && bodyMode === 'SETTINGS') {
	      className = className + 'hide';
	    } else {
	      if (this.backlight) {
	        className = className + 'toggle-visible ';
	      }
	      if (!this.props.data.headerFooterControl) {
	        className = className + 'hide';
	      }
	    }

	    return className;
	  },
	  render: function render() {
	    var location = this.props.location,
	        bodyMode = this.props.data.bodyOptions.mode;
	    if (location === 'TOP') {
	      return _react2.default.createElement(
	        'div',
	        { className: this.defineClassName(bodyMode, location),
	          style: { 'zIndex': 5 }, 'data-role': 'toggleContainer',
	          onMouseUp: this.handleResize, onMouseMove: this.handleResize,
	          onTouchEnd: this.handleResize, onTouchMove: this.handleResize },
	        _react2.default.createElement(
	          'button',
	          { 'data-role': 'toggleButton', 'data-action': 'hideTopPart', style: { 'left': this.state.left },
	            onClick: this.handleClick,
	            onMouseDown: this.startResize,
	            onTouchEnd: this.startResize,
	            onTouchMove: this.startResize,
	            onTouchStart: this.startResize },
	          '/\\'
	        )
	      );
	    } else if (location === 'BOTTOM') {
	      return _react2.default.createElement(
	        'div',
	        { className: this.defineClassName(bodyMode, location),
	          'data-role': 'toggleContainer',
	          onMouseUp: this.handleResize, onMouseMove: this.handleResize,
	          onTouchEnd: this.handleResize, onTouchMove: this.handleResize },
	        _react2.default.createElement(
	          'div',
	          { className: this.defineClassName(bodyMode, location),
	            style: { 'bottom': 0 } },
	          _react2.default.createElement(
	            'button',
	            { 'data-role': 'toggleButton', 'data-action': 'hideBottomPart', style: { 'left': this.state.left },
	              onClick: this.handleClick,
	              onMouseDown: this.startResize,
	              onTouchEnd: this.startResize,
	              onTouchMove: this.startResize,
	              onTouchStart: this.startResize },
	            '\\/'
	          )
	        )
	      );
	    }
	  }
	});

	_extend_core2.default.prototype.inherit(ToggleVisibleChatPart, _dom_core2.default);

	exports.default = ToggleVisibleChatPart;

/***/ },

/***/ 341:
/***/ function(module, exports) {

	'use strict';

	var ID_Generator = function ID_Generator() {};

	ID_Generator.prototype = {

	  _s4: function _s4() {
	    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	  },

	  _get5Digits: function _get5Digits(digitsArray) {
	    var _5d = [];
	    var digit = digitsArray.pop();
	    while (_5d.length < 4) {
	      if (digit) {
	        _5d.unshift(digit);
	      } else {
	        _5d.unshift(0);
	      }
	      if (_5d.length < 4 && digit) {
	        digit = digitsArray.pop();
	      }
	    }
	    if (digitsArray.length) {
	      return [_5d.join('')].concat(this._get5Digits(digitsArray));
	    } else {
	      return [_5d.join('')];
	    }
	  },

	  _s4Date: function _s4Date() {
	    var D = Date.now();
	    return this._get5Digits(D.toString().split('')).reverse();
	  },

	  generateId: function generateId() {
	    return this._s4Date().concat([this._s4(), this._s4(), this._s4(), this._s4(), this._s4(), this._s4(), this._s4(), this._s4()]).join('-');
	  }
	};

	module.exports = new ID_Generator();

/***/ },

/***/ 342:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(45);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _event_bus = __webpack_require__(287);

	var _event_bus2 = _interopRequireDefault(_event_bus);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _dom_core = __webpack_require__(303);

	var _dom_core2 = _interopRequireDefault(_dom_core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ChatResize = _react2.default.createClass({
	  displayName: 'ChatResize',
	  getDefaultProps: function getDefaultProps() {
	    return {
	      min_chats_width: 350,
	      min_move: 5
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      visible_resize_container: false,
	      left_position_line_resize: 0,
	      resizeMouseDown: false,
	      positionSplitterItem: '',
	      splitterWidth: null,
	      offsetLeft_splitter_left: null,
	      offsetLeft_splitter_right: null,
	      chatResizeWidth: null,
	      chatResize: null
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    this.chat_resize_container = _reactDom2.default.findDOMNode(this);
	    this.line_resize = this.chat_resize_container.querySelector('[data-role="resize_line"]');
	    _event_bus2.default.on('transformToResizeState', this.transformToResizeState, this);
	    _event_bus2.default.on('redirectResize', this.handleResize, this);
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    _event_bus2.default.off('transformToResizeState', this.transformToResizeState);
	    _event_bus2.default.off('redirectResize', this.handleResize);
	  },
	  transformToResizeState: function transformToResizeState(event, _chat) {
	    var left_line_resize = void 0;
	    if (event.type === 'touchstart' && event.changedTouches) {
	      left_line_resize = event.changedTouches[0].clientX + 'px';
	    } else {
	      left_line_resize = event.clientX + 'px';
	    }
	    this.setState({
	      visible_resize_container: true,
	      resizeMouseDown: true,
	      left_position_line_resize: left_line_resize,
	      positionSplitterItem: event.currentTarget.dataset.splitteritem,
	      splitterWidth: _chat.splitter_left.clientWidth,
	      offsetLeft_splitter_left: this.getOffset(_chat.splitter_left).offsetLeft,
	      offsetLeft_splitter_right: this.getOffset(_chat.splitter_right).offsetLeft,
	      chatResizeWidth: _chat.chat.clientWidth,
	      chatResize: _chat
	    });
	  },
	  handleResize: function handleResize(event) {
	    switch (event.type) {
	      case 'mousemove':
	      case 'touchmove':
	        if (this.state.resizeMouseDown) {
	          var clientX = event.clientX,
	              left_line_resize = void 0;
	          if (event.type === 'touchmove' && event.changedTouches) {
	            clientX = event.changedTouches[0].clientX;
	          }
	          if (!this.resizeClientX_absolue) {
	            this.resizeClientX_absolue = clientX;
	          }
	          if (!this.resizeClientX) {
	            this.resizeClientX = clientX;
	          } else {
	            var deltaX = clientX - this.resizeClientX;
	            this.absoluteDeltaX = this.resizeClientX_absolue - clientX;
	            this.redraw_chat = false;
	            if (Math.abs(this.absoluteDeltaX - deltaX) > this.props.min_move) {
	              this.redraw_chat = true;
	              if (this.state.positionSplitterItem === 'left' && this.state.offsetLeft_splitter_right - clientX + this.state.splitterWidth > this.props.min_chats_width || this.state.positionSplitterItem === 'right' && clientX - this.state.offsetLeft_splitter_left > this.props.min_chats_width) {
	                left_line_resize = this.line_resize.offsetLeft + deltaX + 'px';
	                this.resizeClientX = clientX;
	              } else {
	                if (this.state.positionSplitterItem === 'left') {
	                  left_line_resize = this.state.offsetLeft_splitter_right - this.props.min_chats_width + this.state.splitterWidth + 'px';
	                }
	                if (this.state.positionSplitterItem === 'right') {
	                  left_line_resize = this.state.offsetLeft_splitter_left + this.props.min_chats_width + 'px';
	                }
	                this.resizeClientX = clientX;
	              }
	              this.setState({ left_position_line_resize: left_line_resize });
	            }
	          }
	        }
	        break;
	      case 'mouseup':
	      case 'touchend':
	        if (this.redraw_chat) {
	          if (this.state.positionSplitterItem === 'left') {
	            if (this.state.chatResizeWidth + this.absoluteDeltaX >= this.props.min_chats_width) {
	              this.state.chatResize.state.settings_ListOptions.size_current = this.state.chatResizeWidth + this.absoluteDeltaX + 'px';
	            } else {
	              this.state.chatResize.state.settings_ListOptions.size_current = this.props.min_chats_width + 'px';
	            }
	          }
	          if (this.state.positionSplitterItem === 'right') {
	            if (this.state.chatResizeWidth - this.absoluteDeltaX >= this.props.min_chats_width) {
	              this.state.chatResize.state.settings_ListOptions.size_current = this.state.chatResizeWidth - this.absoluteDeltaX + 'px';
	            } else {
	              this.state.chatResize.state.settings_ListOptions.size_current = this.props.min_chats_width + 'px';
	            }
	          }
	          this.state.chatResize.state.settings_ListOptions.size_custom_value = this.state.chatResize.state.settings_ListOptions.size_current;
	          this.state.chatResize.changeState({
	            settings_ListOptions: this.state.chatResize.state.settings_ListOptions
	          });
	        }

	        this.setState({
	          resizeMouseDown: false,
	          visible_resize_container: false,
	          left_position_line_resize: 0,
	          positionSplitterItem: '',
	          splitterWidth: null,
	          offsetLeft_splitter_left: null,
	          offsetLeft_splitter_right: null,
	          chatResizeWidth: null,
	          chatResize: null
	        });

	        delete this.resizeClientX;
	        delete this.resizeClientX_absolue;
	        delete this.redraw_chat;
	    }
	  },
	  defineClass: function defineClass(className) {
	    if (this.state.visible_resize_container) {
	      className = className + " draggable";
	    }

	    return className;
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      'div',
	      { 'data-role': 'chat_resize_container',
	        className: this.defineClass("clear chat-resize-container "),
	        onMouseUp: this.handleResize, onMouseMove: this.handleResize,
	        onTouchEnd: this.handleResize, onTouchMove: this.handleResize },
	      _react2.default.createElement('div', { className: 'line', style: { left: this.state.left_position_line_resize },
	        'data-role': 'resize_line' })
	    );
	  }
	});
	_extend_core2.default.prototype.inherit(ChatResize, _dom_core2.default);

	exports.default = ChatResize;

/***/ },

/***/ 343:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(12);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(219);

	var _location_wrapper = __webpack_require__(293);

	var _location_wrapper2 = _interopRequireDefault(_location_wrapper);

	var _dialogError = __webpack_require__(304);

	var _dialogError2 = _interopRequireDefault(_dialogError);

	var _dialogSuccess = __webpack_require__(331);

	var _dialogSuccess2 = _interopRequireDefault(_dialogSuccess);

	var _description = __webpack_require__(302);

	var _description2 = _interopRequireDefault(_description);

	var _ajax_core = __webpack_require__(335);

	var _ajax_core2 = _interopRequireDefault(_ajax_core);

	var _extend_core = __webpack_require__(283);

	var _extend_core2 = _interopRequireDefault(_extend_core);

	var _id_core = __webpack_require__(291);

	var _id_core2 = _interopRequireDefault(_id_core);

	var _users_bus = __webpack_require__(282);

	var _users_bus2 = _interopRequireDefault(_users_bus);

	var _localization = __webpack_require__(280);

	var _localization2 = _interopRequireDefault(_localization);

	var _overlay_core = __webpack_require__(306);

	var _overlay_core2 = _interopRequireDefault(_overlay_core);

	var _jdenticon = __webpack_require__(330);

	var _jdenticon2 = _interopRequireDefault(_jdenticon);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Register = _react2.default.createClass({
	  displayName: 'Register',
	  getDefaultProps: function getDefaultProps() {
	    return {
	      mainContainer: {
	        "element": "div",
	        "config": {
	          "class": "flex-inner-container"
	        }
	      },
	      configs: [{
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-just-center",
	        "location": "language"
	      }, {
	        "element": "label",
	        "text": 100,
	        "class": "p-r-l-1em",
	        "location": "language",
	        "data": {
	          "role": "labelLanguage"
	        }
	      }, {
	        "element": "select",
	        "location": "language",
	        "select_options": [{
	          "text": "English",
	          "value": "en"
	        }, {
	          "text": "Русский",
	          "value": "ru"
	        }],
	        "data": {
	          "action": "changeLanguage",
	          "role": "selectLanguage"
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-around",
	        "location": "loginButton"
	      }, {
	        "element": "button",
	        "type": "button",
	        "text": 52,
	        "location": "loginButton",
	        "link": "/login",
	        "data": {
	          "action": "redirectToLogin",
	          "role": "loginButton"
	        },
	        "class": "button-inset"
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-around",
	        "location": "userName"
	      }, {
	        "element": "label",
	        "text": 49,
	        "class": "flex-item-w50p",
	        "location": "userName",
	        "data": {
	          "role": "labelUserName"
	        }
	      }, {
	        "element": "input",
	        "type": "text",
	        "class": "flex-item-w50p",
	        "autoComplete": "off",
	        "location": "userName",
	        "name": "userName",
	        "data": {
	          "key": "userName"
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-between",
	        "location": "userPassword"
	      }, {
	        "element": "label",
	        "text": 50,
	        "class": "flex-item-w50p",
	        "location": "userPassword",
	        "data": {
	          "role": "labelUserPassword"
	        }
	      }, {
	        "element": "input",
	        "type": "password",
	        "class": "flex-item-w50p",
	        "autoComplete": "off",
	        "location": "userPassword",
	        "name": "userPassword",
	        "data": {
	          "key": "userPassword"
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-between",
	        "location": "userPasswordConfirm"
	      }, {
	        "element": "label",
	        "text": 41,
	        "class": "flex-item-w50p",
	        "location": "userPasswordConfirm",
	        "data": {
	          "role": "labelConfirmUserPassword"
	        }
	      }, {
	        "element": "input",
	        "type": "password",
	        "class": "flex-item-w50p",
	        "autoComplete": "off",
	        "location": "userPasswordConfirm",
	        "name": "userPasswordConfirm",
	        "data": {
	          "key": "userPasswordConfirm"
	        }
	      }, {
	        "role": "locationWrapper",
	        "classList": "w-100p p-t-b flex-sp-around",
	        "location": "registerButton"
	      }, {
	        "element": "button",
	        "type": "submit",
	        "text": 53,
	        "location": "registerButton",
	        "data": {
	          "description": 55,
	          "action": "register",
	          "role": "registerButton"
	        },
	        "class": "button-inset"
	      }]
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      errorMessage: null,
	      successMessage: null
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    this.registerForm = document.querySelector('[data-role="registerForm"]');
	    this.toggleWaiter();
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    this.registerForm = null;
	  },
	  handleClick: function handleClick() {},
	  handleDialogError: function handleDialogError() {
	    this.setState({ errorMessage: null });
	  },
	  handleDialogRegisterUser: function handleDialogRegisterUser() {
	    _reactRouter.browserHistory.push(this.props.location.search.slice(1));
	    this.setState({ successMessage: null });
	  },
	  handleChange: function handleChange(event) {
	    switch (event.target.dataset.action) {
	      case "changeLanguage":
	        _localization2.default.changeLanguage(event.target.value, this);
	        break;
	    }
	  },
	  handleSubmit: function handleSubmit(event) {
	    event.preventDefault();
	    var self = this,
	        userName = this.registerForm.elements.userName.value,
	        userPassword = this.registerForm.elements.userPassword.value,
	        userPasswordConfirm = this.registerForm.elements.userPasswordConfirm.value;
	    if (userName && userPassword && userPasswordConfirm) {
	      if (userPassword === userPasswordConfirm) {
	        this.toggleWaiter(true);
	        this.registerNewUser({
	          userName: userName,
	          userPassword: userPassword
	        }, function (regErr, account) {
	          self.toggleWaiter();
	          if (regErr) {
	            self.setState({ errorMessage: regErr });
	            return;
	          }
	          _users_bus2.default.setUserId(account.user_id);
	          self.setState({ successMessage: 96 });
	        });
	      } else {
	        self.setState({ errorMessage: 91 });
	      }
	    } else {
	      self.setState({ errorMessage: 88 });
	    }
	  },
	  registerNewUser: function registerNewUser(options, callback) {
	    this.get_JSON_res('/api/uuid', function (err, res) {
	      if (err) {
	        callback(err);
	        return;
	      }

	      _jdenticon2.default.jdenticon(res.uuid, function (avatar_data) {
	        _users_bus2.default.storeNewUser(res.uuid, options.userName, options.userPassword, avatar_data, Date.now(), function (err, account) {
	          if (err) {
	            callback(err);
	            return;
	          }

	          // successful register
	          callback(null, account);
	        });
	      });
	    });
	  },
	  handleEvents: function handleEvents(event) {
	    this.descriptionContext.showDescription(event);
	  },
	  render: function render() {
	    var _this = this;

	    var onEvent = {
	      onClick: this.handleClick,
	      onChange: this.handleChange
	    };
	    //https://www.zigpress.com/2014/11/22/stop-chrome-messing-forms/
	    return _react2.default.createElement(
	      'div',
	      { onMouseDown: this.handleEvents,
	        onMouseMove: this.handleEvents,
	        onMouseUp: this.handleEvents,
	        onClick: this.handleEvents,
	        onTouchEnd: this.handleEvents,
	        onTouchMove: this.handleEvents,
	        onTouchStart: this.handleEvents },
	      _react2.default.createElement(
	        'div',
	        { 'data-role': 'main_container', className: 'w-100p h-100p p-abs' },
	        _react2.default.createElement(
	          'div',
	          { className: 'flex-outer-container p-fx' },
	          _react2.default.createElement(
	            'form',
	            { autoComplete: 'off', className: 'flex-inner-container form-small', 'data-role': 'registerForm',
	              onSubmit: this.handleSubmit },
	            _react2.default.createElement('input', { style: { display: 'none' }, type: 'text' }),
	            _react2.default.createElement('input', { style: { display: 'none' }, type: 'password' }),
	            _react2.default.createElement(_location_wrapper2.default, { mainContainer: this.props.mainContainer, events: onEvent, configs: this.props.configs })
	          )
	        )
	      ),
	      _react2.default.createElement(_dialogSuccess2.default, { show: this.state.successMessage, message: this.state.successMessage,
	        handleClick: this.handleDialogRegisterUser }),
	      _react2.default.createElement(_dialogError2.default, { show: this.state.errorMessage, message: this.state.errorMessage,
	        handleClick: this.handleDialogError }),
	      _react2.default.createElement(_description2.default, { ref: function ref(obj) {
	          return _this.descriptionContext = obj;
	        } })
	    );
	  }
	});

	_extend_core2.default.prototype.inherit(Register, _id_core2.default);
	_extend_core2.default.prototype.inherit(Register, _ajax_core2.default);
	_extend_core2.default.prototype.inherit(Register, _overlay_core2.default);

	exports.default = Register;

/***/ }

});