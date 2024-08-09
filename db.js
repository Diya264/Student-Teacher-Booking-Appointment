const mysql = require('mysql2'); // importing mysql2 library

// creating connection with mysql database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'JHYD@1204!$jhyd',
    database: 'student_teacher'
});
// eastablishing connection to database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err); // showing error message if any error connecting to database
        return;
    }
    console.log('Connected to the MySQL database'); // show/log success message
});

// exporting the connection object so that it can be used in other modules
module.exports = connection;
