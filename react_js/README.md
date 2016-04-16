## SPACHAT - Single Page Application Chat

SPACHAT - web application for communication between clients with the help of WebRTC technology (in browser).

NodeJS works as signalling server for peers (for exchange session description protocols).

Each client uses indexedDB as main storage. Clients can create/join chats, create/join users.

Each chat can save its state.

## DEMO
<a href="https://s-p-a-chat.herokuapp.com/" target="_blank">SPACHAT</a>
- Chrome & Firefox

##### Description will be provided soon


After WebRTC find the way to each other A and B should have names of each-other under "Contact list"

### Development Requirements:
- [NodeJS](https://nodejs.org/en/)
- install all packages
```bash
npm install
```

### Build production files
```bash
npm run webpack
```
All files will be in "__build__" folder

## Run testing server

### Development testing server
```bash
npm run server:dev
```
Visit [http://localhost:8081/](http://localhost:8081/) in browser

### Production testing server
```bash
npm run server:prod
```
Visit [http://localhost:8082/](http://localhost:8082/) in browser