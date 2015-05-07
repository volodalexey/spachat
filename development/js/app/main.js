require.config({
    "baseUrl": "js",
    "waitSeconds": 10,
    "paths": {
        "Underscore": "lib/underscore",
        "text": "lib/text",
        "editor": "app/editor",
        "navigate": "app/navigate",
        "async_core": "app/async_core",
        "panel": "app/panel",
        "overlay": "app/overlay",
        "header": "app/header",
        "pagination": "app/pagination"
    },
    "shim": {
        "navigate": ["Underscore"],
        "editor": ["Underscore"]
    }
});

require(['navigate'], function() {
    //OK
});