## SPACHAT - Single Page Application Chat

SPACHAT - web application for communication between browsers with the help of WebRTC technology. NodeJS works as signalling server for peers (for exchange session description protocols). Each client uses indexedDB as main storage. Clients can create/join chats, create/join users. Each chat can save its state.

### Make production files
```bash
node node_modules/gulp/bin/gulp.js production
```