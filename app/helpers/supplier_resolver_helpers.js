import connection from "../config/database.js";

export const getSuppliers = async () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM supplier ORDER BY id DESC", function(error, result) {
            if (error) reject(error);
            resolve(result);
        })
    });
}

export const destroySupplier = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query("DELETE FROM supplier WHERE id = ?", id, function(error, result) {
            if (error) reject(error);
            resolve({
                success: true,
                data: JSON.stringify(result)
            })
        });
    });
}

export const storeSupplier = async (supplier) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO supplier SET ?", supplier, function(error, result) {
            if (error) reject(error);
            resolve({
                success: true,
                data: JSON.stringify(result)
            });
        });
    });
};