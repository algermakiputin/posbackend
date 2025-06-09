import mysql from 'mysql';
import 'dotenv/config';

var connection = mysql.createConnection({
    host     : process.env.DATABASE_HOST,
    user     : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    debug: false
});

connection.connect(function(err) {
    if (err) {
        //logger.error('error connecting to the database: ' + err.stack);
        console.error('error connecting to the database: ' + err.stack);
        return;
    }
    //logger('connected as id ' + connection.threadId);
    console.log('connected as id ' + connection.threadId);
});
export default connection;