require.config({
    "baseUrl": "js",
    "waitSeconds": 10,
    "paths": {
        "Underscore": "lib/underscore",
        "text": "lib/text",

        "async_core": "app/extentions/async_core",
        "ajax_core": "app/extentions/ajax_core",
        "overlay_core": "app/extentions/overlay_core",
        "event_core": "app/extentions/event_core",
        "template_core": "app/extentions/template_core",

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
        "navigator": "app/navigator"
    },
    "shim": {
        "chat_platform": ["Underscore"],
        "chat": ["Underscore"],
        "navigator": ["Underscore"]
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



require(['navigator'], function(navigator) {
    //OK
    navigator.navigate();
});