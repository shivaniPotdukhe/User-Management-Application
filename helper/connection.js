const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "UserManagement",
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err) {
        console.log('Connected Successfully!');
    }
    else {
        console.log('Connection Failed!');
    }
});

module.exports = mysqlConnection;