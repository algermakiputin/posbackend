import connection from "../config/database.js";

export const getItems = async () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM items LIMIT 10", function(error, result, fields) {
            if (error) reject(error);
            resolve(result);
        }); 
    });
}