require.config({
    "baseUrl": "js",
    "waitSeconds": 10,
    "paths": {
        "Underscore": "lib/underscore",
        "text": "lib/text",
        "chat": "app/chat",
        "navigate": "app/navigate",
        "async_core": "app/extentions/async_core",
        "panel": "app/panel",
        "overlay": "app/extentions/overlay",
        "event": "app/extentions/event",
        "header": "app/header",
        "pagination": "app/pagination",
        "messages": "app/messages",
        "editor": "app/editor"
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