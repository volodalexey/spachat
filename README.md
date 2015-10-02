## SPACHAT - Single Page Application Chat

SPACHAT - web application for communication between browsers with the help of WebRTC technology. NodeJS works as signalling server for peers (for exchange session description protocols). Each client uses indexedDB as main storage. Clients can create/join chats, create/join users. Each chat can save its state.

## DEMO
https://s-p-a-chat.herokuapp.com/
> Only Chrome is tested now

> After login you will see "shield" in Chrome

> To use chat you need to enable "load unsafe script" by clicking on "shield" in address bar

##### To connect to each other make following (just a test connection peer-to-peer users):
- A: create user & login & enable unsafe script
- B: create user & login & enable unsafe script
- A: goes to right panel and copies user id
- A: sends this user id to B (e.g. by email)
- A: goes to left panel "make friends"
- A: enables checkbox "Ready for request"
- B: goes to left panel "make friends"
- B: inserts received user id into user id and fills some invitation message
- B: clicks "Send request"
- A: If everything goes well, A receives message and confirms friendship

After WebRTC find the way to each other A and B should have friends under "My users"

##### To connect to chat make following:
- A: create user & login & enable unsafe script
- B: create user & login & enable unsafe script
- A: goes to left panel under "Create chat"
- A: clicks "auto handshake" & sees new chat
- A: goes to opened chat "settings" and copies chat id
- A: checks "Ready for new chat users requests"
- A: sends this chat id to B (e.g. by email)
- B: goes to left panel "make friends"
- B: inserts received user id into user id and fills some invitation message
- B: clicks "Send request"
- A: If everything goes well, A receives message and confirms friendship

After WebRTC find the way to each other A and B should have friends under "My users"

### Make production files
```bash
node node_modules/gulp/bin/gulp.js production
```