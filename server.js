const express = require('express');
const app = express();
const userRoute = require('./routes/user');
app.set('view engine', 'ejs');


const mysqlConnector = require('mysql');
const connection = mysqlConnector.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'note_taking_app'
    }
);

connection.connect();
connection.query('SELCT * FROM notes', (error, result) => {
    console.log(`query results: ${result}`)
})
connection.end();


app.listen(3000, () => console.log("listening on port 3000"));
