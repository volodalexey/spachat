require.config({
    "baseUrl": "js",
    "waitSeconds": 10,
    "paths": {
        "text": "lib/text",
        //
        "html_message": "app/model/html_message",
        "html_log_message": "app/model/html_log_message",
        //
        "async_core": "app/extensions/async_core",
        "ajax_core": "app/extensions/ajax_core",
        "overlay_core": "app/extensions/overlay_core",
        "event_core": "app/extensions/event_core",
        "throw_event_core": "app/extensions/throw_event_core",
        "template_core": "app/extensions/template_core",
        "ping_core": "app/extensions/ping_core",
        "id_core": "app/extensions/id_core",
        "render_layout_core": "app/extensions/render_layout_core",
        "extend_core": "app/extensions/extend_core",
        "message_core": "app/extensions/message_core",
        "dom_core": "app/extensions/dom_core",
        "description_core": "app/description_core",
        "switcher_core": "app/extensions/switcher_core",
        //
        "body": "app/body",
        "chat": "app/chat",
        "chat_platform": "app/chat_platform",
        "panel_platform": "app/panel_platform",
        "panel": "app/panel",
        "header": "app/header",
        "pagination": "app/pagination",
        "messages": "app/messages",
        "editor": "app/editor",
        "settings": "app/settings",
        "contact_list": "app/contact_list",
        "indexeddb": "app/indexeddb",
        "tab": "app/tab",
        "webrtc": "app/webrtc",
        "login": "app/login",
        "register": "app/register",
        "navigator": "app/navigator",
        "websocket": "app/websocket",
        "event_bus": "app/event_bus",
        "users_bus": "app/users_bus",
        "chats_bus": "app/chats_bus",
        "localization": "app/localization",
        "main_layout": "app/main_layout",
        "extra_toolbar": "app/extra_toolbar",
        "filter": "app/filter"
    }
});

function extend(Child, Parent) {
    var F = function() {
    };
    F.prototype = Parent.prototype;
    var f = new F();

    for (var prop in Child.prototype) {
        f[prop] = Child.prototype[prop]
    }
    Child.prototype = f;
    Child.prototype[Parent.prototype.__class_name] = Parent.prototype;
}

require(['main_layout', 'localization'
], function(main_layout, localization) {
    //OK
    localization.getLocConfig(function(err) {
        if (err) {
            document.body.innerHTML = err;
            return;
        }
        main_layout.render();
    });

});