# WebSocket Chat with Express and Firebase

- Express.js Server Setup

    ```
    npm init -y
    npm install express --save
    npm install firebase-admin

    npm install --save-dev nodemon
    ```

- Creating Express.js Server Entry Point

    Create src/app.js and add "start": "node ./src/app.js" to package.json

- Firebase database Connection

    Create Firebase database
    Create firebase.js 

- Socket.io Implementation (Local)

    ```
    npm install socket.io
    ```

- CORS 

    ```    
    npm i cors
    ```

# Security 

1. Prevent NoSQL injections

    ```
    npm I express-mongo-sanitize
    ```

2. Security Headers

    ``` 
    npm i helmet
    ``` 

3. XSS Protection

    ```
    npm i xss-clean
    ```

4. Rate Limiting

    ```
    npm i express-rate-limit
    ```

5. HTTP Parameter Pollution (HPP)

    ```
    npm i hpp
    ```