import connection from "../config/database.js";

export const getCategories = async () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM categories LIMIT 10", function(error, result, fields) {
            if (error) reject(error);
            resolve(result);
        });
    });
}