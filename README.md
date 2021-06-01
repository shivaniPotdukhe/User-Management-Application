# User-Management-Application
This repository consist of APIs for registration, login and user Listing.

## Getting started

The User-Management-Application is written in JavaScript ES2015. It is a RESTful web API and can be easily integrated with front end applications build with react / angular.

This project will run on **NodeJs** using **MYSQL** as database.

## Features

-   Basic Authentication (Register/Login with hashed password)
-   API to get listing of users with search ( by firstName, lastName, email) and sort on keys required along with pagination.
-   JWT Tokens, make requests with a token after login with `Authorization` header with value `yourToken` where `yourToken` will be returned in Login response.
-   Pre-defined response structures with proper status codes.
-   Included API collection for Postman.
-   Light-weight project.

## Software Requirements

-   Node.js **8+**
-   MYSQL **14.14(or any)**

### Clone and Install npm dependencies

- git clone https://github.com/shivaniPotdukhe/User-Management-Application.git
- cd Server
- npm install

## Project  structure
```
.
├── app.js
├── controllers
│   ├── auth.js
│   └── user.js
├── helper
│   ├── apiResponse.js
│   ├── connection.js
│   └── utility.js
├── middleware
│   └── auth.js
├── package.json
├── package-lock.json
├── postman-collection
│   └── DPD API.postman_collection.json
├── README.md
├── routes
    ├── auth.js
    ├── user.js
    └── index.js

```

### Running  API server locally
- npm start
