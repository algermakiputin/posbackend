import connection from "../config/database.js";

export const getSuppliers = async () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM supplier", function(error, result) {
            if (error) reject(error);
            resolve(result);
        })
    });
}