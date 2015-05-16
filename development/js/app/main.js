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

        "chat": "app/chat",
        "navigate": "app/navigate",
        "panel": "app/panel",
        "header": "app/header",
        "pagination": "app/pagination",
        "messages": "app/messages",
        "editor": "app/editor",
        "settings": "app/settings",
        "contact_list": "app/contact_list",
        "indexeddb": "app/indexeddb",
        "tab": "app/tab",
        "webrtc": "app/webrtc"
    },
    "shim": {
        "navigate": ["Underscore"],
        "chat": ["Underscore"]
    }
});

function extend(Child, Parent) {
    var F = function () { };
    F.prototype = Parent.prototype;
    var f = new F();

    for (var prop in Child.prototype) {
        f[prop] = Child.prototype[prop]
    }
    Child.prototype = f;
    Child.prototype[Parent.prototype.__class_name] = Parent.prototype;
}

require(['navigate'], function() {
    //OK
});